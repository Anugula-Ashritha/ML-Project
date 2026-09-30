from .pdf_loader import extract_text_from_pdf
from .chunker import chunk_pages
from .embedder import create_embeddings
from .vector_store import VectorStore
from .retriever import retrieve


class RAGPipeline:
    def __init__(self):
        self.vector_store = None
        self.documents = []

    def add_pdf(
        self,
        pdf_path: str,
        source_name: str | None = None
    ) -> int:
        """Load one PDF and add its chunks to the vector store."""

        pages = extract_text_from_pdf(
            pdf_path,
            source_name=source_name
        )
        chunks = chunk_pages(pages)

        if not chunks:
            return 0

        embeddings = create_embeddings(chunks)

        if self.vector_store is None:
            self.vector_store = VectorStore(len(embeddings[0]))

        self.vector_store.add(embeddings, chunks)

        self.documents.append(source_name or pdf_path)

        return len(chunks)

    def search(self, question: str, top_k: int = 5) -> list[dict]:
        """Search across all PDFs that have been added."""

        if self.vector_store is None:
            return []

        return retrieve(
            question,
            self.vector_store,
            top_k=top_k
        )
