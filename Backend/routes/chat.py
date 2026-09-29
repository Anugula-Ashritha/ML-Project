from fastapi import APIRouter, HTTPException

from models.schemas import ChatRequest, ChatResponse
from services.rag_service import answer_question


router = APIRouter()


@router.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):

    # Validate question
    if not request.question.strip():
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": {
                    "code": "EMPTY_QUESTION",
                    "message": "Question cannot be empty."
                }
            }
        )

    # Call the ML/RAG service
    result = answer_question(request.question)

    return {
        "success": True,
        "answer": result["answer"],
        "sources": result["sources"]
    }