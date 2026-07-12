"""Pydantic schemas for the chat / RAG question-answering API."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=2000)
    document_id: str


class SourceCitation(BaseModel):
    document: str
    page: int


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceCitation] = []


class ChatHistoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    document_id: str | None
    question: str
    answer: str
    sources: list[SourceCitation] = []
    created_at: datetime
