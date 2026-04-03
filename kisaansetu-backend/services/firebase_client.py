import firebase_admin
from firebase_admin import credentials, firestore
import json
import os
from dotenv import load_dotenv

load_dotenv()

_db = None

def get_db():
    global _db
    if _db is not None:
        return _db
    cert_json = os.environ.get("FIREBASE_SERVICE_ACCOUNT_JSON")
    if not cert_json:
        raise ValueError("FIREBASE_SERVICE_ACCOUNT_JSON env var not set")
    
    cred_dict = json.loads(cert_json)
    cred = credentials.Certificate(cred_dict)
    
    if not firebase_admin._apps:
        firebase_admin.initialize_app(cred)
        
    _db = firestore.client()
    return _db
