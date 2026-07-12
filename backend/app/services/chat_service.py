"""
Chat service — orchestrates the "ask a question" RAG pipeline:

    question -> retrieve relevant chunks -> generate grounded answer
                                                    |
                                                    v
                                    persist Q/A + sources to chat history
"""
import json

from sqlalchemy.orm import Session

from app.database.models import Chat, Document, DocumentStatus
from app.rag.llm import generate_answer
from app.rag.retriever import retrieve_relevant_chunks
from app.schemas.chat import SourceCitation


class DocumentNotReadyError(Exception):
    pass


def ask_question(db: Session, user_id: str, document_id: str, question: str) -> tuple[str, list[SourceCitation]]:
    """
    Run the full RAG pipeline for a single question and persist it to
    chat history. Returns (answer, sources).
    """
    document = db.query(Document).filter(Document.id == document_id, Document.user_id == user_id).first()
    if document is None:
        raise ValueError("Document not found.")
    if document.status != DocumentStatus.READY:
        raise DocumentNotReadyError("This document is still processing. Please wait until it's ready.")

    # 1. Retrieve the most relevant chunks for this question.
    retrieved = retrieve_relevant_chunks(document_id=document_id, query=question)

    # 2. Generate a grounded answer from those chunks.
    answer = generate_answer(question=question, chunks=retrieved)

    # De-duplicate (document, page) pairs while preserving order, so the
    # same page isn't cited twice just because two chunks came from it.
    seen = set()
    sources: list[SourceCitation] = []
    for chunk in retrieved:
        key = (chunk.filename, chunk.page)
        if key not in seen:
            seen.add(key)
            sources.append(SourceCitation(document=chunk.filename, page=chunk.page))

    # 3. Persist to chat history.
    chat = Chat(
        user_id=user_id,
        document_id=document_id,
        question=question,
        answer=answer,
        sources=json.dumps([s.model_dump() for s in sources]),
    )
    db.add(chat)
    db.commit()

    return answer, sources


def parse_sources(sources_json: str | None) -> list[SourceCitation]:
    if not sources_json:
        return []
    return [SourceCitation(**s) for s in json.loads(sources_json)]
