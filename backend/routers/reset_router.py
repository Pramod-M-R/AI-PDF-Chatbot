from fastapi import APIRouter
import shutil
import os

router = APIRouter()

CHROMA_PATH = "chroma_db"

@router.post("/reset")
def reset_database():

    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)

    os.makedirs(CHROMA_PATH, exist_ok=True)

    return {
        "status": "success",
        "message": "Knowledge base cleared successfully."
    }