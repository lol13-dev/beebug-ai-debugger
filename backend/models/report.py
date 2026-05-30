from pydantic import BaseModel
from typing import List

class ErrorReport(BaseModel):
    explanation: str
    root_cause: str
    solutions: List[str]
    example_fixes: str
