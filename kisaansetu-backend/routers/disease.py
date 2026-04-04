from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.mongodb_client import get_mongodb
from services.claude_client import get_claude_service
from services.vector_store import get_collections
from services.authenticity import get_trust_badge
from services.disease_area import get_district_alerts
import base64
from io import BytesIO
from PIL import Image

router = APIRouter(prefix="/api/disease", tags=["disease"])

TREATMENT_DB = [
    {"name": "Standard Fungicide", "instructions": "Spray 10L water"}
]

@router.post("/detect")
async def detect_disease(uid: str = Form(...), image: UploadFile = File(...)):
    try:
        img_bytes = await image.read()
        with Image.open(BytesIO(img_bytes)) as pil_img:
            pil_img.thumbnail((1024, 1024))
            buffered = BytesIO()
            if pil_img.mode in ("RGBA", "P"):
                pil_img = pil_img.convert("RGB")
            pil_img.save(buffered, format="JPEG")
            base64_img = base64.b64encode(buffered.getvalue()).decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    claude = get_claude_service()
    analysis = await claude.detect_disease(base64_img)

    if "error" in analysis:
        raise HTTPException(status_code=500, detail=analysis["error"])

    disease_name = analysis.get("disease", "Unknown")
    is_healthy = analysis.get("is_healthy", False)
    treatment = analysis.get("treatment", [])
    diagnosis = analysis.get("diagnosis", "")

    # Vector search for matching treatment
    composition = "N/A"
    instructions_pa = "N/A"
    safety_warning_pa = "N/A"
    
    if not is_healthy and disease_name != "Unknown":
        try:
            collections = get_collections()
            diseases_collection = collections.get("diseases")
            if diseases_collection:
                disease_query = f"{disease_name} disease symptoms treatment pesticide"
                results = diseases_collection.query(
                    query_texts=[disease_query],
                    n_results=1
                )
                if results and results["distances"] and len(results["distances"][0]) > 0:
                    distance = results["distances"][0][0]
                    score = 1 - distance
                    if score > 0.5:
                        meta = results["metadatas"][0][0]
                        # Use vector result
                        composition = meta.get("pesticide_composition", "N/A")
                        instructions_pa = meta.get("instructions_pa", "N/A")
                        safety_warning_pa = meta.get("safety_warning_pa", "N/A")
                    else:
                        # use hardcoded TREATMENT_DB fallback
                        pass
        except Exception as e:
            print(f"Vector search failed for disease: {e}")
            pass

    nearest_store = None
    related_scheme = None
    district_alerts = []
    
    db = get_mongodb()
    if db is not None:
        try:
            farmer = await db.farmers.find_one({"uid": uid})
            district = farmer.get("district") if farmer else None
            if district:
                nearest_store = await db.agriStores.find_one({"district": district})
                district_alerts = get_district_alerts(district)
        except Exception:
            pass

    return {
        "disease": {
            "name": disease_name, 
            "isHealthy": is_healthy, 
            "diagnosis": diagnosis, 
            "severity": "Low" if is_healthy else "High"
        },
        "treatment": treatment,
        "nearestStore": {"name": nearest_store.get("name","N/A"), "phone": nearest_store.get("phone","N/A")} if nearest_store else None,
        "relatedScheme": related_scheme,
        "composition": composition,
        "instructions_pa": instructions_pa,
        "safety_warning_pa": safety_warning_pa,
        "district_alert": district_alerts,
        "trust": get_trust_badge("diseases")
    }
