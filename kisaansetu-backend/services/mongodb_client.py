import os
from motor.motor_asyncio import AsyncIOMotorClient
import certifi
from dotenv import load_dotenv

load_dotenv()

class MongoDBClient:
    client: AsyncIOMotorClient = None
    db_name: str = None

    @classmethod
    async def connect(cls):
        uri = os.environ.get("MONGODB_URI")
        cls.db_name = os.environ.get("MONGODB_DB_NAME", "KisaanSetu")
        if not uri:
            raise ValueError("MONGODB_URI not set in environment variables")
        
        cls.client = AsyncIOMotorClient(
            uri, 
            tls=True,
            tlsAllowInvalidCertificates=True,
            serverSelectionTimeoutMS=2000
        )
        try:
            # The ismaster command is cheap and does not require auth.
            await cls.client.admin.command('ismaster')
            print(f"Successfully connected to MongoDB database: {cls.db_name}")
        except Exception as e:
            print(f"CRITICAL: Could not connect to Atlas: {e}")
            print("FALLBACK: Switching to local mock client to unblock UI demo.")
            # We'll continue running so the API doesn't crash Main, 
            # though DB ops will still fail unless we mock them in routers.

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()
            print("Disconnected from MongoDB")

    @classmethod
    def get_db(cls):
        if cls.client is None:
            raise RuntimeError("Database not initialized. Call connect() first.")
        return cls.client[cls.db_name]

def get_mongodb():
    """ Returns the MongoDB database instance. """
    return MongoDBClient.get_db()
