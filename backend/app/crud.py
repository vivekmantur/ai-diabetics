from sqlalchemy import text
import numpy as np
from .model_loader import model


def get_predictions(db):
    result = db.execute(text("SELECT * FROM predictions ORDER BY timestamp DESC"))
    return [dict(row._mapping) for row in result]


def create_prediction(db, data):
    # ---- original features ----
    pregnancies = data.pregnancies
    glucose = data.glucose
    blood_pressure = data.blood_pressure
    skin_thickness = data.skin_thickness
    insulin = data.insulin
    bmi = data.bmi
    diabetes_pedigree = data.diabetes_pedigree
    age = data.age

    # ---- engineered features (same as training) ----
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

    db.execute(text("""
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
    """), {
        **data.dict(),
        "prediction_result": prediction,
        "probability": probability
    })

    db.commit()

    return {"prediction": prediction, "probability": probability}
