"""
Application entry point.

Wires together middleware, routers, exception handlers, and startup logic
(creating DB tables). Run with:

    uvicorn app.main:app --reload
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config.settings import settings
from app.database.database import Base, engine
from app.routers import auth, chat, documents, users
from app.utils.exception_handlers import register_exception_handlers
from app.utils.logger import get_logger

logger = get_logger(__name__)

app = FastAPI(
    title=settings.APP_NAME,
    description=(
        "Backend API for an AI Research Assistant. Upload PDF documents and "
        "ask grounded, cited questions about them using a Retrieval-Augmented "
        "Generation (RAG) pipeline."
    ),
    version="1.0.0",
    docs_url="/docs",       # Swagger UI
    redoc_url="/redoc",     # ReDoc
)

# --- CORS ---
# Restrict to known frontend origins in production via CORS_ORIGINS.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Consistent JSON error responses across the app ---
register_exception_handlers(app)

# --- Routers ---
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(documents.router)
app.include_router(chat.router)


@app.on_event("startup")
def on_startup():
    """
    Create tables if they don't exist yet.

    Fine for local dev / quick starts. In production, prefer proper
    migrations with Alembic instead of relying on `create_all`.
    """
    Base.metadata.create_all(bind=engine)
    logger.info("Database tables ensured. %s started in '%s' mode.", settings.APP_NAME, settings.ENVIRONMENT)


@app.get("/health", tags=["Health"])
def health_check():
    """Simple liveness/readiness probe for Docker/orchestrators."""
    return {"status": "ok", "app": settings.APP_NAME, "environment": settings.ENVIRONMENT}
