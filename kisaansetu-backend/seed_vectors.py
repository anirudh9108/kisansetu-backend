from services.vector_store import get_collections

collections = get_collections()
schemes_collection = collections["schemes"]
diseases_collection = collections["diseases"]
crops_collection = collections["crops"]
mandi_collection = collections["mandi"]

def seed_schemes():
    schemes_data = [
        {
            "id": "pm-kisan",
            "document": "Direct income support of ₹6000 per year in three equal installments to all landholding farmers. ਪੀ.ਐਮ.-ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ: ਸਾਰੇ ਜ਼ਮੀਨ ਵਾਲੇ ਕਿਸਾਨਾਂ ਨੂੰ ਤਿੰਨ ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਪ੍ਰਤੀ ਸਾਲ ₹6000 ਦੀ ਸਿੱਧੀ ਆਮਦਨ ਸਹਾਇਤਾ।",
            "metadata": {
                "scheme_id": "central_01", "name_en": "PM-KISAN Samman Nidhi", "name_pa": "ਪੀ.ਐਮ.-ਕਿਸਾਨ ਸਨਮਾਨ ਨਿਧੀ",
                "benefit_amount": 6000, "benefit_text_pa": "₹6,000 ਸਾਲਾਨਾ", "type": "cash", "scope": "central",
                "eligible_categories": "all", "eligible_crops": "all", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "pmkisan.gov.in/registrationform.aspx", "govt_source": "pmkisan.gov.in", "verified": True
            }
        },
        {
            "id": "pmfby",
            "document": "Comprehensive insurance cover against failure of the crop helping in stabilizing the income of farmers. ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ: ਫਸਲਾਂ ਦੇ ਖਰਾਬ ਹੋਣ ਤੋਂ ਵਿਆਪਕ ਬੀਮਾ ਕਵਰ ਜੋ ਕਿਸਾਨਾਂ ਦੀ ਆਮਦਨ ਨੂੰ ਸਥਿਰ ਕਰਨ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।",
            "metadata": {
                "scheme_id": "central_02", "name_en": "Pradhan Mantri Fasal Bima Yojana (PMFBY)", "name_pa": "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ (PMFBY)",
                "benefit_amount": 0, "benefit_text_pa": "ਫਸਲ ਦਾ ਬੀਮਾ", "type": "insurance", "scope": "central",
                "eligible_categories": "all", "eligible_crops": "all", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "pmfby.gov.in", "govt_source": "pmfby.gov.in", "verified": True
            }
        },
        {
            "id": "punjab-sc-farmer-subsidy",
            "document": "Subsidy for SC farmers in Punjab. ₹5000/acre. ਪੰਜਾਬ ਅਨੁਸੂਚਿਤ ਜਾਤੀ ਕਿਸਾਨ ਸਬਸਿਡੀ: ਪੰਜਾਬ ਵਿੱਚ ਐਸਸੀ ਕਿਸਾਨਾਂ ਲਈ 5000 ਰੁਪਏ ਪ੍ਰਤੀ ਏਕੜ ਦੀ ਸਬਸਿਡੀ।",
            "metadata": {
                "scheme_id": "punjab_01", "name_en": "Punjab SC Farmer Subsidy", "name_pa": "ਪੰਜਾਬ ਅਨੁਸੂਚਿਤ ਜਾਤੀ ਕਿਸਾਨ ਸਬਸਿਡੀ",
                "benefit_amount": 5000, "benefit_text_pa": "₹5,000 ਪ੍ਰਤੀ ਏਕੜ", "type": "subsidy", "scope": "punjab",
                "eligible_categories": "SC", "eligible_crops": "all", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "agri.punjab.gov.in", "govt_source": "agri.punjab.gov.in", "verified": True
            }
        },
        {
            "id": "mukhyamantri-drip-irrigation",
            "document": "Mukhyamantri Drip Irrigation Subsidy. 70% subsidy on drip systems for vegetables and maize. ਮੁੱਖ ਮੰਤਰੀ ਤੁਪਕਾ ਸਿੰਚਾਈ ਸਬਸਿਡੀ: ਸਬਜ਼ੀਆਂ ਅਤੇ ਮੱਕੀ ਲਈ ਤੁਪਕਾ ਸਿੰਚਾਈ ਪ੍ਰਣਾਲੀਆਂ ਤੇ 70% ਸਬਸਿਡੀ।",
            "metadata": {
                "scheme_id": "punjab_02", "name_en": "Mukhyamantri Drip Irrigation Subsidy", "name_pa": "ਮੁੱਖ ਮੰਤਰੀ ਤੁਪਕਾ ਸਿੰਚਾਈ ਸਬਸਿਡੀ",
                "benefit_amount": 0, "benefit_text_pa": "70% ਸਬਸਿਡੀ", "type": "subsidy", "scope": "punjab",
                "eligible_categories": "all", "eligible_crops": "vegetables,maize", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "agri.punjab.gov.in", "govt_source": "agri.punjab.gov.in", "verified": True
            }
        },
        {
            "id": "rkvy-maize-promotion",
            "document": "RKVY Maize Promotion. Input support for maize farmers. ਆਰਕੇਵੀਵਾਈ ਮੱਕੀ ਪ੍ਰੋਤਸਾਹਨ: ਮੱਕੀ ਦੇ ਕਿਸਾਨਾਂ ਲਈ ਇਨਪੁਟ ਸਹਾਇਤਾ।",
            "metadata": {
                "scheme_id": "central_03", "name_en": "RKVY Maize Promotion", "name_pa": "ਆਰਕੇਵੀਵਾਈ ਮੱਕੀ ਪ੍ਰੋਤਸਾਹਨ",
                "benefit_amount": 0, "benefit_text_pa": "ਇਨਪੁਟ ਸਹਾਇਤਾ", "type": "input", "scope": "central",
                "eligible_categories": "all", "eligible_crops": "maize", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "rkvy.nic.in", "govt_source": "rkvy.nic.in", "verified": True
            }
        },
        {
            "id": "nfsm-pulses",
            "document": "National Food Security Mission Pulses. Seed subsidy for moong, urad, and arhar. ਰਾਸ਼ਟਰੀ ਖੁਰਾਕ ਸੁਰੱਖਿਆ ਮਿਸ਼ਨ ਦਾਲਾਂ: ਮੂੰਗੀ, ਉੜਦ ਅਤੇ ਅਰਹਰ ਲਈ ਬੀਜ ਦੀ ਸਬਸਿਡੀ।",
            "metadata": {
                "scheme_id": "central_04", "name_en": "National Food Security Mission Pulses", "name_pa": "ਰਾਸ਼ਟਰੀ ਖੁਰਾਕ ਸੁਰੱਖਿਆ ਮਿਸ਼ਨ ਦਾਲਾਂ",
                "benefit_amount": 0, "benefit_text_pa": "ਬੀਜ ਦੀ ਸਬਸਿਡੀ", "type": "subsidy", "scope": "central",
                "eligible_categories": "all", "eligible_crops": "moong,urad,arhar", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "nfsm.gov.in", "govt_source": "nfsm.gov.in", "verified": True
            }
        },
        {
            "id": "punjab-beej-subsidy",
            "document": "Punjab Beej Subsidy. 50% subsidy on wheat and paddy seeds for SC/OBC categories. ਪੰਜਾਬ ਬੀਜ ਸਬਸਿਡੀ: ਐਸਸੀ/ਓਬੀਸੀ ਵਰਗਾਂ ਲਈ ਕਣਕ ਅਤੇ ਝੋਨੇ ਦੇ ਬੀਜਾਂ 'ਤੇ 50% ਸਬਸਿਡੀ।",
            "metadata": {
                "scheme_id": "punjab_03", "name_en": "Punjab Beej Subsidy", "name_pa": "ਪੰਜਾਬ ਬੀਜ ਸਬਸਿਡੀ",
                "benefit_amount": 0, "benefit_text_pa": "50% ਬੀਜ ਸਬਸਿਡੀ", "type": "subsidy", "scope": "punjab",
                "eligible_categories": "SC,OBC", "eligible_crops": "wheat,paddy", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "agri.punjab.gov.in", "govt_source": "agri.punjab.gov.in", "verified": True
            }
        },
        {
            "id": "pmfby-rabi",
            "document": "PM Fasal Bima Yojana Rabi. Crop insurance specifically for Rabi crops like wheat and mustard. ਮੁੱਖ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ ਹਾੜ੍ਹੀ: ਕਣਕ ਅਤੇ ਸਰ੍ਹੋਂ ਵਰਗੀਆਂ ਹਾੜ੍ਹੀ ਦੀਆਂ ਫਸਲਾਂ ਲਈ ਵਿਸ਼ੇਸ਼ ਤੌਰ 'ਤੇ ਫਸਲ ਬੀਮਾ।",
            "metadata": {
                "scheme_id": "central_05", "name_en": "PM Fasal Bima Yojana Rabi", "name_pa": "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ ਹਾੜ੍ਹੀ",
                "benefit_amount": 0, "benefit_text_pa": "ਹਾੜ੍ਹੀ ਫਸਲ ਬੀਮਾ", "type": "insurance", "scope": "central",
                "eligible_categories": "all", "eligible_crops": "wheat,mustard", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "pmfby.gov.in", "govt_source": "pmfby.gov.in", "verified": True
            }
        },
        {
            "id": "soil-health-card",
            "document": "Soil Health Card Scheme. Free soil testing for all farmers. ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਯੋਜਨਾ: ਸਾਰੇ ਕਿਸਾਨਾਂ ਲਈ ਮੁਫ਼ਤ ਮਿੱਟੀ ਦੀ ਜਾਂਚ।",
            "metadata": {
                "scheme_id": "central_06", "name_en": "Soil Health Card Scheme", "name_pa": "ਮਿੱਟੀ ਸਿਹਤ ਕਾਰਡ ਯੋਜਨਾ",
                "benefit_amount": 0, "benefit_text_pa": "ਮੁਫ਼ਤ ਮਿੱਟੀ ਜਾਂਚ", "type": "subsidy", "scope": "central",
                "eligible_categories": "all", "eligible_crops": "all", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "soilhealth.dac.gov.in", "govt_source": "soilhealth.dac.gov.in", "verified": True
            }
        },
        {
            "id": "national-horticulture-mission",
            "document": "National Horticulture Mission. 40% subsidy for vegetables and fruits. ਰਾਸ਼ਟਰੀ ਬਾਗਬਾਨੀ ਮਿਸ਼ਨ: ਸਬਜ਼ੀਆਂ ਅਤੇ ਫਲਾਂ ਲਈ 40% ਸਬਸਿਡੀ।",
            "metadata": {
                "scheme_id": "central_07", "name_en": "National Horticulture Mission", "name_pa": "ਰਾਸ਼ਟਰੀ ਬਾਗਬਾਨੀ ਮਿਸ਼ਨ",
                "benefit_amount": 0, "benefit_text_pa": "40% ਸਬਸਿਡੀ", "type": "subsidy", "scope": "central",
                "eligible_categories": "all", "eligible_crops": "vegetables,fruits", "min_land_acres": 0.0, "max_land_acres": 1000.0,
                "apply_url": "midh.gov.in", "govt_source": "midh.gov.in", "verified": True
            }
        }
    ]

    try:
        count = schemes_collection.count()
        if count == 0:
            schemes_collection.add(
                ids=[s["id"] for s in schemes_data],
                documents=[s["document"] for s in schemes_data],
                metadatas=[s["metadata"] for s in schemes_data]
            )
            print("Seeded 10 schemes.")
        else:
            print("Schemes collection already seeded.")
    except Exception as e:
        print(f"Error seeding schemes: {e}")

