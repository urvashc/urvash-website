# Graph Report - .  (2026-05-08)

## Corpus Check
- Corpus is ~19,619 words - fits in a single context window. You may not need a graph.

## Summary
- 53 nodes · 61 edges · 8 communities (7 shown, 1 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 2,447 input · 1,412 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Avatar & Visual Identity|Avatar & Visual Identity]]
- [[_COMMUNITY_Serverless Chat Backend|Serverless Chat Backend]]
- [[_COMMUNITY_Chatbot Frontend UI|Chatbot Frontend UI]]
- [[_COMMUNITY_Site Features & Analytics|Site Features & Analytics]]
- [[_COMMUNITY_Personal Brand & Domain|Personal Brand & Domain]]
- [[_COMMUNITY_OG Image & Social Sharing|OG Image & Social Sharing]]
- [[_COMMUNITY_README|README]]

## God Nodes (most connected - your core abstractions)
1. `index.html — Single-File Portfolio Site` - 8 edges
2. `OG Image (og-image.png)` - 8 edges
3. `Urvash Chheda` - 8 edges
4. `3D Animated Avatar Character` - 7 edges
5. `chat.js Netlify Serverless Function` - 6 edges
6. `Chatbot UI Widget (Floating Bubble + Window)` - 4 edges
7. `callAPI() — fetch to /.netlify/functions/chat` - 4 edges
8. `sendMessage() / sendText() functions` - 4 edges
9. `Tagline: I build the infrastructure modern AI runs on — and I stay accountable to the numbers on the other side.` - 4 edges
10. `Avatar / Profile Image` - 4 edges

## Surprising Connections (you probably didn't know these)
- `callAPI() — fetch to /.netlify/functions/chat` --calls--> `chat.js Netlify Serverless Function`  [EXTRACTED]
  index.html → netlify/functions/chat.js
- `Netlify Auto-Deploy on Push to Main` --rationale_for--> `chat.js Netlify Serverless Function`  [EXTRACTED]
  CLAUDE.md → netlify/functions/chat.js
- `CLAUDE.md — Project Configuration and Session Context` --references--> `chat.js Netlify Serverless Function`  [EXTRACTED]
  CLAUDE.md → netlify/functions/chat.js
- `CLAUDE.md — Project Configuration and Session Context` --references--> `index.html — Single-File Portfolio Site`  [EXTRACTED]
  CLAUDE.md → index.html

## Hyperedges (group relationships)
- **Chatbot End-to-End Request Pipeline** — indexhtml_call_api, chatjs_serverless_function, chatjs_anthropic_api_call [EXTRACTED 1.00]
- **Rate Limiting Enforcement Pattern** — chatjs_rate_limiter, chatjs_is_rate_limited, chatjs_cleanup_rate_limit [EXTRACTED 1.00]
- **Chatbot UI Interaction Flow** — indexhtml_chatbot_ui, indexhtml_send_message, indexhtml_append_msg [EXTRACTED 1.00]
- **OG Image Identity Cluster: person + role + domains + tagline** —  [INFERRED 1.00]
- **OG Image Design System** —  [INFERRED 1.00]

## Communities (8 total, 1 thin omitted)

### Community 0 - "Avatar & Visual Identity"
Cohesion: 0.24
Nodes (10): Apple Memoji, 3D Animated Avatar Character, Avatar / Profile Image, Calm / Serene Mood, Black Background, Dark Beard Visual Feature, Gray Long-Sleeve Sweater, Meditation / Mindfulness Pose (+2 more)

### Community 1 - "Serverless Chat Backend"
Cohesion: 0.25
Nodes (9): Anthropic Messages API Call (claude-haiku-4-5), cleanupRateLimit() function, isRateLimited() function, In-Memory Rate Limiter (20 req / 10 min per IP), chat.js Netlify Serverless Function, Chatbot System Prompt (Five-Register Taxonomy), CLAUDE.md — Project Configuration and Session Context, Five-Register Tone Taxonomy (chatbot design pattern) (+1 more)

### Community 2 - "Chatbot Frontend UI"
Cohesion: 0.32
Nodes (8): appendMsg() — DOM message renderer, callAPI() — fetch to /.netlify/functions/chat, Chatbot UI Widget (Floating Bubble + Window), renderMarkdown() — lightweight markdown-to-HTML, sendMessage() / sendText() functions, sendSuggestion() — suggestion button handler, showTyping() / setLoading() — typing indicator, toggleChat() — open/close chatbot window

### Community 3 - "Site Features & Analytics"
Cohesion: 0.29
Nodes (8): Google Analytics (gtag G-SVJKPE6JN9), Microsoft Clarity (placeholder ID), Password Gate — Deep Case Study (checkPassword), Animated Data Pipeline Canvas (hero section), index.html — Single-File Portfolio Site, Scroll-Triggered Reveal Animations (tick / IntersectionObserver), toggleDark() — dark mode toggle, Password Gate with localStorage 7-day Cache

### Community 4 - "Personal Brand & Domain"
Cohesion: 0.36
Nodes (8): Brand Initials Badge: UC, Analytics, Data Infrastructure, Machine Learning (ML), Urvash Chheda, Senior Technical PM, Tagline: I build the infrastructure modern AI runs on — and I stay accountable to the numbers on the other side., 3D Avatar / Memoji Character

### Community 5 - "OG Image & Social Sharing"
Cohesion: 0.4
Nodes (6): OG Image Color Palette (warm cream/off-white + terracotta/rust red + dark background), OG Image Layout (split: left text panel, right dark avatar panel), OG Image Typography (large serif display name, sans-serif body), OG Image (og-image.png), Social Sharing / Open Graph Preview, urvash.com

## Knowledge Gaps
- **19 isolated node(s):** `renderMarkdown() — lightweight markdown-to-HTML`, `showTyping() / setLoading() — typing indicator`, `toggleDark() — dark mode toggle`, `Animated Data Pipeline Canvas (hero section)`, `Scroll-Triggered Reveal Animations (tick / IntersectionObserver)` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `index.html — Single-File Portfolio Site` connect `Site Features & Analytics` to `Serverless Chat Backend`, `Chatbot Frontend UI`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Why does `chat.js Netlify Serverless Function` connect `Serverless Chat Backend` to `Chatbot Frontend UI`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Why does `CLAUDE.md — Project Configuration and Session Context` connect `Serverless Chat Backend` to `Site Features & Analytics`?**
  _High betweenness centrality (0.060) - this node is a cross-community bridge._
- **What connects `renderMarkdown() — lightweight markdown-to-HTML`, `showTyping() / setLoading() — typing indicator`, `toggleDark() — dark mode toggle` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._