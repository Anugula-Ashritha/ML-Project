from pathlib import Path
import sys

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from ML.src.llm import generate_answer
from ML.src.ml_service import ml_service


def ingest_document(file_path: str) -> dict:
    """
    Add an uploaded PDF to the existing ML/RAG knowledge base.
    """

    try:
        return ml_service.add_document(file_path)
    except Exception as exc:
        raise RuntimeError(
            f"Failed to ingest document: {file_path}"
        ) from exc


def answer_question(question: str) -> dict:
    """
    Retrieve relevant chunks from the existing ML/RAG knowledge base
    and generate an answer using the existing LLM integration.
    """

    search_result = ml_service.search(question, top_k=3)
    retrieved_chunks = search_result["results"]

    return generate_answer(question, retrieved_chunks)


def generate_report(topic: str | None = None) -> dict:
    """
    Generate a simple knowledge-base report using the existing
    retrieval and LLM pipeline. No fake document data is used.
    """

    report_topic = topic or "Knowledge Base Summary"
    question = topic or "Summarize the uploaded documents."

    search_result = ml_service.search(question, top_k=3)
    result = generate_answer(question, search_result["results"])

    return {
        "title": report_topic,
        "content": result["answer"],
        "sources": result["sources"]
    }
