from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..database import SessionLocal
from .. import crud, schemas
from ..dependencies import get_current_user   # JWT dependency


router = APIRouter()


# DB session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# 🔒 Get predictions only for logged-in user
@router.get("/")
def read_predictions(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return crud.get_predictions(db, user["user_id"])


@router.post("/")
def add_prediction(
    data: schemas.PredictionCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):
    return crud.create_prediction(db, data, user["user_id"])

