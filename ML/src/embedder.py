from sentence_transformers import SentenceTransformer


MODEL_NAME = "all-MiniLM-L6-v2"

model = SentenceTransformer(MODEL_NAME)


def create_embeddings(chunks: list[dict]) -> list[list[float]]:
    """
    Convert chunk text into normalized embedding vectors.

    Normalization lets FAISS use inner-product search as cosine similarity.
    """

    if not chunks:
        return []

    texts = [chunk["text"] for chunk in chunks]

    embeddings = model.encode(
        texts,
        convert_to_numpy=True,
        normalize_embeddings=True
    )

    return embeddings.tolist()
