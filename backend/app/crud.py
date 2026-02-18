from sqlalchemy import text
import numpy as np
from .model_loader import model


# ============================================================
# 🔐 AUTH — get user by phone
# ============================================================
def get_user_by_phone(db, phone: str):
    result = db.execute(
        text("""
            SELECT user_id, phone_number, email
            FROM users
            WHERE phone_number = :phone
        """),
        {"phone": phone},
    ).fetchone()

    if not result:
        return None

    return dict(result._mapping)


# ============================================================
# 🔐 Get predictions ONLY for logged-in user
# ============================================================
def get_predictions(db, user_id: int):
    result = db.execute(
        text("""
            SELECT *
            FROM predictions
            WHERE user_id = :uid
            ORDER BY timestamp DESC
        """),
        {"uid": user_id},
    )

    return [dict(row._mapping) for row in result]


# ============================================================
# 🔐 Create prediction using JWT user_id (NOT frontend)
# ============================================================
def create_prediction(db, data, user_id: int):
    pregnancies = data.pregnancies
    glucose = data.glucose
    blood_pressure = data.blood_pressure
    skin_thickness = data.skin_thickness
    insulin = data.insulin
    bmi = data.bmi
    diabetes_pedigree = data.diabetes_pedigree
    age = data.age

    # ---- engineered features ----
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
        pregnancy_age
    ]])

    prediction = int(model.predict(features)[0])
    probability = float(model.predict_proba(features)[0][1])

    db.execute(
        text("""
            INSERT INTO predictions (
                user_id, pregnancies, glucose, blood_pressure, skin_thickness,
                insulin, bmi, diabetes_pedigree, age,
                prediction_result, probability
            )
            VALUES (
                :user_id, :pregnancies, :glucose, :blood_pressure, :skin_thickness,
                :insulin, :bmi, :diabetes_pedigree, :age,
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
            "prediction_result": prediction,
            "probability": probability,
        },
    )

    db.commit()

    return {"prediction": prediction, "probability": probability}

def create_user(db, phone: str, email: str):
    # prevent duplicate phone OR email
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


