
from fastapi import APIRouter
from datetime import datetime

router = APIRouter(prefix="/api/weather", tags=["weather"])

# Historical Agriculture Almanac (Typical conditions for Punjab)
ALMANAC = {
    6: {"temp": 38, "rain": 150, "hum": 60, "ph": 6.8, "n": 90, "p": 42, "k": 43}, # June (Kharif Start)
    7: {"temp": 34, "rain": 250, "hum": 80, "ph": 6.5, "n": 85, "p": 40, "k": 40}, # July (Monsoon)
    10: {"temp": 28, "rain": 20, "hum": 50, "ph": 7.0, "n": 100, "p": 45, "k": 50}, # Oct (Rabi Start)
    11: {"temp": 22, "rain": 10, "hum": 45, "ph": 7.1, "n": 105, "p": 48, "k": 55}, # Nov
}

@router.get("/details")
async def get_almanac_details():
    # Use current month for zero-key auto detection
    month = datetime.now().month
    data = ALMANAC.get(month, ALMANAC[6]) # Default to June if month not in map
    
    return {
        "temperature": data["temp"],
        "humidity": data["hum"],
        "rainfall": data["rain"],
        "ph": data["ph"],
        "n": data["n"], "p": data["p"], "k": data["k"],
        "address": "Local District (Almanac Data)"
    }

@router.get("/current")
async def get_current_weather():
    month = datetime.now().month
    data = ALMANAC.get(month, ALMANAC[6])
    return {
        "temp": data["temp"], 
        "condition": "Season Normal", 
        "humidity": data["hum"], 
        "farmingTip": "Follow seasonal package of practices."
    }
