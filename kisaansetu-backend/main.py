from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load Environment Variables
load_dotenv()

# Initialize Firebase before mapping routers that may need get_db at startup
from services.firebase_client import get_db
try:
    get_db()
except ValueError as e:
    print(f"Warning on startup: {e}")

# Routers
from routers import farmer, schemes, crops, disease, mandi, water, weather

app = FastAPI(title="KisaanSetu Backend API", version="1.0.0")

# CORS Setup
origins_str = os.environ.get("ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in origins_str.split(",") if origin.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
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
    return {"message": "Welcome to the KisaanSetu API"}
