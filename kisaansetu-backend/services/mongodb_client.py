import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

class MongoDBClient:
    client: AsyncIOMotorClient = None
    db_name: str = None
    _connected: bool = False

    @classmethod
    async def connect(cls):
        uri = os.environ.get("MONGODB_URI")
        cls.db_name = os.environ.get("MONGODB_DB_NAME", "KisaanSetu")
        if not uri:
            print("WARNING: MONGODB_URI not set. Running in offline/mock mode.")
            return

        try:
            cls.client = AsyncIOMotorClient(
                uri,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000,
                socketTimeoutMS=5000,
            )
            await cls.client.admin.command('ping')
            cls._connected = True
            print(f"SUCCESS: Connected to MongoDB: {cls.db_name}")
        except Exception as e:
            print(f"WARNING: MongoDB connection failed: {e}")
            print("Running in OFFLINE mode - API will return mock/fallback data.")
            cls.client = None
            cls._connected = False

    @classmethod
    async def close(cls):
        if cls.client:
            cls.client.close()
            print("Disconnected from MongoDB")

    @classmethod
    def get_db(cls):
        if cls.client is None or not cls._connected:
            return None
        return cls.client[cls.db_name]

    @classmethod
    def is_connected(cls):
        return cls._connected

def get_mongodb():
    return MongoDBClient.get_db()
