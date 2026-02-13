import os
from dotenv import load_dotenv
from pathlib import Path

# load .env from backend folder
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")
