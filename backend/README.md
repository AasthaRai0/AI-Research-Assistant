# AI Research Assistant — Backend

A production-ready FastAPI backend for a RAG-based PDF chatbot: upload documents, ask
questions, and get answers grounded in your own files with page-level source citations.

Verified end-to-end with an automated smoke test (signup → login → upload → background
processing → chat → history → delete) before delivery.

## Stack

| Layer | Choice |
|---|---|
| API framework | FastAPI + Pydantic v2 |
| Database | PostgreSQL + SQLAlchemy 2.0 |
| Auth | JWT (python-jose) + bcrypt password hashing (passlib) |
| PDF extraction | PyPDF |
| Chunking | LangChain `RecursiveCharacterTextSplitter` |
| Embeddings | Sentence-Transformers (local, default) or OpenAI (swappable) |
| Vector store | ChromaDB (persisted to disk, one collection per document) |
| LLM | OpenAI (default) or HuggingFace (swappable) |
| Deployment | Docker + docker-compose |

## Project structure

```
backend/
├── app/
│   ├── main.py                  # FastAPI app, middleware, routers, startup
│   ├── config/settings.py       # Env-driven settings (pydantic-settings)
│   ├── database/
│   │   ├── database.py          # Engine, session factory, get_db dependency
│   │   └── models.py            # User, Document, Chat (SQLAlchemy models)
│   ├── auth/
│   │   ├── jwt.py                # Token create/decode
│   │   └── authentication.py     # Password hashing, get_current_user dependency
│   ├── routers/
│   │   ├── auth.py               # POST /auth/signup, /auth/login
│   │   ├── users.py              # GET /users/me
│   │   ├── documents.py          # Upload / list / status / delete
│   │   └── chat.py               # Ask / history / delete
│   ├── rag/                      # The RAG pipeline, one file per stage
│   │   ├── pdf_loader.py         # 1. Extract text per page (PyPDF)
│   │   ├── text_splitter.py      # 2. Chunk text, keep page metadata
│   │   ├── embeddings.py         # 3. Text -> vectors (pluggable provider)
│   │   ├── vector_store.py       # 4. Store/query vectors (ChromaDB)
│   │   ├── retriever.py          # 5. Similarity search for a question
│   │   └── llm.py                # 6. Grounded answer generation
│   ├── schemas/                  # Pydantic request/response models
│   ├── services/                 # Orchestration: document_service, chat_service
│   └── utils/                    # Logging, exception handlers
├── storage/
│   ├── uploads/                  # Saved PDF files
│   └── chroma/                   # Persisted vector DB
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── .env.example
```

## The RAG pipeline

```
Upload PDF
   │
   ▼
[pdf_loader]     Extract text per page (PyPDF)              status: extracting
   │
   ▼
[text_splitter]  Split into overlapping chunks, tag each     status: embedding
                 with its source page number
   │
   ▼
[embeddings]     Turn each chunk into a vector
   │
   ▼
[vector_store]   Store vectors in a per-document              status: ready
                 ChromaDB collection

────────────────────────── at question time ──────────────────────────

User question
   │
   ▼
[embeddings]     Embed the question with the same model
   │
   ▼
[retriever]      Similarity search -> top-k relevant chunks
   │
   ▼
[llm]            Answer using ONLY the retrieved chunks
   │
   ▼
Response: { answer, sources: [{ document, page }, ...] }
```

Every document gets its own ChromaDB collection (`doc_<document_id>`), so retrieval
never mixes chunks from someone else's files and deleting a document is just dropping
its collection.

## API reference

