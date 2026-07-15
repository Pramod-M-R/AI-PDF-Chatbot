import uuid

from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Load embedding model only once
embedding_model = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5"
)


def store_chunks(chunks, pdf_name):
    """
    Store chunks from a PDF into the existing Chroma database.
    New uploads are appended instead of replacing older PDFs.
    """

    vector_db = Chroma(
        persist_directory="chroma_db",
        embedding_function=embedding_model
    )

    texts = []
    metadatas = []
    ids = []

    print("\n========== STORING CHUNKS ==========\n")

    for i, chunk in enumerate(chunks):

        print(f"Chunk {i+1}")
        print("--------------------------------")
        print(chunk)
        print("--------------------------------\n")

        texts.append(chunk)

        metadatas.append({
            "pdf_name": pdf_name,
            "chunk_number": i + 1
        })

        ids.append(str(uuid.uuid4()))

    vector_db.add_texts(
        texts=texts,
        metadatas=metadatas,
        ids=ids
    )

    vector_db.persist()

    print(f"\nStored {len(texts)} chunks from {pdf_name}\n")

    return len(texts)