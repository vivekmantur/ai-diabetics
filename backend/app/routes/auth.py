from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..database import SessionLocal
from ..auth.jwt_handler import create_access_token
from ..crud import get_user_by_phone

router = APIRouter()


# ================= DB Dependency =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= Request Schema =================
class LoginRequest(BaseModel):   # ✅ MUST inherit BaseModel
    phone: str


# ================= Login Route =================
@router.post("/login")
def login(data: LoginRequest, db: Session = Depends(get_db)):

    user = get_user_by_phone(db, data.phone)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_access_token({"user_id": user["user_id"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }
