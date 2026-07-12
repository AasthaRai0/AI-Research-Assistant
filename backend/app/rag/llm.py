"""
Step 6 of the RAG pipeline: generation.

Takes the user's question plus the retrieved chunks (the "context") and
asks an LLM to answer using only that context. This is what keeps answers
grounded in the user's own documents instead of the model's general
training knowledge, and it's why we can confidently show source citations
alongside every answer.
"""
from app.config.settings import settings
from app.rag.retriever import RetrievedChunk

SYSTEM_PROMPT = (
    "You are an AI research assistant. Answer the user's question using ONLY "
    "the provided context extracted from their uploaded document. "
    "If the context does not contain enough information to answer, say so "
    "clearly instead of guessing. Be concise and cite specific facts from "
    "the context where relevant."
)


def _build_context(chunks: list[RetrievedChunk]) -> str:
    """Concatenate retrieved chunks into a single context block, each tagged with its page."""
    return "\n\n".join(f"[Page {c.page}]\n{c.text}" for c in chunks)


def generate_answer(question: str, chunks: list[RetrievedChunk]) -> str:
    """
    Generate a grounded answer using the configured LLM provider.

    If no relevant chunks were retrieved, we short-circuit and say so rather
    than sending an empty context to the model.
    """
    if not chunks:
        return (
            "I couldn't find relevant information in this document to answer "
            "that question. Try rephrasing, or check that the right document "
            "is selected."
        )

    context = _build_context(chunks)
    user_prompt = f"Context:\n{context}\n\nQuestion: {question}\n\nAnswer:"

    if settings.LLM_PROVIDER == "huggingface":
        return _generate_with_huggingface(user_prompt)
    return _generate_with_openai(user_prompt)


def _generate_with_openai(user_prompt: str) -> str:
    from openai import OpenAI

    client = OpenAI(api_key=settings.OPENAI_API_KEY)
    response = client.chat.completions.create(
        model=settings.LLM_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        temperature=0.2,
    )
    return response.choices[0].message.content.strip()


def _generate_with_huggingface(user_prompt: str) -> str:
    """
    Fallback path using a local/hosted HuggingFace text-generation pipeline.
    Swap `model` for any instruction-tuned model you have available.
    """
    from transformers import pipeline

    generator = pipeline("text-generation", model="HuggingFaceH4/zephyr-7b-beta")
    full_prompt = f"{SYSTEM_PROMPT}\n\n{user_prompt}"
    result = generator(full_prompt, max_new_tokens=400, do_sample=False)
    return result[0]["generated_text"][len(full_prompt):].strip()
