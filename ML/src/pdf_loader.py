import pymupdf
from pathlib import Path


def extract_text_from_pdf(pdf_path: str) -> list[dict]:
    """
    Extract text from a PDF page by page.

    Returns a list containing:
    - source: PDF filename
    - page: page number
    - text: extracted text
    """

    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    document = pymupdf.open(pdf_path)

    pages = []

    for page_number, page in enumerate(document, start=1):
        text = page.get_text("text").strip()

        if text:
            pages.append({
                "source": pdf_path.name,
                "page": page_number,
                "text": text
            })

    document.close()

    return pages