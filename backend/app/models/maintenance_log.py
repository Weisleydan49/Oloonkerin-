from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
from ..core.database import Base

class MaintenanceLog(Base):
    __tablename__ = "maintenance_logs"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    date = Column(DateTime(timezone=True), nullable=False)
    vehicle_id = Column(String, ForeignKey("vehicles.id"), nullable=False)
    cost_ksh = Column(Numeric(12, 2), nullable=False)
    description = Column(Text, nullable=False)
    created_by_id = Column(String, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    vehicle = relationship("Vehicle", back_populates="maintenance_logs")
    created_by = relationship("User", back_populates="maintenance_logs")