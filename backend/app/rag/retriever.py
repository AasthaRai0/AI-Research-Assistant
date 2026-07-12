"""
Step 5 of the RAG pipeline: retrieval.

Given a user's question, embed it with the same embedding model used at
ingestion time, then run a similarity search against the document's Chroma
collection to pull back the most relevant chunks. These retrieved chunks
become the "context" the LLM is grounded in — this is the "R" in RAG.
"""
from dataclasses import dataclass

from app.config.settings import settings
from app.rag.embeddings import get_embedding_provider
from app.rag.vector_store import collection_name_for, get_chroma_client


@dataclass
class RetrievedChunk:
    text: str
    page: int
    filename: str
    score: float


def retrieve_relevant_chunks(
    document_id: str, query: str, top_k: int = settings.RETRIEVAL_TOP_K
) -> list[RetrievedChunk]:
    """Return the top-k most semantically relevant chunks for `query`."""
    client = get_chroma_client()
    collection = client.get_collection(collection_name_for(document_id))

    embedder = get_embedding_provider()
    query_vector = embedder.embed_query(query)

    results = collection.query(
        query_embeddings=[query_vector],
        n_results=top_k,
        include=["documents", "metadatas", "distances"],
    )

    chunks: list[RetrievedChunk] = []
    documents = results.get("documents", [[]])[0]
    metadatas = results.get("metadatas", [[]])[0]
    distances = results.get("distances", [[]])[0]

    for text, meta, distance in zip(documents, metadatas, distances):
        chunks.append(
            RetrievedChunk(
                text=text,
                page=meta.get("page", 0),
                filename=meta.get("filename", "document.pdf"),
                # Chroma returns a distance (lower = more similar); convert
                # to a 0-1 "similarity score" that's more intuitive to log/inspect.
                score=1 / (1 + distance),
            )
        )
    return chunks
