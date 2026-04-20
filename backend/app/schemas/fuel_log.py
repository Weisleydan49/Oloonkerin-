from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class FuelLogBase(BaseModel):
    date: datetime
    vehicle_id: str
    litres: float
    cost_ksh: float
    notes: Optional[str] = None

class FuelLogCreate(FuelLogBase):
    pass

class FuelLogUpdate(BaseModel):
    date: Optional[datetime] = None
    vehicle_id: Optional[str] = None
    litres: Optional[float] = None
    cost_ksh: Optional[float] = None
    notes: Optional[str] = None

class FuelLogResponse(FuelLogBase):
    id: str
    created_by_id: str
    created_at: datetime

    class Config:
        from_attributes = True
