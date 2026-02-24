"""
Database Configuration

Creates SQLAlchemy engine and session factory
used across the application.
"""

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from .config import DATABASE_URL


# ==============================
# Database Engine
# ==============================

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,   # checks connection health
    future=True,          # SQLAlchemy 2.x style
)


# ==============================
# Session Factory
# ==============================

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)