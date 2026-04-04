import os
import anthropic
import json
from dotenv import load_dotenv

load_dotenv()

class ClaudeClient:
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        # In a real scenario, initialize the client here
        # self.client = anthropic.Anthropic(api_key=self.api_key)

    async def get_crop_recommendation(self, sensor_data, farmer_profile, lang="pa"):
        # AgriSense System Prompt for Multi-Language Crop Recommendations
        brands = {"pa": " ???????? (AgriSense)", "hi": "????????? (AgriSense)", "en": "AgriSense"}
        brand = brands.get(lang, "AgriSense")
        # Simulated logic
        return [{"crop": "Maize", "yield": "25-30 Q", "price": "?2150", "scheme": "PM-KISAN", "link": "https://pmkisan.gov.in"}]

    async def detect_disease(self, base64_image, lang="pa"):
        # Rebranded Disease Detection simulation
        return {
            "disease": "Rice Blast", 
            "is_healthy": False, 
            "diagnosis": "Severe fungal infection detected in the leaves.",
            "treatment": ["Use Tricyclazole 75WP @ 0.6g/L", "Improve drainage", "Avoid excess Nitrogen fertilizer"]
        }

_instance = None
def get_claude_service():
    global _instance
    if _instance is None:
        _instance = ClaudeClient()
    return _instance
