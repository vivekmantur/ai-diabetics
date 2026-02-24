"""
LLM Service

Handles communication with Groq LLM for AI health coaching.
"""

import logging
from typing import Optional

from groq import Groq
from .config import GROQ_API_KEY


logger = logging.getLogger(__name__)


# ==============================
# Validate Configuration
# ==============================

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not configured.")


# ==============================
# LLM Client
# ==============================

client = Groq(api_key=GROQ_API_KEY)


# ==============================
# Prompt Template
# ==============================

SYSTEM_PROMPT_TEMPLATE = """
You are a friendly and professional diabetes health coach.

Use the user health context below to answer the question clearly.

Context:
{context}

Question:
{question}

Formatting rules:
- Write in clear, simple language.
- Use bullet points wherever helpful.
- Keep paragraphs short and readable.
- Highlight important numbers or warnings.
- Format nicely for markdown rendering.
- Do NOT force fixed headings.
- Sound supportive and human, not robotic.
- Do not provide medical diagnosis; give educational guidance only.
"""


# ==============================
# Ask LLM
# ==============================

def ask_llm(question: str, context: str) -> str:
    """
    Send user question and context to Groq LLM.

    Args:
        question (str): User question.
        context (str): Retrieved health context.

    Returns:
        str: Generated AI response.
    """

    prompt = SYSTEM_PROMPT_TEMPLATE.format(
        question=question,
        context=context,
    )

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.3,
        )

        content: Optional[str] = response.choices[0].message.content

        if not content:
            logger.warning("LLM returned empty response.")
            return "Sorry, I couldn't generate a response right now."

        return content

    except Exception as exc:
        logger.exception("LLM request failed: %s", exc)
        return "AI service is temporarily unavailable. Please try again later."