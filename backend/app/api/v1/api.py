from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    mfa,
    oauth,
    webauthn,
    admin,
    files,
    dashboard,
    parameters,
    scenarios,
    statements,
    lean_financial,
    notifications,
)
api_router = APIRouter()

# Include authentication routes
api_router.include_router(
    auth.router, prefix="/auth", tags=["authentication"]
)

# Include MFA routes
api_router.include_router(
    mfa.router, prefix="/auth/mfa", tags=["multi-factor-auth"]
)

# Include OAuth routes
api_router.include_router(
    oauth.router, prefix="/auth/oauth", tags=["oauth"]
)

# Include WebAuthn routes
api_router.include_router(
    webauthn.router, prefix="/auth/webauthn", tags=["webauthn"]
)

# Include admin routes
api_router.include_router(
    admin.router, prefix="/admin", tags=["administration"]
)

# Include file upload routes
api_router.include_router(
    files.router, prefix="/files", tags=["file-upload"]
)

# Include dashboard routes
api_router.include_router(
    dashboard.router, prefix="/dashboard", tags=["dashboard"]
)

# Include parameter management routes
api_router.include_router(
    parameters.router, prefix="/parameters", tags=["parameters"]
)

# Include scenario management routes
api_router.include_router(
    scenarios.router, prefix="/scenarios", tags=["scenarios"]
)

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


@api_router.get("/")
async def api_root():
    return {"message": "FinVision API v1"}


@api_router.get("/status")
async def api_status():
    return {"status": "operational", "version": "1.0.0"}
