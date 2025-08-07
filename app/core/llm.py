from langchain_groq import ChatGroq
from app.core.config import GROQ_API_KEY

def get_groq_llm(model_name="mixtral-8x7b-32768"):
    llm = ChatGroq(
        groq_api_key=GROQ_API_KEY,
        model_name="llama3-70b-8192",   
        temperature=0.7
    )
    return llm

