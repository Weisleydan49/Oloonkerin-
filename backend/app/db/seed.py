import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import AsyncSessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.user import User, Role

async def create_default_admin():
    async with AsyncSessionLocal() as session:
        # Check if admin already exists
        result = await session.execute(
            "SELECT id FROM users WHERE email = :email LIMIT 1",
            {"email": "admin@oloonkerin.com"}
        )
        if result.scalar_one_or_none():
            print("Default admin already exists.")
            return

        admin = User(
            email="admin@oloonkerin.com",
            full_name="System Administrator",
            hashed_password=get_password_hash("Admin@123"),  # Change this immediately in production!
            role=Role.ADMIN,
            is_active=True,
        )
        session.add(admin)
        await session.commit()
        print("Default admin created: admin@oloonkerin.com / Admin@123")

if __name__ == "__main__":
    asyncio.run(create_default_admin())