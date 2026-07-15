from fastapi import APIRouter, UploadFile, File
from pathlib import Path
import shutil

from services.pdf_service import extract_text
from services.chunk_service import create_chunks
from services.embedding_service import store_chunks

router = APIRouter()

UPLOAD_FOLDER = Path("uploads")
UPLOAD_FOLDER.mkdir(exist_ok=True)


# ===========================================
# Get all uploaded PDFs
# ===========================================
@router.get("/documents")
def get_documents():

    documents = []

    for file in sorted(
        UPLOAD_FOLDER.glob("*.pdf"),
        key=lambda f: f.stat().st_mtime,
        reverse=True
    ):

        documents.append({

            "id": file.name,

            "name": file.name,

            "uploadedAt": "Previously uploaded",

            "status": "ready",

            "size": f"{round(file.stat().st_size / (1024*1024), 1)} MB"

        })

    return documents


# ===========================================
# Upload PDF
# ===========================================
@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        return {
            "success": False,
            "message": "Please upload a PDF file."
        }

    file_path = UPLOAD_FOLDER / file.filename

    # Prevent duplicate uploads
    if file_path.exists():
        return {
            "success": False,
            "filename": file.filename,
            "message": f'"{file.filename}" is already in your knowledge base.'
        }

    # Save PDF
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Extract text
    text = extract_text(file_path)

    print("\n========== EXTRACTED TEXT ==========")
    print(text[:1000])
    print("====================================\n")

    # Create chunks
    chunks = create_chunks(text)

    print(f"Total Chunks Created: {len(chunks)}")

    # Store embeddings
    stored_chunks = store_chunks(
        chunks=chunks,
        pdf_name=file.filename
    )

    print(f"Stored Vectors: {stored_chunks}")

    return {
        "success": True,
        "filename": file.filename,
        "characters": len(text),
        "total_chunks": len(chunks),
        "stored_vectors": stored_chunks,
        "message": "PDF added successfully to the knowledge base."
    }