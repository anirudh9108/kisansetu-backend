from fastapi import APIRouter
from models.schemas import IrrigationLogRequest
from services.mongodb_client import get_mongodb
from services.constants import CROP_WATER_BENCHMARK, WATER_USAGE_METHOD_LPH, PADDY_BENCHMARK
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/water", tags=["water"])

@router.post("/log")
async def log_water(req: IrrigationLogRequest):
    rate = WATER_USAGE_METHOD_LPH.get(req.method.lower(), 18000)
    litres_used = rate * req.durationHours * req.acres

    db = get_mongodb()
    log_id = str(uuid.uuid4())

    if db is not None:
        try:
            data = req.model_dump()
            data["_id"] = log_id
            data["litresUsed"] = litres_used
            data["date"] = datetime.now().strftime("%Y-%m-%d")
            await db.irrigationLogs.insert_one(data)
        except Exception as e:
            print(f"Water log DB error: {e}")

    return {"logId": log_id, "litresUsed": litres_used, "monthlyTotal": litres_used, "overuseDetected": False}

@router.get("/summary/{uid}")
@router.get("/summary")
async def get_water_summary(uid: str = "guest"):
    db = get_mongodb()
    logs = []
    if db is not None:
        try:
            cursor = db.irrigationLogs.find({"uid": uid})
            logs = await cursor.to_list(length=1000)
        except Exception:
            pass

    if not logs:
        return {"monthlyUsage": [], "totalSeason": 0, "vsNeighborPercent": 15, "sustainabilityScore": 65}

    monthly_map = {}
    total_season = 0
    total_acres = 0
    for log in logs:
        used = log.get("litresUsed", 0)
        date_str = log.get("date", "")
        acres = log.get("acres", 1)
        if date_str:
            month = date_str[:7]
            monthly_map[month] = monthly_map.get(month, 0) + used
        total_season += used
        total_acres = max(total_acres, acres)

    monthly_usage = [{"month": k, "litres": v} for k, v in monthly_map.items()]
    baseline = PADDY_BENCHMARK * (total_acres if total_acres > 0 else 1)
    saved = max(0, baseline - total_season)
    vs_percent = (saved / baseline) * 100 if baseline > 0 else 0
    sustainability_score = min(100, int((vs_percent / 20) * 100)) if vs_percent > 0 else 50

    return {"monthlyUsage": monthly_usage, "totalSeason": total_season, "vsNeighborPercent": int(vs_percent), "sustainabilityScore": sustainability_score}
