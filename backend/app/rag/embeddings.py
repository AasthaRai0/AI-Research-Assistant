"""
Step 3 of the RAG pipeline: embedding generation.

Embeddings turn text into vectors of floats such that semantically similar
text ends up close together in vector space. We support two interchangeable
providers behind one interface:

- sentence-transformers (default): runs locally, free, no API key needed.
- openai: higher quality for some domains, requires OPENAI_API_KEY.

Swap providers with the EMBEDDING_PROVIDER setting — nothing else in the
pipeline needs to change, since both return plain `list[list[float]]`.
"""
from functools import lru_cache

from app.config.settings import settings


class EmbeddingProvider:
    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        raise NotImplementedError

    def embed_query(self, text: str) -> list[float]:
        raise NotImplementedError


class SentenceTransformerEmbeddings(EmbeddingProvider):
    """Local embedding model — no network calls, good default for dev/self-hosting."""

    def __init__(self, model_name: str):
        # Imported lazily so the (fairly heavy) sentence-transformers package
        # is only loaded if this provider is actually selected.
        from sentence_transformers import SentenceTransformer

        self.model = SentenceTransformer(model_name)

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        vectors = self.model.encode(texts)
        return vectors.tolist() if hasattr(vectors, "tolist") else vectors

    def embed_query(self, text: str) -> list[float]:
        vector = self.model.encode(text)
        return vector.tolist() if hasattr(vector, "tolist") else vector


class OpenAIEmbeddings(EmbeddingProvider):
    """Remote embeddings via the OpenAI API."""

    def __init__(self, model_name: str, api_key: str):
        from openai import OpenAI

        self.client = OpenAI(api_key=api_key)
        self.model_name = model_name

    def embed_documents(self, texts: list[str]) -> list[list[float]]:
        response = self.client.embeddings.create(model=self.model_name, input=texts)
        return [item.embedding for item in response.data]

    def embed_query(self, text: str) -> list[float]:
        return self.embed_documents([text])[0]


@lru_cache
def get_embedding_provider() -> EmbeddingProvider:
    """Cached singleton — avoids reloading the model on every request."""
    if settings.EMBEDDING_PROVIDER == "openai":
        return OpenAIEmbeddings(model_name="text-embedding-3-small", api_key=settings.OPENAI_API_KEY)
    return SentenceTransformerEmbeddings(model_name=settings.EMBEDDING_MODEL)
