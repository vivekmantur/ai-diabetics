import os

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://app:admin@192.168.1.81:5432/diabeticsdb"
)
