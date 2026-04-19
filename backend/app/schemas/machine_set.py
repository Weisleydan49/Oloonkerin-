from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class MachineSetBase(BaseModel):
    supervisor_id: str
    project_id: str
    target_value: float
    target_unit: str

class MachineSetCreate(MachineSetBase):
    pass

class MachineSetUpdate(BaseModel):
    supervisor_id: Optional[str] = None
    project_id: Optional[str] = None
    target_value: Optional[float] = None
    target_unit: Optional[str] = None

class MachineSetResponse(MachineSetBase):
    id: str
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
