from fastapi import APIRouter
from pydantic import BaseModel

from services.retrieval_service import retrieve_chunks
from services.chat_service import generate_answer

router = APIRouter(
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
def chat(request: ChatRequest):

    # Retrieve relevant chunks
    docs = retrieve_chunks(request.question)

    # Build context for the LLM
    context = "\n\n".join(
        doc.page_content
        for doc in docs
    )

    print("\n========== RETRIEVED CONTEXT ==========")
    print(context)
    print("=======================================\n")

    # Generate answer
    answer = generate_answer(
        question=request.question,
        context=context
    )

    # Get unique PDF names
    sources = list(
        {
            doc.metadata.get(
                "pdf_name",
                "Unknown PDF"
            )
            for doc in docs
        }
    )

    return {
        "question": request.question,
        "answer": answer,
        "sources": sources
    }