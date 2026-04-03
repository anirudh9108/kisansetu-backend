from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.mongodb_client import get_mongodb
from services.claude_client import get_claude_service
import base64
from io import BytesIO
from PIL import Image
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/disease", tags=["disease"])

@router.post("/detect")
async def detect_disease(uid: str = Form(...), image: UploadFile = File(...)):
    # 1. Resize image and convert to Base64 for Claude
    try:
        img_bytes = await image.read()
        mime_type = image.content_type or "image/jpeg"
        with Image.open(BytesIO(img_bytes)) as pil_img:
            # Claude handles large images well, but we resize to save tokens and latency
            pil_img.thumbnail((1024, 1024))
            buffered = BytesIO()
            if pil_img.mode in ("RGBA", "P"):
                pil_img = pil_img.convert("RGB")
            pil_img.save(buffered, format="JPEG")
            base64_img = base64.b64encode(buffered.getvalue()).decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")

    # 2. Use Claude 3.5 Sonnet Vision for Detection
    claude = get_claude_service()
    analysis = await claude.detect_disease(base64_img, mime_type="image/jpeg")
    
    if "error" in analysis:
        raise HTTPException(status_code=500, detail=analysis["error"])

    disease_name = analysis.get("disease", "Unknown")
    is_healthy = analysis.get("is_healthy", False)
    treatment = analysis.get("treatment", [])
    diagnosis = analysis.get("diagnosis", "")

    db = get_mongodb()
    
    # 3. Lookup farmer district for nearest store in MongoDB
    farmer = await db.farmers.find_one({"uid": uid})
    district = farmer.get("district") if farmer else None
    
    nearest_store = None
    if district:
        nearest_store = await db.agriStores.find_one({"district": district})

    # 4. Query matching schemes in MongoDB
    related_scheme = None
    # We search for schemes where disease_name is in matchingDiseases list (case-insensitive regex)
    scheme_doc = await db.schemes.find_one({
        "matchingDiseases": {"$elemMatch": {"$regex": f"^{disease_name}$", "$options": "i"}}
    })
    
    if not scheme_doc:
        # Fallback: partial match
        scheme_doc = await db.schemes.find_one({
            "matchingDiseases": {"$elemMatch": {"$regex": disease_name, "$options": "i"}}
        })

    if scheme_doc:
        related_scheme = {
            "schemeId": str(scheme_doc["_id"]),
            "name": scheme_doc.get("name"),
            "benefit": scheme_doc.get("benefit")
        }

    # 5. Save alert to MongoDB
    alert_id = str(uuid.uuid4())
    alert_data = {
        "uid": uid,
        "diseaseName": disease_name,
        "isHealthy": is_healthy,
        "diagnosis": diagnosis,
        "severity": "Low" if is_healthy else "High",
        "treatment": treatment,
        "detectedAt": datetime.now(timezone.utc),
        "relatedSchemeId": related_scheme["schemeId"] if related_scheme else None
    }
    
    await db.diseaseAlerts.insert_one(alert_data)
    
    return {
        "disease": {
            "name": disease_name,
            "isHealthy": is_healthy,
            "diagnosis": diagnosis,
            "severity": alert_data["severity"]
        },
        "treatment": treatment,
        "nearestStore": {
            "name": nearest_store.get("name") if nearest_store else "Unknown",
            "phone": nearest_store.get("phone") if nearest_store else "Unknown",
            "address": nearest_store.get("address") if nearest_store else "Unknown"
        } if nearest_store else None,
        "relatedScheme": related_scheme
    }
