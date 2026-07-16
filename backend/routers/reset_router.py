from fastapi import APIRouter
from pathlib import Path
import shutil

router = APIRouter()

BASE_DIR = Path(__file__).resolve().parent.parent

UPLOADS_PATH = BASE_DIR / "uploads"
CHROMA_PATH = BASE_DIR / "chroma_db"


@router.post("/reset")
def reset_database():

    # Delete uploaded PDFs
    if UPLOADS_PATH.exists():
        shutil.rmtree(UPLOADS_PATH)

    # Delete vector database
    if CHROMA_PATH.exists():
        shutil.rmtree(CHROMA_PATH)

    # Recreate folders
    UPLOADS_PATH.mkdir(exist_ok=True)
    CHROMA_PATH.mkdir(exist_ok=True)

    return {
        "status": "success",
        "message": "Knowledge base cleared successfully."
    }