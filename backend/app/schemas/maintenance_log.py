from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MaintenanceLogBase(BaseModel):
    date: datetime
    vehicle_id: str
    cost_ksh: float
    description: str

class MaintenanceLogCreate(MaintenanceLogBase):
    pass

class MaintenanceLogUpdate(BaseModel):
    date: Optional[datetime] = None
    vehicle_id: Optional[str] = None
    cost_ksh: Optional[float] = None
    description: Optional[str] = None

class MaintenanceLogResponse(MaintenanceLogBase):
    id: str
    created_by_id: str
    created_at: datetime

    class Config:
        from_attributes = True
