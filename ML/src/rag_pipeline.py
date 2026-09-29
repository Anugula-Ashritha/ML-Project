from src.pdf_loader import extract_text_from_pdf
from src.chunker import chunk_pages
from src.embedder import create_embeddings
from src.vector_store import VectorStore
from src.retriever import retrieve


class RAGPipeline:
    def __init__(self):
        self.vector_store = None
        self.documents = []

    def add_pdf(self, pdf_path: str) -> int:
        """
        Load one PDF and add its chunks to the vector store.
        Can be called multiple times for multiple PDFs.
        """

        pages = extract_text_from_pdf(pdf_path)
        chunks = chunk_pages(pages)

        if not chunks:
            return 0

        embeddings = create_embeddings(chunks)

        if self.vector_store is None:
            self.vector_store = VectorStore(len(embeddings[0]))

        self.vector_store.add(embeddings, chunks)

        self.documents.append(pdf_path)

        return len(chunks)

    def search(self, question: str, top_k: int = 3) -> list[dict]:
        """
        Search across all PDFs that have been added.
        """

        if self.vector_store is None:
            return []

        return retrieve(
            question,
            self.vector_store,
            top_k=top_k
        )