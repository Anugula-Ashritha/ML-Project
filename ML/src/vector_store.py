import faiss
import numpy as np


class VectorStore:
    def __init__(self, dimension: int):
        """
        Create an in-memory FAISS vector store using cosine similarity.
        Embeddings are normalized before insertion/search.
        """

        self.index = faiss.IndexFlatIP(dimension)
        self.chunks = []

    def add(self, embeddings: list[list[float]], chunks: list[dict]):
        """Add embeddings and their corresponding chunks."""

        if not embeddings or not chunks:
            return

        vectors = np.array(embeddings, dtype="float32")
        self.index.add(vectors)
        self.chunks.extend(chunks)

    def remove_document(self, source: str):
        """Remove all chunks belonging to one source document."""

        remaining_chunks = [
            chunk for chunk in self.chunks
            if chunk.get("source") != source
        ]

        self.index = faiss.IndexFlatIP(self.index.d)
        self.chunks = []

        if remaining_chunks:
            texts_embeddings = remaining_chunks
            # The embedding is not stored in the chunk, so callers should
            # rebuild the pipeline when document deletion is required.
            return False

        return True

    def search(self, query_embedding: list[float], top_k: int = 5) -> list[dict]:
        """
        Search for the most similar chunks.

        Returns chunks with a cosine-similarity score.
        """

        if not self.chunks:
            return []

        query_vector = np.array(
            [query_embedding],
            dtype="float32"
        )

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
