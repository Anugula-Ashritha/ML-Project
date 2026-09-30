documents = []


def add_document(document: dict):
    documents.append(document)


def get_documents() -> list[dict]:
    return documents


def remove_document(document_id: str) -> dict | None:
    for index, document in enumerate(documents):
        if document.get("id") == document_id:
            return documents.pop(index)
    return None
