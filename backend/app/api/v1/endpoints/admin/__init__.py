from fastapi import APIRouter

from . import database, logs, system, users

router = APIRouter()

router.include_router(users.router)
router.include_router(system.router)
router.include_router(database.router)
router.include_router(logs.router)

__all__ = ["router"]
