def chunk_pages(pages: list[dict], chunk_size: int = 500, overlap: int = 50) -> list[dict]:
    """
    Split extracted PDF text into smaller chunks while preserving
    source document and page number.
    """

    chunks = []

    for page in pages:
        text = page["text"]

        start = 0

        while start < len(text):
            end = start + chunk_size
            chunk_text = text[start:end].strip()

            if chunk_text:
                chunks.append({
                    "source": page["source"],
                    "page": page["page"],
                    "text": chunk_text
                })

            start += chunk_size - overlap

    return chunks