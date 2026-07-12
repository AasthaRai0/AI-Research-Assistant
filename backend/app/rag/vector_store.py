"""
Step 4 of the RAG pipeline: vector storage.

Each document gets its own ChromaDB collection (named `doc_<document_id>`),
which keeps documents cleanly isolated from one another — deleting a
document is just dropping its collection, and search never accidentally
leaks another user's content.

ChromaDB persists to disk (CHROMA_PERSIST_DIR), so embeddings survive
server restarts without needing a separate always-on vector DB service.
"""
from functools import lru_cache

import chromadb
from chromadb.config import Settings as ChromaSettings

from app.config.settings import settings
from app.rag.embeddings import get_embedding_provider
from app.rag.text_splitter import Chunk


@lru_cache
def get_chroma_client() -> chromadb.ClientAPI:
    """Cached singleton Chroma client, persisted to disk."""
    return chromadb.PersistentClient(
        path=settings.CHROMA_PERSIST_DIR,
        settings=ChromaSettings(anonymized_telemetry=False),
    )


def collection_name_for(document_id: str) -> str:
    return f"{settings.CHROMA_COLLECTION_PREFIX}{document_id}"


def store_chunks(document_id: str, filename: str, chunks: list[Chunk]) -> str:
    """
    Embed a document's chunks and store them in a dedicated Chroma
    collection. Returns the collection name for later retrieval/deletion.
    """
    client = get_chroma_client()
    name = collection_name_for(document_id)

    # Fresh collection each time this is (re)processed.
    client.get_or_create_collection(name)
    client.delete_collection(name)
    collection = client.get_or_create_collection(name, metadata={"filename": filename})

    embedder = get_embedding_provider()
    texts = [c.text for c in chunks]
    vectors = embedder.embed_documents(texts)

    collection.add(
        ids=[f"{document_id}-{c.chunk_index}" for c in chunks],
        embeddings=vectors,
        documents=texts,
        metadatas=[{"page": c.page_number, "filename": filename} for c in chunks],
    )
    return name


def delete_document_vectors(document_id: str) -> None:
    """Remove a document's collection entirely (used on document delete)."""
    client = get_chroma_client()
    try:
        client.delete_collection(collection_name_for(document_id))
    except Exception:  # noqa: BLE001 — collection may not exist; deletion is idempotent
        pass
