from pydantic import BaseModel

class PredictionCreate(BaseModel):
    user_id: int
    pregnancies: int
    glucose: int
    blood_pressure: int
    skin_thickness: int
    insulin: int
    bmi: float
    diabetes_pedigree: float
    age: int
