"""Pydantic schemas for document upload, status, and listing."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.database.models import DocumentStatus


class DocumentOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    filename: str
    status: DocumentStatus
    page_count: int
    error_message: str | None = None
    created_at: datetime


class DocumentUploadResponse(BaseModel):
    id: str
    filename: str
    status: DocumentStatus
    message: str = "Document received and queued for processing."
