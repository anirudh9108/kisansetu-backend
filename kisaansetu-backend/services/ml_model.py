import numpy as np
import os
import random
try:
    from sklearn.ensemble import RandomForestClassifier
    import joblib
    HAVE_SKLEARN = True
except ImportError:
    HAVE_SKLEARN = False

MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_rf_model.pkl")

# Attached Schemes Dictionary with URLs from Punjab's official agriculture portals and government schemes
CROP_SCHEMES = {
    "Wheat": {
        "name": "Punjab Crop Residue Management Scheme", 
        "desc": "Subsidy on machinery for in-situ management of crop residue.", 
        "url": "https://agri.punjab.gov.in/?q=crop-residue-management",
        "yield": "18-22 Quintals/Acre",
        "price": "?2125 - ?2275/Quintal"
    },
    "Paddy": {
        "name": "Direct Seeding of Rice (DSR) Subsidy", 
        "desc": "Financial assistance for adopting DSR technique to save water.", 
        "url": "https://agri.punjab.gov.in/?q=dsr-subsidy",
        "yield": "22-26 Quintals/Acre",
        "price": "?2183 - ?2350/Quintal"
    },
    "Maize": {
        "name": "Crop Diversification Programme (CDP)", 
        "desc": "Promotion of alternative crops like Maize in original green revolution states.", 
        "url": "https://agri.punjab.gov.in/?q=crop-diversification",
        "yield": "15-20 Quintals/Acre",
        "price": "?1962 - ?2100/Quintal"
    },
    "Cotton": {
        "name": "Punjab State Cotton Mission", 
        "desc": "Support for high-yield cotton seeds and whitefly management.", 
        "url": "https://agri.punjab.gov.in/?q=cotton-mission",
        "yield": "10-14 Quintals/Acre",
        "price": "?6620 - ?7020/Quintal"
    },
    "Mustard": {
        "name": "National Mission on Oilseeds (NMOOP) - Punjab", 
        "desc": "Financial assistance for oilseed production and seed distribution.", 
        "url": "https://agri.punjab.gov.in/?q=oilseeds",
        "yield": "6-10 Quintals/Acre",
        "price": "?5450 - ?5650/Quintal"
    },
    "Sugarcane": {
        "name": "State Advised Price (SAP) for Sugarcane", 
        "desc": "Assured higher prices declared by the Punjab government for sugarcane.", 
        "url": "https://agri.punjab.gov.in/?q=sugarcane",
        "yield": "300-400 Quintals/Acre",
        "price": "?380 - ?391/Quintal"
    },
    "Barley": {
        "name": "Rashtriya Krishi Vikas Yojana (RKVY)", 
        "desc": "Overall agriculture development subsidy applicable to rabi crops.", 
        "url": "https://agri.punjab.gov.in/?q=rkvy",
        "yield": "12-16 Quintals/Acre",
        "price": "?1735 - ?1900/Quintal"
    },
    "Soybean": {
        "name": "Sub-Mission on Seeds and Planting Material (SMSP)", 
        "desc": "Provision of certified seeds at subsidized rates.", 
        "url": "https://agri.punjab.gov.in/?q=seeds",
        "yield": "8-12 Quintals/Acre",
        "price": "?4600 - ?4800/Quintal"
    },
    "Groundnut": {
        "name": "Punjab State Micro Irrigation Scheme", 
        "desc": "Subsidy on drip and sprinkler irrigation systems.", 
        "url": "https://agri.punjab.gov.in/?q=micro-irrigation",
        "yield": "14-18 Quintals/Acre",
        "price": "?5850 - ?6100/Quintal"
    },
    "Bajra": {
        "name": "State Millet Mission", 
        "desc": "Promotion of coarse cereals for health and water conservation.", 
        "url": "https://agri.punjab.gov.in/?q=millets",
        "yield": "8-12 Quintals/Acre",
        "price": "?2500 - ?2700/Quintal"
    }
}

