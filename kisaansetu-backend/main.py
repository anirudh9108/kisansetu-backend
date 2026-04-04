from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load Environment Variables
load_dotenv()

app = FastAPI(title="AgriSense Backend API", version="1.0.0")

# Initialize Database
from services.mongodb_client import MongoDBClient

@app.on_event("startup")
async def startup_db_client():
    await MongoDBClient.connect()

@app.on_event("shutdown")
async def shutdown_db_client():
    await MongoDBClient.close()

# Routers
from routers import farmer, schemes, crops, disease, mandi, water, weather

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1|0\.0\.0\.0)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Routers
app.include_router(farmer.router)
app.include_router(schemes.router)
app.include_router(crops.router)
app.include_router(disease.router)
app.include_router(mandi.router)
app.include_router(water.router)
app.include_router(weather.router)

@app.get("/")
def root():
    return {"message": "Welcome to the AgriSense API"}
