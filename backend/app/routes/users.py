"""
User Router

Provides endpoints related to authenticated user information.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import Dict

from ..database import SessionLocal
from ..dependencies import get_current_user


router = APIRouter(tags=["User"])


# ==============================
# Database Dependency
# ==============================

def get_db():
    """
    Provide database session dependency.
    Ensures session cleanup after request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ============================================================
# Get Current Logged-in User
# ============================================================

@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
) -> Dict:
    """
    Retrieve profile information for the authenticated user.
    """

    query = text("""
        SELECT user_id, phone_number
        FROM users
        WHERE user_id = :uid
    """)

    result = db.execute(
        query,
        {"uid": user["user_id"]},
    ).fetchone()

    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    return dict(result._mapping)