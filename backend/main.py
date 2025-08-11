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
    logger.info(f"fastapi_cache2 not available: {e}. Using Redis caching instead.")
    # Create dummy classes for fallback

    class FastAPICache:
        @staticmethod
        def init(*args, **kwargs):
            logger.warning("Cache initialization skipped - fastapi_cache not available")

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

# Set up CORS with explicit origins
cors_origins = settings.get_cors_origins()
logger.info("CORS origins configured: %s", cors_origins)

# If we have wildcard, use it directly
if "*" in cors_origins:
    cors_origins = ["*"]
    allow_credentials = False
else:
    allow_credentials = True

# Regex to allow any Netlify/Railway subdomain and Netlify deploy-preview style
cors_origin_regex = (
    r"^https://[A-Za-z0-9-]+\.[A-Za-z0-9-]+\.(netlify|railway)\.app$|"
    r"^https://[A-Za-z0-9-]+--[A-Za-z0-9-]+\.netlify\.app$|"
    r"^https://pre-production--advanced-financial-modeling\.netlify\.app$"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    # Allow any Netlify/Railway subdomain via regex
    allow_origin_regex=cors_origin_regex,
    allow_credentials=allow_credentials,
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


def make_json_serializable(obj):
    """Recursively convert non-JSON-serializable objects to strings."""
    if isinstance(obj, bytes):
        return obj.decode("utf-8", errors="ignore")
    elif isinstance(obj, dict):
        return {k: make_json_serializable(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_serializable(item) for item in obj]
    elif isinstance(obj, Exception):
        return str(obj)
    elif hasattr(obj, "__dict__"):
        # For objects with attributes, convert to string
        return str(obj)
    else:
        return obj


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request, exc):
    errors = []
    for err in exc.errors():
        # Make a deep copy and ensure all data is JSON serializable
        clean_err = make_json_serializable(err)
        errors.append(clean_err)
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
            "cache_status": ("enabled" if CACHE_AVAILABLE else "disabled"),
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
            "cache_status": "enabled" if CACHE_AVAILABLE else "disabled",
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
            "allow_credentials": allow_credentials,
            "cors_origin_regex": cors_origin_regex,
            "message": "CORS test successful",
        }
    )


@app.get("/cors-test")
async def cors_test():
    """Simple CORS test endpoint."""
    return JSONResponse(
        content={
            "message": "CORS is working!",
            "timestamp": datetime.utcnow().isoformat(),
        }
    )


@app.get("/db-test")
async def db_test():
    """Simple database test endpoint."""
    try:
        from sqlalchemy import create_engine, text
        from app.core.config import settings

        engine = create_engine(settings.DATABASE_URL)
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1 as test"))
            test_value = result.fetchone()[0]

        return JSONResponse(
            content={
                "message": "Database connection successful!",
                "test_value": test_value,
                "timestamp": datetime.utcnow().isoformat(),
            }
        )
    except Exception as e:
        return JSONResponse(
            content={
                "message": "Database connection failed!",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            },
            status_code=500,
        )


@app.get("/schema-check")
async def schema_check():
    """Check database schema for missing columns."""
    try:
        from sqlalchemy import create_engine, text
        from app.core.config import settings

        engine = create_engine(settings.DATABASE_URL)
        issues = []

        with engine.connect() as conn:
            # Check uploaded_files table
            try:
                result = conn.execute(
                    text("SELECT stored_filename FROM uploaded_files LIMIT 1")
                )
                result.fetchone()
            except Exception as e:
                if "column" in str(e).lower() and "does not exist" in str(e).lower():
                    issues.append("uploaded_files.stored_filename column missing")

            # Check other potential issues
            try:
                result = conn.execute(text("SELECT COUNT(*) FROM uploaded_files"))
                result.fetchone()
            except Exception as e:
                issues.append(f"uploaded_files table issue: {str(e)}")

        return JSONResponse(
            content={
                "message": "Schema check completed",
                "issues": issues,
                "timestamp": datetime.utcnow().isoformat(),
            }
        )
    except Exception as e:
        return JSONResponse(
            content={
                "message": "Schema check failed!",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat(),
            },
            status_code=500,
        )


# Note: Let CORSMiddleware handle OPTIONS automatically.


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
