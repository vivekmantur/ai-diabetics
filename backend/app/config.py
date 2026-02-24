"""
Application Configuration

Loads environment variables required for the backend
application such as database and external API credentials.
"""

import os
from pathlib import Path
from dotenv import load_dotenv


# ==============================
# Load Environment Variables
# ==============================

# Resolve project root directory
BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env explicitly from project root/backend folder
load_dotenv(BASE_DIR / ".env")


# ==============================
# Environment Variables
# ==============================

GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")
DATABASE_URL: str | None = os.getenv("DATABASE_URL")


# ==============================
# Validation (Fail Fast)
# ==============================

if not GROQ_API_KEY:
    raise ValueError("GROQ_API_KEY is not set in environment variables.")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL is not set in environment variables.")