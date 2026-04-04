from fastapi import APIRouter
from services.mongodb_client import get_mongodb
from datetime import datetime, timedelta
import random

router = APIRouter(prefix="/api/mandi", tags=["mandi"])

MOCK_PRICES = {
    "wheat": 2275, "paddy": 3100, "maize": 2050, "cotton": 7200, "mustard": 5600,
    "sugarcane": 391, "barley": 1850, "soybean": 4700, "groundnut": 6000, "bajra": 2600
}

@router.get("/prices")
async def get_mandi_prices(crop: str = "wheat", district: str = "Ludhiana"):
    mandis = []
    seven_day_prices = []
    crop_lower = crop.lower()
    base = MOCK_PRICES.get(crop_lower, 2000)

    db = get_mongodb()
    if db is not None:
        try:
            cursor = db.mandiPrices.find({"crop": crop_lower, "district": district}).sort("date", -1).limit(30)
            db_records = await cursor.to_list(length=30)
            if db_records:
                today_rec = db_records[0]
                yesterday_rec = db_records[1] if len(db_records) > 1 else today_rec
                mandis.append({
                    "name": today_rec.get("mandiName", f"{district} Main Market"),
                    "district": district,
                    "todayPrice": today_rec.get("pricePerQuintal", base),
                    "yesterdayPrice": yesterday_rec.get("pricePerQuintal", base),
                    "trend": "up" if today_rec.get("pricePerQuintal",0) > yesterday_rec.get("pricePerQuintal",0) else "down",
                    "distance": "3 km"
                })
                seven_day_prices = [{"date": r.get("date"), "price": r.get("pricePerQuintal")} for r in db_records[:7]]
        except Exception as e:
            print(f"Mandi DB Error: {e}")

    if not mandis:
        today = datetime.now()
        variations = [      
            {"suffix": "City Mandi", "distance": "2 km", "multiplier": 1.0, "trend": "same"},
            {"suffix": "Grain Market (New)", "distance": "5.5 km", "multiplier": 1.02, "trend": "up"},
            {"suffix": "FCI Procurement Center", "distance": "8 km", "multiplier": 0.98, "trend": "down"},
            {"suffix": "Wholesale APMC", "distance": "12.3 km", "multiplier": 1.03, "trend": "up"}
        ]
        
        for v in variations:
            today_p = int(base * v["multiplier"])
            yest_p = int(base * (v["multiplier"] - 0.01)) if v["trend"] == "up" else int(base * (v["multiplier"] + 0.01))
            if v["trend"] == "same": yest_p = today_p
            
            mandis.append({
                "name": f"{district} {v['suffix']}",
                "district": district,
                "todayPrice": today_p,
                "yesterdayPrice": yest_p,
                "trend": v["trend"],
                "distance": v["distance"]
            })
            
        seven_day_prices = [{"date": (today - timedelta(days=i)).strftime("%Y-%m-%d"), "price": int(base + random.randint(-100,100))} for i in range(7)]

    recommendation = "Hold" if crop_lower in ["cotton", "maize"] else "Sell Now"
    return {"mandis": mandis, "sevenDayPrices": seven_day_prices, "bestSellWindow": {"recommendation": recommendation, "daysFromNow": 3}}
