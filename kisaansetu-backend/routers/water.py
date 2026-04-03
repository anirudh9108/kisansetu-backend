from fastapi import APIRouter
from models.schemas import IrrigationLogRequest
from services.firebase_client import get_db
from services.constants import CROP_WATER_BENCHMARK, WATER_USAGE_METHOD_LPH, PADDY_BENCHMARK
from datetime import datetime
import uuid

router = APIRouter(prefix="/api/water", tags=["water"])

@router.post("/log")
async def log_water(req: IrrigationLogRequest):
    rate = WATER_USAGE_METHOD_LPH.get(req.method.lower(), 18000)
    litres_used = rate * req.durationHours * req.acres
    
    db = get_db()
    log_id = str(uuid.uuid4())
    
    data = req.model_dump()
    data["litresUsed"] = litres_used
    data["date"] = datetime.now().strftime("%Y-%m-%d")
    
    db.collection(u'farmers').document(req.uid).collection(u'irrigationLogs').document(log_id).set(data)
    
    # Check overuse
    benchmark = CROP_WATER_BENCHMARK.get(req.crop.lower(), CROP_WATER_BENCHMARK["default"]) * req.acres
    overuse_detected = litres_used > benchmark
    
    related_scheme = None
    if overuse_detected:
        schemes_ref = db.collection(u'schemes').where(u'name', u'==', "Mukhya Mantri Punjab Drip Irrigation Subsidy").limit(1).stream()
        for doc in schemes_ref:
            sch = doc.to_dict()
            related_scheme = {
                "schemeId": doc.id,
                "name": sch.get('name'),
                "benefit": sch.get('benefit')
            }
            
    return {
        "logId": log_id,
        "litresUsed": litres_used,
        "monthlyTotal": litres_used, # Mocked monthly total for response
        "overuseDetected": overuse_detected,
        "relatedScheme": related_scheme
    }

@router.get("/summary/{uid}")
async def get_water_summary(uid: str):
    db = get_db()
    logs_ref = db.collection(u'farmers').document(uid).collection(u'irrigationLogs').stream()
    
    monthly_map = {}
    total_season = 0
    total_acres = 0
    for doc in logs_ref:
        log = doc.to_dict()
        used = log.get('litresUsed', 0)
        date_str = log.get('date', '')
        acres = log.get('acres', 1)
        if date_str:
            month = date_str[:7]
            monthly_map[month] = monthly_map.get(month, 0) + used
        total_season += used
        total_acres = max(total_acres, acres)
        
    monthly_usage = [{"month": k, "litres": v} for k, v in monthly_map.items()]
    
    # Calculate vs paddy benchmark (145000 * total acres)
    baseline = PADDY_BENCHMARK * (total_acres if total_acres > 0 else 1)
    saved = max(0, baseline - total_season)
    vs_percent = (saved / baseline) * 100 if baseline > 0 else 0
    
    sustainability_score = min(100, int((vs_percent / 20) * 100)) if vs_percent > 0 else 50
    
    return {
        "monthlyUsage": monthly_usage,
        "totalSeason": total_season,
        "vsNeighborPercent": int(vs_percent),
        "sustainabilityScore": sustainability_score
    }
