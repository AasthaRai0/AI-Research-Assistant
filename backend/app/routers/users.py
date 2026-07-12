"""User profile endpoints."""
from fastapi import APIRouter, Depends

from app.auth.authentication import get_current_user
from app.database.models import User
from app.schemas.user import UserOut

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserOut)
def get_my_profile(current_user: User = Depends(get_current_user)):
    """Return the authenticated user's profile."""
    return current_user
