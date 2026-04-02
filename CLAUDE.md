# urvash.com — Claude context

## Stack
- Single-file static HTML: `index.html`
- Netlify (auto-deploy on push to main)
- Serverless function: `netlify/functions/chat.js` (Claude Haiku chatbot proxy)
- Repo: `urvashc/urvash-website`
- Assets: `avatar.jpg`, `og-image.png`

## Typography
- Headings: DM Serif Display
- Body: DM Sans
- Mono / accent: IBM Plex Mono
- Palette: warm paper-and-ink — no pure black/white, no cool grays

## Structure
Sections are numbered 01–09. Keep numbering consistent when adding sections.

## Features in place
- Dark mode toggle in nav
- Animated data pipeline canvas (scroll-triggered)
- Scroll-triggered animations throughout
- Password-gated deep case study (password: `insights2024`, rotate weekly)
- AI chatbot via Claude Haiku (`netlify/functions/chat.js`)
- Google Analytics + Google Search Console
- OG image configured

## Chatbot (`chat.js`)
- Tone: five-register taxonomy (adjust in system prompt inside `chat.js`)
- Markdown rendering enabled
- Variable typing delay
- Restrained email CTA (don't make it aggressive)

## ⚠️ Before making changes
- Everything is in `index.html` — no separate CSS or JS files
- Test dark mode toggle after any color/style change
- Don't add new font imports without checking load performance
- Chatbot changes go in `netlify/functions/chat.js`, not inline

## Pending
- Microsoft Clarity (ID placeholder: `YOUR_CLARITY_PROJECT_ID` — needs real ID)
- "Currently thinking about" section (placeholder content)
- "Working with me" section (placeholder content)

## Session startup
Fetch latest index.html before making changes:
`https://raw.githubusercontent.com/urvashc/urvash-website/main/index.html`
