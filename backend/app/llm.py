from groq import Groq
from .config import GROQ_API_KEY

client = Groq(api_key=GROQ_API_KEY)


def ask_llm(question: str, context: str) -> str:
    prompt = f"""
You are a friendly and professional diabetes health coach.

Use the user health context below to answer the question clearly.

Context:
{context}

Question:
{question}

Formatting rules:
- Write in clear, simple language.
- Use bullet points wherever helpful (diet tips, risks, actions, foods, etc.).
- Keep paragraphs short and readable.
- Highlight important numbers or warnings.
- Make the response look clean and pleasant when rendered as markdown.
- Do NOT force fixed headings like "Health Summary" or "Diet Plan".
- Sound supportive and human, not robotic.
"""

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
    )

    return response.choices[0].message.content
