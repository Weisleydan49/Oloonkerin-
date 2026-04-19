from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from ..models.vehicle import VehicleType

class VehicleBase(BaseModel):
    type: VehicleType
    plate_number: str
    make_model: str
    year: Optional[str] = None
    tire_serials: Optional[List[str]] = None
    current_project_id: Optional[str] = None
    driver_id: Optional[str] = None
    is_active: bool = True

class VehicleCreate(VehicleBase):
    pass

class VehicleUpdate(BaseModel):
    type: Optional[VehicleType] = None
    plate_number: Optional[str] = None
    make_model: Optional[str] = None
    year: Optional[str] = None
    tire_serials: Optional[List[str]] = None
    current_project_id: Optional[str] = None
    driver_id: Optional[str] = None
    is_active: Optional[bool] = None

class VehicleResponse(VehicleBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
