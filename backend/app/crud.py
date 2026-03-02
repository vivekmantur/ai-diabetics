"""
Repository Layer (CRUD Operations)

Handles database interactions for users and predictions.
"""

from typing import Optional, Dict, List, Any
from sqlalchemy import text
import logging
import numpy as np

from .model_loader import model


logger = logging.getLogger(__name__)


# ============================================================
# AUTH — Get user by phone
# ============================================================

def get_user_by_phone(db, phone: str) -> Optional[Dict[str, Any]]:
    """Fetch user by phone number."""

    result = db.execute(
        text("""
            SELECT user_id, phone_number, email
            FROM users
            WHERE phone_number = :phone
        """),
        {"phone": phone},
    ).fetchone()

    return dict(result._mapping) if result else None


# ============================================================
# Predictions — Fetch User Predictions
# ============================================================

def get_predictions(db, user_id: int) -> List[Dict[str, Any]]:
    """Return predictions belonging to a specific user."""

    result = db.execute(
        text("""
            SELECT
                user_id,
                pregnancies,
                glucose,
                blood_pressure,
                skin_thickness,
                insulin,
                bmi,
                diabetes_pedigree,
                age,
                gender,

                glucose_symptoms,
                obesity_history,
                sedentary_lifestyle,
                sleep_apnea,
                weight_loss_attempts,
                pcos,

                prediction_result,
                probability,
                timestamp
            FROM predictions
            WHERE user_id = :uid
            ORDER BY timestamp DESC
        """),
        {"uid": user_id},
    )

    return [dict(row._mapping) for row in result]

# ============================================================
# Predictions — Create Prediction
# ============================================================

def create_prediction(db, data, user_id: int) -> Dict[str, float]:
    """
    Generate ML prediction and store result in database.
    """

    # ==============================
    # Core Features
    # ==============================

    pregnancies = data.pregnancies
    glucose = data.glucose
    blood_pressure = data.blood_pressure
    skin_thickness = data.skin_thickness
    insulin = data.insulin
    bmi = data.bmi
    diabetes_pedigree = data.diabetes_pedigree
    age = data.age

    # ==============================
    # Feature Engineering
    # ==============================

    bmi_age = bmi * age
    glucose_bmi = glucose / (bmi + 1)
    insulin_glucose = insulin / (glucose + 1)
    pregnancy_age = pregnancies / (age + 1)

    features = np.array([[
        pregnancies,
        glucose,
        blood_pressure,
        skin_thickness,
        insulin,
        bmi,
        diabetes_pedigree,
        age,
        bmi_age,
        glucose_bmi,
        insulin_glucose,
        pregnancy_age,
    ]])

    # ==============================
    # ML Prediction
    # ==============================

    prediction = int(model.predict(features)[0])
    probability = float(model.predict_proba(features)[0][1])

    logger.info("Prediction generated for user_id=%s", user_id)

    # ==============================
    # Database Insert
    # ==============================

    db.execute(
        text("""
            INSERT INTO predictions (
                user_id,
                pregnancies, glucose, blood_pressure, skin_thickness,
                insulin, bmi, diabetes_pedigree, age,
                glucose_symptoms, obesity_history, sedentary_lifestyle,
                sleep_apnea, weight_loss_attempts, pcos, gender,
                prediction_result, probability
            )
            VALUES (
                :user_id,
                :pregnancies, :glucose, :blood_pressure, :skin_thickness,
                :insulin, :bmi, :diabetes_pedigree, :age,
                :glucose_symptoms, :obesity_history, :sedentary_lifestyle,
                :sleep_apnea, :weight_loss_attempts, :pcos, :gender,
                :prediction_result, :probability
            )
        """),
        {
            "user_id": user_id,
            "pregnancies": pregnancies,
            "glucose": glucose,
            "blood_pressure": blood_pressure,
            "skin_thickness": skin_thickness,
            "insulin": insulin,
            "bmi": bmi,
            "diabetes_pedigree": diabetes_pedigree,
            "age": age,

            "glucose_symptoms": getattr(data, "glucose_symptoms", False),
            "obesity_history": getattr(data, "obesity_history", False),
            "sedentary_lifestyle": getattr(data, "sedentary_lifestyle", False),
            "sleep_apnea": getattr(data, "sleep_apnea", False),
            "weight_loss_attempts": getattr(data, "weight_loss_attempts", False),
            "pcos": getattr(data, "pcos", False),
            "gender": getattr(data, "gender", "unknown"),

            "prediction_result": prediction,
            "probability": probability,
        },
    )

    db.commit()

    return {
        "prediction": prediction,
        "probability": probability,
    }


# ============================================================
# Users — Create User
# ============================================================

def create_user(db, phone: str, email: str) -> Optional[Dict[str, Any]]:
    """Create a new user if phone/email not already registered."""

    existing = db.execute(
        text("""
            SELECT user_id
            FROM users
            WHERE phone_number = :phone OR email = :email
        """),
        {"phone": phone, "email": email},
    ).fetchone()

    if existing:
        return None

    db.execute(
        text("""
            INSERT INTO users (phone_number, email)
            VALUES (:phone, :email)
        """),
        {"phone": phone, "email": email},
    )

    db.commit()

    return get_user_by_phone(db, phone)