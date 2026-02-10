from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from .routes import predict

app = FastAPI(title="AI Diabetes API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router, prefix="/predict", tags=["Prediction"])

if os.path.exists("frontend_build"):
    app.mount("/static", StaticFiles(directory="frontend_build/static"), name="static")

    @app.get("/")
    def serve_react():
        return FileResponse("frontend_build/index.html")
