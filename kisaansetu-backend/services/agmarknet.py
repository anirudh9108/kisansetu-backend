import os
import httpx
from typing import List, Dict, Any

async def fetch_agmarknet_prices(crop: str, district: str) -> List[Dict[str, Any]]:
    api_key = os.environ.get("AGMARKNET_API_KEY")
    if not api_key:
        return []
        
    url = "https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24"
    params = {
        "api-key": api_key,
        "format": "json",
        "filters[commodity]": crop.capitalize(),
        "filters[state]": "Punjab",
        "filters[district]": district.capitalize(),
        "limit": 50
    }
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(url, params=params, timeout=10)
            resp.raise_for_status()
            data = resp.json()
            records = data.get("records", [])
            return records
        except Exception as e:
            print(f"Agmarknet Error: {e}")
            return []
