"""
SQLAlchemy ORM models.

Three core tables:
- users: authentication + profile
- documents: uploaded PDFs and their processing status
- chats: question/answer history, linked to a user and (optionally) a document
"""
import enum
import uuid

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Enum, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


def generate_uuid() -> str:
    return str(uuid.uuid4())


class DocumentStatus(str, enum.Enum):
    UPLOADING = "uploading"
    EXTRACTING = "extracting"
    EMBEDDING = "embedding"
    READY = "ready"
    ERROR = "error"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    name = Column(String(120), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    documents = relationship("Document", back_populates="owner", cascade="all, delete-orphan")
    chats = relationship("Chat", back_populates="user", cascade="all, delete-orphan")


class Document(Base):
    __tablename__ = "documents"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    status = Column(Enum(DocumentStatus), default=DocumentStatus.UPLOADING, nullable=False)
    page_count = Column(Integer, default=0)
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Name of the ChromaDB collection holding this document's chunk embeddings.
    vector_collection = Column(String(255), nullable=True)

    owner = relationship("User", back_populates="documents")
    chats = relationship("Chat", back_populates="document")


class Chat(Base):
    __tablename__ = "chats"

    id = Column(UUID(as_uuid=False), primary_key=True, default=generate_uuid)
    user_id = Column(UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    document_id = Column(UUID(as_uuid=False), ForeignKey("documents.id", ondelete="SET NULL"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    # Sources stored as JSON-serialized text: [{"document": "...", "page": 12}, ...]
    sources = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="chats")
    document = relationship("Document", back_populates="chats")
