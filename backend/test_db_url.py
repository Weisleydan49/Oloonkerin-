from app.core.config import get_settings
from sqlalchemy.engine.url import make_url

settings = get_settings()
url = make_url(settings.DATABASE_URL)
print("Username:", url.username)
print("Password:", url.password)
print("Host:", url.host)
print("Port:", url.port)
print("Database:", url.database)
