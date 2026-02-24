"""
Prediction Router

Handles CRUD operations for user diabetes predictions.
Access is restricted to authenticated users via JWT.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from ..database import SessionLocal
from .. import crud, schemas
from ..dependencies import get_current_user


router = APIRouter()


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
# Get User Predictions
# ============================================================

@router.get("/")
def get_user_predictions(
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """
    Retrieve all predictions belonging to the logged-in user.
    """
    return crud.get_predictions(db, user["user_id"])


# ============================================================
# Create Prediction
# ============================================================

@router.post("/")
def add_prediction(
    data: schemas.PredictionCreate,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
):
    """
    Create a new diabetes prediction for the authenticated user.
    """
    return crud.create_prediction(db, data, user["user_id"])