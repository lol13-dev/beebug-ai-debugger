class PromptBuilder:
    def build_analysis_prompt(self, error_text: str, error_type: str, difficulty: str = "beginner") -> str:
        """
        Constructs the prompt to send to the LLM based on the error text and type.
        """
        
        explanation_instruction = (
            "A highly technical and detailed explanation of the error."
            if difficulty == "technical" else
            "A simple, beginner-friendly explanation of the error."
        )
        
        return f"""
You are Beebug, an expert AI debugging assistant.
The user has encountered the following error (Type: {error_type}):

{error_text}

Please provide:
1. detected_language: The programming language of the error/code (e.g., "Python", "JavaScript", "Java", "C", "C++", etc.).
2. explanation: {explanation_instruction}
3. root_cause: The root cause.
4. solutions: Suggested solutions (array of strings).
5. example_fixes: Example fixes (code blocks as a single string).

Format the output as JSON with the exact keys above.
"""

prompt_builder = PromptBuilder()