def seed_diseases():
    diseases_data = [
        {
            "id": "wheat-yellow-rust",
            "document": "Puccinia striiformis. Wheat Yellow Rust. Yellow stripes on leaves leading to reduced yield. ਕਣਕ ਦੀ ਪੀਲੀ ਕੁੰਗੀ। ਪੱਤਿਆਂ 'ਤੇ ਪੀਲੀਆਂ ਧਾਰੀਆਂ ਜੋ ਝਾੜ ਨੂੰ ਘਟਾਉਂਦੀਆਂ ਹਨ।",
            "metadata": {
                "disease_id": "d01", "name_en": "Wheat Yellow Rust", "name_pa": "ਕਣਕ ਦੀ ਪੀਲੀ ਕੁੰਗੀ", "latin_names": "Puccinia striiformis",
                "affected_crop": "wheat", "severity_default": "high", "pesticide_name": "Propiconazole 25 EC",
                "pesticide_composition": "Propiconazole 25% EC", "dose_per_acre": "200ml", "water_litres_per_acre": 200,
                "waiting_period_days": 30, "toxicity_class": "Yellow", "price_range": "₹300 - ₹500",
                "instructions_pa": "200 ਮਿਲੀਲੀਟਰ ਪ੍ਰੋਪੀਕੋਨਾਜ਼ੋਲ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਸਪਰੇਅ ਕਰੋ।",
                "safety_warning_pa": "ਦਸਤਾਨੇ ਅਤੇ ਮਾਸਕ ਪਹਿਨੋ। ਨਿੱਜੀ ਸੁਰੱਖਿਆ ਉਪਕਰਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ।", "related_scheme_id": "central_05"
            }
        },
        {
            "id": "wheat-brown-rust",
            "document": "Puccinia recondita. Wheat Brown Rust. Brown pustules on leaves. ਕਣਕ ਦੀ ਭੂਰੀ ਕੁੰਗੀ। ਪੱਤਿਆਂ 'ਤੇ ਭੂਰੇ ਦਾਣੇ ਦਿਖਾਈ ਦਿੰਦੇ ਹਨ।",
            "metadata": {
                "disease_id": "d02", "name_en": "Wheat Brown Rust", "name_pa": "ਕਣਕ ਦੀ ਭੂਰੀ ਕੁੰਗੀ", "latin_names": "Puccinia recondita",
                "affected_crop": "wheat", "severity_default": "moderate", "pesticide_name": "Tebuconazole 25.9 EC",
                "pesticide_composition": "Tebuconazole 25.9% EC", "dose_per_acre": "200ml", "water_litres_per_acre": 200,
                "waiting_period_days": 35, "toxicity_class": "Yellow", "price_range": "₹400 - ₹600",
                "instructions_pa": "200 ਮਿਲੀਲੀਟਰ ਟੇਬੂਕੋਨਾਜ਼ੋਲ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਸਪਰੇਅ ਕਰੋ।",
                "safety_warning_pa": "ਸਪਰੇਅ ਕਰਦੇ ਸਮੇਂ ਹਵਾ ਦਿਸ਼ਾ ਵੱਲ ਧਿਆਨ ਦਿਓ।", "related_scheme_id": "central_05"
            }
        },
        {
            "id": "wheat-loose-smut",
            "document": "Ustilago tritici. Wheat Loose Smut. Black powder replacing grain. ਕਣਕ ਦਾ ਕਾਂਗਿਆਰੀ। ਦਾਣਿਆਂ ਦੀ ਥਾਂ ਕਾਲਾ ਪਾਊਡਰ ਬਣ ਜਾਂਦਾ ਹੈ।",
            "metadata": {
                "disease_id": "d03", "name_en": "Wheat Loose Smut", "name_pa": "ਕਣਕ ਦਾ ਕਾਂਗਿਆਰੀ", "latin_names": "Ustilago tritici",
                "affected_crop": "wheat", "severity_default": "high", "pesticide_name": "Carboxin 37.5%",
                "pesticide_composition": "Carboxin 37.5% + Thiram 37.5% DS", "dose_per_acre": "seed treatment", "water_litres_per_acre": 0,
                "waiting_period_days": 0, "toxicity_class": "Red", "price_range": "₹200 - ₹300",
                "instructions_pa": "ਬੀਜਣ ਤੋਂ ਪਹਿਲਾਂ ਬੀਜਾਂ ਨੂੰ ਕਾਰਬੋਕਸਿਨ ਨਾਲ ਸੋਧੋ।",
                "safety_warning_pa": "ਸੋਧੇ ਹੋਏ ਬੀਜਾਂ ਨੂੰ ਖਾਣ ਲਈ ਨਾ ਵਰਤੋ।", "related_scheme_id": "punjab_03"
            }
        },
        {
            "id": "paddy-blast",
            "document": "Magnaporthe oryzae. Paddy Blast. Spindle shaped lesions on leaves. ਝੋਨੇ ਦਾ ਝੁਲਸ ਰੋਗ। ਪੱਤਿਆਂ 'ਤੇ ਅੱਖ ਦੇ ਆਕਾਰ ਦੇ ਧੱਬੇ।",
            "metadata": {
                "disease_id": "d04", "name_en": "Paddy Blast", "name_pa": "ਝੋਨੇ ਦਾ ਝੁਲਸ ਰੋਗ", "latin_names": "Magnaporthe oryzae",
                "affected_crop": "paddy", "severity_default": "high", "pesticide_name": "Tricyclazole 75 WP",
                "pesticide_composition": "Tricyclazole 75% WP", "dose_per_acre": "120g", "water_litres_per_acre": 200,
                "waiting_period_days": 30, "toxicity_class": "Yellow", "price_range": "₹250 - ₹400",
                "instructions_pa": "120 ਗ੍ਰਾਮ ਟਰਾਈਸਾਈਕਲਾਜ਼ੋਲ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਪ੍ਰਤੀ ਏਕੜ ਛਿੜਕਾਅ ਕਰੋ।",
                "safety_warning_pa": "ਮਾਸਕ ਅਤੇ ਦਸਤਾਨੇ ਪਹਿਨੋ।", "related_scheme_id": "central_02"
            }
        },
        {
            "id": "paddy-brown-plant-hopper",
            "document": "Nilaparvata lugens. Paddy Brown Plant Hopper (BPH). Insects sucking sap from base causing hopper burn. ਝੋਨੇ ਦਾ ਭੂਰਾ ਟਿੱਡਾ। ਕੀਟ ਬੂਟੇ ਦੇ ਤਣੇ ਤੋਂ ਰਸ ਚੂਸਦੇ ਹਨ ਜਿਸ ਨਾਲ ਫਸਲ ਸੁੱਕ ਜਾਂਦੀ ਹੈ।",
            "metadata": {
                "disease_id": "d05", "name_en": "Paddy Brown Plant Hopper", "name_pa": "ਝੋਨੇ ਦਾ ਭੂਰਾ ਟਿੱਡਾ", "latin_names": "Nilaparvata lugens",
                "affected_crop": "paddy", "severity_default": "high", "pesticide_name": "Imidacloprid 17.8 SL",
                "pesticide_composition": "Imidacloprid 17.8% SL", "dose_per_acre": "100ml", "water_litres_per_acre": 150,
                "waiting_period_days": 40, "toxicity_class": "Red", "price_range": "₹350 - ₹500",
                "instructions_pa": "100 ਮਿ.ਲੀ. ਇਮੀਡਾਕਲੋਪ੍ਰਿਡ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਬੂਟੇ ਦੇ ਤਣੇ 'ਤੇ ਛਿੜਕਾਅ ਕਰੋ।",
                "safety_warning_pa": "ਜ਼ਹਿਰੀਲੀ ਦਵਾਈ, ਚਮੜੀ ਤੋਂ ਦੂਰ ਰੱਖੋ।", "related_scheme_id": "central_02"
            }
        },
        {
            "id": "cotton-bollworm",
            "document": "Helicoverpa armigera. Cotton Bollworm. Larvae eating bolls and squares. ਕਪਾਹ ਦੀ ਸੁੰਡੀ (ਬੋਲਵਰਮ)। ਸੁੰਡੀਆਂ ਟੀਂਡਿਆਂ ਅਤੇ ਫੁੱਲਾਂ ਨੂੰ ਖਾਂਦੀਆਂ ਹਨ।",
            "metadata": {
                "disease_id": "d06", "name_en": "Cotton Bollworm", "name_pa": "ਕਪਾਹ ਦੀ ਸੁੰਡੀ (ਬੋਲਵਰਮ)", "latin_names": "Helicoverpa armigera",
                "affected_crop": "cotton", "severity_default": "high", "pesticide_name": "Chlorpyrifos 20 EC",
                "pesticide_composition": "Chlorpyrifos 20% EC", "dose_per_acre": "400ml", "water_litres_per_acre": 200,
                "waiting_period_days": 30, "toxicity_class": "Yellow", "price_range": "₹280 - ₹400",
                "instructions_pa": "400 ਮਿਲੀਲੀਟਰ ਕਲੋਰਪਾਇਰੀਫੋਸ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਪਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।",
                "safety_warning_pa": "ਛਿੜਕਾਅ ਵੇਲੇ ਅੱਖਾਂ ਦੀ ਸੁਰੱਖਿਆ ਕਰੋ।", "related_scheme_id": "punjab_01"
            }
        },
        {
            "id": "cotton-whitefly",
            "document": "Bemisia tabaci. Cotton Whitefly. Tiny white flies under leaves causing leaf curl. ਨਰਮੇ ਦੀ ਚਿੱਟੀ ਮੱਖੀ। ਪੱਤਿਆਂ ਦੇ ਹੇਠਾਂ ਛੋਟੀਆਂ ਚਿੱਟੀਆਂ ਮੱਖੀਆਂ ਜੋ ਰਸ ਚੂਸਦੀਆਂ ਹਨ।",
            "metadata": {
                "disease_id": "d07", "name_en": "Cotton Whitefly", "name_pa": "ਨਰਮੇ ਦੀ ਚਿੱਟੀ ਮੱਖੀ", "latin_names": "Bemisia tabaci",
                "affected_crop": "cotton", "severity_default": "high", "pesticide_name": "Spiromesifen 22.9 SC",
                "pesticide_composition": "Spiromesifen 22.9% w/w SC", "dose_per_acre": "200ml", "water_litres_per_acre": 200,
                "waiting_period_days": 15, "toxicity_class": "Blue", "price_range": "₹600 - ₹800",
                "instructions_pa": "200 ਮਿਲੀਲੀਟਰ ਸਪਾਈਰੋਮੈਸੀਫੇਨ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।",
                "safety_warning_pa": "ਖੇਤ ਵਿੱਚ ਮੱਖੀਆਂ ਦੀ ਗਿਣਤੀ ਵਧਣ ਤੋਂ ਪਹਿਲਾਂ ਇਲਾਜ ਕਰੋ।", "related_scheme_id": "central_05"
            }
        },
        {
            "id": "mustard-aphid",
            "document": "Lipaphis erysimi. Mustard Aphid. Greenish insects colonizing stems and pods. ਸਰ੍ਹੋਂ ਦਾ ਚੇਪਾ। ਤਣੇ ਅਤੇ ਫਲੀਆਂ 'ਤੇ ਹਰੇ ਰੰਗ ਦੇ ਛੋਟੇ ਕੀੜੇ।",
            "metadata": {
                "disease_id": "d08", "name_en": "Mustard Aphid", "name_pa": "ਸਰ੍ਹੋਂ ਦਾ ਚੇਪਾ", "latin_names": "Lipaphis erysimi",
                "affected_crop": "mustard", "severity_default": "high", "pesticide_name": "Dimethoate 30 EC",
                "pesticide_composition": "Dimethoate 30% EC", "dose_per_acre": "250ml", "water_litres_per_acre": 150,
                "waiting_period_days": 21, "toxicity_class": "Yellow", "price_range": "₹200 - ₹350",
                "instructions_pa": "250 ਮਿ.ਲੀ. ਡਾਈਮੇਥੋਏਟ ਨੂੰ 150 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਸਪਰੇਅ ਕਰੋ।",
                "safety_warning_pa": "ਸ਼ਹਿਦ ਦੀਆਂ ਮੱਖੀਆਂ ਲਈ ਨੁਕਸਾਨਦੇਹ ਹੋ ਸਕਦਾ ਹੈ।", "related_scheme_id": "central_02"
            }
        },
        {
            "id": "maize-stem-borer",
            "document": "Chilo partellus. Maize Stem Borer. Larvae bore into stem causing dead heart. ਮੱਕੀ ਦਾ ਤਣਾ ਛੇਦਕ ਕੀੜਾ (ਗੜੂੰਆਂ)। ਸੁੰਡੀ ਤਣੇ ਦੇ ਅੰਦਰ ਵੜ ਕੇ ਪੌਦੇ ਨੂੰ ਸੁਕਾ ਦਿੰਦੀ ਹੈ।",
            "metadata": {
                "disease_id": "d09", "name_en": "Maize Stem Borer", "name_pa": "ਮੱਕੀ ਦਾ ਗੜੂੰਆਂ", "latin_names": "Chilo partellus",
                "affected_crop": "maize", "severity_default": "moderate", "pesticide_name": "Carbofuran 3G",
                "pesticide_composition": "Carbofuran 3% CG", "dose_per_acre": "8kg", "water_litres_per_acre": 0,
                "waiting_period_days": 60, "toxicity_class": "Red", "price_range": "₹400 - ₹500",
                "instructions_pa": "8 ਕਿਲੋ ਕਾਰਬੋਫਿਉਰਾਨ ਦਾਣੇਦਾਰ ਦਵਾਈ ਪ੍ਰਤੀ ਏਕੜ ਛੱਟਾ ਦਿਓ।",
                "safety_warning_pa": "ਦਵਾਈ ਪਾਉਣ ਸਮੇਂ ਨੰਗੇ ਹੱਥਾਂ ਦੀ ਵਰਤੋਂ ਨਾ ਕਰੋ।", "related_scheme_id": "central_03"
            }
        },
        {
            "id": "tomato-early-blight",
            "document": "Alternaria solani. Tomato Early Blight. Bulls-eye spots on lower leaves. ਟਮਾਟਰ ਦਾ ਅਗੇਤਾ ਝੁਲਸ ਰੋਗ। ਪੁਰਾਣੇ ਪੱਤਿਆਂ 'ਤੇ ਗੋਲ ਧੱਬੇ ਬਣਦੇ ਹਨ।",
            "metadata": {
                "disease_id": "d10", "name_en": "Tomato Early Blight", "name_pa": "ਟਮਾਟਰ ਦਾ ਅਗੇਤਾ ਝੁਲਸ ਰੋਗ", "latin_names": "Alternaria solani",
                "affected_crop": "tomato", "severity_default": "moderate", "pesticide_name": "Mancozeb 75 WP",
                "pesticide_composition": "Mancozeb 75% WP", "dose_per_acre": "400g", "water_litres_per_acre": 200,
                "waiting_period_days": 10, "toxicity_class": "Yellow", "price_range": "₹300 - ₹450",
                "instructions_pa": "400 ਗ੍ਰਾਮ ਮੈਨਕੋਜ਼ੈਬ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਪਾ ਕੇ ਸਪਰੇਅ ਕਰੋ।",
                "safety_warning_pa": "ਰਸਾਇਣ ਨੂੰ ਬੱਚਿਆਂ ਦੀ ਪਹੁੰਚ ਤੋਂ ਦੂਰ ਰੱਖੋ।", "related_scheme_id": "central_07"
            }
        },
        {
            "id": "tomato-late-blight",
            "document": "Phytophthora infestans. Tomato Late Blight. Large dark water-soaked spots. ਟਮਾਟਰ ਦਾ ਪਿਛੇਤਾ ਝੁਲਸ ਰੋਗ। ਪੱਤਿਆਂ 'ਤੇ ਵੱਡੇ ਕਾਲੇ ਧੱਬੇ।",
            "metadata": {
                "disease_id": "d11", "name_en": "Tomato Late Blight", "name_pa": "ਟਮਾਟਰ ਦਾ ਪਿਛੇਤਾ ਝੁਲਸ ਰੋਗ", "latin_names": "Phytophthora infestans",
                "affected_crop": "tomato", "severity_default": "high", "pesticide_name": "Metalaxyl + Mancozeb",
                "pesticide_composition": "Metalaxyl 8% + Mancozeb 64% WP", "dose_per_acre": "300g", "water_litres_per_acre": 200,
                "waiting_period_days": 14, "toxicity_class": "Yellow", "price_range": "₹450 - ₹650",
                "instructions_pa": "300 ਗ੍ਰਾਮ ਦਵਾਈ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਘੋਲ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।",
                "safety_warning_pa": "ਛਿੜਕਾਅ ਤੋਂ ਬਾਅਦ ਤੁਰੰਤ ਫਲ ਨਾ ਤੋੜੋ।", "related_scheme_id": "central_07"
            }
        },
        {
            "id": "general-fungal-disease",
            "document": "General Fungal Disease. Unknown fungus causing spots or blights. ਆਮ ਉੱਲੀ ਰੋਗ। ਅਣਪਛਾਤੀ ਉੱਲੀ ਕਾਰਨ ਧੱਬੇ ਜਾਂ ਝੁਲਸ ਰੋਗ।",
            "metadata": {
                "disease_id": "d12", "name_en": "General Fungal Disease", "name_pa": "ਆਮ ਉੱਲੀ ਰੋਗ", "latin_names": "Unknown Fungi",
                "affected_crop": "all", "severity_default": "low", "pesticide_name": "Copper Oxychloride 50 WP",
                "pesticide_composition": "Copper Oxychloride 50% WP", "dose_per_acre": "500g", "water_litres_per_acre": 200,
                "waiting_period_days": 15, "toxicity_class": "Green", "price_range": "₹350 - ₹500",
                "instructions_pa": "500 ਗ੍ਰਾਮ ਕਾਪਰ ਔਕਸੀਕਲੋਰਾਈਡ ਨੂੰ 200 ਲੀਟਰ ਪਾਣੀ ਵਿੱਚ ਮਿਲਾ ਕੇ ਛਿੜਕਾਅ ਕਰੋ।",
                "safety_warning_pa": "ਵਰਤੋਂ ਪਹਿਲਾਂ ਲੇਬਲ ਧਿਆਨ ਨਾਲ ਪੜ੍ਹੋ।", "related_scheme_id": "central_02"
            }
        }
    ]

    try:
        count = diseases_collection.count()
        if count == 0:
            diseases_collection.add(
                ids=[d["id"] for d in diseases_data],
                documents=[d["document"] for d in diseases_data],
                metadatas=[d["metadata"] for d in diseases_data]
            )
            print("Seeded 12 diseases.")
        else:
            print("Diseases collection already seeded.")
    except Exception as e:
        print(f"Error seeding diseases: {e}")

