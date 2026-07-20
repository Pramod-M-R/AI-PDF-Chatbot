from fastapi import APIRouter
import shutil
import os

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

router = APIRouter()

UPLOAD_FOLDER = "uploads"

embedding_model = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5"
)

@router.post("/reset")
def reset_database():

    if os.path.exists(UPLOAD_FOLDER):
        shutil.rmtree(UPLOAD_FOLDER)

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    vector_db = Chroma(
        persist_directory="chroma_db",
        embedding_function=embedding_model
    )

    collection = vector_db._collection

    ids = collection.get()["ids"]

    if ids:
        collection.delete(ids=ids)

    vector_db.persist()

    return {
        "status": "success",
        "message": "Knowledge base cleared."
    }