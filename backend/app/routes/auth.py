from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
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


class RegisterRequest(BaseModel):
    phone: str
    email: EmailStr   # ✅ NEW


class OTPVerifyRequest(BaseModel):
    phone: str
    otp: str


class RegisterVerifyRequest(BaseModel):
    phone: str
    email: EmailStr   # ✅ NEW
    otp: str


# ================= Helper =================
def generate_and_send_otp(phone: str, email: str):
    otp = str(random.randint(100000, 999999))
    store_otp(phone, otp, int(os.getenv("OTP_EXPIRE_SECONDS", 300)))
    send_otp(email, otp)   # ✅ send to EMAIL



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

    generate_and_send_otp(data.phone, user["email"])



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

    otp_db.pop(data.phone, None)  # 🔒 delete OTP after success

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
def request_register_otp(data: RegisterRequest, db: Session = Depends(get_db)):

    user = get_user_by_phone(db, data.phone)
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    generate_and_send_otp(data.phone, data.email)


    return {"message": "Registration OTP sent"}


# ============================================================
# 🆕 REGISTER — Verify OTP and create user (WITH EMAIL)
# ============================================================
@router.post("/register")
def register_user(data: RegisterVerifyRequest, db: Session = Depends(get_db)):

    if not verify_otp(data.phone, data.otp):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired OTP"
        )

    # 🔎 safety check
    existing_user = get_user_by_phone(db, data.phone)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already exists"
        )

    # ✅ create user with email
    user = create_user(db, data.phone, data.email)

    otp_db.pop(data.phone, None)

    token = create_access_token({"user_id": user["user_id"]})

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": user,
    }
