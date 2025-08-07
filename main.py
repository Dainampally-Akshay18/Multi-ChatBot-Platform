from fastapi import FastAPI
from app.api import routes
import os
from langchain_core.runnables import RunnableLambda
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_groq import ChatGroq  # ✅ Required for GROQ LLM

app = FastAPI(title="LangChain RAG Chatbot")

app.include_router(routes.router)

@app.post("/rag-chat")
async def rag_chat(user_query: str):
    embeddings = HuggingFaceEmbeddings()
    db = Chroma(persist_directory="./chroma_db", embedding_function=embeddings)

    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": 4})

    prompt_template = PromptTemplate(
        template="""
        You are a helpful assistant. Use the context below to answer the question.

        Context:
        {context}

        Question:
        {question}

        Answer:""",
        input_variables=["context", "question"]
    )

    # 4. Define the LLM (GROQ Llama 3)
    llm = ChatGroq(
        groq_api_key=os.getenv("GROQ_API_KEY"),  # ✅ Correct method
        model_name="llama3-70b-8192"
    )

    # 5. Chain everything together
    rag_chain = (
        {"context": retriever, "question": RunnableLambda(lambda x: x)}
        | prompt_template
        | llm
        | StrOutputParser()
    )

    # 6. Run the chain with user query
    
    response = rag_chain.invoke(user_query)

    return {"answer": response}
