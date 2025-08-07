from contextlib import asynccontextmanager
from typing import AsyncIterator
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uvicorn
import logging
import os
from datetime import datetime

from app.core.config import settings
from app.api.v1.api import api_router
from app.api.v1.endpoints.websocket import router as websocket_router
# Temporarily disable monitoring middleware
# from app.middleware.monitoring_middleware import MonitoringMiddleware

# Configure logging
logger = logging.getLogger(__name__)

# Try to import fastapi_cache, fallback gracefully if not available
try:
    from fastapi_cache2 import FastAPICache
    from fastapi_cache2.backends.inmemory import InMemoryBackend
    CACHE_AVAILABLE = True
    logger.info("fastapi_cache2 is available and will be used for caching")
except ImportError as e:
    CACHE_AVAILABLE = False
    logger.info(
        f"fastapi_cache2 not available: {e}. Using Redis caching instead."
    )
    # Create dummy classes for fallback

    class FastAPICache:
        @staticmethod
        def init(*args, **kwargs):
            logger.warning(
                "Cache initialization skipped - fastapi_cache not available"
            )

    class InMemoryBackend:
        pass


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Initialize FastAPI cache on startup."""
    if CACHE_AVAILABLE:
        try:
            FastAPICache.init(InMemoryBackend(), prefix="finvision-cache")
            logger.info("FastAPI cache initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize cache: {e}")
    else:
        logger.info("Cache initialization skipped")
    yield


app = FastAPI(
    title="FinVision API",
    description="Financial Modeling and Analysis Platform API",
    version="1.0.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)

# Set up CORS with enhanced configuration
cors_origins = settings.get_cors_origins()
logger.info(f"CORS origins configured: {cors_origins}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now to fix CORS issues
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=[
        "Accept",
        "Accept-Language",
        "Content-Language",
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-CSRF-Token",
        "X-API-Key",
        "Origin",
        "Access-Control-Request-Method",
        "Access-Control-Request-Headers",
    ],
    expose_headers=["Content-Length", "Content-Range"],
    max_age=86400,  # 24 hours
)

# Add monitoring middleware - temporarily disabled
# app.add_middleware(MonitoringMiddleware)

# Ensure validation errors return JSON responses instead of raising


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = []
    for err in exc.errors():
        err = err.copy()
        # Handle ctx field with exception objects
        if "ctx" in err and isinstance(err["ctx"].get("error"), Exception):
            err["ctx"] = {"error": str(err["ctx"]["error"])}
        # Handle input field that might contain bytes
        if "input" in err and isinstance(err["input"], bytes):
            err["input"] = err["input"].decode('utf-8', errors='ignore')
        errors.append(err)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors},
    )


# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Include WebSocket routes directly (bypass authentication)
app.include_router(websocket_router, prefix="/ws", tags=["websocket"])


@app.get("/")
async def root():
    return JSONResponse(
        content={
            "message": "FinVision API", 
            "version": "1.0.0",
            "status": "running",
            "cache_status": "enabled" if CACHE_AVAILABLE else "disabled"
        }
    )


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring."""
    return JSONResponse(
        content={
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "version": "1.0.0",
            "cache_status": "enabled" if CACHE_AVAILABLE else "disabled"
        }
    )


@app.get("/cors-debug")
async def cors_debug():
    """Debug endpoint to check CORS configuration."""
    return JSONResponse(
        content={
            "cors_origins": settings.get_cors_origins(),
            "raw_cors_origins": settings.BACKEND_CORS_ORIGINS,
            "frontend_url": settings.FRONTEND_URL,
            "environment": os.getenv("ENV", "development"),
        }
    )


@app.options("/{full_path:path}")
async def cors_preflight(full_path: str):
    """Handle CORS preflight requests for all paths."""
    return JSONResponse(
        content={"message": "CORS preflight successful"},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": (
                "GET, POST, PUT, DELETE, OPTIONS, PATCH"
            ),
            "Access-Control-Allow-Headers": (
                "Content-Type, Authorization, X-Requested-With"
            ),
            "Access-Control-Max-Age": "86400",
        }
    )


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
