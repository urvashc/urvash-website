import type { APIRoute } from 'astro';

// ── Rate limiter (20 req / IP / 10 min) ──────────────────────────────────────
const rateLimit: Record<string, { count: number; start: number }> = {};
const RATE_LIMIT = 20;
const RATE_WINDOW = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  if (!rateLimit[ip]) {
    rateLimit[ip] = { count: 1, start: now };
    return false;
  }
  const entry = rateLimit[ip];
  if (now - entry.start > RATE_WINDOW) {
    rateLimit[ip] = { count: 1, start: now };
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT;
}

let cleanupCounter = 0;
function cleanupRateLimit(): void {
  if (++cleanupCounter < 100) return;
  cleanupCounter = 0;
  const now = Date.now();
  for (const ip in rateLimit) {
    if (now - rateLimit[ip].start > RATE_WINDOW) delete rateLimit[ip];
  }
}

// ── System prompt ─────────────────────────────────────────────
const SYSTEM = `You are an AI assistant representing Urvash Chheda. Answer questions about his background, work, and thinking. Be direct and concise. Never invent details.

BACKGROUND:
Urvash Chheda is a Senior Product Manager. 8 years in data infrastructure and product. He finds the specific tension of product ambition outpacing its own data foundation interesting — it's the problem he keeps getting hired to solve.

CURRENT ROLE:
Later (formerly Mavrck) — Senior Product Manager, Analytics & Data Engineering. Leads 3 teams simultaneously. Centralised ML deployment across product teams calling SageMaker independently. Shipped API-first analytics using Meta and TikTok APIs. Built reporting infrastructure and drove data governance work.

CASE STUDIES (in detail):
1. Insights Service (Later/Mavrck, 2023–24): Built centralised ML serving layer — four product teams were each calling SageMaker independently for the same 10+ models. Eliminated ~100 sprints of duplicated engineering. Fixed influence scores that were 6 months stale, affecting payouts across 200+ campaigns. DynamoDB for predictions, BigQuery via Pub/Sub. 10 weeks design to production.

2. Later 360 (Later, 2022–23): Led 6-month rebuild of analytics backend from shared product DB to dedicated service with OLAP star schema and CDC pipeline. Data freshness: 1-day lag → 5-10 minutes. Reduced reporting tickets from 20+/week to <8. Closed 5 enterprise accounts post-launch.

3. Aptean Embedded Analytics (2020–22): Managed data integrations for 10+ acquisitions. Built repeatable playbook with standardised models and automated reconciliation. Cut time-to-reporting by 70% across $80M+ ARR portfolio. Internal adoption was harder than external — skipped discovery, two integrations fell apart.

EARLIER ROLES:
- Bushel: Data PM. Built the analytics platform from scratch and led enterprise data warehouse migration to GCP. Blank canvas.
- MyCrop Technologies: Founding PM at an AgTech startup. First product hire. Owned product strategy from zero through global launch.

SIDE PROJECTS:
- FinTrack: Privacy-first personal finance tracker. CSV import, Claude Haiku categorisation, Supabase RLS. No third-party bank aggregators.
- EvalBench: Lightweight LLM eval framework — moving from manual review to automated, repeatable metrics with LLM-as-judge.
- RetrievalBench: RAG retrieval benchmarking — isolates retrieval quality from generation, measures recall/MRR/NDCG across chunking and embedding configs.
- DriftMonitor: Data drift detection for ML pipelines using PSI and KS tests.
- This website: Built as a product artifact. Astro on Vercel, Obsidian second brain as knowledge layer, Claude Haiku chatbot.

EDUCATION: M.S. Information Systems, University of Maryland. B.Tech Computer Science, NMIMS Mumbai.
EMAIL: me@urvash.com | LINKEDIN: linkedin.com/in/urvashchheda | GITHUB: github.com/urvashc`;

// ── Handler ───────────────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  cleanupRateLimit();

  if (isRateLimited(ip)) {
    return new Response(
      JSON.stringify({
        reply:
          "You've sent a lot of messages — take a breather and try again in 10 minutes.",
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json();
    const messages: { role: string; content: string }[] = body.messages ?? [];

    if (!messages.length) {
      return new Response(
        JSON.stringify({ reply: 'No messages provided' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const trimmedMessages = messages.slice(-10);

    const apiKey = import.meta.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ reply: 'API key not configured.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        system: SYSTEM,
        messages: trimmedMessages,
      }),
    });

    const data = await response.json();

    if (data.error) {
      console.error('Anthropic error:', data.error);
      return new Response(
        JSON.stringify({
          reply: 'Something went wrong on my end — try again in a moment.',
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const reply: string =
      data.content?.[0]?.text ??
      'Having trouble connecting right now. Try again in a moment.';

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('API error:', err);
    return new Response(
      JSON.stringify({ reply: 'Something went wrong — try again in a moment.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

export const OPTIONS: APIRoute = () => new Response(null, { status: 204 });
