DISTRICT_DISEASE_ALERTS = {
    "Ludhiana": ["wheat-yellow-rust", "mustard-aphid"],
    "Patiala": ["paddy-blast", "cotton-whitefly"],
    "Amritsar": ["paddy-brown-plant-hopper", "wheat-brown-rust"],
    "Jalandhar": ["tomato-early-blight", "general-fungal-disease"],
    "Bathinda": ["cotton-bollworm", "cotton-whitefly"],
    "Moga": ["maize-stem-borer"],
    "Fazilka": ["cotton-bollworm", "mustard-aphid"],
    "Muktsar": ["wheat-yellow-rust", "cotton-whitefly"]
}

# Fallback empty list for other 15 districts for simplicity.
# Full dataset would map all 23 districts of Punjab.

MEDICINE_COMPOSITION = {
    "Propiconazole 25 EC": {
        "active_ingredient": "Propiconazole",
        "formulation": "25% EC",
        "dose_per_acre": "200ml",
        "water_volume_litres": 200,
        "waiting_period_days": 30,
        "toxicity_class": "Yellow",
        "price_range_inr": "₹300-₹500",
        "manufacturer_examples": "Tilt (Syngenta), Radar (Rallis)",
        "safety_pa": "ਦਸਤਾਨੇ ਪਾਓ, ਹਵਾ ਦੀ ਦਿਸ਼ਾ ਵਿੱਚ ਛਿੜਕਾਅ ਕਰੋ।",
        "disposal_pa": "ਖਾਲੀ ਬੋਤਲਾਂ ਨੂੰ ਜ਼ਮੀਨ ਵਿੱਚ ਦਬਾ ਦਿਓ।"
    },
    "Tebuconazole 25.9 EC": {
        "active_ingredient": "Tebuconazole",
        "formulation": "25.9% EC",
        "dose_per_acre": "200ml",
        "water_volume_litres": 200,
        "waiting_period_days": 35,
        "toxicity_class": "Yellow",
        "price_range_inr": "₹400-₹600",
        "manufacturer_examples": "Folicur (Bayer)",
        "safety_pa": "ਮੂੰਹ 'ਤੇ ਮਾਸਕ ਲਗਾਓ।",
        "disposal_pa": "ਡੱਬੇ ਪਾਣੀ ਦੇ ਸਰੋਤਾਂ ਤੋਂ ਦੂਰ ਸੁੱਟੋ।"
    },
    "Chlorpyrifos 20 EC": {
        "active_ingredient": "Chlorpyrifos",
        "formulation": "20% EC",
        "dose_per_acre": "400ml",
        "water_volume_litres": 200,
        "waiting_period_days": 30,
        "toxicity_class": "Yellow",
        "price_range_inr": "₹280-₹400",
        "manufacturer_examples": "Dursban (Corteva)",
        "safety_pa": "ਅੱਖਾਂ ਨੂੰ ਬਚਾਓ, ਪੂਰੇ ਕੱਪੜੇ ਪਹਿਨੋ।",
        "disposal_pa": "ਪਿੰਡ ਦੇ ਕੂੜੇ ਵਿੱਚ ਨਾ ਸੁੱਟੋ।"
    }
}

def get_district_alerts(district: str) -> list[dict]:
    alerts = DISTRICT_DISEASE_ALERTS.get(district, [])
    return [{"disease_id": disease, "severity": "high"} for disease in alerts]

def get_medicine_details(pesticide_name: str) -> dict:
    return MEDICINE_COMPOSITION.get(pesticide_name, {
        "active_ingredient": pesticide_name,
        "formulation": "Unknown",
        "dose_per_acre": "Check Label",
        "water_volume_litres": 200,
        "waiting_period_days": 15,
        "toxicity_class": "Unknown",
        "price_range_inr": "Varies",
        "manufacturer_examples": "Multiple Brands",
        "safety_pa": "ਦਵਾਈ ਵਰਤਣ ਤੋਂ ਪਹਿਲਾਂ ਲੇਬਲ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।",
        "disposal_pa": "ਬਚੀ ਹੋਈ ਦਵਾਈ ਨੂੰ ਪਾਣੀ ਦੇ ਸਰੋਤਾਂ ਵਿੱਚ ਨਾ ਪਾਓ।"
    })
