from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from pathlib import Path

router = APIRouter()

# Path to documentation files
# In Railway deployment, the working directory is /app
DOCS_PATH = Path("/app/docs/redocs")


@router.get("/")
async def docs_landing():
    """Serve the documentation landing page."""
    landing_file = DOCS_PATH / "landing.html"

    # Debug information for Railway deployment
    import os

    debug_info = {
        "docs_path": str(DOCS_PATH),
        "landing_file": str(landing_file),
        "file_exists": landing_file.exists(),
        "current_dir": os.getcwd(),
        "app_dir_contents": (
            list(Path("/app").iterdir()) if Path("/app").exists() else []
        ),
        "docs_dir_contents": (list(DOCS_PATH.iterdir()) if DOCS_PATH.exists() else []),
    }

    if not landing_file.exists():
        raise HTTPException(
            status_code=404, detail=f"Documentation not found. Debug: {debug_info}"
        )

    with open(landing_file, "r", encoding="utf-8") as f:
        content = f.read()

    return HTMLResponse(content=content)


@router.get("/landing")
async def docs_landing_redirect():
    """Redirect to the documentation landing page."""
    return RedirectResponse(url="/api/v1/docs/")


@router.get("/redoc")
async def docs_redoc():
    """Serve the ReDoc documentation."""
    redoc_file = DOCS_PATH / "index.html"
    if not redoc_file.exists():
        raise HTTPException(status_code=404, detail="ReDoc documentation not found")

    with open(redoc_file, "r", encoding="utf-8") as f:
        content = f.read()

    return HTMLResponse(content=content)


@router.get("/swagger")
async def docs_swagger():
    """Serve the Swagger UI documentation."""
    swagger_file = DOCS_PATH / "swagger.html"
    if not swagger_file.exists():
        raise HTTPException(status_code=404, detail="Swagger documentation not found")

    with open(swagger_file, "r", encoding="utf-8") as f:
        content = f.read()

    return HTMLResponse(content=content)


@router.get("/openapi.yaml")
async def get_openapi_spec():
    """Serve the OpenAPI specification."""
    openapi_file = Path("/app/docs/openapi.yaml")
    if not openapi_file.exists():
        raise HTTPException(status_code=404, detail="OpenAPI specification not found")

    return FileResponse(openapi_file, media_type="application/x-yaml")


@router.get("/postman")
async def get_postman_collection():
    """Serve the Postman collection."""
    postman_file = Path("/app/docs/FinVision_API.postman_collection.json")
    if not postman_file.exists():
        raise HTTPException(status_code=404, detail="Postman collection not found")

    return FileResponse(postman_file, media_type="application/json")


@router.get("/markdown")
async def get_markdown_docs():
    """Serve the comprehensive markdown documentation."""
    markdown_file = Path("/app/docs/API_DOCUMENTATION.md")
    if not markdown_file.exists():
        raise HTTPException(status_code=404, detail="Markdown documentation not found")

    return FileResponse(markdown_file, media_type="text/markdown")


@router.get("/readme")
async def get_readme_docs():
    """Serve the quick start guide."""
    readme_file = Path("/app/docs/API_README.md")
    if not readme_file.exists():
        raise HTTPException(status_code=404, detail="README documentation not found")

    return FileResponse(readme_file, media_type="text/markdown")


@router.get("/comprehensive")
async def docs_comprehensive():
    """Serve the comprehensive documentation page."""
    comprehensive_file = DOCS_PATH / "comprehensive.html"
    if not comprehensive_file.exists():
        raise HTTPException(
            status_code=404, detail="Comprehensive documentation not found"
        )

    with open(comprehensive_file, "r", encoding="utf-8") as f:
        content = f.read()

    return HTMLResponse(content=content)
