from .embedder import create_embeddings
from .vector_store import VectorStore


def retrieve(
    question: str,
    vector_store: VectorStore,
    top_k: int = 3
) -> list[dict]:
    """
    Find the document chunks most relevant to a user's question.
    """

    query_chunk = [{"text": question}]

    query_embedding = create_embeddings(query_chunk)[0]

    results = vector_store.search(
        query_embedding,
        top_k=top_k
    )

    return results
