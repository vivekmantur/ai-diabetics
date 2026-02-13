from pydantic import BaseModel


# ================= Prediction =================

class PredictionCreate(BaseModel):
    pregnancies: int
    glucose: int
    blood_pressure: int
    skin_thickness: int
    insulin: int
    bmi: float
    diabetes_pedigree: float
    age: int


class PredictionResponse(BaseModel):
    prediction: int
    probability: float


# ================= Chat =================

class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str

class LoginRequest(BaseModel):
    phone: str


class TokenResponse(BaseModel):
    access_token: str
