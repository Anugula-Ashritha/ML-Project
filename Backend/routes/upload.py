import os
import uuid

from fastapi import APIRouter, UploadFile, File, HTTPException, Form

from services.rag_service import ingest_document
from services.document_store import add_document


router = APIRouter()

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    title: str | None = Form(default=None),
    category: str | None = Form(default=None)
):
    if not file.filename or not file.filename.lower().endswith(".pdf"):
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

    document_id = f"doc_{uuid.uuid4().hex[:8]}"
    file_path = os.path.join(UPLOAD_DIR, f"{document_id}.pdf")

    contents = await file.read()

    with open(file_path, "wb") as buffer:
        buffer.write(contents)

    result = ingest_document(
        file_path,
        original_filename=file.filename
    )

    document = {
        "id": document_id,
        "title": title or file.filename.rsplit(".", 1)[0],
        "filename": file.filename,
        "category": category or "Operations",
        "file_size": len(contents),
        "chunk_count": result["chunks_added"],
        "status": result["status"],
        "stored_path": file_path
    }

    add_document(document)

    return {
        "success": True,
        "document": document
    }
