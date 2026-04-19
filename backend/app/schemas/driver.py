from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DriverBase(BaseModel):
    full_name: str
    license_number: str
    phone: str
    is_active: bool = True

class DriverCreate(DriverBase):
    pass

class DriverUpdate(BaseModel):
    full_name: Optional[str] = None
    license_number: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

class DriverResponse(DriverBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
