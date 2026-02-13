from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

from .routes import predict, users, chat

app = FastAPI(title="AI Diabetes API")

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow React dev + Docker
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= Routers =================
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])


# ============================================================
# React Static Serving (ONLY in Docker / production build)
# ============================================================

# backend/app/main.py → go 3 levels up to project root
BASE_DIR = Path(__file__).resolve().parents[2]

# Docker copies React build here
FRONTEND_BUILD = BASE_DIR / "frontend_build"

if FRONTEND_BUILD.exists():
    # Mount JS/CSS/images
    app.mount(
        "/static",
        StaticFiles(directory=FRONTEND_BUILD / "static"),
        name="static",
    )

    # Root → React index.html
    @app.get("/")
    def serve_react():
        return FileResponse(FRONTEND_BUILD / "index.html")

else:
    # Local development root
    @app.get("/")
    def root():
        return {"message": "AI Diabetes API running (dev mode)"}
