from fastapi import APIRouter
import httpx
import os

router = APIRouter(prefix="/api/weather", tags=["weather"])

def get_farming_tip(temp: float, condition: str) -> tuple[str, str]:
    cond = condition.lower()
    if "rain" in cond or "drizzle" in cond:
        return ("Delay chemical sprays due to rain.", "ਮੀਂਹ ਕਾਰਨ ਰਸਾਇਣਕ ਸਪਰੇਅ ਵਿੱਚ ਦੇਰੀ ਕਰੋ।")
    elif temp > 35:
        return ("High temperature detected. Irrigate in the evening.", "ਤਾਪਮਾਨ ਜ਼ਿਆਦਾ ਹੈ। ਸ਼ਾਮ ਨੂੰ ਸਿੰਚਾਈ ਕਰੋ।")
    elif temp < 10:
        return ("Low temperature. Risk of frost, apply light irrigation.", "ਤਾਪਮਾਨ ਘੱਟ ਹੈ, ਫਸਲ ਨੂੰ ਕੋਰੇ ਤੋਂ ਬਚਾਉਣ ਲਈ ਹਲਕੀ ਸਿੰਚਾਈ ਕਰੋ।")
    elif "clear" in cond:
        return ("Favorable weather for field operations.", "ਖੇਤੀ ਦੇ ਕੰਮਾਂ ਲਈ ਢੁਕਵਾਂ ਮੌਸਮ।")
    else:
        return ("Monitor soil moisture before irrigation.", "ਸਿੰਚਾਈ ਤੋਂ ਪਹਿਲਾਂ ਮਿੱਟੀ ਦੀ ਨਮੀ ਦੀ ਜਾਂਚ ਕਰੋ।")

@router.get("/{district}")
async def get_weather(district: str):
    api_key = os.environ.get("OPENWEATHER_API_KEY")
    if not api_key:
        return {
            "temp": 25.0,
            "condition": "Clear",
            "conditionPA": "ਸਾਫ਼",
            "humidity": 50,
            "farmingTip": "Favorable weather",
            "farmingTipPA": "ਢੁਕਵਾਂ ਮੌਸਮ"
        }
        
    url = "https://api.openweathermap.org/data/2.5/weather"
    params = {
        "q": f"{district},Punjab,IN",
        "appid": api_key,
        "units": "metric",
        "lang": "pa"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            
            temp = data["main"]["temp"]
            humidity = data["main"]["humidity"]
            condition = data["weather"][0]["main"]
            condition_pa = data["weather"][0]["description"]
            
            tip, tip_pa = get_farming_tip(temp, condition)
            
            return {
                "temp": temp,
                "condition": condition,
                "conditionPA": condition_pa,
                "humidity": humidity,
                "farmingTip": tip,
                "farmingTipPA": tip_pa
            }
        except Exception as e:
            print(f"Weather API Error: {e}")
            return {
                "temp": 0.0,
                "condition": "Error",
                "conditionPA": "ਗਲਤੀ",
                "humidity": 0,
                "farmingTip": "Unable to fetch weather.",
                "farmingTipPA": "ਮੌਸਮ ਬਾਰੇ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰਨ ਵਿੱਚ ਅਸਮਰੱਥ."
            }
