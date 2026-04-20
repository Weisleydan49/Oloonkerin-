from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.supervisor import Supervisor
from app.schemas.supervisor import SupervisorCreate, SupervisorUpdate, SupervisorResponse

router = APIRouter(prefix="/supervisors", tags=["Supervisors"])

@router.post("/", response_model=SupervisorResponse)
async def create_supervisor(
    supervisor_in: SupervisorCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    supervisor = Supervisor(**supervisor_in.model_dump())
    db.add(supervisor)
    await db.commit()
    await db.refresh(supervisor)
    return supervisor

@router.get("/", response_model=List[SupervisorResponse])
async def list_supervisors(
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(Supervisor).where(Supervisor.is_active == True))
    return result.scalars().all()

@router.get("/{supervisor_id}", response_model=SupervisorResponse)
async def get_supervisor(
    supervisor_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(Supervisor).where(Supervisor.id == supervisor_id))
    supervisor = result.scalar_one_or_none()
    if not supervisor:
        raise HTTPException(status_code=404, detail="Supervisor not found")
    return supervisor
