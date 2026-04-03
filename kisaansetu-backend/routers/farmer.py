from fastapi import APIRouter, HTTPException, Depends
from models.schemas import FarmerProfile
from services.firebase_client import get_db
from datetime import datetime, timezone

router = APIRouter(prefix="/api/farmer", tags=["farmer"])

@router.post("/profile")
async def create_or_update_profile(profile: FarmerProfile):
    db = get_db()
    farmer_ref = db.collection(u'farmers').document(profile.uid)
    
    data = profile.model_dump()
    if not profile.createdAt:
        data['createdAt'] = datetime.now(timezone.utc)
        
    farmer_ref.set(data, merge=True)
    return {"success": True, "farmerId": profile.uid}

@router.get("/profile/{uid}")
async def get_profile(uid: str):
    db = get_db()
    farmer_ref = db.collection(u'farmers').document(uid)
    doc = farmer_ref.get()
    
    if not doc.exists:
        raise HTTPException(status_code=404, detail="Farmer profile not found")
        
    return doc.to_dict()
