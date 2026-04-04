from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FarmerProfile(BaseModel):
    uid: str
    name: Optional[str] = "Farmer"
    district: Optional[str] = "Unknown"
    category: Optional[str] = "General"
    landAcres: Optional[float] = 0.0
    soilType: Optional[str] = "Normal"
    waterSource: Optional[str] = "Canal"
    crops: Optional[List[str]] = []
    createdAt: Optional[datetime] = None

class IrrigationLogRequest(BaseModel):
    uid: str
    crop: str
    method: str
    durationHours: float
    acres: float

class SchemeEligibilityRequest(BaseModel):
    uid: str
    crop: str
    landAcres: float
    district: str
    category: str

class CropRecommendationRequest(BaseModel):
    uid: str
    soilType: str
    waterSource: str
    month: int
