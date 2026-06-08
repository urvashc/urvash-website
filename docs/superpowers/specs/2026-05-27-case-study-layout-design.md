# Case Study Layout — Design Spec

**Date:** 2026-05-27  
**Branch:** v4  
**Step:** 11 — Case study template

---

## Goal

Two files: a reusable `CaseStudy.astro` layout and a `_template.astro` proof page that renders all sections with placeholder content.

---

## Files

| File | Role |
|------|------|
| `src/layouts/CaseStudy.astro` | Full-page layout (html/head/body + Nav + Footer + ChatRoot) |
| `src/pages/work/_template.astro` | Proof page — hardcoded placeholder content, all sections populated |

---

## Props Interface

```ts
interface Props {
  period: string;                              // e.g. "2023–24"
  tag: string;                                 // e.g. "Data Infrastructure"
  title: string;                               // main headline
  metrics: Array<{ value: string; label: string }>; // 2–4 stat blocks
  honestBlock: {
    label: string;
    body: string;
    variant: 'red' | 'grey';
  };
  pills: string[];                             // skill/tech chip tags
}
```

Named slot: `sideProjects` (optional).  
Default slot: `body` prose content.

---

## Visual System

Reuses locked CSS vars only — no new variables introduced.

| Token | Usage |
|-------|-------|
| `--ink` | Title, metric values |
| `--ink-2` | honestBlock body text |
| `--ink-3` | period label, metric labels, honestBlock label (grey), pill text |
| `--ink-4` | decorative separators |
| `--rule` | borders, grey honestBlock left border |
| `--surface-2` | pill background |
| `--surface-3` | subtle section backgrounds if needed |
| `--red` | red honestBlock left border + label color |
| `--mono` | period, tag, metric labels, honestBlock label, pills |
| `--serif` | title, metric values |
| `--sans` | body prose, honestBlock body |
| `--gutter` | 52px — Gutter component column width |

---

## Page Structure (top → bottom)

### 1. Nav + ChatRoot
```
<Nav current="work" />
<ChatRoot client:load />
```

### 2. Header section
```
padding-top: 120px  (matches work/index.astro)

period  ← DM Mono, 11px, letter-spacing 0.18em, --ink-3, uppercase, mb 16px
tag     ← pill chip inline: DM Mono 11px, --surface-2 bg, --rule border, 4px radius, px 10 py 4
title   ← Instrument Serif, clamp(36px, 4.5vw, 52px), font-weight 400, --ink
```

### 3. Metrics bar
```
SectionBar label="IMPACT"
Gutter label="metrics" borderBottom={true}

Horizontal flex row, gap 40px, border-top 1px --rule, padding 48px 0
Each block (2–4):
  value  ← Instrument Serif italic, 48px, --ink
  label  ← DM Mono, 11px, uppercase, letter-spacing 0.14em, --ink-3, mt 8px
Vertical 1px --rule dividers between blocks
```

### 4. Body
```
SectionBar label="CASE STUDY"
Gutter label="body" borderBottom={false}

<slot />  — prose from page, max-width 640px, DM Sans, 17px, line-height 1.75, --ink-2
```

### 5. Honest block
```
Gutter label="honest" borderBottom={false}
border-top: 1px solid --rule

.cs-honest-block
  border-left: 3px solid [--red | --rule]
  padding-left: 20px
  margin: 48px 0

  .label  ← DM Mono, 11px, uppercase, letter-spacing 0.14em
            red variant: color --red
            grey variant: color --ink-3
  .body   ← DM Sans, 16px, line-height 1.65, --ink-2, mt 10px
```

### 6. Pills
```
Gutter label="tags" borderBottom={false}

Inline flex row, flex-wrap, gap 8px
Each pill: DM Mono, 11px, --ink-3, bg --surface-2, border 1px --rule, radius 4px, px 10 py 5
```

### 7. Side projects (optional slot)
```
Rendered only when Astro.slots.has('sideProjects')
SectionBar label="ALSO"
Gutter label="side" borderBottom={false}
<slot name="sideProjects" />
```

### 8. Footer
```
<Footer />
```

---

## _template.astro Placeholder Content

- `period`: "2023–24"
- `tag`: "Data Infrastructure"
- `title`: "Insights Service — Rebuilding Query Infrastructure for 4× Speed"
- `metrics`: 4 blocks — `{ value: "4×", label: "Query speed" }`, `{ value: "90%", label: "Cost reduction" }`, `{ value: "12", label: "Data sources unified" }`, `{ value: "6mo", label: "Time to ship" }`
- `honestBlock`: `{ label: "What I'd do differently", body: "We underestimated migration risk on the first partition rollout. A staged rollout with feature flags per cohort would have caught the edge cases two weeks earlier.", variant: 'red' }`
- `pills`: `["dbt", "Snowflake", "Apache Airflow", "Python", "SQL", "Looker"]`
- `sideProjects` slot: a short paragraph of placeholder text

---

## Constraints

- No new CSS variables — use locked system only.
- No new font imports.
- Mobile breakpoint at 780px (matches existing pages).
- `_template.astro` uses the `CaseStudy` layout via import (not frontmatter `layout:`), to keep the pattern consistent with work/index.astro which constructs its own html shell.
- `honestBlock` is a required prop (not optional) — template always renders it.
