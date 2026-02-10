from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ..database import SessionLocal
from .. import crud, schemas

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.get("/")
def list_predictions(db: Session = Depends(get_db)):
    return crud.get_predictions(db)


@router.post("/")
def add_prediction(data: schemas.PredictionCreate, db: Session = Depends(get_db)):
    return crud.create_prediction(db, data)
