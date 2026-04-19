from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
from ..core.database import Base

class Driver(Base):
    __tablename__ = "drivers"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    full_name = Column(String, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    id_number = Column(String, unique=True, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())

    vehicle = relationship("Vehicle", back_populates="driver", uselist=False)
    payroll_records = relationship("PayrollRecord", back_populates="driver", cascade="all, delete-orphan")