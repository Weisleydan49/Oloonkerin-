from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from ...core.database import get_db
from ...core.dependencies import get_current_admin
from ...models.payroll_record import PayrollRecord
from ...schemas.payroll_record import PayrollRecordCreate, PayrollRecordUpdate, PayrollRecordResponse

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
