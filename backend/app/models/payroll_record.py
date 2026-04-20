from sqlalchemy import Column, String, ForeignKey, Numeric, DateTime, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from uuid import uuid4
import enum
from ..core.database import Base

class EmployeeType(str, enum.Enum):
    DRIVER = "driver"
    SUPERVISOR = "supervisor"

class PayrollRecord(Base):
    __tablename__ = "payroll_records"

    id = Column(String, primary_key=True, default=lambda: str(uuid4()))
    month = Column(DateTime, nullable=False)                    # First day of the month
    employee_id = Column(String, nullable=False)
    employee_type = Column(SQLEnum(EmployeeType), nullable=False)
    basic_salary = Column(Numeric(12, 2), nullable=False)
    allowances = Column(Numeric(12, 2), default=0)
    sha = Column(Numeric(10, 2), default=0)                     # Social Health Authority
    nssf = Column(Numeric(10, 2), default=0)                    # National Social Security Fund
    net_pay = Column(Numeric(12, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships (one of these will be populated)
    driver = relationship(
        "Driver",
        primaryjoin="and_(PayrollRecord.employee_id==Driver.id, PayrollRecord.employee_type=='driver')",
        foreign_keys="[PayrollRecord.employee_id]",
        back_populates="payroll_records",
        uselist=False,
        viewonly=True
    )
    supervisor = relationship(
        "Supervisor",
        primaryjoin="and_(PayrollRecord.employee_id==Supervisor.id, PayrollRecord.employee_type=='supervisor')",
        foreign_keys="[PayrollRecord.employee_id]",
        back_populates="payroll_records",
        uselist=False,
        viewonly=True
    )