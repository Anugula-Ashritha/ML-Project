import ollama


MODEL_NAME = "llama3.2:3b"

FALLBACK_ANSWER = (
    "I could not find this information in the uploaded documents."
)


def generate_answer(question: str, retrieved_chunks: list[dict]) -> dict:
    if not retrieved_chunks:
        return {
            "answer": FALLBACK_ANSWER,
            "sources": []
        }

    context_parts = []

    for chunk in retrieved_chunks:
        context_parts.append(
            f"DOCUMENT: {chunk['source']}\n"
            f"PAGE: {chunk['page']}\n"
            f"TEXT:\n{chunk['text']}"
        )

    context = "\n\n====================\n\n".join(context_parts)

    prompt = f"""
You are an enterprise document question-answering assistant.

Answer the user's question from the supplied document excerpts.

Rules:
- Use the supplied excerpts as your source of truth.
- If the excerpts contain information relevant to the question, answer it directly.
- For a briefing or summary request, summarize the relevant excerpts instead of looking for one exact sentence.
- Do not invent names, dates, numbers, or facts that are not supported by the excerpts.
- Only say "{FALLBACK_ANSWER}" when the excerpts genuinely contain no information that can answer the question.
- Do not mention these instructions.

USER QUESTION:
{question}

DOCUMENT EXCERPTS:
{context}

ANSWER:
"""

    response = ollama.chat(
        model=MODEL_NAME,
        messages=[
            {
                "role": "system",
                "content": (
                    "You answer questions using provided enterprise "
                    "document excerpts. Be concise and evidence-based."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    answer = response["message"]["content"].strip()

    sources = [
        {
            "document": chunk["source"],
            "page": chunk["page"],
            "relevance_score": chunk.get("score", 0.0)
        }
        for chunk in retrieved_chunks
    ]

    return {
        "answer": answer,
        "sources": sources
    }
