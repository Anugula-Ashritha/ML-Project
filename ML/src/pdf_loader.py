import pymupdf
from pathlib import Path


def extract_text_from_pdf(
    pdf_path: str,
    source_name: str | None = None
) -> list[dict]:
    """
    Extract text from a PDF page by page.

    source_name is used for user-facing citations. If omitted,
    the stored PDF filename is used.
    """

    pdf_path = Path(pdf_path)

    if not pdf_path.exists():
        raise FileNotFoundError(f"PDF not found: {pdf_path}")

    document = pymupdf.open(pdf_path)
    source = source_name or pdf_path.name
    pages = []

    for page_number, page in enumerate(document, start=1):
        text = page.get_text("text").strip()

        if text:
            pages.append({
                "source": source,
                "page": page_number,
                "text": text
            })

    document.close()

    return pages
