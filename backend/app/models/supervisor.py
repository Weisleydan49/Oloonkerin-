from sqlalchemy import Column, String, Boolean, DateTime, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
from ..core.database import Base

class Supervisor(Base):
    __tablename__ = "supervisors"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    full_name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    base_salary = Column(Float, nullable=False, default=0.0)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    machine_sets = relationship("MachineSet", back_populates="supervisor")
    payroll_records = relationship(
        "PayrollRecord",
        primaryjoin="and_(Supervisor.id==PayrollRecord.employee_id, PayrollRecord.employee_type=='supervisor')",
        foreign_keys="[PayrollRecord.employee_id]",
        back_populates="supervisor",
        cascade="all, delete-orphan"
    )