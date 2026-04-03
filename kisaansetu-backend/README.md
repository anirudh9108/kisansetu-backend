# AgriSense Backend

This is the FastAPI backend for AgriSense.

## Setup Requirements
Python 3.11+ is recommended.

1. **Install dependencies**
   `ash
   pip install -r requirements.txt
   `

2. **Environment Variables**
   Rename .env.example to .env and fill in the details.
   - FIREBASE_SERVICE_ACCOUNT_JSON: Go to Firebase Console -> Project Settings -> Service Accounts. Generate a new private key. Minify/flatten this JSON string so it doesn't break newlines in the .env variable, or pass the full string.
   - PLANT_ID_API_KEY: Key for Plant.id v3.
   - OPENWEATHER_API_KEY: Key for OpenWeatherMap.
   - AGMARKNET_API_KEY: Key for Data.gov.in Agmarknet API.

3. **Database Seeding**
   Ensure your Firebase credentials are correctly set in the environment before running:
   `ash
   python seed_firestore.py
   `
   This will seed the database with real schemes, mandi prices, crop recommendations, and agri store locations.

4. **Running the Server**
   `ash
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   `
   Check out http://localhost:8000/docs to test endpoints.

## Firebase Rules
Apply irestore.rules in your Firebase console or deploy via Firebase CLI. This restricts writes on public data to the backend while allowing authorized users to manage their profiles securely.