def seed_crops():
    crops = ["maize", "moong", "mustard", "vegetables", "cotton", "wheat"]
    soils = ["loamy", "sandy", "clay"]
    months_data = {"kharif": "6,7,8", "rabi": "10,11,12", "zaid": "4,5"}
    crop_info = {
        "maize": {"pa": "ਮੱਕੀ", "emoji": "🌽", "water": 40, "yield": "20 Q/Acre", "demand": "high", "season": "kharif"},
        "moong": {"pa": "ਮੂੰਗੀ", "emoji": "🌱", "water": 80, "yield": "4 Q/Acre", "demand": "high", "season": "zaid"},
        "mustard": {"pa": "ਸਰ੍ਹੋਂ", "emoji": "🌻", "water": 70, "yield": "8 Q/Acre", "demand": "high", "season": "rabi"},
        "vegetables": {"pa": "ਸਬਜ਼ੀਆਂ", "emoji": "🥦", "water": 50, "yield": "80 Q/Acre", "demand": "high", "season": "zaid"},
        "cotton": {"pa": "ਨਰਮਾ", "emoji": "🌿", "water": 30, "yield": "10 Q/Acre", "demand": "medium", "season": "kharif"},
        "wheat": {"pa": "ਕਣਕ", "emoji": "🌾", "water": 60, "yield": "22 Q/Acre", "demand": "high", "season": "rabi"}
    }
    
    crops_data = []
    for c in crops:
        for s in soils:
            season = crop_info[c]["season"]
            crops_data.append({
                "id": f"crop-{c}-{s}-{season}",
                "document": f"Crop {c} best suited for {s} soil in {season} season. Less water intake. ਇਹ ਫਸਲ {crop_info[c]['pa']} ਲਈ ਵਧੀਆ ਹੈ।",
                "metadata": {
                    "crop_name_en": c.capitalize(),
                    "crop_name_pa": crop_info[c]["pa"],
                    "crop_emoji": crop_info[c]["emoji"],
                    "soil_types": s,
                    "water_sources": "tubewell,canal,rain",
                    "best_months": months_data[season],
                    "season": season,
                    "profit_score": 80 if s == "loamy" else 60,
                    "water_efficiency_score": crop_info[c]["water"],
                    "yield_per_acre": crop_info[c]["yield"],
                    "market_demand": crop_info[c]["demand"],
                    "rationale_pa": f"ਇਹ ਮਿੱਟੀ {crop_info[c]['pa']} ਦੀ ਪੈਦਾਵਾਰ ਲਈ ਬਹੁਤ ਵਧੀਆ ਹੈ।",
                    "sowing_months": months_data[season],
                    "harvest_months": "custom_harvest",
                    "water_litres_per_acre_season": 1000000
                }
            })

    try:
        count = crops_collection.count()
        if count == 0:
            crops_collection.add(
                ids=[c["id"] for c in crops_data],
                documents=[c["document"] for c in crops_data],
                metadatas=[c["metadata"] for c in crops_data]
            )
            print("Seeded 18 crops combinations.")
        else:
            print("Crops collection already seeded.")
    except Exception as e:
        print(f"Error seeding crops: {e}")

