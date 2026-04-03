from fastapi import APIRouter
from models.schemas import SchemeEligibilityRequest
from services.firebase_client import get_db

router = APIRouter(prefix="/api/schemes", tags=["schemes"])

@router.post("/eligible")
async def get_eligible_schemes(req: SchemeEligibilityRequest):
    db = get_db()
    schemes_ref = db.collection(u'schemes')
    docs = schemes_ref.stream()
    
    eligible = []
    
    for doc in docs:
        scheme = doc.to_dict()
        scheme['id'] = doc.id
        
        # Check land condition
        min_land = scheme.get('minLandAcres', 0)
        max_land = scheme.get('maxLandAcres', float('inf'))
        if not (min_land <= req.landAcres <= max_land):
            continue
            
        # Check category condition
        eligible_categories = scheme.get('eligibleCategories', [])
        if req.category not in eligible_categories and "all" not in eligible_categories:
            continue
            
        # Check crop condition
        eligible_crops = scheme.get('eligibleCrops', [])
        if req.crop not in eligible_crops and "all" not in eligible_crops:
            continue
            
        eligible.append(scheme)
        
    # Sort by benefit descending. 
    # Since benefit format in the requirement seems like descriptive strings or amounts,
    # let's try a safe sort if there's a numeric benefitValue, or just default.
    eligible.sort(key=lambda x: x.get('benefitValue', 0), reverse=True)
    
    return {"schemes": eligible, "count": len(eligible)}
