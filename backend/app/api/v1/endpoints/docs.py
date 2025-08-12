from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, HTMLResponse, RedirectResponse
from pathlib import Path
import os

router = APIRouter()


# Path to documentation files - try multiple possible locations
def get_docs_path():
    """Get the correct docs path by trying multiple possible locations."""
    possible_paths = [
        Path("/app/backend/app/docs/redocs"),  # Railway deployment
        Path("backend/app/docs/redocs"),  # Local development from root
        Path("app/docs/redocs"),  # From backend directory
        Path("docs/redocs"),  # From backend directory
        Path("../docs/redocs"),  # Alternative local path
        Path("./docs/redocs"),  # Current directory relative
    ]

    for path in possible_paths:
        if path.exists() and path.is_dir():
            return path

    # If none found, return the default and let the error handler deal with it
    return Path("/app/backend/app/docs/redocs")


DOCS_PATH = get_docs_path()


@router.get("/")
async def docs_landing():
    """Serve the documentation landing page."""
    landing_file = DOCS_PATH / "landing.html"

    # Debug information for troubleshooting
    debug_info = {
        "docs_path": str(DOCS_PATH),
        "landing_file": str(landing_file),
        "file_exists": landing_file.exists(),
        "current_dir": os.getcwd(),
        "app_dir_contents": [],
        "docs_dir_contents": [],
    }

    # Only add directory contents if directories exist to avoid errors
    if Path("/app").exists():
        debug_info["app_dir_contents"] = [str(p) for p in Path("/app").iterdir()][
            :10
        ]  # Limit to first 10

    if DOCS_PATH.exists():
        debug_info["docs_dir_contents"] = [str(p) for p in DOCS_PATH.iterdir()]

    if not landing_file.exists():
        # Try alternative locations
        alt_paths = [
            Path("backend/app/docs/redocs/landing.html"),
            Path("app/docs/redocs/landing.html"),
            Path("docs/redocs/landing.html"),
            Path("../docs/redocs/landing.html"),
            Path("./docs/redocs/landing.html"),
        ]

        for alt_path in alt_paths:
            if alt_path.exists():
                landing_file = alt_path
                break
        else:
            raise HTTPException(
                status_code=404, detail=f"Documentation not found. Debug: {debug_info}"
            )

    try:
        with open(landing_file, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(content=content)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading documentation file: {str(e)}"
        )


@router.get("/landing")
async def docs_landing_redirect():
    """Redirect to the documentation landing page."""
    return RedirectResponse(url="/api/v1/docs/")


@router.get("/redoc")
async def docs_redoc():
    """Serve the ReDoc documentation."""
    redoc_file = DOCS_PATH / "index.html"

    # Try alternative locations if not found
    if not redoc_file.exists():
        alt_paths = [
            Path("backend/app/docs/redocs/index.html"),
            Path("app/docs/redocs/index.html"),
            Path("docs/redocs/index.html"),
            Path("../docs/redocs/index.html"),
            Path("./docs/redocs/index.html"),
        ]

        for alt_path in alt_paths:
            if alt_path.exists():
                redoc_file = alt_path
                break
        else:
            raise HTTPException(status_code=404, detail="ReDoc documentation not found")

    try:
        with open(redoc_file, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(content=content)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading ReDoc file: {str(e)}"
        )


@router.get("/swagger")
async def docs_swagger():
    """Serve the Swagger UI documentation."""
    swagger_file = DOCS_PATH / "swagger.html"

    # Try alternative locations if not found
    if not swagger_file.exists():
        alt_paths = [
            Path("backend/app/docs/redocs/swagger.html"),
            Path("app/docs/redocs/swagger.html"),
            Path("docs/redocs/swagger.html"),
            Path("../docs/redocs/swagger.html"),
            Path("./docs/redocs/swagger.html"),
        ]

        for alt_path in alt_paths:
            if alt_path.exists():
                swagger_file = alt_path
                break
        else:
            raise HTTPException(
                status_code=404, detail="Swagger documentation not found"
            )

    try:
        with open(swagger_file, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(content=content)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading Swagger file: {str(e)}"
        )


