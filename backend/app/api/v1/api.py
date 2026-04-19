from fastapi import APIRouter
from .endpoints import auth, projects, vehicles, fuel, maintenance, drivers, supervisors, machine_sets, payroll

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(projects.router)
api_router.include_router(vehicles.router)
api_router.include_router(fuel.router)
api_router.include_router(maintenance.router)
api_router.include_router(drivers.router)
api_router.include_router(supervisors.router)
api_router.include_router(machine_sets.router)
api_router.include_router(payroll.router)