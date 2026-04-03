from fastapi import APIRouter, HTTPException
from models.schemas import FarmerProfile
from services.mongodb_client import get_mongodb
from datetime import datetime, timezone

router = APIRouter(prefix="/api/farmer", tags=["farmer"])

@router.post("/profile")
async def create_or_update_profile(profile: FarmerProfile):
    from services.mongodb_client import MongoDBClient
    if not MongoDBClient.is_connected:
        print("MOCK MODE: Returning success for profile update (DB not connected).")
        return {"success": True, "farmerId": profile.uid}
        
    db = get_mongodb()
    data = profile.model_dump()
    if not profile.createdAt:
        data['createdAt'] = datetime.now(timezone.utc)
        
    await db.farmers.update_one(
        {"uid": profile.uid},
        {"$set": data},
        upsert=True
    )
    return {"success": True, "farmerId": profile.uid}

@router.get("/profile/{uid}")
async def get_profile(uid: str):
    db = get_mongodb()
    from services.mongodb_client import MongoDBClient
    if not MongoDBClient.is_connected:
        doc = None
    else:
        try:
            doc = await db.farmers.find_one({"uid": uid})
        except Exception as e:
            print(f"DB Fetch Error (Atlas issue?): {e}")
            doc = None
    
    if not doc:
        return {
            "uid": uid,
            "name": "New Farmer",
            "district": "Unknown",
            "category": "General",
            "landAcres": 0.0,
            "soilType": "Normal",
            "waterSource": "Canal",
            "crops": [],
            "isNewUser": True
        }
        
    # Convert MongoDB ObjectID to string for JSON serialization
    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
        
    return doc
