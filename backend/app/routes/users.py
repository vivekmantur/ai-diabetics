from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database import SessionLocal

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/{phone_number}")
def get_user_by_phone(phone_number: str, db: Session = Depends(get_db)):
    result = db.execute(
        text("SELECT user_id, phone_number FROM users WHERE phone_number = :phone"),
        {"phone": phone_number}
    ).fetchone()

    if not result:
        raise HTTPException(status_code=404, detail="User not found")

    return dict(result._mapping)
