from fastapi import APIRouter
from app.api.v1.endpoints import auth, admin, files, websocket, analytics, admin_tools

api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# Include admin routes
api_router.include_router(admin.router, prefix="/admin", tags=["administration"])

# Include file upload routes
api_router.include_router(files.router, prefix="/files", tags=["file-upload"])

# Include analytics routes
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"])

# Include admin tools routes
api_router.include_router(admin_tools.router, prefix="/admin-tools", tags=["admin-tools"])

# Include WebSocket routes
api_router.include_router(websocket.router, tags=["websocket"])

@api_router.get("/")
async def api_root():
    return {"message": "FinVision API v1"}

@api_router.get("/status")
async def api_status():
    return {"status": "operational", "version": "1.0.0"} 