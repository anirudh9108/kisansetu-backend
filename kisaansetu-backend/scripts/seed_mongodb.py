import os
import asyncio
import random
import json
from datetime import datetime, timedelta
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

async def seed_mongodb():
    uri = os.environ.get("MONGODB_URI")
    db_name = os.environ.get("MONGODB_DB_NAME", "KisaanSetu")
    
    if not uri:
        print("ERROR: MONGODB_URI not found in .env")
        return

    client = AsyncIOMotorClient(uri)
    db = client[db_name]
    print(f"Connecting to MongoDB: {db_name}...")

    # 1. Seed Schemes
    schemes_data = [
        {"name": "PM-KISAN", "namePA": "ਪੀਐਮ-ਕਿਸਾਨ", "benefit": "₹6000/year", "benefitValue": 6000, "description": "Direct income support", "descriptionPA": "ਸਿੱਧੀ ਆਮਦਨ ਸਹਾਇਤਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["all"], "state": "Central", "type": "direct", "applyUrl": "https://pmkisan.gov.in", "matchingDiseases": []},
        {"name": "PMFBY", "namePA": "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ", "benefit": "Crop Insurance", "benefitValue": 0, "description": "Insurance against crop failure", "descriptionPA": "ਫਸਲ ਦੇ ਨੁਕਸਾਨ ਦੇ ਖਿਲਾਫ ਬੀਮਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["all"], "state": "Central", "type": "insurance", "applyUrl": "https://pmfby.gov.in", "matchingDiseases": ["Wheat Rust", "Paddy Blast"]},
        {"name": "Punjab SC Farmer Subsidy", "namePA": "ਪੰਜਾਬ ਐਸ.ਸੀ. ਕਿਸਾਨ ਸਬਸਿਡੀ", "benefit": "₹5000/acre", "benefitValue": 5000, "description": "Subsidy for SC farmers", "descriptionPA": "ਐਸ.ਸੀ. ਕਿਸਾਨਾਂ ਲਈ ਸਬਸਿਡੀ", "minLandAcres": 0, "maxLandAcres": 5, "eligibleCategories": ["SC"], "eligibleCrops": ["all"], "state": "Punjab", "type": "input", "applyUrl": "http://agri.punjab.gov.in", "matchingDiseases": []},
        {"name": "Mukhya Mantri Punjab Drip Irrigation Subsidy", "namePA": "ਮੁੱਖ ਮੰਤਰੀ ਪੰਜਾਬ ਤੁਪਕਾ ਸਿੰਚਾਈ ਸਬਸਿਡੀ", "benefit": "70% subsidy on drip", "benefitValue": 70, "description": "Micro irrigation promotion", "descriptionPA": "ਸੂਖਮ ਸਿੰਚਾਈ ਨੂੰ ਉਤਸ਼ਾਹਤ ਕਰਨਾ", "minLandAcres": 0, "maxLandAcres": 25, "eligibleCategories": ["all"], "eligibleCrops": ["vegetables", "maize"], "state": "Punjab", "type": "input", "applyUrl": "http://agri.punjab.gov.in", "matchingDiseases": []},
        {"name": "National Food Security Mission - Pulses", "namePA": "ਰਾਸ਼ਟਰੀ ਭੋਜਨ ਸੁਰੱਖਿਆ ਮਿਸ਼ਨ - ਦਾਲਾਂ", "benefit": "Subsidy on seeds/fertilizers", "benefitValue": 2000, "description": "Promotion of pulse cultivation", "descriptionPA": "ਦਾਲਾਂ ਦੀ ਕਾਸ਼ਤ ਨੂੰ ਉਤਸ਼ਾਹਤ ਕਰਨਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["moong", "urad", "arhar"], "state": "Central", "type": "input", "applyUrl": "https://nfsm.gov.in", "matchingDiseases": []},
        {"name": "RKVY Maize Promotion", "namePA": "ਆਰ.ਕੇ.ਵੀ.ਵਾਈ. ਮੱਕੀ ਪ੍ਰੋਤਸਾਹਨ", "benefit": "₹4000/acre input subsidy", "benefitValue": 4000, "description": "Crop diversification to maize", "descriptionPA": "ਮੱਕੀ ਵਿੱਚ ਫਸਲੀ ਵਿਭਿੰਨਤਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["maize"], "state": "Central", "type": "input", "applyUrl": "http://agri.punjab.gov.in", "matchingDiseases": ["Maize Stem Borer"]},
        {"name": "Punjab Beej Subsidy", "namePA": "ਪੰਜਾਬ ਬੀਜ ਸਬਸਿਡੀ", "benefit": "50% on seeds", "benefitValue": 50, "description": "Quality seeds subsidy for SC/OBC", "descriptionPA": "ਐਸ.ਸੀ./ਓ.ਬੀ.ਸੀ. ਲਈ ਮਿਆਰੀ ਬੀਜ ਸਬਸਿਡੀ", "minLandAcres": 0, "maxLandAcres": 5, "eligibleCategories": ["SC", "OBC"], "eligibleCrops": ["wheat", "paddy"], "state": "Punjab", "type": "input", "applyUrl": "http://agri.punjab.gov.in", "matchingDiseases": []},
        {"name": "PM Fasal Bima Yojana Rabi", "namePA": "ਪੀ.ਐਮ. ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ ਰਬੀ", "benefit": "Premium crop insurance 1.5%", "benefitValue": 0, "description": "Insurance for rabi season", "descriptionPA": "ਹਾੜ੍ਹੀ ਦੇ ਮੌਸਮ ਲਈ ਬੀਮਾ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["wheat", "mustard"], "state": "Central", "type": "insurance", "applyUrl": "https://pmfby.gov.in", "matchingDiseases": ["Mustard Aphid"]},
        {"name": "Soil Health Card Scheme", "namePA": "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਕਾਰਡ ਯੋਜਨਾ", "benefit": "Free Soil Testing", "benefitValue": 0, "description": "Testing soil quality", "descriptionPA": "ਮਿੱਟੀ ਦੀ ਗੁਣਵੱਤਾ ਦੀ ਜਾਂਚ", "minLandAcres": 0, "maxLandAcres": 1000, "eligibleCategories": ["all"], "eligibleCrops": ["all"], "state": "Central", "type": "direct", "applyUrl": "https://soilhealth.dac.gov.in", "matchingDiseases": []}
    ]
    await db.schemes.delete_many({})
    await db.schemes.insert_many(schemes_data)
    print("Schemes seeded.")

    # 2. Seed Mandi Prices
    crops = ["wheat", "paddy", "maize", "cotton", "mustard"]
    mandis = ["Ludhiana", "Moga", "Patiala", "Amritsar", "Bathinda", "Jalandhar"]
    base_prices = {"wheat": 2200, "paddy": 3000, "maize": 2000, "cotton": 7000, "mustard": 5500}
    
    mandi_prices = []
    today = datetime.now()
    for crop in crops:
        for mandi in mandis:
            for day in range(15):  # Reduce to 15 days for faster seeding
                date_str = (today - timedelta(days=day)).strftime("%Y-%m-%d")
                price = int(base_prices[crop] + random.gauss(0, 100))
                mandi_prices.append({
                    "crop": crop,
                    "mandiName": mandi,
                    "district": mandi,
                    "pricePerQuintal": price,
                    "date": date_str,
                    "state": "Punjab"
                })
    await db.mandiPrices.delete_many({})
    await db.mandiPrices.insert_many(mandi_prices)
    print("Mandi prices seeded.")

    # 3. Seed Agri Stores
    districts = ["Ludhiana", "Moga", "Patiala", "Amritsar", "Bathinda", "Jalandhar"]
    agri_stores = []
    for dist in districts:
        for i in range(3):
            agri_stores.append({
                "name": f"Kisan Sewa Kendra {i+1}",
                "district": dist,
                "tehsil": "Central",
                "phone": "9876543210",
                "address": f"Shop {i+1}, Main Market, {dist}",
                "location": {
                    "type": "Point",
                    "coordinates": [75.8572 + random.uniform(-0.05, 0.05), 30.9009 + random.uniform(-0.05, 0.05)]
                }
            })
    await db.agriStores.delete_many({})
    await db.agriStores.insert_many(agri_stores)
    print("Agri stores seeded.")

    # 4. Kaggle Integration: Crop Recommendation Dataset
    # Structure: N, P, K, temperature, humidity, ph, rainfall, label
    kaggle_data = [
        {"n": 90, "p": 42, "k": 43, "temp": 20.87, "humidity": 82.00, "ph": 6.50, "rainfall": 202.93, "label": "rice", "rationale": "High nitrogen and water needed."},
        {"n": 60, "p": 55, "k": 44, "temp": 23.00, "humidity": 70.00, "ph": 5.50, "rainfall": 150.00, "label": "maize", "rationale": "Moderate requirements, sensitive to pH."},
        {"n": 107, "p": 34, "k": 32, "temp": 26.77, "humidity": 66.41, "ph": 6.78, "rainfall": 177.77, "label": "coffee", "rationale": "Tropical climate with high nitrogen."},
        {"n": 104, "p": 18, "k": 30, "temp": 23.60, "humidity": 60.30, "ph": 6.70, "rainfall": 140.91, "label": "cotton", "rationale": "High temperature and nitrogen, low phosphorus."},
        {"n": 40, "p": 72, "k": 77, "temp": 17.02, "humidity": 16.90, "ph": 7.50, "rainfall": 35.00, "label": "chickpea", "rationale": "Low rainfall and low nitrogen, high K/P."},
        {"n": 13, "p": 60, "k": 25, "temp": 24.51, "humidity": 53.00, "ph": 6.80, "rainfall": 45.00, "label": "kidneybeans", "rationale": "Low nitrogen, moderate moisture."}
    ]
    await db.cropRecommendations.delete_many({})
    await db.cropRecommendations.insert_many(kaggle_data)
    print("Kaggle crop recommendations seeded.")

    print("DB Seeding Complete!")
    client.close()

if __name__ == "__main__":
    asyncio.run(seed_mongodb())
