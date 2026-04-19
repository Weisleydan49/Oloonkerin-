from sqlalchemy import Column, String, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
from ..core.database import Base

class Supervisor(Base):
    __tablename__ = "supervisors"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    full_name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    machine_sets = relationship("MachineSet", back_populates="supervisor")
    payroll_records = relationship("PayrollRecord", back_populates="supervisor", cascade="all, delete-orphan")