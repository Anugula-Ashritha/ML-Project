from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ML.src.llm import generate_answer
from ML.src.ml_service import ml_service


def ingest_document(
    file_path: str,
    original_filename: str | None = None
) -> dict:
    """Add an uploaded PDF to the ML/RAG knowledge base."""

    try:
        return ml_service.add_document(
            file_path,
            original_filename=original_filename
        )
    except Exception as exc:
        raise RuntimeError(
            f"Failed to ingest document: {file_path}"
        ) from exc


def answer_question(question: str) -> dict:
    """Retrieve relevant chunks and generate an evidence-based answer."""

    search_result = ml_service.search(question, top_k=5)
    return generate_answer(question, search_result["results"])


def generate_report(topic: str | None = None) -> dict:
    """Generate a report from retrieved knowledge-base content."""

    report_topic = topic or "Knowledge Base Summary"
    question = topic or "Summarize the uploaded documents."

    search_result = ml_service.search(question, top_k=5)
    result = generate_answer(question, search_result["results"])

    return {
        "title": report_topic,
        "content": result["answer"],
        "sources": result["sources"]
    }
