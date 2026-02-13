from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path

from .routes import predict, users, chat, auth   # ✅ include auth

app = FastAPI(title="AI Diabetes API")

# ================= CORS =================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ================= Routers =================
app.include_router(auth.router, prefix="/auth", tags=["Auth"])   # ✅ ADD THIS
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(users.router, prefix="/users", tags=["Users"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])


# ============================================================
# React Static Serving (Docker production)
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
    def serve_react():
        return FileResponse(FRONTEND_BUILD / "index.html")

else:

    @app.get("/")
    def root():
        return {"message": "AI Diabetes API running (dev mode)"}
