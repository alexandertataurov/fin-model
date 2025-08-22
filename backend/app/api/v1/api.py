"""Simplified API router for tests.

This project contains many endpoints covering authentication, file uploads,
financial modeling, and more.  The unit tests in this kata exercise only touch
the administrative endpoints, but importing the full router pulls in optional
dependencies such as `pandas`, `pyotp`, and other heavy packages.  Those
dependencies are unnecessary for the tests and slow down installation.

To keep the test environment lightweight we expose a minimal router that only
includes the administrative modules required by the tests.  The production
application can still use a more feature-complete router, but for the unit
tests this trimmed version is sufficient.
"""

from fastapi import APIRouter

from app.api.v1.endpoints.admin import database, logs, system, users
from app.api.v1.endpoints import (
    auth,
    mfa,
    webauthn,
    oauth,
    files,
    dashboard,
    parameters,
    scenarios,
    statements,
    notifications,
    tasks,
    lean_financial,
    docs,
)


# Create API router
api_router = APIRouter()

# Include authentication routes
api_router.include_router(
    auth.router, prefix="/auth", tags=["authentication"]
)
api_router.include_router(
    mfa.router, prefix="/auth/mfa", tags=["authentication"]
)
api_router.include_router(
    webauthn.router, prefix="/auth/webauthn", tags=["authentication"]
)
api_router.include_router(
    oauth.router, prefix="/auth/oauth", tags=["authentication"]
)

# Include core application routes
api_router.include_router(
    dashboard.router, prefix="/dashboard", tags=["dashboard"]
)
api_router.include_router(files.router, prefix="/files", tags=["files"])
api_router.include_router(
    parameters.router, prefix="/parameters", tags=["parameters"]
)
api_router.include_router(
    scenarios.router, prefix="/scenarios", tags=["scenarios"]
)
api_router.include_router(
    statements.router, prefix="/statements", tags=["statements"]
)
api_router.include_router(
    notifications.router, prefix="/notifications", tags=["notifications"]
)
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

# Include lean financial modeling routes
api_router.include_router(
    lean_financial.router,
    prefix="/lean-financial",
    tags=["lean-financial"],
)

# Include admin routes
api_router.include_router(
    users.router, prefix="/admin", tags=["administration"]
)
api_router.include_router(
    system.router, prefix="/admin", tags=["administration"]
)
api_router.include_router(
    database.router, prefix="/admin", tags=["administration"]
)
api_router.include_router(
    logs.router, prefix="/admin", tags=["administration"]
)

# Include documentation routes
api_router.include_router(
    docs.router, prefix="/docs", tags=["documentation"]
)


@api_router.get("/")
async def api_root():
    """Root of the API router."""

    return {"message": "FinVision API v1"}


@api_router.get("/status")
async def api_status():
    """Basic status endpoint used in health checks."""

    return {"status": "operational", "version": "1.0.0"}
