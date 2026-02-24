"""
Main Application Entry Point

Initializes FastAPI application, middleware,
API routers, and optional frontend static serving.
"""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .routes import (
    predict,
    users,
    chat,
    auth,
)


# ==============================
# App Initialization
# ==============================

app = FastAPI(
    title="AI Diabetes API",
    version="1.0.0",
    description="AI-powered diabetes prediction and health assistant API.",
)


# ==============================
# CORS Middleware
# ==============================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# API Routers
# ==============================

app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])


# ==============================
# Health Check (Best Practice)
# ==============================

@app.get("/health")
def health_check():
    """Health check endpoint for monitoring."""
    return {"status": "ok"}


# ============================================================
# React Static Serving (Docker Production)
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]
FRONTEND_BUILD = BASE_DIR / "frontend_build"

if FRONTEND_BUILD.exists():

    app.mount(
        "/static",
        StaticFiles(directory=FRONTEND_BUILD / "static"),
        name="static",
    )

    @app.get("/")
    def serve_frontend():
        """Serve React production build."""
        return FileResponse(FRONTEND_BUILD / "index.html")

else:

    @app.get("/")
    def root():
        """Development mode root endpoint."""
        return {"message": "AI Diabetes API running (dev mode)"}