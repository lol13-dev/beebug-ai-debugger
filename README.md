# BeeBug 🐝

BeeBug is an intelligent, AI-powered debugging assistant designed to accelerate the software development workflow. By translating cryptic error messages, compiler logs, and complex stack traces into clear, human-readable language, BeeBug empowers developers to identify root causes instantly. Whether you're a seasoned engineer looking to minimize downtime or a junior developer learning best practices, BeeBug streamlines the debugging process by providing actionable solutions and ready-to-use code fixes.

## Key Features
- **Instant Error Translation**: Paste any error message, stack trace, or broken source code to receive a simplified, easy-to-understand explanation.
- **Root Cause Analysis**: Automatically traces and identifies the underlying issue causing the crash or bug.
- **Actionable Code Fixes**: Generates practical, ready-to-use code snippets and step-by-step solutions to resolve the error immediately.
- **Adjustable Explanation Styles**: Tailors the complexity of the response to your experience level (e.g., beginner-friendly explanations).
- **Privacy-First Offline Mode**: Full support for local AI inference, allowing you to debug sensitive code completely offline.

## AI Models Used
- **Google Gemini 2.5 Flash**: The primary cloud-based engine used for blazing-fast, highly accurate error analysis and code generation.
- **Local Open-Source Models (via LM Studio)**: Built-in support for any OpenAI-compatible local model (such as *Qwen 2.5 1.5B Instruct*), enabling privacy-focused, offline debugging without sending code to the cloud.

## Project Structure
- `frontend/`: Contains the HTML, CSS, and JS for the user interface.
- `backend/`: FastAPI backend to process requests and communicate with AI models.
- `docs/`: Project documentation for the hackathon (architecture, pitch, demo script).
- `assets/`: Images and screenshots.

## Getting Started

### Backend
1. Navigate to the root directory.
2. Install requirements: `pip install -r requirements.txt`
3. Configure your `.env` file with necessary AI API keys (e.g., `GEMINI_API_KEY`).
4. Run the backend: `cd backend && uvicorn app:app --reload`

### Frontend
1. Open `frontend/index.html` in your browser.
2. Or use a simple HTTP server: `cd frontend && python -m http.server 3000`
