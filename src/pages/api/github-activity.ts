import type { APIRoute } from 'astro';

const QUERY = `query {
  user(login: "urvashc") {
    contributionsCollection {
      contributionCalendar {
        weeks {
          contributionDays {
            contributionCount
            date
          }
        }
      }
    }
  }
}`;

export const GET: APIRoute = async () => {
  const token = import.meta.env.GITHUB_GRAPH_TOKEN;
  if (!token) {
    return new Response(JSON.stringify({ error: 'No GitHub token' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }

  try {
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: QUERY }),
    });

    const data = await response.json();
    const weeks =
      data.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? [];

    return new Response(JSON.stringify({ weeks }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'GitHub API failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  }
};
