from fastapi import APIRouter
from app.api.v1.endpoints import auth, admin

api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# Include admin routes
api_router.include_router(admin.router, prefix="/admin", tags=["administration"])

@api_router.get("/")
async def api_root():
    return {"message": "FinVision API v1"}

@api_router.get("/status")
async def api_status():
    return {"status": "operational", "version": "1.0.0"} 