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

    # NEW clinical answers
    glucose_symptoms: bool | None = None
    obesity_history: bool | None = None
    sedentary_lifestyle: bool | None = None
    sleep_apnea: bool | None = None
    weight_loss_attempts: bool | None = None
    pcos: bool | None = None
    gender: str | None = None


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
