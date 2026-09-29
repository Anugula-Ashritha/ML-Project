import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException

from services.rag_service import ingest_document
from services.document_store import add_document


router = APIRouter()

UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    # Check file type
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail={
                "success": False,
                "error": {
                    "code": "INVALID_FILE",
                    "message": "Only PDF files are supported."
                }
            }
        )

    # Generate unique document ID
    document_id = f"doc_{uuid.uuid4().hex[:8]}"

    # Create safe file path
    file_path = os.path.join(
        UPLOAD_DIR,
        f"{document_id}.pdf"
    )

    # Save uploaded PDF
    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    # Send document to ML/RAG ingestion
    result = ingest_document(file_path)

    # Store document metadata
    document = {
        "id": document_id,
        "filename": file.filename,
        "status": result["status"]
    }

    add_document(document)

    return {
        "success": True,
        "document": document
    }