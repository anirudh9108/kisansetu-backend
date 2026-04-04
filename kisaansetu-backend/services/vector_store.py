import chromadb
from chromadb.utils import embedding_functions
import os

DB_PATH = "./kisaansetu_vectordb"

client = chromadb.PersistentClient(path=DB_PATH)

embedding_fn = embedding_functions.SentenceTransformerEmbeddingFunction(
    model_name="sentence-transformers/paraphrase-multilingual-MiniLM-L12-v2"
)

schemes_collection = client.get_or_create_collection(
    name="schemes",
    embedding_function=embedding_fn,
    metadata={"hnsw:space": "cosine"}
)

diseases_collection = client.get_or_create_collection(
    name="diseases",
    embedding_function=embedding_fn,
    metadata={"hnsw:space": "cosine"}
)

crops_collection = client.get_or_create_collection(
    name="crops",
    embedding_function=embedding_fn,
    metadata={"hnsw:space": "cosine"}
)

mandi_collection = client.get_or_create_collection(
    name="mandi_tips",
    embedding_function=embedding_fn,
    metadata={"hnsw:space": "cosine"}
)

def get_collections():
    return {
        "schemes": schemes_collection,
        "diseases": diseases_collection,
        "crops": crops_collection,
        "mandi": mandi_collection
    }