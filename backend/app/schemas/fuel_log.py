from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
from ..core.database import Base

class FuelLog(Base):
    __tablename__ = "fuel_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    date = Column(DateTime, nullable=False)
    vehicle_id = Column(String, ForeignKey("vehicles.id"), nullable=False)
    litres = Column(Numeric(10, 2), nullable=False)
    cost_ksh = Column(Numeric(12, 2), nullable=False)
    notes = Column(String, nullable=True)                       # e.g. "Bulk diesel from tank"
    created_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    vehicle = relationship("Vehicle", back_populates="fuel_logs")
    created_by = relationship("User", back_populates="fuel_logs")