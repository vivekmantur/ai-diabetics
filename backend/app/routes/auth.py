from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
import random
import os

from ..database import SessionLocal
from ..crud import get_user_by_phone, create_user
from ..auth.jwt_handler import create_access_token
from ..auth.otp_store import store_otp, verify_otp, otp_db
from ..auth.otp_sender import send_otp

router = APIRouter()


# ================= DB Dependency =================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ================= Schemas =================
class PhoneRequest(BaseModel):
    phone: str


class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str


# ================= Helper =================
def generate_and_send_otp(phone: str):
    otp = str(random.randint(100000, 999999))
    store_otp(phone, otp, int(os.getenv("OTP_EXPIRE_SECONDS", 300)))
    send_otp(phone, otp)


# ============================================================
# 🔐 LOGIN — Send OTP ONLY if user exists
# ============================================================
@router.post("/request-otp")
def request_login_otp(data: PhoneRequest, db: Session = Depends(get_db)):

    user = get_user_by_phone(db, data.phone)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    generate_and_send_otp(data.phone)

    return {"message": "OTP sent successfully"}


# ============================================================
# 🔐 LOGIN — Verify OTP and issue JWT
# ============================================================
@router.post("/verify-otp")
def verify_login_otp(data: OTPVerifyRequest, db: Session = Depends(get_db)):

    if not verify_otp(data.phone, data.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )

    user = get_user_by_phone(db, data.phone)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    # 🔒 delete OTP after success (important security fix)
    otp_db.pop(data.phone, None)

    token = create_access_token({"user_id": user["user_id"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }


# ============================================================
# 🆕 REGISTER — Send OTP ONLY if user NOT exists
# ============================================================
@router.post("/register-otp")
def request_register_otp(data: PhoneRequest, db: Session = Depends(get_db)):

    user = get_user_by_phone(db, data.phone)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    generate_and_send_otp(data.phone)

    return {"message": "Registration OTP sent"}


# ============================================================
# 🆕 REGISTER — Verify OTP and create user
# ============================================================
@router.post("/register")
def register_user(data: OTPVerifyRequest, db: Session = Depends(get_db)):

    if not verify_otp(data.phone, data.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )

    # 🔎 double-check user doesn't exist (race condition safety)
    existing_user = get_user_by_phone(db, data.phone)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    user = create_user(db, data.phone)

    # 🔒 delete OTP after success
    otp_db.pop(data.phone, None)

    token = create_access_token({"user_id": user["user_id"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }
