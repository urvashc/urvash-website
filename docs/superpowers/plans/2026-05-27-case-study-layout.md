# Case Study Layout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build `src/layouts/CaseStudy.astro` (reusable full-page layout) and `src/pages/work/_template.astro` (proof page with placeholder content), then push to branch v4 and confirm the Vercel preview renders at `/work/_template`.

**Architecture:** `CaseStudy.astro` owns the entire HTML shell (html/head/body), Nav, ChatRoot, and Footer, accepting typed props for all content. `_template.astro` is a thin page that imports the layout as a component and passes hardcoded placeholder content into every prop and slot — no frontmatter `layout:` shorthand (consistent with how `work/index.astro` constructs its own shell).

**Tech Stack:** Astro 6, TypeScript, Tailwind v4, DM Mono / Instrument Serif / DM Sans (already loaded in global.css), locked CSS vars only.

---

## File Map

| Action | Path | Role |
|--------|------|------|
| Create | `src/layouts/CaseStudy.astro` | Full-page layout: shell + Nav + ChatRoot + all case study sections + Footer |
| Create | `src/pages/work/_template.astro` | Proof page — imports layout, passes all placeholder content |

No existing files are modified.

---

### Task 1: Create `src/layouts/CaseStudy.astro`

**Files:**
- Create: `src/layouts/CaseStudy.astro`

- [ ] **Step 1: Write the full component**

Create `src/layouts/CaseStudy.astro` with this exact content:

```astro
---
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import Gutter from '../components/Gutter.astro';
import SectionBar from '../components/SectionBar.astro';
import ChatRoot from '../components/ChatRoot';
import '../styles/global.css';

interface Props {
  period: string;
  tag: string;
  title: string;
  metrics: Array<{ value: string; label: string }>;
  honestBlock: { label: string; body: string; variant: 'red' | 'grey' };
  pills: string[];
}

const { period, tag, title, metrics, honestBlock, pills } = Astro.props;
---

<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title} — Urvash Chheda</title>
  </head>
  <body>
    <Nav current="work" />
    <ChatRoot client:load />

    <!-- HEADER -->
    <section class="csh-section">
      <Gutter label="case" borderBottom={false}>
        <div class="csh-content">
          <div class="csh-meta">
            <span class="csh-period">{period}</span>
            <span class="csh-tag">{tag}</span>
          </div>
          <h1 class="csh-title">{title}</h1>
        </div>
      </Gutter>
    </section>

    <!-- METRICS -->
    <SectionBar label="IMPACT" />
    <section class="csm-section">
      <Gutter label="metrics" borderBottom={true}>
        <div class="csm-row">
          {metrics.map((m, i) => (
            <div class={`csm-block${i > 0 ? ' csm-block-border' : ''}`}>
              <span class="csm-value">{m.value}</span>
              <span class="csm-label">{m.label}</span>
            </div>
          ))}
        </div>
      </Gutter>
    </section>

    <!-- BODY -->
    <SectionBar label="CASE STUDY" />
    <section class="csb-section">
      <Gutter label="body" borderBottom={false}>
        <div class="csb-content">
          <slot />
        </div>
      </Gutter>
    </section>

    <!-- HONEST BLOCK -->
    <section class="cse-section">
      <Gutter label="honest" borderBottom={false}>
        <div class={`cse-block cse-${honestBlock.variant}`}>
          <span class="cse-label">{honestBlock.label}</span>
          <p class="cse-body">{honestBlock.body}</p>
        </div>
      </Gutter>
    </section>

    <!-- PILLS -->
    <section class="csp-section">
      <Gutter label="tags" borderBottom={false}>
        <div class="csp-row">
          {pills.map(p => <span class="csp-pill">{p}</span>)}
        </div>
      </Gutter>
    </section>

    <!-- SIDE PROJECTS (optional named slot) -->
    {Astro.slots.has('sideProjects') && (
      <div>
        <SectionBar label="ALSO" />
        <section class="css-section">
          <Gutter label="side" borderBottom={false}>
            <slot name="sideProjects" />
          </Gutter>
        </section>
      </div>
    )}

    <Footer />
  </body>
</html>

<style>
  /* ── HEADER ─────────────────────────────────────────────────────── */
  .csh-section {
    padding-top: 120px;
    padding-bottom: 64px;
  }

  .csh-content { max-width: 720px; }

  .csh-meta {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
  }

  .csh-period {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.18em;
    color: var(--ink-3);
    text-transform: uppercase;
  }

  .csh-tag {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-3);
    background: var(--surface-2);
    border: 1px solid var(--rule);
    border-radius: 4px;
    padding: 4px 10px;
  }

  .csh-title {
    font-family: var(--serif);
    font-size: clamp(36px, 4.5vw, 52px);
    font-weight: 400;
    line-height: 1.1;
    color: var(--ink);
    margin: 0;
  }

  /* ── METRICS ────────────────────────────────────────────────────── */
  .csm-section { border-top: 1px solid var(--rule); }

  .csm-row {
    display: flex;
    align-items: flex-start;
    padding: 48px 0;
  }

  .csm-block {
    display: flex;
    flex-direction: column;
    padding-right: 40px;
  }

  .csm-block-border {
    padding-left: 40px;
    border-left: 1px solid var(--rule);
  }

  .csm-value {
    font-family: var(--serif);
    font-size: 48px;
    font-style: italic;
    font-weight: 400;
    line-height: 1;
    color: var(--ink);
  }

  .csm-label {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-3);
    margin-top: 10px;
  }

  /* ── BODY ───────────────────────────────────────────────────────── */
  .csb-section { border-top: 1px solid var(--rule); }

  .csb-content {
    max-width: 640px;
    padding: 48px 0;
    font-family: var(--sans);
    font-size: 17px;
    line-height: 1.75;
    color: var(--ink-2);
  }

  .csb-content :global(p) { margin: 0 0 24px; }
  .csb-content :global(p:last-child) { margin-bottom: 0; }

  /* ── HONEST BLOCK ───────────────────────────────────────────────── */
  .cse-section { border-top: 1px solid var(--rule); }

  .cse-block {
    padding: 48px 0 48px 20px;
    border-left: 3px solid var(--rule);
    max-width: 640px;
  }

  .cse-red { border-left-color: var(--red); }
  .cse-grey { border-left-color: var(--rule); }

  .cse-label {
    display: block;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }

  .cse-red .cse-label { color: var(--red); }
  .cse-grey .cse-label { color: var(--ink-3); }

  .cse-body {
    font-family: var(--sans);
    font-size: 16px;
    line-height: 1.65;
    color: var(--ink-2);
    margin: 10px 0 0;
  }

  /* ── PILLS ──────────────────────────────────────────────────────── */
  .csp-section { border-top: 1px solid var(--rule); }

  .csp-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 32px 0;
  }

  .csp-pill {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--ink-3);
    background: var(--surface-2);
    border: 1px solid var(--rule);
    border-radius: 4px;
    padding: 5px 10px;
  }

  /* ── SIDE PROJECTS ──────────────────────────────────────────────── */
  .css-section { padding: 48px 0; }

  /* ── MOBILE ─────────────────────────────────────────────────────── */
  @media (max-width: 780px) {
    .csh-section { padding-top: 80px; }

    .csm-row {
      flex-direction: column;
      gap: 28px;
    }

    .csm-block,
    .csm-block-border {
      padding: 0;
      border-left: none;
    }
  }
</style>
```

- [ ] **Step 2: Run type check**

```bash
cd /Users/urvash/stuff-for-claude/urvash-website && npx astro check
```

Expected: zero errors. If you see "Cannot find module '../components/ChatRoot'" that means the import path is wrong — `ChatRoot` lives at `src/components/ChatRoot.tsx`, so the import `'../components/ChatRoot'` from `src/layouts/` is correct.

- [ ] **Step 3: Commit**

```bash
git add src/layouts/CaseStudy.astro
git commit -m "feat: add CaseStudy layout component (step 11)"
```

