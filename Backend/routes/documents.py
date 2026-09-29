from fastapi import APIRouter

from services.document_store import get_documents


router = APIRouter()


@router.get("/documents")
def list_documents():
    return {
        "success": True,
        "documents": get_documents()
    }