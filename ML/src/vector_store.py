import numpy as np


class VectorStore:
    def __init__(self, dimension: int):
        self.dimension = dimension
        self.vectors = []
        self.chunks = []

    def add(self, embeddings: list[list[float]], chunks: list[dict]):
        if not embeddings or not chunks:
            return

        vectors = np.array(embeddings, dtype="float32")

        if vectors.ndim != 2 or vectors.shape[1] != self.dimension:
            raise ValueError("Embedding dimension does not match vector store.")

        self.vectors.extend(vectors)
        self.chunks.extend(chunks)

    def search(
        self,
        query_embedding: list[float],
        top_k: int = 5
    ) -> list[dict]:

        if not self.chunks:
            return []

        query_vector = np.array(
            query_embedding,
            dtype="float32"
        )

        # Embeddings are already normalized,
        # so dot product gives cosine similarity.
        scores = np.dot(
            np.array(self.vectors, dtype="float32"),
            query_vector
        )

        top_k = min(top_k, len(self.chunks))

        top_indices = np.argsort(scores)[::-1][:top_k]

        results = []

        for index in top_indices:
            result = self.chunks[index].copy()
            result["score"] = float(scores[index])
            results.append(result)

        return results