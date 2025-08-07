from fastapi import APIRouter
from app.core.llm import get_groq_llm
from app.rag.vectorstore import chunk_documents, save_to_vectorstore
from pydantic import BaseModel

router = APIRouter()

@router.get("/")
def read_root():
    return {"message": "LangChain RAG Chatbot is running 🚀"}
# Add this at the top

@router.get("/test-groq")
def test_groq():
    llm = get_groq_llm()
    response = llm.invoke("What is LangChain?")
    return {"response": response.content}


class DocumentInput(BaseModel):
    text: str

@router.post("/upload-doc")
def upload_document(data: DocumentInput):
    chunks = chunk_documents([data.text])
    save_to_vectorstore(chunks)
    return {"message": f"{len(chunks)} chunks added to knowledge base."}
