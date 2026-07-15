from fastapi import APIRouter
from pydantic import BaseModel

from services.retrieval_service import retrieve_chunks

router = APIRouter(
    prefix="",
    tags=["Retrieval"]
)


class QuestionRequest(BaseModel):
    question: str


@router.post("/retrieve")
def retrieve(request: QuestionRequest):

    docs = retrieve_chunks(request.question)

    return {
        "question": request.question,
        "matches_found": len(docs),
        "results": [
            {
                "chunk": doc.page_content,
                "metadata": doc.metadata
            }
            for doc in docs
        ]
    }