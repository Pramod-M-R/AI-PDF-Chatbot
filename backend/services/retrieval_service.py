from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma

# Load embedding model only once
embedding_model = HuggingFaceEmbeddings(
    model_name="BAAI/bge-base-en-v1.5"
)


def retrieve_chunks(question: str, k: int = 10):
    """
    Search across every uploaded PDF stored in ChromaDB.
    """

    vector_db = Chroma(
        persist_directory="chroma_db",
        embedding_function=embedding_model
    )

    results = vector_db.similarity_search_with_score(
        query=question,
        k=k
    )

    docs = []

    print("\n========== RETRIEVED CHUNKS ==========\n")

    for i, (doc, score) in enumerate(results, start=1):

        pdf_name = doc.metadata.get(
            "pdf_name",
            "Unknown PDF"
        )

        chunk_number = doc.metadata.get(
            "chunk_number",
            "-"
        )

        print(f"Result {i}")
        print(f"PDF         : {pdf_name}")
        print(f"Chunk       : {chunk_number}")
        print(f"Score       : {score}")
        print("----------------------------------------")
        print(doc.page_content)
        print("----------------------------------------\n")

        docs.append(doc)

    print("========================================\n")

    return docs