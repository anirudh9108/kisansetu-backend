import os
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import certifi

async def test_conn():
    uri = "mongodb+srv://shauryasin8008_db_user:slAak9PnNd9RhROD@cluster1.3tol4sv.mongodb.net/?appName=Cluster1"
    print(f"Testing connection to: {uri}")
    client = AsyncIOMotorClient(uri, tlsCAFile=certifi.where())
    try:
        await client.admin.command('ismaster')
        print("SUCCESS: Connected to MongoDB!")
    except Exception as e:
        print(f"FAILED: {e}")

if __name__ == "__main__":
    asyncio.run(test_conn())
