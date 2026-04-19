from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SupervisorBase(BaseModel):
    full_name: str
    phone: str
    is_active: bool = True

class SupervisorCreate(SupervisorBase):
    pass

class SupervisorUpdate(BaseModel):
    full_name: Optional[str] = None
    phone: Optional[str] = None
    is_active: Optional[bool] = None

class SupervisorResponse(SupervisorBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
