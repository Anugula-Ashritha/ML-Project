def answer_question(question: str) -> dict:
    """
    Temporary mock RAG function.

    Later this will be replaced with the real ML/RAG pipeline.
    """

    return {
        "answer": (
            f"This is a mock answer to your question: '{question}'. "
            "The real RAG system will generate the answer from the uploaded documents."
        ),
        "sources": [
            {
                "document": "Attendance_Policy.pdf",
                "page": 4
            }
        ]
    }


def ingest_document(file_path: str) -> dict:
    """
    Temporary mock document ingestion.

    Later this will call the ML team's PDF processing,
    chunking, embedding and vector-store pipeline.
    """

    return {
        "status": "processed"
    }


def generate_report(topic: str | None = None) -> dict:
    """
    Temporary mock report generation.

    Later this will use the real knowledge base.
    """

    report_topic = topic or "Knowledge Base Summary"

    return {
        "title": report_topic,
        "content": (
            f"This is a mock report about '{report_topic}'. "
            "The real report will be generated from the uploaded documents."
        ),
        "sources": [
            {
                "document": "Attendance_Policy.pdf",
                "page": 4
            }
        ]
    }