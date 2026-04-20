from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.fuel_log import FuelLog
from app.schemas.fuel_log import FuelLogCreate, FuelLogResponse, FuelLogUpdate
from sqlalchemy import select

router = APIRouter(prefix="/fuel", tags=["Fuel Logs"])

@router.post("/", response_model=FuelLogResponse)
async def create_fuel_log(
    fuel_in: FuelLogCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    fuel_log = FuelLog(
        **fuel_in.model_dump(),
        created_by_id=current_admin.id   # Link to logged-in admin
    )
    db.add(fuel_log)
    await db.commit()
    await db.refresh(fuel_log)
    return fuel_log

@router.get("/", response_model=List[FuelLogResponse])
async def list_fuel_logs(
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(FuelLog).order_by(FuelLog.date.desc()))
    return result.scalars().all()

@router.put("/{log_id}", response_model=FuelLogResponse)
async def update_fuel_log(
    log_id: str,
    log_in: FuelLogUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(FuelLog).where(FuelLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=404, detail="Fuel log not found")
        
    update_data = log_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(log, field, value)
        
    await db.commit()
    await db.refresh(log)
    return log

@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_fuel_log(
    log_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(FuelLog).where(FuelLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=404, detail="Fuel log not found")
        
    await db.delete(log)
    await db.commit()
    return None