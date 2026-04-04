from fastapi import APIRouter, HTTPException
from models.schemas import CropRecommendationRequest
from services.vector_store import get_collections
from services.authenticity import get_trust_badge

router = APIRouter(prefix="/api/crops", tags=["crops"])

@router.post("/recommend")
async def recommend_crops(req: CropRecommendationRequest):
    try:
        collections = get_collections()
        crops_collection = collections.get("crops")
        
        query = f"{req.soilType} soil {req.waterSource} water month {req.month} crop recommendation Punjab profitable low water"
        
        recommendations = []
        
        if crops_collection:
            results = crops_collection.query(
                query_texts=[query],
                n_results=5
            )
            
            if results and results["metadatas"] and results["metadatas"][0]:
                for idx, meta in enumerate(results["metadatas"][0]):
                    dist = results["distances"][0][idx] if results["distances"] else 1.0
                    relevance_score = 1.0 - dist
                    
                    profit_score = meta.get("profit_score", 50)
                    water_efficiency = meta.get("water_efficiency_score", 50)
                    
                    # Re-rank formula
                    final_score = (profit_score * 0.5) + (water_efficiency * 0.3) + (relevance_score * 0.2)
                    
                    # Construct return format similar to existing ones
                    recommendations.append({
                        "name_en": meta.get("crop_name_en"),
                        "name_pa": meta.get("crop_name_pa"),
                        "emoji": meta.get("crop_emoji"),
                        "confidence": int(final_score),  # Treating final score as confidence %
                        "title": meta.get("crop_name_en"),
                        "description": meta.get("rationale_pa"),
                        "estimatedYield": meta.get("yield_per_acre"),
                        "waterSavings": f"{int(water_efficiency)}%",
                        "profit_score": profit_score,
                        "water_efficiency": water_efficiency,
                        "relevance": relevance_score,
                        "final_score": final_score
                    })
                
                # Sort descending by final score
                recommendations.sort(key=lambda x: x["final_score"], reverse=True)
                # Top 3
                recommendations = recommendations[:3]
                
        # Fallback if no collections
        if not recommendations:
            recommendations = [{
                "title": "Maize",
                "emoji": "🌽",
                "confidence": 80,
                "description": "Good fallback option",
                "estimatedYield": "15 Q/Acre",
                "waterSavings": "60%",
                "name_en": "Maize",
                "name_pa": "ਮੱਕੀ"
            }]

        return {"recommendations": recommendations, "trust": get_trust_badge("crops")}
        
    except Exception as e:
        print(f"Vector Model Error: {e}")
        # Return fallback
        return {
            "recommendations": [{
                "title": "Fallback Crop",
                "emoji": "🌱",
                "confidence": 50,
                "description": "Basic recommendation due to search error.",
                "estimatedYield": "TBD",
                "waterSavings": "TBD"
            }],
            "trust": get_trust_badge("crops", live=False)
        }
