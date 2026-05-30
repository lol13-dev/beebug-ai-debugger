from typing import Any, Dict, Optional

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from services.ai_analyzer import ai_analyzer

# Load environment variables
load_dotenv(dotenv_path="../.env")

app = FastAPI(title="Beebug API", description="AI-powered debugging assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Beebug API!"}


def _analyze_request(error_text: str, context: Optional[Dict[str, Any]] = None):
    cleaned_error_text = error_text.strip()
    if not cleaned_error_text:
        return {
            "message": "Provide error_text to analyze an error.",
            "example": "/api/analyze?error_text=TypeError:%20Cannot%20read%20properties%20of%20undefined",
        }
    return ai_analyzer.analyze(cleaned_error_text, context)


@app.get("/api/analyze")
def analyze_error_get(error_text: str = ""):
    return _analyze_request(error_text)


@app.post("/api/analyze")
def analyze_error(payload: dict):
    error_text = payload.get("error_text", "")
    context = payload.get("context")
    return _analyze_request(error_text, context)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
