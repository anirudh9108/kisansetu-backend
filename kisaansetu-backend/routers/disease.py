from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from geojson import Point
from services.firebase_client import get_db
from services.plant_id import identify_disease
from services.treatment_db import TREATMENT_DATABASE, DEFAULT_TREATMENT
import base64
from io import BytesIO
from PIL import Image
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/disease", tags=["disease"])

@router.post("/detect")
async def detect_disease(uid: str = Form(...), image: UploadFile = File(...)):
    # 1. Resize image to 800x800 max
    try:
        img_bytes = await image.read()
        with Image.open(BytesIO(img_bytes)) as pil_img:
            pil_img.thumbnail((800, 800))
            buffered = BytesIO()
            # Convert RGBA to RGB for JPEG format
            if pil_img.mode in ("RGBA", "P"):
                pil_img = pil_img.convert("RGB")
            pil_img.save(buffered, format="JPEG")
            base64_img = base64.b64encode(buffered.getvalue()).decode("utf-8")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Invalid image format")

    # 2. POST to Plant.id API
    disease_name, prob = await identify_disease(base64_img)

    # 3. Lookup Treatment database
    treatment = TREATMENT_DATABASE.get(disease_name)
    if not treatment:
        for known_key, known_val in TREATMENT_DATABASE.items():
            if known_key.lower() in disease_name.lower() or disease_name.lower() in known_key.lower():
                treatment = known_val
                break
    
    if not treatment:
        treatment = DEFAULT_TREATMENT
        
    db = get_db()
    
    # 4. Lookup farmer district for nearest store
    farmer_ref = db.collection(u'farmers').document(uid)
    farmer_doc = farmer_ref.get()
    district = farmer_doc.get(u'district') if farmer_doc.exists else None
    
    nearest_store = None
    if district:
        stores_ref = db.collection(u'agriStores').where(u'district', u'==', district).limit(1)
        store_docs = stores_ref.stream()
        for s in store_docs:
            nearest_store = s.to_dict()
            nearest_store['id'] = s.id
            break

    # 5. Query matching diseases for scheme
    related_scheme = None
    schemes_ref = db.collection(u'schemes').where(u'matchingDiseases', u'array_contains', disease_name).limit(1)
    s_docs = schemes_ref.stream()
    for sch in s_docs:
        sch_data = sch.to_dict()
        related_scheme = {
            "schemeId": sch.id,
            "name": sch_data.get('name'),
            "benefit": sch_data.get('benefit')
        }
        break

    # 6. Save alert to Firestore
    alert_id = str(uuid.uuid4())
    alert_data = {
        "cropImageUrl": "", # Ideally uploaded to Cloud Storage, keeping empty string for now
        "diseaseName": disease_name,
        "severity": "High" if prob > 0.6 else "Medium",
        "treatment": treatment,
        "detectedAt": datetime.now(timezone.utc),
        "relatedSchemeId": related_scheme["schemeId"] if related_scheme else None
    }
    
    db.collection(u'farmers').document(uid).collection(u'diseaseAlerts').document(alert_id).set(alert_data)
    
    return {
        "disease": {
            "name": disease_name,
            "namePA": disease_name, # Simplified
            "severity": alert_data["severity"],
            "confidence": prob
        },
        "treatment": treatment,
        "nearestStore": {
            "name": nearest_store.get('name') if nearest_store else "Unknown",
            "distance": "5km", # Mock distance
            "phone": nearest_store.get('phone') if nearest_store else "Unknown",
            "address": nearest_store.get('address') if nearest_store else "Unknown"
        } if nearest_store else None,
        "relatedScheme": related_scheme
    }
