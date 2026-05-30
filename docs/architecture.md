# Architecture

## Frontend
- HTML5 / CSS3 / Vanilla JS
- Communicates with the backend via REST API.

## Backend
- Python FastAPI
- Receives error payloads, categorizes them using `ErrorClassifier`, builds prompts with `PromptBuilder`, and fetches responses using `AIAnalyzer`.

## AI Integration
- Models interact with OpenAI/Anthropic/Gemini to provide debugging insights.
