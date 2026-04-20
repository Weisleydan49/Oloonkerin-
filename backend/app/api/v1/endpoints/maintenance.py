from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.maintenance_log import MaintenanceLog
from app.schemas.maintenance_log import MaintenanceLogCreate, MaintenanceLogResponse, MaintenanceLogUpdate
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

@router.put("/{log_id}", response_model=MaintenanceLogResponse)
async def update_maintenance_log(
    log_id: str,
    log_in: MaintenanceLogUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(MaintenanceLog).where(MaintenanceLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
        
    update_data = log_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(log, field, value)
        
    await db.commit()
    await db.refresh(log)
    return log

@router.delete("/{log_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_maintenance_log(
    log_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(MaintenanceLog).where(MaintenanceLog.id == log_id))
    log = result.scalar_one_or_none()
    if not log:
        raise HTTPException(status_code=404, detail="Maintenance log not found")
        
    await db.delete(log)
    await db.commit()
    return None