from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import get_settings
from .api.v1.api import api_router

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Oloonkerin Management - Fleet, Machinery, Fuel & Payroll System (Admin Only)",
    version="1.0.0",
)

# CORS - Change origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],                    # Restrict to your frontend URL later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all API routes
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {"message": f"{settings.PROJECT_NAME} API is running successfully"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}