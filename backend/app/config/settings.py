"""
Application settings.

All configuration is loaded from environment variables (via a `.env` file in
development). Never hardcode secrets — this module is the single source of
truth for configuration across the app.
"""
from functools import lru_cache
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # --- General ---
    APP_NAME: str = "AI Research Assistant API"
    ENVIRONMENT: str = "development"  # development | production
    API_V1_PREFIX: str = ""
    DEBUG: bool = True

    # --- Security / JWT ---
    SECRET_KEY: str = "change-this-secret-key-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # --- Database ---
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/research_assistant"

    # --- CORS ---
    CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # --- File uploads ---
    UPLOAD_DIR: str = "storage/uploads"
    MAX_UPLOAD_SIZE_MB: int = 25
    ALLOWED_FILE_TYPES: List[str] = ["application/pdf"]

    # --- RAG / AI ---
    OPENAI_API_KEY: str = ""
    LLM_PROVIDER: str = "openai"  # openai | huggingface
    LLM_MODEL: str = "gpt-4o-mini"
    EMBEDDING_PROVIDER: str = "sentence-transformers"  # sentence-transformers | openai
    EMBEDDING_MODEL: str = "all-MiniLM-L6-v2"

    # --- Vector store (ChromaDB) ---
    CHROMA_PERSIST_DIR: str = "storage/chroma"
    CHROMA_COLLECTION_PREFIX: str = "doc_"

    # --- Chunking ---
    CHUNK_SIZE: int = 1000
    CHUNK_OVERLAP: int = 150
    RETRIEVAL_TOP_K: int = 4

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache
def get_settings() -> Settings:
    """Cached settings instance — avoids re-reading the .env file on every call."""
    return Settings()


settings = get_settings()
