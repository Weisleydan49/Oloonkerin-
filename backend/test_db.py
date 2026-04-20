import asyncio
from app.core.database import engine

async def test_conn():
    try:
        async with engine.begin() as conn:
            print("Successfully connected to the database!")
    except Exception as e:
        print(f"Failed to connect: {e}")

asyncio.run(test_conn())
