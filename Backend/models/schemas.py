from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    question: str


class Source(BaseModel):
    document: str
    page: int
    relevance_score: float | None = None


class ChatResponse(BaseModel):
    success: bool
    answer: str
    sources: list[Source]


class ReportRequest(BaseModel):
    topic: Optional[str] = None
