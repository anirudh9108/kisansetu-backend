from fastapi import APIRouter
from services.agmarknet import fetch_agmarknet_prices
from services.firebase_client import get_db
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/mandi", tags=["mandi"])

@router.get("/prices")
async def get_mandi_prices(crop: str, district: str):
    # 1. Fetch from Agmarknet
    records = await fetch_agmarknet_prices(crop, district)
    
    mandis = []
    seven_day_prices = []
    
    if records:
        # Simplistic parsing of Agmarknet records
        for r in records[:5]:
            mandis.append({
                "name": r.get('market', 'Unknown'),
                "district": r.get('district', district),
                "todayPrice": float(r.get('modal_price', 0)),
                "yesterdayPrice": float(r.get('modal_price', 0)) * 0.98, # mock
                "trend": "up" # mock
            })
            if not seven_day_prices:
                today = datetime.now()
                seven_day_prices = [{"date": (today - timedelta(days=i)).strftime("%Y-%m-%d"), "price": float(r.get('modal_price', 0))} for i in range(7)]
    else:
        # Fallback to Firestore
        db = get_db()
        prices_ref = db.collection(u'mandiPrices')
        docs = prices_ref.where(u'crop', u'==', crop.lower()).where(u'district', u'==', district).order_by(u'date', direction='DESCENDING').limit(30).stream()
        
        db_records = [d.to_dict() for d in docs]
        if db_records:
            today_rec = db_records[0]
            yesterday_rec = db_records[1] if len(db_records) > 1 else today_rec
            mandis.append({
                "name": today_rec.get('mandiName'),
                "district": district,
                "todayPrice": today_rec.get('pricePerQuintal'),
                "yesterdayPrice": yesterday_rec.get('pricePerQuintal'),
                "trend": "up" if today_rec.get('pricePerQuintal') > yesterday_rec.get('pricePerQuintal') else "down"
            })
            seven_day_prices = [{"date": r.get('date'), "price": r.get('pricePerQuintal')} for r in db_records[:7]]
            
    best_sell_window = {
        "recommendation": "Hold",
        "daysFromNow": 3,
        "rationalePA": "ਕੀਮਤਾਂ ਅਗਲੇ ਕੁਝ ਦਿਨਾਂ ਵਿੱਚ ਵਧਣ ਦੀ ਉਮੀਦ ਹੈ।"
    }
    
    return {
        "mandis": mandis,
        "sevenDayPrices": seven_day_prices,
        "bestSellWindow": best_sell_window
    }
