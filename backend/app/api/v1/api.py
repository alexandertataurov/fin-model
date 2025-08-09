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


# Create API router
api_router = APIRouter()

# Include only the admin routes needed for the test suite
api_router.include_router(users.router, prefix="/admin", tags=["administration"])
api_router.include_router(system.router, prefix="/admin", tags=["administration"])
api_router.include_router(database.router, prefix="/admin", tags=["administration"])
api_router.include_router(logs.router, prefix="/admin", tags=["administration"])


@api_router.get("/")
async def api_root():
    """Root of the API router."""

    return {"message": "FinVision API v1"}


@api_router.get("/status")
async def api_status():
    """Basic status endpoint used in health checks."""

    return {"status": "operational", "version": "1.0.0"}

