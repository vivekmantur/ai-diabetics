"""
Model Loader

Loads the trained diabetes prediction model used
for inference across the application.
"""

import logging
from pathlib import Path
import joblib
from typing import Any


logger = logging.getLogger(__name__)


# ==============================
# Resolve Model Path
# ==============================

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "diabetes_final_model.pkl"


# ==============================
# Load Model
# ==============================

def load_model() -> Any:
    """
    Load ML model from disk.

    Returns:
        Any: Loaded ML model instance.
    """
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"Model file not found at: {MODEL_PATH}"
        )

    logger.info("Loading ML model from %s", MODEL_PATH)

    try:
        return joblib.load(MODEL_PATH)
    except Exception as exc:
        logger.exception("Failed to load ML model")
        raise RuntimeError("Model loading failed") from exc


# Load model once at startup
model = load_model()