import ollama


MODEL_NAME = "llama3.2:3b"


def generate_answer(question: str, retrieved_chunks: list[dict]) -> dict:
    if not retrieved_chunks:
        return {
            "answer": "I could not find relevant information in the uploaded documents.",
            "sources": []
        }

    context_parts = []

    for chunk in retrieved_chunks:
        context_parts.append(
            f"Source: {chunk['source']}\n"
            f"Page: {chunk['page']}\n"
            f"Content: {chunk['text']}"
        )

    context = "\n\n---\n\n".join(context_parts)

    prompt = f"""
You are an enterprise document assistant.

Answer the user's question using ONLY the provided document context.

If the answer is not present in the context, say:
"I could not find this information in the uploaded documents."

User question:
{question}

Document context:
{context}

Give a clear and concise answer.
"""

    response = ollama.chat(
        model=MODEL_NAME,
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    sources = [
        {
            "document": chunk["source"],
            "page": chunk["page"]
        }
        for chunk in retrieved_chunks
    ]

    return {
        "answer": response["message"]["content"],
        "sources": sources
    }