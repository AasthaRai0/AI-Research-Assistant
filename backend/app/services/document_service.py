"""
Document service — orchestrates the full ingestion pipeline:

    save file -> extract text -> chunk -> embed -> store in ChromaDB
                                              |
                                              v
                          update PostgreSQL `documents.status` at each step

This runs as a FastAPI BackgroundTask after the upload endpoint responds,
so the client gets an immediate 202-style response and can poll
`GET /documents/{id}` (or re-fetch `GET /documents`) to watch the status
move: uploading -> extracting -> embedding -> ready (or error).
"""
import os
import uuid

from fastapi import UploadFile
from sqlalchemy.orm import Session

from app.config.settings import settings
from app.database.models import Document, DocumentStatus
from app.rag.pdf_loader import PDFLoadError, extract_text_from_pdf, get_page_count
from app.rag.text_splitter import split_pages_into_chunks
from app.rag.vector_store import delete_document_vectors, store_chunks


def validate_upload(file: UploadFile, file_size_bytes: int) -> None:
    """Raise ValueError with a user-facing message if the upload is invalid."""
    if file.content_type not in settings.ALLOWED_FILE_TYPES:
        raise ValueError("Only PDF files are supported.")

    max_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024
    if file_size_bytes > max_bytes:
        raise ValueError(f"File exceeds the {settings.MAX_UPLOAD_SIZE_MB}MB limit.")


def save_upload_to_disk(file: UploadFile, contents: bytes) -> str:
    """Persist the raw uploaded bytes to disk and return the file path."""
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    safe_name = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(settings.UPLOAD_DIR, safe_name)
    with open(file_path, "wb") as f:
        f.write(contents)
    return file_path


def create_document_record(db: Session, user_id: str, filename: str, file_path: str) -> Document:
    document = Document(
        user_id=user_id,
        filename=filename,
        file_path=file_path,
        status=DocumentStatus.UPLOADING,
    )
    db.add(document)
    db.commit()
    db.refresh(document)
    return document


def process_document_task(document_id: str) -> None:
    """
    Entry point for FastAPI's BackgroundTasks.

    Opens its own DB session rather than reusing the request's session,
    since the request session is closed as soon as the response is sent
    and background tasks may still be running. This also makes it trivial
    to later move this function to a real task queue (Celery/RQ) — it
    already doesn't depend on request-scoped objects.
    """
    from app.database.database import SessionLocal

    db = SessionLocal()
    try:
        process_document(db, document_id)
    finally:
        db.close()


def process_document(db: Session, document_id: str) -> None:
    """
    The core RAG ingestion pipeline. Intended to run in a background task
    so the upload request itself returns quickly.

    Each stage updates `document.status` so the frontend can show live
    progress ("Extracting text...", "Creating embeddings...", "Ready for chat").
    """
    document = db.query(Document).filter(Document.id == document_id).first()
    if document is None:
        return

    try:
        # --- Extract ---
        document.status = DocumentStatus.EXTRACTING
        db.commit()
        pages = extract_text_from_pdf(document.file_path)
        document.page_count = get_page_count(document.file_path)

        # --- Chunk + Embed + Store ---
        document.status = DocumentStatus.EMBEDDING
        db.commit()
        chunks = split_pages_into_chunks(pages)
        collection_name = store_chunks(document.id, document.filename, chunks)
        document.vector_collection = collection_name

        # --- Ready ---
        document.status = DocumentStatus.READY
        document.error_message = None
        db.commit()

    except PDFLoadError as exc:
        document.status = DocumentStatus.ERROR
        document.error_message = str(exc)
        db.commit()
    except Exception as exc:  # noqa: BLE001 — never let a bad file crash the worker
        document.status = DocumentStatus.ERROR
        document.error_message = f"Unexpected processing error: {exc}"
        db.commit()


def delete_document(db: Session, document: Document) -> None:
    """Delete a document's file, vectors, and DB record."""
    delete_document_vectors(document.id)
    if os.path.exists(document.file_path):
        os.remove(document.file_path)
    db.delete(document)
    db.commit()
