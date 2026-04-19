from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
from ..core.database import Base

# Many-to-Many association table: MachineSet <-> Vehicle
machine_set_vehicles = Table(
    "machine_set_vehicles",
    Base.metadata,
    Column("machine_set_id", String, ForeignKey("machine_sets.id"), primary_key=True),
    Column("vehicle_id", String, ForeignKey("vehicles.id"), primary_key=True),
)

class MachineSet(Base):
    __tablename__ = "machine_sets"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    supervisor_id = Column(String, ForeignKey("supervisors.id"), nullable=False)
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    target_value = Column(Numeric(12, 2), nullable=False)      # e.g. 1200.00
    target_unit = Column(String, nullable=False)               # "trips", "cubic meters", "hours"
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    supervisor = relationship("Supervisor", back_populates="machine_sets")
    project = relationship("Project", back_populates="machine_sets")
    vehicles = relationship("Vehicle", secondary=machine_set_vehicles, backref="machine_sets")
