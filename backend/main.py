from contextlib import asynccontextmanager
from typing import AsyncIterator
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.core.config import settings
from app.api.v1.api import api_router

# from fastapi_cache import FastAPICache  # TODO: Fix fastapi-cache2 import
# from fastapi_cache.backends.inmemory import InMemoryBackend  # TODO: Fix fastapi-cache2 import


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    """Initialize FastAPI cache on startup."""
    # FastAPICache.init(InMemoryBackend(), prefix="finvision-cache")  # TODO: Fix fastapi-cache2 setup
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

# Ensure validation errors return JSON responses instead of raising
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


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
        content={"message": "FinVision API", "version": "1.0.0", "docs": "/docs"}
    )


@app.get("/health")
async def health_check():
    return JSONResponse(content={"status": "healthy"})


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
