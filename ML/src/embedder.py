from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def create_embeddings(chunks: list[dict]) -> list[list[float]]:
    """
    Convert chunk text into numerical embeddings.

    Returns:
        A list of embedding vectors, one for each chunk.
    """

    texts = [chunk["text"] for chunk in chunks]

    embeddings = model.encode(
        texts,
        convert_to_numpy=True
    )

    return embeddings.tolist()