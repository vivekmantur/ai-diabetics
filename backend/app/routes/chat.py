from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database import SessionLocal
from ..schemas import ChatRequest, ChatResponse
from ..llm import ask_llm
from ..dependencies import get_current_user   # 🔐 JWT

router = APIRouter()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/ask", response_model=ChatResponse)
def ask_chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
    user=Depends(get_current_user),   # 🔐 get user from JWT
):
    """
    RAG:
    Pull latest user predictions → send as context to LLM
    """

    rows = db.execute(
        text("""
        SELECT pregnancies, glucose, blood_pressure, skin_thickness,
               insulin, bmi, diabetes_pedigree, age,
               prediction_result, probability, timestamp
        FROM predictions
        WHERE user_id = :uid
        ORDER BY timestamp DESC
        LIMIT 5
        """),
        {"uid": user["user_id"]},   # 🔐 use JWT user_id
    ).fetchall()

    if not rows:
        context = "No previous prediction data available."
    else:
        context = "\n".join([
            f"""
Time: {r.timestamp}
Glucose: {r.glucose}
BMI: {r.bmi}
Age: {r.age}
Result: {"Diabetic" if r.prediction_result else "Healthy"}
Probability: {round(r.probability * 100, 1)}%
"""
            for r in rows
        ])

    answer = ask_llm(data.question, context)

    return {"answer": answer}