---

### Task 2: Create `src/pages/work/_template.astro`

**Files:**
- Create: `src/pages/work/_template.astro`

- [ ] **Step 1: Write the template page**

Create `src/pages/work/_template.astro` with this exact content:

```astro
---
import CaseStudy from '../../layouts/CaseStudy.astro';
---

<CaseStudy
  period="2023–24"
  tag="Data Infrastructure"
  title="Insights Service — Rebuilding Query Infrastructure for 4× Speed"
  metrics={[
    { value: "4×",  label: "Query speed" },
    { value: "90%", label: "Cost reduction" },
    { value: "12",  label: "Data sources unified" },
    { value: "6mo", label: "Time to ship" },
  ]}
  honestBlock={{
    label: "What I'd do differently",
    body: "We underestimated migration risk on the first partition rollout. A staged rollout with feature flags per cohort would have caught the edge cases two weeks earlier.",
    variant: "red",
  }}
  pills={["dbt", "Snowflake", "Apache Airflow", "Python", "SQL", "Looker"]}
>
  <p>
    Later's analyst team was running queries that took 45 seconds on a good day.
    The underlying issue wasn't the queries — it was a seven-year-old schema that
    had grown by accretion, with no one having a full picture of the joins.
  </p>
  <p>
    I led the data modeling rebuild: normalized the core entity graph, introduced
    dbt for transformation lineage, and migrated 12 disparate sources into a single
    Snowflake schema. The result was a 4× query speedup and a 90% reduction in
    compute cost within the first quarter.
  </p>
  <p>
    The harder problem was organizational: getting three engineering teams to agree
    on a single source of truth during an active product sprint. That meant weekly
    alignment reviews, written ADRs for every schema decision, and a staged migration
    that kept the old and new schemas live in parallel for six weeks.
  </p>

  <div slot="sideProjects">
    <p style="font-family: var(--sans); font-size: 15px; color: var(--ink-3); line-height: 1.65; margin: 0;">
      Related: built an internal SQL linting ruleset during this project — now enforced
      in CI across all analytics repos at Later.
    </p>
  </div>
</CaseStudy>
```

- [ ] **Step 2: Run build to confirm no errors**

```bash
cd /Users/urvash/stuff-for-claude/urvash-website && npm run build
```

Expected: build completes with no TypeScript errors. The output should include a line like `.vercel/output/static/work/_template/index.html` confirming the route was generated.

If you see "Type 'string' is not assignable to type 'red' | 'grey'", it means the `variant` literal type isn't being inferred — fix by adding `as const` to the variant value: `variant: "red" as const`.

- [ ] **Step 3: Commit**

```bash
git add src/pages/work/_template.astro
git commit -m "feat: add /work/_template proof page (step 11)"
```

---

### Task 3: Push and get Vercel preview URL

**Files:** none

- [ ] **Step 1: Push branch to remote**

```bash
git push origin v4
```

Expected: Vercel picks up the push automatically (project is linked to urvash-website team urvash-app with auto-deploy on v4 branch).

- [ ] **Step 2: Get the preview URL**

```bash
npx vercel ls --scope urvash-app 2>/dev/null | head -20
```

Or via Vercel MCP — list deployments for project `urvash-website` on team `urvash-app` and find the most recent one. The preview URL pattern is `urvash-website-<hash>-urvash-app.vercel.app`.

The `/work/_template` route should be live at `https://<preview-url>/work/_template`.

- [ ] **Step 3: Verify the page renders all sections**

Open `https://<preview-url>/work/_template` in a browser and confirm:
- Nav with "work" active
- Header: period label, tag pill, serif title
- IMPACT section bar + 4 metric blocks with italic serif values
- CASE STUDY section bar + 3 prose paragraphs
- HONEST BLOCK with red left border + "WHAT I'D DO DIFFERENTLY" label
- PILLS row: dbt, Snowflake, Apache Airflow, Python, SQL, Looker
- ALSO section bar + side projects text
- Footer

Report the preview URL back to the user.
