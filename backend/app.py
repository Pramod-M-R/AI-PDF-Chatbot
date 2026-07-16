from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from pathlib import Path
from groq import Groq
import os

from routers.pdf_router import router as pdf_router
from routers.retrieval_router import router as retrieval_router
from routers.chat_router import router as chat_router

# Load .env
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

app = FastAPI(title="AI PDF Chatbot API")

# -----------------------------
# CORS
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "https://rag-chatbot-by-pramod.netlify.app",
]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(pdf_router)
app.include_router(retrieval_router)
app.include_router(chat_router)

# Groq Client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


@app.get("/")
def home():
    return {
        "message": "AI PDF Chatbot Backend is Running 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "ok",
        "groq_api_loaded": os.getenv("GROQ_API_KEY") is not None
    }


@app.get("/test-llm")
def test_llm():

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": "Say hello in one short sentence."
            }
        ]
    )

    return {
        "response": completion.choices[0].message.content
    }