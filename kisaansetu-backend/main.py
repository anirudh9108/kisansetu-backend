from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager
import os

load_dotenv()

from services.mongodb_client import MongoDBClient
from services.vector_store import get_collections

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Setup MongoDB
    await MongoDBClient.connect()
    
    # Warm up Vector DB
    try:
        collections = get_collections()
        print(f"Vector DB ready: {len(collections)} collections")
    except Exception as e:
        print(f"Vector DB startup failed: {e}")

    yield
    await MongoDBClient.close()

app = FastAPI(title="KisaanSetu Backend API", version="1.0.0", lifespan=lifespan)

# CORS - allow all origins for dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

from routers import farmer, schemes, crops, disease, mandi, water, weather, kisan_ai
app.include_router(farmer.router)
app.include_router(schemes.router)
app.include_router(crops.router)
app.include_router(disease.router)
app.include_router(mandi.router)
app.include_router(water.router)
app.include_router(weather.router)
app.include_router(kisan_ai.router, prefix="/api/kisan-ai")

@app.get("/")
def root():
    return {"message": "Welcome to the KisaanSetu API"}
