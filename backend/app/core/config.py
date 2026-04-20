from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache
from typing import Optional
from pydantic import model_validator
from urllib.parse import quote_plus

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_ignore_empty=True, 
        extra="ignore"
    )

    # Database Settings
    DB_USER: str = "postgres"
    DB_PASSWORD: str = ""
    DB_HOST: str = "localhost"
    DB_PORT: int = 5432
    DB_NAME: str = "postgres"
    
    # If DATABASE_URL is provided in .env, it will be used directly
    DATABASE_URL: Optional[str] = None

    @model_validator(mode="after")
    def assemble_db_connection(self) -> "Settings":
        if not self.DATABASE_URL:
            # URL encode password for safety
            password = quote_plus(self.DB_PASSWORD)
            # Use postgresql+asyncpg for SQLAlchemy async support
            self.DATABASE_URL = (
                f"postgresql+asyncpg://{self.DB_USER}:{password}@"
                f"{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
            )
        elif self.DATABASE_URL.startswith("postgresql://"):
            # Ensure it uses the async driver
            self.DATABASE_URL = self.DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)
            
        return self

    SECRET_KEY: str = "super-secret-key-change-it"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    DEBUG: bool = True
    PROJECT_NAME: str = "Oloonkerin Management"

    # Production connection pooling
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 3600

@lru_cache
def get_settings() -> Settings:
    return Settings()
