from groq import Groq
from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables
env_path = Path(__file__).parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def generate_answer(question: str, context: str):

    prompt = f"""
You are an expert AI assistant that answers questions ONLY using the retrieved context from the uploaded documents.

The retrieved context may come from one PDF or multiple PDFs.

Rules:

1. NEVER use outside knowledge.
2. NEVER make up information.
3. If the answer is not present in the retrieved context, reply exactly:

"I couldn't find that information in the uploaded documents."

4. If information comes from multiple documents, combine it naturally.

5. If the user asks for a comparison, compare only using the retrieved context.

Formatting:

- Use Markdown.
- Use headings.
- Use bullet points.
- Use numbered lists whenever appropriate.
- Use tables for comparisons.
- Highlight important keywords in bold.
- Keep answers clean and easy to read.

Retrieved Context:

{context}

Question:

{question}

Answer:
"""

    completion = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=0.2
    )

    return completion.choices[0].message.content