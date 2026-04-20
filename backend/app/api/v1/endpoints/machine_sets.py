from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.machine_set import MachineSet
from app.schemas.machine_set import MachineSetCreate, MachineSetUpdate, MachineSetResponse

router = APIRouter(prefix="/machine-sets", tags=["Machine Sets"])

@router.post("/", response_model=MachineSetResponse)
async def create_machine_set(
    set_in: MachineSetCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    machine_set = MachineSet(**set_in.model_dump())
    db.add(machine_set)
    await db.commit()
    await db.refresh(machine_set)
    return machine_set

@router.get("/", response_model=List[MachineSetResponse])
async def list_machine_sets(
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(MachineSet))
    return result.scalars().all()
