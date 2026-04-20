from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.fuel_log import FuelLog
from app.schemas.fuel_log import FuelLogCreate, FuelLogResponse
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