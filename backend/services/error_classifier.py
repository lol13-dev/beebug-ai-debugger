class ErrorClassifier:
    def classify(self, error_text: str) -> str:
        """
        Classifies the error text into categories like 'SyntaxError', 'TypeError', 'CompilerLog', etc.
        """
        error_text_lower = error_text.lower()
        if "syntaxerror" in error_text_lower:
            return "Syntax Error"
        elif "typeerror" in error_text_lower:
            return "Type Error"
        elif "traceback" in error_text_lower:
            return "Runtime Exception / Stack Trace"
        return "Unknown Error"

error_classifier = ErrorClassifier()
