from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from ...core.database import get_db
from ...core.dependencies import get_current_admin
from ...models.maintenance_log import MaintenanceLog
from ...schemas.maintenance_log import MaintenanceLogCreate, MaintenanceLogResponse
from sqlalchemy import select

router = APIRouter(prefix="/maintenance", tags=["Maintenance"])

@router.post("/", response_model=MaintenanceLogResponse)
async def create_maintenance_log(
    maint_in: MaintenanceLogCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    log = MaintenanceLog(
        **maint_in.model_dump(),
        created_by_id=current_admin.id
    )
    db.add(log)
    await db.commit()
    await db.refresh(log)
    return log

@router.get("/", response_model=List[MaintenanceLogResponse])
async def list_maintenance_logs(
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(MaintenanceLog).order_by(MaintenanceLog.date.desc()))
    return result.scalars().all()