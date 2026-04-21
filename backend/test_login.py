import asyncio
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy import select
from app.models.user import User
import ssl
import os
from dotenv import load_dotenv

load_dotenv(".env")
db_url = os.environ["DATABASE_URL"]

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

engine = create_async_engine(db_url, connect_args={"ssl": ssl_context})
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession)

async def main():
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(User).where(User.email == "admin@oloonkerin.com", User.is_active == True)
        )
        user = result.scalar_one_or_none()
        print("Found user:", user.email if user else None)

asyncio.run(main())
