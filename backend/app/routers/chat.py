"""
Chat endpoints — ask a grounded question about a document, list chat
history, and delete a past conversation.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth.authentication import get_current_user
from app.database.database import get_db
from app.database.models import Chat, User
from app.schemas.chat import ChatHistoryOut, ChatRequest, ChatResponse
from app.services.chat_service import DocumentNotReadyError, ask_question, parse_sources

router = APIRouter(prefix="/chat", tags=["Chat"])


@router.post("", response_model=ChatResponse)
def ask(payload: ChatRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    Ask a question about a specific document. Runs the full RAG pipeline
    (retrieve -> generate) and returns a grounded answer with page-level
    source citations. The exchange is saved to chat history automatically.
    """
    try:
        answer, sources = ask_question(
            db, user_id=current_user.id, document_id=payload.document_id, question=payload.question
        )
    except DocumentNotReadyError as exc:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001 — surface AI/API failures as a clean 502
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"The AI service failed to generate an answer: {exc}",
        ) from exc

    return ChatResponse(answer=answer, sources=sources)


@router.get("/history", response_model=list[ChatHistoryOut])
def get_history(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Return the current user's previous conversations, most recent first."""
    chats = (
        db.query(Chat)
        .filter(Chat.user_id == current_user.id)
        .order_by(Chat.created_at.desc())
        .all()
    )
    return [
        ChatHistoryOut(
            id=c.id,
            document_id=c.document_id,
            question=c.question,
            answer=c.answer,
            sources=parse_sources(c.sources),
            created_at=c.created_at,
        )
        for c in chats
    ]


@router.delete("/{chat_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_chat(chat_id: str, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """Delete a single past conversation entry."""
    chat = db.query(Chat).filter(Chat.id == chat_id, Chat.user_id == current_user.id).first()
    if chat is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Conversation not found.")
    db.delete(chat)
    db.commit()
