"""
API Schemas

Defines request and response models used across the API.
"""

from pydantic import BaseModel, Field
from typing import Optional, Literal


# ============================================================
# Prediction Schemas
# ============================================================

class PredictionCreate(BaseModel):
    """Input data for diabetes prediction."""

    pregnancies: int = Field(..., ge=0, le=20)
    glucose: int = Field(..., ge=0, le=300)
    blood_pressure: int = Field(..., ge=0, le=200)
    skin_thickness: int = Field(..., ge=0, le=100)
    insulin: int = Field(..., ge=0, le=900)
    bmi: float = Field(..., ge=0, le=80)
    diabetes_pedigree: float = Field(..., ge=0, le=5)
    age: int = Field(..., ge=1, le=120)

    # Clinical questionnaire
    glucose_symptoms: Optional[bool] = None
    obesity_history: Optional[bool] = None
    sedentary_lifestyle: Optional[bool] = None
    sleep_apnea: Optional[bool] = None
    weight_loss_attempts: Optional[bool] = None
    pcos: Optional[bool] = None

    gender: Optional[Literal["male", "female", "other", "unknown"]] = None


class PredictionResponse(BaseModel):
    """Prediction result returned to client."""
    prediction: int
    probability: float


# ============================================================
# Chat Schemas
# ============================================================

class ChatRequest(BaseModel):
    """User question for AI assistant."""
    question: str = Field(..., min_length=3, max_length=500)


class ChatResponse(BaseModel):
    """AI assistant response."""
    answer: str


# ============================================================
# Authentication Schemas
# ============================================================

class LoginRequest(BaseModel):
    """Login request using phone number."""
    phone: str


class TokenResponse(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"