All routes except `/health`, `/auth/signup`, and `/auth/login` require
`Authorization: Bearer <token>`.

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Liveness check |
| POST | `/auth/signup` | Create account, returns JWT |
| POST | `/auth/login` | Log in, returns JWT |
| GET | `/users/me` | Current user profile |
| POST | `/documents/upload` | Upload a PDF (multipart `file`), processes in background |
| GET | `/documents` | List the current user's documents |
| GET | `/documents/{id}` | Poll a document's processing status |
| DELETE | `/documents/{id}` | Delete a document, its file, and its vectors |
| POST | `/chat` | Ask a question: `{ "question": "...", "document_id": "..." }` |
| GET | `/chat/history` | List past conversations |
| DELETE | `/chat/{id}` | Delete one conversation entry |

Interactive docs: **Swagger UI** at `/docs`, **ReDoc** at `/redoc`.

### Example: ask a question

```bash
curl -X POST http://localhost:8000/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"question": "What is gradient descent?", "document_id": "<doc-id>"}'
```

```json
{
  "answer": "According to your uploaded Machine Learning notes, gradient descent is...",
  "sources": [
    { "document": "ML_notes.pdf", "page": 23 },
    { "document": "ML_notes.pdf", "page": 24 }
  ]
}
```

## Document processing status

`Document.status` moves through: `uploading` → `extracting` → `embedding` → `ready`
(or `error`, with details in `error_message`). Poll `GET /documents/{id}` from the
frontend to drive a progress indicator — this is exactly the sequence the frontend's
upload UI expects ("Extracting text...", "Creating embeddings...", "Ready for chat").

## Getting started (local, without Docker)

Requires Python 3.11+ and a running PostgreSQL instance.

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# Edit .env: set DATABASE_URL, SECRET_KEY, OPENAI_API_KEY

uvicorn app.main:app --reload
```

The app creates its tables automatically on startup (`Base.metadata.create_all`).
For production, replace this with proper Alembic migrations.

Visit **http://localhost:8000/docs** to try the API.

## Getting started (Docker)

```bash
cd backend
cp .env.example .env
# Edit .env: at minimum set OPENAI_API_KEY and a strong SECRET_KEY

docker compose up --build
```

This starts PostgreSQL and the API together; the API is available at
`http://localhost:8000`. Uploaded files and the vector store persist in `./storage`
on the host via a volume mount.

## Configuration reference (`.env`)

| Variable | Purpose |
|---|---|
| `SECRET_KEY` | JWT signing secret — generate with `openssl rand -hex 32` |
| `DATABASE_URL` | PostgreSQL connection string |
| `CORS_ORIGINS` | JSON array of allowed frontend origins |
| `MAX_UPLOAD_SIZE_MB` | Upload size limit (default 25MB) |
| `OPENAI_API_KEY` | Required if `LLM_PROVIDER=openai` or `EMBEDDING_PROVIDER=openai` |
| `LLM_PROVIDER` | `openai` or `huggingface` |
| `EMBEDDING_PROVIDER` | `sentence-transformers` (local, free) or `openai` |
| `CHUNK_SIZE` / `CHUNK_OVERLAP` | Chunking parameters |
| `RETRIEVAL_TOP_K` | Number of chunks retrieved per question |

## Security notes

- Passwords are hashed with bcrypt (never stored or logged in plain text).
- JWT tokens are required on every document/chat route via the `get_current_user`
  dependency, and every document/chat query is scoped to `user_id` — one user can
  never read or delete another user's documents or conversations.
- File uploads are validated by content type and size before touching disk.
- CORS is restricted to the origins listed in `CORS_ORIGINS`.
- All errors return a consistent JSON shape (`{"error": true, "detail": "..."}`)
  via centralized exception handlers, so the API never leaks stack traces.

## Known trade-offs / next steps for production

- `Base.metadata.create_all` is used for simplicity — swap for Alembic migrations
  before a real production deploy.
- Background processing uses FastAPI `BackgroundTasks` (in-process). For heavier
  scale, move `process_document_task` to a real queue (Celery/RQ + Redis) — the
  function already takes only a `document_id`, so this is a drop-in change.
- Rate limiting isn't implemented; add `slowapi` or an API gateway in front for
  production traffic.
