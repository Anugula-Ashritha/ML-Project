import faiss
import numpy as np


class VectorStore:
    def __init__(self, dimension: int):
        """Create an in-memory FAISS store using cosine similarity."""
        self.index = faiss.IndexFlatIP(dimension)
        self.chunks = []

    def add(self, embeddings: list[list[float]], chunks: list[dict]):
        """Add normalized embeddings and their chunks."""
        if not embeddings or not chunks:
            return

        vectors = np.array(embeddings, dtype="float32")
        self.index.add(vectors)
        self.chunks.extend(chunks)

    def search(self, query_embedding: list[float], top_k: int = 5) -> list[dict]:
        """Return the most similar chunks with cosine-similarity scores."""
        if not self.chunks:
            return []

        query_vector = np.array([query_embedding], dtype="float32")

        scores, indices = self.index.search(
            query_vector,
            min(top_k, len(self.chunks))
        )

        results = []

        for score, index in zip(scores[0], indices[0]):
            if index != -1:
                result = self.chunks[index].copy()
                result["score"] = float(score)
                results.append(result)

        return results
