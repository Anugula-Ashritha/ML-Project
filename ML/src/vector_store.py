import faiss
import numpy as np


class VectorStore:
    def __init__(self, dimension: int):
        """
        Create an in-memory FAISS vector store.

        Args:
            dimension: Size of each embedding vector.
        """

        self.index = faiss.IndexFlatL2(dimension)
        self.chunks = []

    def add(self, embeddings: list[list[float]], chunks: list[dict]):
        """
        Add embeddings and their corresponding chunks to the store.
        """

        vectors = np.array(embeddings, dtype="float32")

        self.index.add(vectors)
        self.chunks.extend(chunks)

    def search(self, query_embedding: list[float], top_k: int = 3) -> list[dict]:
        """
        Search for the most similar chunks.

        Returns:
            A list of matching chunks with their similarity distance.
        """

        query_vector = np.array(
            [query_embedding],
            dtype="float32"
        )

        distances, indices = self.index.search(
            query_vector,
            min(top_k, len(self.chunks))
        )

        results = []

        for distance, index in zip(distances[0], indices[0]):
            if index != -1:
                result = self.chunks[index].copy()
                result["distance"] = float(distance)
                results.append(result)

        return results