def get_ml_recommendations(land_acres, temperature, humidity, rainfall):
    if not HAVE_SKLEARN:
        return _fallback_recommendations(land_acres, temperature, humidity, rainfall)

    if not os.path.exists(MODEL_PATH):
        _train_synthetic_model()
    
    clf = joblib.load(MODEL_PATH)
    input_data = np.array([[land_acres, temperature, humidity, rainfall]])
    probabilities = clf.predict_proba(input_data)[0]
    classes = clf.classes_
    sorted_indices = np.argsort(probabilities)[::-1]
    
    results = []
    # Suggest EXACTLY 5 crops (if probability > 0)
    for idx in sorted_indices[:5]:
        crop = classes[idx]
        prob = float(probabilities[idx])
        
        # Attach Schemes and Forecasts
        scheme_info = CROP_SCHEMES.get(crop, CROP_SCHEMES["Wheat"])
        
        results.append({
            "crop": crop,
            "profitScore": int(prob * 100),
            "rationale": f"ML Model Match ({int(prob * 100)}%). Ideal for Temp {temperature}°C, Hum {humidity}%, Rain {rainfall}mm.",
            "schemeName": scheme_info["name"],
            "schemeDesc": scheme_info["desc"],
            "schemeUrl": scheme_info["url"],
            "yieldForecast": scheme_info["yield"],
            "harvestPrice": scheme_info["price"]
        })
            
    if not results:
        return _fallback_recommendations(land_acres, temperature, humidity, rainfall)
        
    return results

def _train_synthetic_model():
    X = []
    y = []
    random.seed(42)
    for _ in range(5000):
        val = random.random()
        if val < 0.15:
            X.append([random.uniform(1, 50), random.uniform(10, 25), random.uniform(40, 60), random.uniform(30, 80)])
            y.append("Wheat")
        elif val < 0.25:
            X.append([random.uniform(5, 100), random.uniform(22, 35), random.uniform(70, 95), random.uniform(150, 300)])
            y.append("Paddy")
        elif val < 0.35:
            X.append([random.uniform(2, 40), random.uniform(18, 30), random.uniform(50, 75), random.uniform(60, 150)])
            y.append("Maize")
        elif val < 0.45:
            X.append([random.uniform(10, 80), random.uniform(25, 38), random.uniform(30, 55), random.uniform(40, 90)])
            y.append("Cotton")
        elif val < 0.55:
            X.append([random.uniform(1, 20), random.uniform(10, 22), random.uniform(30, 50), random.uniform(20, 50)])
            y.append("Mustard")
        elif val < 0.65:
            X.append([random.uniform(5, 100), random.uniform(20, 35), random.uniform(60, 80), random.uniform(100, 200)])
            y.append("Sugarcane")
        elif val < 0.75:
            X.append([random.uniform(1, 30), random.uniform(12, 25), random.uniform(40, 60), random.uniform(30, 60)])
            y.append("Barley")
        elif val < 0.85:
            X.append([random.uniform(5, 50), random.uniform(20, 30), random.uniform(50, 70), random.uniform(70, 120)])
            y.append("Soybean")
        elif val < 0.95:
            X.append([random.uniform(2, 40), random.uniform(25, 35), random.uniform(40, 60), random.uniform(50, 100)])
            y.append("Groundnut")
        else:
            X.append([random.uniform(1, 20), random.uniform(25, 40), random.uniform(30, 50), random.uniform(20, 40)])
            y.append("Bajra")

    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X, y)
    joblib.dump(clf, MODEL_PATH)

def _fallback_recommendations(land_acres, temperature, humidity, rainfall):
    return [
       {
           "crop": "Paddy", "profitScore": 88, "rationale": "High rainfall fallback match.", 
           "schemeName": "Direct Seeding of Rice (DSR) Subsidy", "schemeDesc": "Financial assistance for adopting DSR technique.", "schemeUrl": "https://agri.punjab.gov.in/?q=dsr-subsidy",
           "yieldForecast": "22-26 Quintals/Acre", "harvestPrice": "?2183 - ?2350/Quintal"
       },
       {
           "crop": "Wheat", "profitScore": 80, "rationale": "High rainfall fallback match.", 
           "schemeName": "Punjab Crop Residue Management Scheme", "schemeDesc": "Subsidy on machinery for in-situ management.", "schemeUrl": "https://agri.punjab.gov.in/?q=crop-residue-management",
           "yieldForecast": "18-22 Quintals/Acre", "harvestPrice": "?2125 - ?2275/Quintal"
       }
    ]