@router.get("/openapi.yaml")
async def get_openapi_spec():
    """Serve the OpenAPI specification."""
    # Try multiple possible locations for the OpenAPI spec
    possible_paths = [
        Path("/app/backend/app/docs/openapi.yaml"),
        Path("backend/app/docs/openapi.yaml"),
        Path("app/docs/openapi.yaml"),
        Path("docs/openapi.yaml"),
        Path("../docs/openapi.yaml"),
        Path("./docs/openapi.yaml"),
    ]

    openapi_file = None
    for path in possible_paths:
        if path.exists():
            openapi_file = path
            break

    if not openapi_file:
        raise HTTPException(status_code=404, detail="OpenAPI specification not found")

    return FileResponse(openapi_file, media_type="application/x-yaml")


@router.get("/postman")
async def get_postman_collection():
    """Serve the Postman collection."""
    # Try multiple possible locations for the Postman collection
    possible_paths = [
        Path("/app/backend/app/docs/FinVision_API.postman_collection.json"),
        Path("backend/app/docs/FinVision_API.postman_collection.json"),
        Path("app/docs/FinVision_API.postman_collection.json"),
        Path("docs/FinVision_API.postman_collection.json"),
        Path("../docs/FinVision_API.postman_collection.json"),
        Path("./docs/FinVision_API.postman_collection.json"),
    ]

    postman_file = None
    for path in possible_paths:
        if path.exists():
            postman_file = path
            break

    if not postman_file:
        raise HTTPException(status_code=404, detail="Postman collection not found")

    return FileResponse(postman_file, media_type="application/json")


@router.get("/markdown")
async def get_markdown_docs():
    """Serve the comprehensive markdown documentation."""
    # Try multiple possible locations for the markdown docs
    possible_paths = [
        Path("/app/backend/app/docs/API_DOCUMENTATION.md"),
        Path("backend/app/docs/API_DOCUMENTATION.md"),
        Path("app/docs/API_DOCUMENTATION.md"),
        Path("docs/API_DOCUMENTATION.md"),
        Path("../docs/API_DOCUMENTATION.md"),
        Path("./docs/API_DOCUMENTATION.md"),
    ]

    markdown_file = None
    for path in possible_paths:
        if path.exists():
            markdown_file = path
            break

    if not markdown_file:
        raise HTTPException(status_code=404, detail="Markdown documentation not found")

    return FileResponse(markdown_file, media_type="text/markdown")


@router.get("/readme")
async def get_readme_docs():
    """Serve the quick start guide."""
    # Try multiple possible locations for the README
    possible_paths = [
        Path("/app/backend/app/docs/API_README.md"),
        Path("backend/app/docs/API_README.md"),
        Path("app/docs/API_README.md"),
        Path("docs/API_README.md"),
        Path("../docs/API_README.md"),
        Path("./docs/API_README.md"),
    ]

    readme_file = None
    for path in possible_paths:
        if path.exists():
            readme_file = path
            break

    if not readme_file:
        raise HTTPException(status_code=404, detail="README documentation not found")

    return FileResponse(readme_file, media_type="text/markdown")


@router.get("/comprehensive")
async def docs_comprehensive():
    """Serve the comprehensive documentation page."""
    comprehensive_file = DOCS_PATH / "comprehensive.html"

    # Try alternative locations if not found
    if not comprehensive_file.exists():
        alt_paths = [
            Path("backend/app/docs/redocs/comprehensive.html"),
            Path("app/docs/redocs/comprehensive.html"),
            Path("docs/redocs/comprehensive.html"),
            Path("../docs/redocs/comprehensive.html"),
            Path("./docs/redocs/comprehensive.html"),
        ]

        for alt_path in alt_paths:
            if alt_path.exists():
                comprehensive_file = alt_path
                break
        else:
            raise HTTPException(
                status_code=404, detail="Comprehensive documentation not found"
            )

    try:
        with open(comprehensive_file, "r", encoding="utf-8") as f:
            content = f.read()
        return HTMLResponse(content=content)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error reading comprehensive docs: {str(e)}"
        )
