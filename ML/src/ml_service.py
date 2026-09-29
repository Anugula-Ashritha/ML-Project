from pathlib import Path

from src.rag_pipeline import RAGPipeline


class MLService:
    def __init__(self):
        self.rag = RAGPipeline()

    def add_document(self, pdf_path: str) -> dict:
        """
        Add a PDF document to the RAG knowledge base.
        """

        path = Path(pdf_path)

        if not path.exists():
            raise FileNotFoundError(f"PDF not found: {pdf_path}")

        chunks_added = self.rag.add_pdf(str(path))

        return {
            "document": path.name,
            "chunks_added": chunks_added,
            "status": "success"
        }

    def search(self, question: str, top_k: int = 3) -> dict:
        """
        Search the knowledge base for relevant document chunks.
        """

        results = self.rag.search(
            question,
            top_k=top_k
        )

        sources = [
            {
                "document": result["source"],
                "page": result["page"]
            }
            for result in results
        ]

        return {
            "question": question,
            "results": results,
            "sources": sources
        }


ml_service = MLService()