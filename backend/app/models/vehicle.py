from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, ARRAY, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
import enum
from ..core.database import Base

class VehicleType(str, enum.Enum):
    TRUCK = "truck"
    EXCAVATOR = "excavator"
    BULLDOZER = "bulldozer"
    GRADER = "grader"
    LOADER = "loader"
    OTHER = "other"

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    type = Column(SQLEnum(VehicleType, name="vehicle_type", values_callable=lambda x: [e.value for e in x]), nullable=False)
    plate_number = Column(String, unique=True, nullable=False)
    make_model = Column(String, nullable=False)
    year = Column(String, nullable=True)
    tire_serials = Column(ARRAY(String))                     # List of tire serial numbers
    current_project_id = Column(String, ForeignKey("projects.id"), nullable=True)
    driver_id = Column(String, ForeignKey("drivers.id"), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    current_project = relationship("Project", back_populates="vehicles")
    driver = relationship("Driver", back_populates="vehicle", uselist=False)
    fuel_logs = relationship("FuelLog", back_populates="vehicle", cascade="all, delete-orphan")
    maintenance_logs = relationship("MaintenanceLog", back_populates="vehicle", cascade="all, delete-orphan")