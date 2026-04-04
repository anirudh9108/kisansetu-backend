from fastapi import APIRouter
from models.schemas import FarmerProfile
from services.mongodb_client import get_mongodb
from datetime import datetime, timezone

router = APIRouter(prefix="/api/farmer", tags=["farmer"])

_in_memory_farmers = {}

@router.post("/profile")
async def create_or_update_profile(profile: FarmerProfile):
    db = get_mongodb()
    data = profile.model_dump()
    if not profile.createdAt:
        data["createdAt"] = datetime.now(timezone.utc).isoformat()

    if db is not None:
        try:
            await db.farmers.update_one({"uid": profile.uid}, {"$set": data}, upsert=True)
        except Exception as e:
            print(f"Farmer DB Error: {e}")

    _in_memory_farmers[profile.uid] = data
    return {"success": True, "farmerId": profile.uid}

@router.get("/profile/{uid}")
async def get_profile(uid: str):
    db = get_mongodb()
    doc = None
    if db is not None:
        try:
            doc = await db.farmers.find_one({"uid": uid})
        except Exception:
            pass

    if not doc:
        doc = _in_memory_farmers.get(uid)

    if not doc:
        return {"uid": uid, "name": "New Farmer", "district": "Unknown", "category": "General", "landAcres": 0.0, "soilType": "Normal", "waterSource": "Canal", "crops": [], "isNewUser": True}

    if "_id" in doc:
        doc["_id"] = str(doc["_id"])
    return doc
