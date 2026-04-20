import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
from app.core.config import get_settings

async def main():
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL)
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE drivers ADD COLUMN base_salary FLOAT DEFAULT 0.0 NOT NULL;"))
            print("Added base_salary to drivers")
        except Exception as e:
            print("Could not add to drivers:", e)
            
        try:
            await conn.execute(text("ALTER TABLE supervisors ADD COLUMN base_salary FLOAT DEFAULT 0.0 NOT NULL;"))
            print("Added base_salary to supervisors")
        except Exception as e:
            print("Could not add to supervisors:", e)
        
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(main())
