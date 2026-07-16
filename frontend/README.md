# Lumen — AI Research Assistant

A modern, ChatGPT/Perplexity-style frontend for a RAG-based PDF chatbot, built with
React, Vite, and Tailwind CSS — fully wired to the companion FastAPI backend (`/backend`).

## Stack
- React 19 + Vite
- Tailwind CSS v4
- React Router v7 (with protected routes)
- Framer Motion
- Lucide React icons
- react-markdown + remark-gfm (chat markdown & code blocks)
- Axios (real API client in `src/lib/api.js`)

## Connecting to the backend

This frontend expects the FastAPI backend to be running (see `/backend/README.md`).

```bash
cp .env.example .env
# Edit .env if your backend isn't at the default http://localhost:8000
```

Then start both:
```bash
# Terminal 1 — backend
cd backend && uvicorn app.main:app --reload   # or: docker compose up

# Terminal 2 — frontend
cd ai-research-assistant
npm install
npm run dev
```

Open http://localhost:5173. Sign up, upload a PDF, and watch its status move through
`uploading → extracting → embedding → ready` (backed by real polling against
`GET /documents/{id}`), then ask it questions in Chat.

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
│   ├── ProtectedRoute.jsx   # Redirects to /login if not authenticated
│   ├── ChatMessage.jsx      # Chat bubble: markdown, code blocks, citations, typing state
│   ├── DocumentCard.jsx     # Document tile with live processing status
│   ├── UploadBox.jsx        # Drag & drop PDF upload
│   ├── SourceCitation.jsx   # Citation chips under AI answers
│   ├── FeatureCard.jsx      # Landing page feature card
│   ├── HeroGraphic.jsx      # Animated hero illustration
│   └── Loader.jsx           # Spinner + typing dots
├── pages/
│   ├── Home.jsx              # Landing page
│   ├── Login.jsx / Signup.jsx  # Call authApi.login/signup, store JWT
│   ├── Dashboard.jsx          # Real stats + activity feed from documents/chatHistory
│   ├── Documents.jsx          # Upload, list, delete — backed by documentsApi
│   ├── Chat.jsx                # RAG chat — backed by chatApi
│   ├── History.jsx             # Past Q&A — backed by chatApi.history
│   └── Settings.jsx            # Profile editing — backed by authApi.updateProfile
├── context/
│   └── AppContext.jsx        # Global state + all backend orchestration (auth, docs, chat)
├── lib/
│   ├── api.js                 # Axios client + documentsApi / chatApi / authApi
│   ├── format.js               # formatRelativeDate helper
│   └── config.js                # Static UI-only options (e.g. model picker labels)
├── App.jsx                     # Route definitions (public + protected)
└── index.css                    # Tailwind v4 theme tokens (design system)
```

## How the pieces connect

| Frontend action | API call | Backend endpoint |
|---|---|---|
| Sign up / log in | `authApi.signup` / `authApi.login` | `POST /auth/signup` / `/auth/login` |
| Load profile on refresh | `authApi.me()` | `GET /users/me` |
| Save profile changes | `authApi.updateProfile()` | `PATCH /users/me` |
| Upload a PDF | `documentsApi.upload()` | `POST /documents/upload` |
| Poll processing status | `documentsApi.get(id)` | `GET /documents/{id}` |
| List / delete documents | `documentsApi.list()` / `.remove()` | `GET` / `DELETE /documents` |
| Ask a question | `chatApi.ask()` | `POST /chat` |
| Load / delete history | `chatApi.history()` / `.deleteEntry()` | `GET` / `DELETE /chat` |

The JWT returned on login/signup is stored in `localStorage` (`lumen_token`) and attached
to every request by an axios interceptor. A `401` response anywhere clears the session
and redirects to `/login` automatically.

## Design system

Defined in `src/index.css` via Tailwind v4 `@theme`:
- **Ink** neutrals (`ink-50` → `ink-950`) for the black/white base palette
- **Accent** indigo-violet gradient (`accent-400` → `accent-600`) for AI/interactive moments
- **Mint/Amber** for success and in-progress states
- Display face: Space Grotesk · Body: Inter · Mono: JetBrains Mono
