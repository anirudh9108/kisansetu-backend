from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FarmerProfile(BaseModel):
    uid: str
    name: str = "Anonymous"
    district: str = "Unknown"
    category: str = "General"
    landAcres: float = 0.0
    soilType: str = "Normal"
    waterSource: str = "Rainfed"
    crops: List[str] = []
    isNewUser: Optional[bool] = False
    createdAt: Optional[str] = None

class SchemeEligibilityRequest(BaseModel):
    category: str = "General"
    landAcres: float = 0.0
    state: str = "Punjab"
    crop: Optional[str] = None

class IrrigationLogRequest(BaseModel):
    uid: str
    method: str
    durationHours: float
    acres: float
    date: Optional[str] = None

class CropRecommendationRequest(BaseModel):
    uid: Optional[str] = "anon"
    soilType: Optional[str] = "Loamy"
    waterSource: Optional[str] = "Rainfed"
    month: Optional[int] = 6
    landAcres: float = 5.0
    temperature: float = 25.0
    humidity: float = 60.0
    rainfall: float = 100.0
    lang: Optional[str] = "pa"
    # Added N, P, K, ph for the Kaggle Dataset ML Model
    n: Optional[float] = 90.0
    p: Optional[float] = 42.0
    k: Optional[float] = 43.0
    ph: Optional[float] = 6.5