def seed_mandi():
    mandi_data = [
        {"id": "tip1", "document": "Sell wheat immediately at MSP to govt procurement centers. ਕਣਕ ਨੂੰ ਤੁਰੰਤ ਐਮ.ਐਸ.ਪੀ. 'ਤੇ ਸਰਕਾਰੀ ਖਰੀਦ ਕੇਂਦਰਾਂ ਵਿੱਚ ਵੇਚੋ।", "metadata": {"topic": "wheat"}},
        {"id": "tip2", "document": "Hold maize if moisture is high, sell when dry. ਜੇਕਰ ਨਮੀ ਜ਼ਿਆਦਾ ਹੈ ਤਾਂ ਮੱਕੀ ਨੂੰ ਸਟੋਰ ਕਰੋ, ਸੁੱਕਣ 'ਤੇ ਵੇਚੋ।", "metadata": {"topic": "maize"}},
        {"id": "tip3", "document": "Paddy should be cleaned before bringing to mandi. ਝੋਨੇ ਨੂੰ ਮੰਡੀ ਵਿੱਚ ਲਿਆਉਣ ਤੋਂ ਪਹਿਲਾਂ ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਾਫ਼ ਕਰੋ।", "metadata": {"topic": "paddy"}},
        {"id": "tip4", "document": "Cotton prices peak in January, consider storing. ਜਨਵਰੀ ਵਿੱਚ ਕਪਾਹ ਦੀਆਂ ਕੀਮਤਾਂ ਵੱਧ ਹੁੰਦੀਆਂ ਹਨ, ਸਟੋਰ ਕਰਨ ਬਾਰੇ ਸੋਚੋ।", "metadata": {"topic": "cotton"}},
        {"id": "tip5", "document": "Mustard has high private demand, compare with MSP. ਸਰ੍ਹੋਂ ਦੀ ਨਿੱਜੀ ਮੰਗ ਵਧੇਰੇ ਹੈ, ਐਮ.ਐਸ.ਪੀ. ਨਾਲ ਤੁਲਨਾ ਕਰੋ।", "metadata": {"topic": "mustard"}},
        {"id": "tip6", "document": "Vegetables should be sold fresh early morning. ਸਬਜ਼ੀਆਂ ਨੂੰ ਸਵੇਰੇ ਤਾਜ਼ਾ ਵੇਚਣਾ ਚਾਹੀਦਾ ਹੈ।", "metadata": {"topic": "vegetables"}},
        {"id": "tip7", "document": "Track daily mandi rates before harvesting. ਵਾਢੀ ਤੋਂ ਪਹਿਲਾਂ ਰੋਜ਼ਾਨਾ ਮੰਡੀ ਦੇ ਰੇਟ ਦੇਖੋ।", "metadata": {"topic": "general"}},
        {"id": "tip8", "document": "Avoid agents, sell directly to FCI for MSP. ਏਜੰਟਾਂ ਤੋਂ ਬਚੋ, ਐਮ.ਐਸ.ਪੀ. ਲਈ ਸਿੱਧਾ ਐਫ.ਸੀ.ਆਈ. ਨੂੰ ਵੇਚੋ।", "metadata": {"topic": "general"}},
        {"id": "tip9", "document": "Check soil moisture before selling crops like pulses. ਦਾਲਾਂ ਵਰਗੀਆਂ ਫਸਲਾਂ ਵੇਚਣ ਤੋਂ ਪਹਿਲਾਂ ਨਮੀ ਦੀ ਮਾਤਰਾ ਜ਼ਰੂਰ ਚੈੱਕ ਕਰੋ।", "metadata": {"topic": "moong"}},
        {"id": "tip10", "document": "Register on e-NAM for better national prices. ਬਿਹਤਰ ਕੀਮਤਾਂ ਲਈ ਈ-ਨੈਮ 'ਤੇ ਰਜਿਸਟਰ ਕਰੋ।", "metadata": {"topic": "general"}}
    ]

    try:
        count = mandi_collection.count()
        if count == 0:
            mandi_collection.add(
                ids=[m["id"] for m in mandi_data],
                documents=[m["document"] for m in mandi_data],
                metadatas=[m["metadata"] for m in mandi_data]
            )
            print("Seeded 10 mandi tips.")
        else:
            print("Mandi collection already seeded.")
    except Exception as e:
        print(f"Error seeding mandi: {e}")

if __name__ == "__main__":
    print("Seeding vectors...")
    seed_schemes()
    seed_diseases()
    seed_crops()
    seed_mandi()
    print("Vector database seeding complete.")
