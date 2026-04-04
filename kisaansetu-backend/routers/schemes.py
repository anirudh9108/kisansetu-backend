from fastapi import APIRouter
from models.schemas import SchemeEligibilityRequest
from services.vector_store import get_collections
from services.authenticity import get_trust_badge

router = APIRouter(prefix="/api/schemes", tags=["schemes"])

@router.post("/eligible")
async def get_eligible_schemes(req: SchemeEligibilityRequest):
    collections = get_collections()
    schemes_collection = collections.get("schemes")

    # 1. Build a natural language query from farmer profile
    query = f"{req.category} farmer {req.landAcres} acres {req.crop} crop {req.district} Punjab scheme subsidy government help"

    eligible = []
    query_used = query
    try:
        if schemes_collection:
            # 2. Search schemes_collection
            results = schemes_collection.query(
                query_texts=[query],
                n_results=8,
                where={
                    "$and": [
                        {"min_land_acres": {"$lte": req.landAcres}},
                        {"max_land_acres": {"$gte": req.landAcres}}
                    ]
                }
            )

            if results and results["metadatas"] and results["metadatas"][0]:
                for idx, meta in enumerate(results["metadatas"][0]):
                    dist = results["distances"][0][idx] if results["distances"] else 1.0
                    score = 1.0 - dist
                    
                    # 4. Calculate relevance score (Only > 0.4)
                    if score < 0.4:
                        continue

                    # 3. Post-filter by category from metadata
                    ec = meta.get("eligible_categories", "all")
                    ec_list = ec.split(",")
                    if req.category not in ec_list and ec != "all":
                        continue

                    eligible.append({
                        "scheme_id": meta.get("scheme_id"),
                        "name_pa": meta.get("name_pa"),
                        "name_en": meta.get("name_en"),
                        "name": meta.get("name_en"), # Map back for existing frontend
                        "benefit_text_pa": meta.get("benefit_text_pa"),
                        "benefit": meta.get("benefit_text_pa"), # Map back for existing frontend
                        "description": meta.get("name_pa"), # Map back for existing frontend
                        "type": meta.get("type"),
                        "state": meta.get("scope"),
                        "scope": meta.get("scope"),
                        "applyUrl": meta.get("apply_url"),
                        "relevance_score": score,
                        "govt_source": meta.get("govt_source")
                    })
                    
                # 5. Sort by relevance_score descending
                eligible.sort(key=lambda x: x["relevance_score"], reverse=True)
                
    except Exception as e:
        print(f"Vector search failed: {e}")
        # Fall back to hardcoded mock
        eligible = [{"name": "Fallback Scheme", "benefit": "Subsidies", "description": "Error in search, fallback loaded.", "state": "Unknown", "applyUrl": ""}]

    return {
        "schemes": eligible,
        "count": len(eligible),
        "trust": get_trust_badge("schemes"),
        "query_used": query_used
    }
