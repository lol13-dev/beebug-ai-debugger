# Beebug 🐝

Beebug is an AI-powered debugging assistant that helps developers understand and fix programming errors faster.

## Features
- Paste error messages, compiler logs, stack traces, or source code.
- Explains the error in simple language.
- Identifies the root cause.
- Suggests solutions and generates example fixes.

## Project Structure
- `frontend/`: Contains the HTML, CSS, and JS for the user interface.
- `backend/`: FastAPI backend to process requests and communicate with AI models.
- `docs/`: Project documentation for the hackathon (architecture, pitch, demo script).
- `assets/`: Images and screenshots.

## Getting Started

### Backend
1. Navigate to the root directory.
2. Install requirements: `pip install -r requirements.txt`
3. Configure your `.env` file with necessary AI API keys (e.g., `OPENAI_API_KEY`).
4. Run the backend: `cd backend && uvicorn app:app --reload`

### Frontend
1. Open `frontend/index.html` in your browser.
2. Or use a simple HTTP server: `cd frontend && python -m http.server 3000`
