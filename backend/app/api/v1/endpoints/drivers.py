from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.models.driver import Driver
from app.schemas.driver import DriverCreate, DriverUpdate, DriverResponse

router = APIRouter(prefix="/drivers", tags=["Drivers"])

@router.post("/", response_model=DriverResponse)
async def create_driver(
    driver_in: DriverCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    driver = Driver(**driver_in.model_dump())
    db.add(driver)
    await db.commit()
    await db.refresh(driver)
    return driver

@router.get("/", response_model=List[DriverResponse])
async def list_drivers(
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(Driver).where(Driver.is_active == True))
    return result.scalars().all()

@router.get("/{driver_id}", response_model=DriverResponse)
async def get_driver(
    driver_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    return driver

@router.put("/{driver_id}", response_model=DriverResponse)
async def update_driver(
    driver_id: str,
    driver_in: DriverUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    update_data = driver_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(driver, field, value)
        
    await db.commit()
    await db.refresh(driver)
    return driver

@router.delete("/{driver_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_driver(
    driver_id: str,
    db: AsyncSession = Depends(get_db),
    current_admin: dict = Depends(get_current_admin)
):
    result = await db.execute(select(Driver).where(Driver.id == driver_id))
    driver = result.scalar_one_or_none()
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
        
    # Soft delete
    driver.is_active = False
    await db.commit()
    return None
