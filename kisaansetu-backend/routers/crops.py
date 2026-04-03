from fastapi import APIRouter
from models.schemas import CropRecommendationRequest
from services.firebase_client import get_db

router = APIRouter(prefix="/api/crops", tags=["crops"])

@router.post("/recommend")
async def recommend_crops(req: CropRecommendationRequest):
    db = get_db()
    rec_ref = db.collection(u'cropRecommendations')
    
    # Simple query matching soil and water source
    docs = rec_ref.where(u'soilType', u'==', req.soilType).where(u'waterSource', u'==', req.waterSource).stream()
    
    rules = []
    for doc in docs:
        rule = doc.to_dict()
        if req.month in rule.get('applicableMonths', []):
            rules.append(rule)
            
    # If no exact match on both, fallback to soilType
    if not rules:
        docs = rec_ref.where(u'soilType', u'==', req.soilType).stream()
        for doc in docs:
            rule = doc.to_dict()
            if req.month in rule.get('applicableMonths', []):
                rules.append(rule)
                
    if not rules:
        return {"recommendations": []}
        
    # Assume the rule contains a 'crops' array
    best_rule = rules[0]
    crops_list = best_rule.get('crops', [])
    
    # Sort top 3 based on formula: profitScore * 0.6 + waterScore * 0.4
    sorted_crops = sorted(crops_list, key=lambda c: (c.get('profitScore', 0) * 0.6 + c.get('waterScore', 0) * 0.4), reverse=True)
    
    return {"recommendations": sorted_crops[:3]}
