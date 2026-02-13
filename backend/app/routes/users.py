from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database import SessionLocal
from ..dependencies import get_current_user  # JWT dependency

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔐 Get current logged-in user (from JWT)
@router.get("/me")
def get_me(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    result = db.execute(
        text("SELECT user_id, phone_number FROM users WHERE user_id = :uid"),
        {"uid": user["user_id"]},
    ).fetchone()

    return dict(result._mapping)
