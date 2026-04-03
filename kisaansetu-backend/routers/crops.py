from fastapi import APIRouter, HTTPException
from models.schemas import CropRecommendationRequest
from services.mongodb_client import get_mongodb
from services.claude_client import get_claude_service

router = APIRouter(prefix="/api/crops", tags=["crops"])

@router.post("/recommend")
async def recommend_crops(req: CropRecommendationRequest):
    db = get_mongodb()
    
    # 1. Fetch Kaggle Context from MongoDB
    try:
        # Get up to 50 reference points from the Kaggle dataset
        cursor = db.cropRecommendations.find().limit(50)
        kaggle_context = await cursor.to_list(length=50)
        
        # 2. Fetch Farmer Context (optional but good for history)
        # farmer = await db.farmers.find_one({"uid": req.uid})
        
        # 3. Simple Weather Context
        # Note: In a real app, we'd use the farmer's district to get real-time weather
        weather_data = {
            "temp": 28.0, 
            "humidity": 65.0,
            "month": req.month
        }

        # 4. Use Claude 3.5 Sonnet for Personalized Recommendation
        claude = get_claude_service()
        recommendations = await claude.get_crop_recommendation(
            soil_data={
                "soilType": req.soilType, 
                "waterSource": req.waterSource
            },
            weather_data=weather_data,
            kaggle_context=kaggle_context
        )

        if isinstance(recommendations, dict) and "error" in recommendations:
             raise HTTPException(status_code=500, detail=recommendations["error"])

        return {
            "uid": req.uid,
            "recommendations": recommendations,
            "contextUsed": {
                "soil": req.soilType,
                "water": req.waterSource,
                "weather": "Favorable"
            }
        }

    except Exception as e:
        print(f"Crop Recommendation Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
