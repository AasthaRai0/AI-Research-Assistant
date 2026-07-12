# Lumen — AI Research Assistant

A modern, ChatGPT/Perplexity-style frontend for a RAG-based PDF chatbot, built with React, Vite, and Tailwind CSS.

## Stack
- React 19 + Vite
- Tailwind CSS v4
- React Router v7
- Framer Motion
- Lucide React icons
- react-markdown + remark-gfm (chat markdown & code blocks)
- Axios (API client stub in `src/lib/api.js`)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build

```bash
npm run build
npm run preview
```

## Project structure

```
src/
├── components/
│   ├── Navbar.jsx           # Public site nav
│   ├── Sidebar.jsx          # Authenticated app sidebar (responsive w/ mobile drawer)
│   ├── DashboardLayout.jsx  # Sidebar + content shell for authenticated pages
│   ├── ChatMessage.jsx      # Chat bubble: markdown, code blocks, citations, typing state
│   ├── DocumentCard.jsx     # Document tile with processing status
│   ├── UploadBox.jsx        # Drag & drop PDF upload
│   ├── SourceCitation.jsx   # Citation chips under AI answers
│   ├── FeatureCard.jsx      # Landing page feature card
│   ├── HeroGraphic.jsx      # Animated hero illustration
│   └── Loader.jsx           # Spinner + typing dots
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── Login.jsx / Signup.jsx
│   ├── Dashboard.jsx
│   ├── Documents.jsx
│   ├── Chat.jsx
│   ├── History.jsx
│   └── Settings.jsx
├── context/
│   └── AppContext.jsx       # Global state: documents, conversations, user, theme
├── lib/
│   ├── mockData.js          # Seed data (swap for real API responses)
│   └── api.js                # Axios client + endpoint stubs for your RAG backend
├── App.jsx                   # Route definitions
└── index.css                  # Tailwind v4 theme tokens (design system)
```

## Wiring up a real backend

Replace the mock logic in `AppContext.jsx` (`addDocuments`, `createConversation`, etc.) with calls to
`src/lib/api.js`, which already has `documentsApi`, `chatApi`, and `authApi` stubs pointing at
`VITE_API_BASE_URL` (defaults to `http://localhost:8000/api`).

## Design system

Defined in `src/index.css` via Tailwind v4 `@theme`:
- **Ink** neutrals (`ink-50` → `ink-950`) for the black/white base palette
- **Accent** indigo-violet gradient (`accent-400` → `accent-600`) for AI/interactive moments
- **Mint/Amber** for success and in-progress states
- Display face: Space Grotesk · Body: Inter · Mono: JetBrains Mono
