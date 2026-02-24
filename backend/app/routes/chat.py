"""
Chat Router

Provides AI chat endpoint using RAG (Retrieval Augmented Generation)
by combining user prediction history with LLM responses.
"""

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from ..database import SessionLocal
from ..schemas import ChatRequest, ChatResponse
from ..llm import ask_llm
from ..dependencies import get_current_user


router = APIRouter()


# ==============================
# Database Dependency
# ==============================

def get_db():
    """
    Provide database session dependency.
    Ensures proper session cleanup.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==============================
# Chat Endpoint (RAG)
# ==============================

@router.post("/ask", response_model=ChatResponse)
def ask_chat(
    data: ChatRequest,
    db: Session = Depends(get_db),
    user: dict = Depends(get_current_user),
) -> ChatResponse:
    """
    Ask AI health assistant.

    Workflow:
    1. Fetch latest user prediction history.
    2. Build contextual medical summary.
    3. Send question + context to LLM.
    4. Return generated answer.
    """

    query = text("""
        SELECT
            pregnancies,
            glucose,
            blood_pressure,
            skin_thickness,
            insulin,
            bmi,
            diabetes_pedigree,
            age,
            prediction_result,
            probability,
            timestamp
        FROM predictions
        WHERE user_id = :uid
        ORDER BY timestamp DESC
        LIMIT 5
    """)

    rows = db.execute(
        query,
        {"uid": user["user_id"]},
    ).fetchall()

    # ==============================
    # Build RAG Context
    # ==============================

    if not rows:
        context = "No previous prediction data available."
    else:
        context_parts = []

        for r in rows:
            context_parts.append(
                (
                    f"Time: {r.timestamp}\n"
                    f"Glucose: {r.glucose}\n"
                    f"BMI: {r.bmi}\n"
                    f"Age: {r.age}\n"
                    f"Result: {'Diabetic' if r.prediction_result else 'Healthy'}\n"
                    f"Probability: {round(r.probability * 100, 1)}%\n"
                )
            )

        context = "\n".join(context_parts)

    # ==============================
    # LLM Call
    # ==============================

    answer = ask_llm(data.question, context)

    return ChatResponse(answer=answer)