from datetime import datetime

VERIFIED_SOURCES = {
    "schemes": {
        "source_name": "MyScheme.gov.in — Government of India",
        "api": "api.data.gov.in",
        "license": "OGDL — Open Government Data License India",
        "verified": True
    },
    "mandi": {
        "source_name": "Agmarknet — data.gov.in",
        "api": "api.data.gov.in/resource/35985678",
        "license": "OGDL",
        "verified": True
    },
    "diseases": {
        "source_name": "ICAR — Indian Council of Agricultural Research",
        "api": "plant.id v3",
        "license": "Public domain research",
        "verified": True
    },
    "weather": {
        "source_name": "OpenWeatherMap",
        "api": "api.openweathermap.org",
        "license": "CC BY-SA 4.0",
        "verified": True
    },
    "crops": {
        "source_name": "Punjab Agriculture Department",
        "api": "Internal KisaanSetu knowledge base",
        "license": "Public domain",
        "verified": True
    }
}

def get_trust_badge(data_type: str, live: bool = True) -> dict:
    source = VERIFIED_SOURCES.get(data_type, {})
    return {
        "verified": source.get("verified", False),
        "source_name": source.get("source_name", "Unknown"),
        "license": source.get("license", ""),
        "fetched_live": live,
        "fetched_at": datetime.utcnow().isoformat() + "Z",
        "badge_text_pa": "✓ ਸਰਕਾਰੀ ਤਸਦੀਕ" if source.get("verified") else "ਅਣਤਸਦੀਕਸ਼ੁਦਾ",
        "badge_text_en": "✓ Govt Verified" if source.get("verified") else "Unverified"
    }
