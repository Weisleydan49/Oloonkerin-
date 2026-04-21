import asyncio
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text
import ssl
import os
from dotenv import load_dotenv

load_dotenv("backend/.env")
db_url = os.environ["DATABASE_URL"]

ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

engine = create_async_engine(db_url, connect_args={"ssl": ssl_context})

async def main():
    async with engine.connect() as conn:
        try:
            result = await conn.execute(text("SELECT * FROM users;"))
            print("Users:", result.fetchall())
        except Exception as e:
            print("Error querying users:", e)
            
asyncio.run(main())
