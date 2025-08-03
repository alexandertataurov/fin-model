from contextlib import asynccontextmanager
from typing import AsyncIterator
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
import uvicorn
import logging

from app.core.config import settings
from app.api.v1.api import api_router
from app.middleware.monitoring_middleware import MonitoringMiddleware

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

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add monitoring middleware
app.add_middleware(MonitoringMiddleware)

# Ensure validation errors return JSON responses instead of raising


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = []
    for err in exc.errors():
        if "ctx" in err and isinstance(err["ctx"].get("error"), Exception):
            err = err.copy()
            err["ctx"] = {"error": str(err["ctx"]["error"])}
        errors.append(err)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": errors},
    )


# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)


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
    return JSONResponse(
        content={
            "status": "healthy",
            "cache_available": CACHE_AVAILABLE,
            "timestamp": "2025-08-03T13:42:50.867Z"
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
