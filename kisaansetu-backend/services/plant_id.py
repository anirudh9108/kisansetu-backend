import os
import httpx
from typing import Dict, Any, Tuple

async def identify_disease(base64_img: str) -> Tuple[str, float]:
    api_key = os.environ.get("PLANT_ID_API_KEY")
    if not api_key:
        return ("Unknown", 0.0)

    url = "https://api.plant.id/v3/identification"
    headers = {
        "Api-Key": api_key,
        "Content-Type": "application/json"
    }
    payload = {
        "images": [base64_img],
        "similar_images": False,
        "health": "auto"
    }
    
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(url, json=payload, headers=headers, timeout=15)
            resp.raise_for_status()
            data = resp.json()
            
            # Parse top disease suggestion
            health = data.get("result", {}).get("disease", {})
            suggestions = health.get("suggestions", [])
            if not suggestions:
                return ("Healthy", 1.0)
            
            top_sug = suggestions[0]
            name = top_sug.get("name", "Unknown")
            prob = top_sug.get("probability", 0.0)
            return (name, prob)
        except Exception as e:
            print(f"Plant.id Error: {e}")
            return ("Error", 0.0)
