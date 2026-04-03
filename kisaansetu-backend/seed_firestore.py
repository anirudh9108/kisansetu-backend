import os
import json
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime, timedelta
import random

from dotenv import load_dotenv
load_dotenv()
cert_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
if not cert_json:
    print("WARNING: FIREBASE_SERVICE_ACCOUNT_JSON not set. Cannot run seeder.")
    exit(1)

try:
    cred_dict = json.loads(cert_json)
    cred = credentials.Certificate(cred_dict)
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
    db = firestore.client()
except Exception as e:
    print(f"Failed to intialize Firebase Admin: {e}")
    exit(1)

def seed_schemes():
    schemes = [
        {"name": "PM-KISAN", "namePA": "ਪੀਐਮ-ਕਿਸਾਨ", "benefit": "₹6000/year", "benefitValue": 6000, "description": "Direct income support", "descriptionPA": "ਸਿੱਧੀ ਆਮਦਨ ਸਹਾਇਤਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["all"], "state": "Central", "type": "direct", "applyUrl": "https://pmkisan.gov.in", "matchingDiseases": []},
        {"name": "PMFBY", "namePA": "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ", "benefit": "Crop Insurance", "benefitValue": 0, "description": "Insurance against crop failure", "descriptionPA": "ਫਸਲ ਦੇ ਨੁਕਸਾਨ ਦੇ ਖਿਲਾਫ ਬੀਮਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["all"], "state": "Central", "type": "insurance", "applyUrl": "https://pmfby.gov.in", "matchingDiseases": ["Wheat Rust", "Paddy Blast"]},
        {"name": "Punjab SC Farmer Subsidy", "namePA": "ਪੰਜਾਬ ਐਸ.ਸੀ. ਕਿਸਾਨ ਸਬਸਿਡੀ", "benefit": "₹5000/acre", "benefitValue": 5000, "description": "Subsidy for SC farmers", "descriptionPA": "ਐਸ.ਸੀ. ਕਿਸਾਨਾਂ ਲਈ ਸਬਸਿਡੀ", "minLandAcres": 0, "maxLandAcres": 5, "eligibleCategories": ["SC"], "eligibleCrops": ["all"], "state": "Punjab", "type": "input", "applyUrl": "http://agri.punjab.gov.in", "matchingDiseases": []},
        {"name": "Mukhya Mantri Punjab Drip Irrigation Subsidy", "namePA": "ਮੁੱਖ ਮੰਤਰੀ ਪੰਜਾਬ ਤੁਪਕਾ ਸਿੰਚਾਈ ਸਬਸਿਡੀ", "benefit": "70% subsidy on drip", "benefitValue": 70, "description": "Micro irrigation promotion", "descriptionPA": "ਸੂਖਮ ਸਿੰਚਾਈ ਨੂੰ ਉਤਸ਼ਾਹਤ ਕਰਨਾ", "minLandAcres": 0, "maxLandAcres": 25, "eligibleCategories": ["all"], "eligibleCrops": ["vegetables", "maize"], "state": "Punjab", "type": "input", "applyUrl": "http://agri.punjab.gov.in", "matchingDiseases": []},
        {"name": "National Food Security Mission - Pulses", "namePA": "ਰਾਸ਼ਟਰੀ ਭੋਜਨ ਸੁਰੱਖਿਆ ਮਿਸ਼ਨ - ਦਾਲਾਂ", "benefit": "Subsidy on seeds/fertilizers", "benefitValue": 2000, "description": "Promotion of pulse cultivation", "descriptionPA": "ਦਾਲਾਂ ਦੀ ਕਾਸ਼ਤ ਨੂੰ ਉਤਸ਼ਾਹਤ ਕਰਨਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["moong", "urad", "arhar"], "state": "Central", "type": "input", "applyUrl": "https://nfsm.gov.in", "matchingDiseases": []},
        {"name": "RKVY Maize Promotion", "namePA": "ਆਰ.ਕੇ.ਵੀ.ਵਾਈ. ਮੱਕੀ ਪ੍ਰੋਤਸਾਹਨ", "benefit": "₹4000/acre input subsidy", "benefitValue": 4000, "description": "Crop diversification to maize", "descriptionPA": "ਮੱਕੀ ਵਿੱਚ ਫਸਲੀ ਵਿਭਿੰਨਤਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["maize"], "state": "Central", "type": "input", "applyUrl": "http://agri.punjab.gov.in", "matchingDiseases": ["Maize Stem Borer"]},
        {"name": "Punjab Beej Subsidy", "namePA": "ਪੰਜਾਬ ਬੀਜ ਸਬਸਿਡੀ", "benefit": "50% on seeds", "benefitValue": 50, "description": "Quality seeds subsidy for SC/OBC", "descriptionPA": "ਐਸ.ਸੀ./ਓ.ਬੀ.ਸੀ. ਲਈ ਮਿਆਰੀ ਬੀਜ ਸਬਸਿਡੀ", "minLandAcres": 0, "maxLandAcres": 5, "eligibleCategories": ["SC", "OBC"], "eligibleCrops": ["wheat", "paddy"], "state": "Punjab", "type": "input", "applyUrl": "http://agri.punjab.gov.in", "matchingDiseases": []},
        {"name": "PM Fasal Bima Yojana Rabi", "namePA": "ਪੀ.ਐਮ. ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ ਰਬੀ", "benefit": "Premium crop insurance 1.5%", "benefitValue": 0, "description": "Insurance for rabi season", "descriptionPA": "ਹਾੜ੍ਹੀ ਦੇ ਮੌਸਮ ਲਈ ਬੀਮਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["wheat", "mustard"], "state": "Central", "type": "insurance", "applyUrl": "https://pmfby.gov.in", "matchingDiseases": ["Mustard Aphid"]},
        {"name": "Soil Health Card Scheme", "namePA": "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਕਾਰਡ ਯੋਜਨਾ", "benefit": "Free Soil Testing", "benefitValue": 0, "description": "Testing soil quality", "descriptionPA": "ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਦੀ ਜਾਂਚ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["all"], "state": "Central", "type": "direct", "applyUrl": "https://soilhealth.dac.gov.in", "matchingDiseases": []},
        {"name": "National Horticulture Mission", "namePA": "ਰਾਸ਼ਟਰੀ ਬਾਗਬਾਨੀ ਮਿਸ਼ਨ", "benefit": "Post-harvest subsidies", "benefitValue": 1000, "description": "Promotion of horticulture", "descriptionPA": "ਬਾਗਬਾਨੀ ਨੂੰ ਉਤਸ਼ਾਹਤ ਕਰਨਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["vegetables", "fruits"], "state": "Central", "type": "input", "applyUrl": "https://midh.gov.in", "matchingDiseases": ["Tomato Blight"]}
    ]
    ref = db.collection('schemes')
    existing = list(ref.limit(1).stream())
    if not existing:
        for s in schemes:
            ref.add(s)
        print("Schemes seeded.")
    else:
        print("Schemes already exist.")

def seed_mandi_prices():
    crops = ["wheat", "paddy", "maize", "cotton", "mustard"]
    mandis = ["Ludhiana", "Moga", "Patiala", "Amritsar", "Bathinda", "Jalandhar"]
    base_prices = {"wheat": 2200, "paddy": 3000, "maize": 2000, "cotton": 7000, "mustard": 5500}
    
    ref = db.collection('mandiPrices')
    existing = list(ref.limit(1).stream())
    if not existing:
        today = datetime.now()
        batch = db.batch()
        count = 0
        for crop in crops:
            for mandi in mandis:
                for day in range(30):
                    date_str = (today - timedelta(days=day)).strftime("%Y-%m-%d")
                    price = int(base_prices[crop] + random.gauss(0, 100))
                    doc_ref = ref.document()
                    batch.set(doc_ref, {
                        "crop": crop,
                        "mandiName": mandi,
                        "district": mandi,
                        "pricePerQuintal": price,
                        "date": date_str,
                        "state": "Punjab"
                    })
                    count += 1
                    if count % 400 == 0:
                        batch.commit()
                        batch = db.batch()
        batch.commit()
        print("Mandi prices seeded.")
    else:
        print("Mandi prices already exist.")

def seed_agri_stores():
    districts = ["Ludhiana", "Moga", "Patiala", "Amritsar", "Bathinda", "Jalandhar"]
    ref = db.collection('agriStores')
    existing = list(ref.limit(1).stream())
    if not existing:
        for dist in districts:
            for i in range(5):
                ref.add({
                    "name": f"Kisan Sewa Kendra {i+1}",
                    "district": dist,
                    "tehsil": "Central",
                    "phone": "9876543210",
                    "address": f"Shop {i+1}, Main Market, {dist}",
                    "lat": 30.9009 + random.uniform(-0.05, 0.05),
                    "lng": 75.8572 + random.uniform(-0.05, 0.05)
                })
        print("Agri stores seeded.")
    else:
        print("Agri stores already exist.")

def seed_crop_recommendations():
    recs = [
        {"soilType": "Loamy", "waterSource": "scare", "applicableMonths": [5,6,7], "crops": [
            {"name": "Maize", "profitScore": 80, "waterScore": 90, "rationalePA": "ਘੱਟ ਪਾਣੀ, ਵਧੀਆ ਮੁਨਾਫਾ", "rationaleHI": "कम पानी, अच्छा मुनाफा", "slowingMonths": [5,6], "harvestMonths": [9,10]},
            {"name": "Cotton", "profitScore": 85, "waterScore": 85, "rationalePA": "ਚੰਗੀ ਮਿੱਟੀ ਅਨੁਕੂਲਤਾ", "rationaleHI": "मिट्टी के अनुकूल", "slowingMonths": [5], "harvestMonths": [10]}
        ]},
        {"soilType": "Clay", "waterSource": "abundant", "applicableMonths": [5,6,7], "crops": [
            {"name": "Paddy", "profitScore": 90, "waterScore": 40, "rationalePA": "ਵੱਧ ਪਾਣੀ ਲਈ ਢੁਕਵਾਂ", "rationaleHI": "अधिक पानी के अनुकूल", "slowingMonths": [6,7], "harvestMonths": [10,11]}
        ]},
        {"soilType": "Sandy", "waterSource": "average", "applicableMonths": [10,11], "crops": [
            {"name": "Wheat", "profitScore": 85, "waterScore": 70, "rationalePA": "ਸਰਦੀਆਂ ਦੀ ਮੁੱਖ ਫਸਲ", "rationaleHI": "सर्दियों की मुख्य फसल", "slowingMonths": [11], "harvestMonths": [4]},
            {"name": "Mustard", "profitScore": 75, "waterScore": 85, "rationalePA": "ਸੁੱਕੇ ਇਲਾਕਿਆਂ ਲਈ ਵਧੀਆ", "rationaleHI": "सूखे क्षेत्रों के लिए अच्छा", "slowingMonths": [10], "harvestMonths": [3]}
        ]}
    ]
    ref = db.collection('cropRecommendations')
    existing = list(ref.limit(1).stream())
    if not existing:
        for r in recs:
            ref.add(r)
        print("Crop recommendations seeded.")
    else:
        print("Crop recommendations already exist.")

if __name__ == '__main__':
    seed_schemes()
    seed_mandi_prices()
    seed_agri_stores()
    seed_crop_recommendations()
    print("Seeding complete.")
