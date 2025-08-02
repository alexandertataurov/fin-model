from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    admin,
    files,
    websocket,
    analytics,
    admin_tools,
    dashboard,
    parameters,
    scenarios,
    reports,
    statements,
)
from app.core.config import settings

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
api_router.include_router(
    admin_tools.router, prefix="/admin-tools", tags=["admin-tools"]
)

# Include dashboard routes
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

# Include parameter management routes
api_router.include_router(parameters.router, prefix="/parameters", tags=["parameters"])

# Include scenario management routes
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["scenarios"])

# Include report generation routes
api_router.include_router(reports.router, prefix="/reports", tags=["reports"])

# Include financial statements routes
api_router.include_router(
    statements.router, prefix="/statements", tags=["financial-statements"]
)

# Include WebSocket routes
api_router.include_router(websocket.router, tags=["websocket"])

try:
    from app.api.v1.endpoints import test_utils
    if getattr(settings, 'ENV', 'development') in ['development', 'dev', 'test', 'testing']:
        api_router.include_router(test_utils.router, prefix="", tags=["test-utils"])
except ImportError:
    pass


@api_router.get("/")
async def api_root():
    return {"message": "FinVision API v1"}


@api_router.get("/status")
async def api_status():
    return {"status": "operational", "version": "1.0.0"}
