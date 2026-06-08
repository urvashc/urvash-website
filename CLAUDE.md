# urvash.com v4 — Claude Code context

## ⚠️ Active step
Step 18: Full visual redesign implementation.
Steps 01–17 are complete. Do not modify the project structure or routing unless explicitly asked.

## Design spec
Read `design/preview.html` before making any visual or structural decision.
It is the approved, locked design. It is the source of truth for layout, typography, spacing, 
tokens, components, effects, and copy. When in doubt, check the preview.

## Stack
- Framework: Astro (astro.config.mjs is in root)
- Deployment: Vercel (not Netlify — do not reference Netlify)
- Styling: Tailwind + CSS custom properties (design tokens)
- Language: TypeScript
- Backend: Supabase (vault graph data), Vercel serverless functions
- Chatbot: Claude Haiku proxy — was netlify/functions/chat.js, needs migrating to Vercel
- Repo: urvashc/urvash-website, branch: v4

## Typography (v4 — replaces old DM Serif/DM Sans)
- Serif: Instrument Serif (italic variant used extensively)
- Mono: JetBrains Mono (300, 400, 500 weights)
- No DM Serif Display. No DM Sans. No IBM Plex Mono.

## Design tokens (all as CSS custom properties)
Dark mode (default on :root):
- --bg: #000000
- --surface: #0d0d0d
- --surface-2: #1a1a18
- --border: #3a3a38
- --text: #f0f0ee
- --text-dim: #888880
- --text-dimmer: #444440
- --accent: #00ff88
- --font-serif: 'Instrument Serif', Georgia, serif
- --font-mono: 'JetBrains Mono', monospace
- --pad-l: max(2.5rem, 11vw)
- --pad-r: max(2.5rem, 5vw)
- --section-gap: 5rem

Light mode overrides on [data-theme="light"]:
- --bg: #f2f1ec
- --surface: #eae9e3
- --surface-2: #dddbd4
- --border: #b8b6ae
- --text: #1c1c1a
- --text-dim: #5a5a54
- --text-dimmer: #9a9890
- --accent: #00994d

## Layout conventions
- Left-anchored (not centred): padding-left var(--pad-l), padding-right var(--pad-r)
- Section labels use bracket pattern: [02] · SECTION NAME (matches nav active state)
- All borders: var(--border), never hardcoded
- Section padding: var(--section-gap)
- Theme controlled via data-theme on <html>

## Pages
- / → Home (hero, how I think, known for, selected work, let's talk)
- /work → Work (case study rows, what I use stack table, side projects)
- /about → About (who I am, how I work, what I build + graphs, where I come from)
- /work/mavrck → Case study (Mavrck/Later ML platform)

## Key effects (see preview for implementation)
- Page transition: black curtain slides up from bottom, page switches, exits top (~350ms)
- Hero: particle canvas background, pixel reveal on portrait photo (right column)
- Character assembly on scroll for "Data products are only as good..." quote
- Obsidian vault D3 force graph + GitHub contribution heatmap — About page only
- Floating chat trigger: >_ ask (bottom right), opens chat panel

## Nav
- Left: UC logo
- Right: [home] work about, ● ask me button, [ light ]/[ dark ] theme toggle
- Active page gets [bracket] treatment via CSS ::before/::after
- No hamburger menu, no terminal overlay

## ⚠️ Before making changes
- Check design/preview.html first
- All colours must use CSS custom properties — no hardcoded hex values
- Test both dark and light mode after any style change
- Canvas elements (particles, graphs, avatar) need theme-aware colour logic
- Fonts: do not add new font imports — Instrument Serif + JetBrains Mono only