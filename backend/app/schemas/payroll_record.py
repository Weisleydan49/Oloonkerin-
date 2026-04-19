from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.payroll_record import EmployeeType

class PayrollRecordBase(BaseModel):
    month: datetime
    employee_id: str
    employee_type: EmployeeType
    basic_salary: float
    allowances: float = 0.0
    sha: float = 0.0
    nssf: float = 0.0
    net_pay: float

class PayrollRecordCreate(PayrollRecordBase):
    pass

class PayrollRecordUpdate(BaseModel):
    month: Optional[datetime] = None
    employee_id: Optional[str] = None
    employee_type: Optional[EmployeeType] = None
    basic_salary: Optional[float] = None
    allowances: Optional[float] = None
    sha: Optional[float] = None
    nssf: Optional[float] = None
    net_pay: Optional[float] = None

class PayrollRecordResponse(PayrollRecordBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True
