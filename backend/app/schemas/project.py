from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from uuid import uuid4
from ..core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    name = Column(String, nullable=False)                    # e.g. "Oloonkerin Road Project"
    location = Column(String, nullable=False)                # e.g. "Narok County"
    description = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    vehicles = relationship("Vehicle", back_populates="current_project")
    machine_sets = relationship("MachineSet", back_populates="project")