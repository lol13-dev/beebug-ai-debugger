import json
import os
from typing import Any, Dict, Optional

import google.generativeai as genai # type: ignore
from openai import OpenAI

from services.error_classifier import error_classifier
from services.prompt_builder import prompt_builder

class AIAnalyzer:
    def __init__(self):
        self.is_configured = False
        self.use_local = os.getenv("USE_LOCAL_AI", "false").lower() == "true"
        self.local_port = os.getenv("LOCAL_PORT", "1234")
        self.local_client: Optional[OpenAI] = None

    def _configure_client(self, model_choice: str):
        if self.use_local:
            if not self.local_client:
                # LM Studio provides an OpenAI compatible endpoint on localhost:1234
                self.local_client = OpenAI(
                    base_url=f"http://localhost:{self.local_port}/v1",
                    api_key="lm-studio" # required but ignored
                )
            return

        if not self.is_configured:
            api_key = os.getenv("GEMINI_API_KEY")
            if not api_key:
                raise ValueError("GEMINI_API_KEY is missing. Add it to your .env file.")
            genai.configure(api_key=api_key) # type: ignore
            self.is_configured = True

    def _parse_response(self, content: str) -> Dict[str, Any]:
        cleaned = content.strip()
        if cleaned.startswith("```"):
            cleaned = cleaned.strip("`")
            if cleaned.startswith("json"):
                cleaned = cleaned[4:].strip()

        data = json.loads(cleaned)
        return {
            "detected_language": data.get("detected_language", "Unknown"),
            "explanation": data.get("explanation", "No explanation returned."),
            "root_cause": data.get("root_cause", "No root cause returned."),
            "solutions": data.get("solutions", []),
            "example_fixes": data.get("example_fixes", ""),
        }

    def analyze(
        self, error_text: str, context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Analyzes the error text and returns structured debugging information using the chosen AI model.
        """
        request_context = context or {}
        model_choice = request_context.get("model", "gemini-2.5-flash")
        difficulty = request_context.get("explanation_style", "beginner")

        try:
            self._configure_client(model_choice)
        except ValueError as e:
            return {
                "explanation": f"API Error: {str(e)}",
                "root_cause": "Missing API Key configuration.",
                "solutions": ["Check your .env file for the required API key."],
                "example_fixes": ""
            }

        error_type = error_classifier.classify(error_text)
        prompt = prompt_builder.build_analysis_prompt(error_text, error_type, difficulty)
        
        full_prompt = (
            "You are Beebug, an AI debugging assistant. Return only valid JSON.\n\n"
            f"{prompt}\n\nAdditional context: {json.dumps(request_context)}"
        )

        try:
            if self.use_local:
                # LM Studio ignores the model name if only one is loaded, so we pass a generic string
                assert self.local_client is not None, "Local client is not initialized"
                response = self.local_client.chat.completions.create(
                    model="local-model",
                    messages=[
                        {
                            "role": "system",
                            "content": "You are Beebug, an AI debugging assistant. Return only valid JSON."
                        },
                        {
                            "role": "user",
                            "content": full_prompt
                        }
                    ],
                    temperature=0.2
                )
                content = response.choices[0].message.content or "{}"
            else:
                model = genai.GenerativeModel("gemini-2.5-flash") # type: ignore
                response = model.generate_content(
                    full_prompt,
                    generation_config=genai.types.GenerationConfig( # type: ignore
                        temperature=0.2,
                    )
                )
                content = response.text or "{}"
            
            return self._parse_response(content)
        except Exception as e:
            error_message = str(e)
            
            if self.use_local:
                return {
                    "explanation": f"Local AI Connection Error: {error_message}",
                    "root_cause": "The backend could not connect to LM Studio.",
                    "solutions": [
                        "Ensure you have downloaded LM Studio for Mac (Intel).",
                        "Download a tiny model like 'Qwen 2.5 1.5B Instruct' (Q4_K_M).",
                        "Go to the '<->' Local Server tab in LM Studio, load the model, and click 'Start Server'."
                    ],
                    "example_fixes": ""
                }
            
            return {
                "explanation": f"Gemini API Error: {error_message}",
                "root_cause": "The backend encountered an error while contacting the Gemini API.",
                "solutions": [
                    "Check your API key in the .env file.",
                    "Ensure your Google Cloud project has the Gemini API enabled."
                ],
                "example_fixes": ""
            }

# Singleton instance
ai_analyzer = AIAnalyzer()
