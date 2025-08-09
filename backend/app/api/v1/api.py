from app.api.v1.endpoints import (
    admin,
    auth,
    dashboard,
    files,
    lean_financial,
    mfa,
    notifications,
    oauth,
    parameters,
    scenarios,
    statements,
    tasks,
    webauthn,
)
from fastapi import APIRouter

api_router = APIRouter()

# Include authentication routes
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])

# Include MFA routes (both new and legacy prefixes)
api_router.include_router(mfa.router, prefix="/auth/mfa", tags=["multi-factor-auth"])
api_router.include_router(mfa.router, prefix="/mfa", tags=["multi-factor-auth"])

# Include OAuth routes
api_router.include_router(oauth.router, prefix="/auth/oauth", tags=["oauth"])

# Include WebAuthn routes (both new and legacy prefixes)
api_router.include_router(webauthn.router, prefix="/auth/webauthn", tags=["webauthn"])
api_router.include_router(webauthn.router, prefix="/webauthn", tags=["webauthn"])

# Include admin routes
api_router.include_router(admin.router, prefix="/admin", tags=["administration"])

# Include file upload routes
api_router.include_router(files.router, prefix="/files", tags=["file-upload"])

# Include dashboard routes
api_router.include_router(dashboard.router, prefix="/dashboard", tags=["dashboard"])

# Include parameter management routes
api_router.include_router(parameters.router, prefix="/parameters", tags=["parameters"])

# Include scenario management routes
api_router.include_router(scenarios.router, prefix="/scenarios", tags=["scenarios"])

# Include financial statements routes
api_router.include_router(
    statements.router, prefix="/statements", tags=["financial-statements"]
)

# Include lean financial modeling routes
api_router.include_router(
    lean_financial.router,
    prefix="/lean-financial",
    tags=["lean-financial-modeling"],
)

# Include notification routes
api_router.include_router(
    notifications.router, prefix="/notifications", tags=["notifications"]
)

# Include task status routes
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])


@api_router.get("/")
async def api_root():
    return {"message": "FinVision API v1"}


@api_router.get("/status")
async def api_status():
    return {"status": "operational", "version": "1.0.0"}
