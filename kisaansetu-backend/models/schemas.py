from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FarmerProfile(BaseModel):
    uid: str
    name: str
    district: str
    category: str
    landAcres: float
    soilType: str
    waterSource: str
    crops: List[str]
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
