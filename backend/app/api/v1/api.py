from fastapi import APIRouter

api_router = APIRouter()

@api_router.get("/")
async def api_root():
    return {"message": "FinVision API v1"}

@api_router.get("/status")
async def api_status():
    return {"status": "operational", "version": "1.0.0"} 