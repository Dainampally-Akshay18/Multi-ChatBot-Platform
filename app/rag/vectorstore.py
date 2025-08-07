from langchain_community.vectorstores import Chroma
from langchain_huggingface import HuggingFaceEmbeddings  
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_community.vectorstores import Chroma


import os

PERSIST_DIR = "chroma_db"

# Load embedding model (all free and local)
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Chunking function
def chunk_documents(docs: list[str]) -> list[Document]:
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    return text_splitter.create_documents(docs)

# Save chunks to vectorstore
def save_to_vectorstore(chunks: list[Document]):
    vectorstore = Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embedding_model
    )
    vectorstore.add_documents(chunks)
    vectorstore.persist()

# Load vectorstore for retrieval
def load_vectorstore():
    return Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embedding_model
    )
