import os
import json
import base64
from anthropic import AsyncAnthropic
from dotenv import load_dotenv

load_dotenv()

class ClaudeClient:
    def __init__(self):
        api_key = os.environ.get("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("ANTHROPIC_API_KEY not found in environment. Please set it in .env")
        self.client = AsyncAnthropic(api_key=api_key)

    async def detect_disease(self, base64_image: str, mime_type: str = "image/jpeg"):
        """
        Detects plant disease using Claude 3.5 Sonnet Vision.
        Returns (disease_name, confidence_description, treatment_plan)
        """
        prompt = (
            "Analyze this plant leaf image. Identify the common name of the disease if any. "
            "If the plant is healthy, say 'Healthy'. "
            "Provide a brief diagnosis and a step-by-step treatment plan for an Indian farmer. "
            "Format the response in JSON: { \"disease\": \"string\", \"is_healthy\": bool, \"diagnosis\": \"string\", \"treatment\": [\"step1\", \"step2\"] }"
        )

        try:
            response = await self.client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "image",
                                "source": {
                                    "type": "base64",
                                    "media_type": mime_type,
                                    "data": base64_image,
                                },
                            },
                            {
                                "type": "text",
                                "text": prompt
                            }
                        ],
                    }
                ],
            )
            
            # Content is a list of blocks, we want the text block
            content_text = response.content[0].text
            # Basic parsing of JSON from text block (Claude usually follows the JSON prompt well)
            # Find the first { and last } to handle any preamble
            start = content_text.find("{")
            end = content_text.rfind("}") + 1
            if start != -1 and end != -1:
                return json.loads(content_text[start:end])
            
            return {"error": "Could not parse Claude response", "raw": content_text}
            
        except Exception as e:
            print(f"Claude Vision Error: {e}")
            return {"error": str(e)}

    async def get_crop_recommendation(self, soil_data: dict, weather_data: dict, kaggle_context: list):
        """
        Provides personalized crop recommendations using Claude 3.5 Sonnet.
        Uses Kaggle dataset points as reference.
        """
        prompt = (
            f"As an expert agronomist, provide crop recommendations based on the following data:\n"
            f"Soil Data: {json.dumps(soil_data)}\n"
            f"Weather Data: {json.dumps(weather_data)}\n"
            f"Reference Data (Kaggle Dataset): {json.dumps(kaggle_context)}\n\n"
            "Suggest the top 3 best crops to plant. For each crop, provide a profit score (out of 100) and a rationale. "
            "Format the response as a JSON list of objects: [{\"crop\": \"name\", \"profitScore\": int, \"rationale\": \"string\"}]"
        )

        try:
            response = await self.client.messages.create(
                model="claude-3-5-sonnet-20240620",
                max_tokens=1024,
                messages=[
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            )
            
            content_text = response.content[0].text
            start = content_text.find("[")
            end = content_text.rfind("]") + 1
            if start != -1 and end != -1:
                return json.loads(content_text[start:end])
                
            return {"error": "Could not parse Claude response", "raw": content_text}
            
        except Exception as e:
            print(f"Claude Text Error: {e}")
            return {"error": str(e)}

# Singleton instance
claude_service = None

def get_claude_service():
    global claude_service
    if claude_service is None:
        claude_service = ClaudeClient()
    return claude_service
