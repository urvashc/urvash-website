import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  const SUPABASE_URL = import.meta.env.PUBLIC_SUPABASE_URL ?? import.meta.env.SUPABASE_URL;
  const SUPABASE_KEY = import.meta.env.SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return new Response(JSON.stringify({ error: 'Supabase not configured' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/vault_notes?select=file_path,folder,folder_code,wikilinks`,
      {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      }
    );

    const rows: Array<{
      file_path: string;
      folder: string;
      folder_code: string;
      wikilinks: string[] | null;
    }> = await response.json();

    // Build anonymous nodes — slugs only, no titles or content
    const nodes = rows.map((row, i) => ({
      id: i,
      slug: row.file_path.split('/').pop()?.replace('.md', '') ?? String(i),
      folder: row.folder,
      folder_code: row.folder_code,
      degree: (row.wikilinks?.length ?? 0) + 1,
    }));

    const slugToIndex: Record<string, number> = {};
    nodes.forEach((n, i) => { slugToIndex[n.slug] = i; });

    const links: { source: number; target: number }[] = [];
    rows.forEach((row, sourceIdx) => {
      (row.wikilinks ?? []).forEach(target => {
        const targetIdx = slugToIndex[target];
        if (targetIdx !== undefined && targetIdx !== sourceIdx) {
          links.push({ source: sourceIdx, target: targetIdx });
        }
      });
    });

    return new Response(JSON.stringify({ nodes, links }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Supabase query failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
};
