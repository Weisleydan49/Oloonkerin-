from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.payroll_record import PayrollRecord
from app.schemas.payroll_record import PayrollRecordCreate, PayrollRecordUpdate, PayrollRecordResponse

router = APIRouter(prefix="/payroll", tags=["Payroll"])

@router.post("/", response_model=PayrollRecordResponse)
async def create_payroll_record(
    payroll_in: PayrollRecordCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    payroll = PayrollRecord(**payroll_in.model_dump())
    db.add(payroll)
    await db.commit()
    await db.refresh(payroll)
    return payroll

@router.get("/", response_model=List[PayrollRecordResponse])
async def list_payroll_records(
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(PayrollRecord).order_by(PayrollRecord.month.desc()))
    return result.scalars().all()

@router.put("/{record_id}", response_model=PayrollRecordResponse)
async def update_payroll_record(
    record_id: str,
    record_in: PayrollRecordUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(PayrollRecord).where(PayrollRecord.id == record_id))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Payroll record not found")
        
    update_data = record_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(record, field, value)
        
    await db.commit()
    await db.refresh(record)
    return record

@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_payroll_record(
    record_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(PayrollRecord).where(PayrollRecord.id == record_id))
    record = result.scalar_one_or_none()
    if not record:
        raise HTTPException(status_code=404, detail="Payroll record not found")
        
    await db.delete(record)
    await db.commit()
    return None
