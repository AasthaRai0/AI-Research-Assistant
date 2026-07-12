"""
Document endpoints — upload a PDF and kick off the RAG ingestion pipeline
as a background task, list a user's documents, check a single document's
processing status, and delete a document.
"""
from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.auth.authentication import get_current_user
from app.database.database import get_db
from app.database.models import Document, User
from app.schemas.document import DocumentOut, DocumentUploadResponse
from app.services.document_service import (
    create_document_record,
    delete_document,
    process_document_task,
    save_upload_to_disk,
    validate_upload,
)

router = APIRouter(prefix="/documents", tags=["Documents"])


@router.post("/upload", response_model=DocumentUploadResponse, status_code=status.HTTP_202_ACCEPTED)
async def upload_document(
    background_tasks: BackgroundTasks,
    file: UploadFile,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Upload a PDF. The file is validated and saved immediately; text
    extraction, chunking, and embedding then run in the background so this
    endpoint returns right away. Poll `GET /documents` (or `/documents/{id}`)
    to watch `status` progress to "ready".
    """
    contents = await file.read()

    try:
        validate_upload(file, len(contents))
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

    file_path = save_upload_to_disk(file, contents)
    document = create_document_record(db, current_user.id, file.filename, file_path)

    # Runs after the response has been sent to the client, using its own DB session.
    background_tasks.add_task(process_document_task, document.id)

    return DocumentUploadResponse(id=document.id, filename=document.filename, status=document.status)


@router.get("", response_model=list[DocumentOut])
def list_documents(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """List all documents uploaded by the current user, most recent first."""
    return (
        db.query(Document)
        .filter(Document.user_id == current_user.id)
        .order_by(Document.created_at.desc())
        .all()
    )


@router.get("/{document_id}", response_model=DocumentOut)
def get_document(document_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Fetch a single document — used by the frontend to poll processing status."""
    document = (
        db.query(Document)
        .filter(Document.id == document_id, Document.user_id == current_user.id)
        .first()
    )
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")
    return document


@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_document(document_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a document, its file on disk, and its vector embeddings."""
    document = (
        db.query(Document)
        .filter(Document.id == document_id, Document.user_id == current_user.id)
        .first()
    )
    if document is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found.")

    delete_document(db, document)
