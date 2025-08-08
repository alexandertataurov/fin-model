from typing import Any, List, Optional
from fastapi import (
    APIRouter,
    Depends,
    UploadFile,
    File,
    HTTPException,
    status,
    Query,
)
from fastapi.responses import FileResponse, Response
from sqlalchemy.orm import Session

from app.models.base import get_db
from app.models.user import User
from app.models.file import FileStatus
from app.schemas.file import (
    FileUploadResponse,
    FileInfo,
    FileListResponse,
    FileWithLogs,
    ProcessingLogEntry,
    FileProcessingRequest,
)
from app.schemas.financial import FilePreviewResponse
from app.services.file_service import FileService
from app.api.v1.endpoints.auth import get_current_active_user
from app.core.dependencies import require_permissions
from app.core.permissions import Permission

router = APIRouter()


def get_file_service(db: Session = Depends(get_db)) -> FileService:
    """Dependency to get file service."""
    return FileService(db)


@router.post(
    "/upload",
    response_model=FileUploadResponse,
    status_code=status.HTTP_201_CREATED,
)
async def upload_file(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Upload a new file.
    """
    try:
        uploaded_file = await file_service.save_uploaded_file(
            file, current_user
        )
        return FileUploadResponse.from_orm(uploaded_file)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}",
        )


@router.get("/", response_model=List[FileInfo])
def list_files(
    skip: int = Query(0, ge=0, description="Number of files to skip"),
    limit: int = Query(
        100, ge=1, le=1000, description="Number of files to return"
    ),
    status_filter: Optional[FileStatus] = Query(
        None, description="Filter by file status"
    ),
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Get list of uploaded files for the current user.
    """
    result = file_service.get_user_files(
        user=current_user,
        skip=skip,
        limit=limit,
        status_filter=status_filter,
    )

    return [FileInfo.from_orm(f) for f in result["files"]]


@router.get("/{file_id}", response_model=FileInfo)
def get_file_info(
    file_id: str,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Get information about a specific file.
    """
    if not file_id.isdigit():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid file id",
        )
    file_record = file_service.get_file_by_id(int(file_id), current_user)

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    return FileInfo.from_orm(file_record)


@router.get("/{file_id}/logs", response_model=List[ProcessingLogEntry])
def get_file_logs(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Get processing logs for a specific file.
    """
    logs = file_service.get_file_logs(file_id, current_user)
    return [ProcessingLogEntry.from_orm(log) for log in logs]


@router.get("/{file_id}/details", response_model=FileWithLogs)
def get_file_with_logs(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Get detailed file information including processing logs.
    """
    file_record = file_service.get_file_by_id(file_id, current_user)

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    logs = file_service.get_file_logs(file_id, current_user)

    file_info = FileInfo.from_orm(file_record)
    return FileWithLogs(
        **file_info.dict(),
        processing_logs=[ProcessingLogEntry.from_orm(log) for log in logs],
    )


@router.get("/{file_id}/status")
def get_file_status(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """Return simple processing status information for a file."""
    file_record = file_service.get_file_by_id(file_id, current_user)
    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )
    return {"status": file_record.status}


@router.get("/{file_id}/data")
def get_file_data(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """Return parsed data for a processed file if available."""
    file_record = file_service.get_file_by_id(file_id, current_user)
    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )
    if not file_record.parsed_data:
        # Tests expect an empty JSON payload rather than a 404 when a file has
        # completed processing but no parsed data was stored.
        return {"financial_data": {}}
    import json

    try:
        return json.loads(file_record.parsed_data)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to parse stored data",
        )


@router.get("/{file_id}/download")
def download_file(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> FileResponse:
    """
    Download a specific file.
    """
    file_record = file_service.get_file_by_id(file_id, current_user)

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    file_path = file_service.get_file_path(file_id, current_user)

    if not file_path:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="File not found on disk",
        )

    return FileResponse(
        path=file_path,
        filename=file_record.original_filename,
        media_type=file_record.mime_type,
    )


@router.delete("/{file_id}")
def delete_file(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Delete a specific file.
    """
    success = file_service.delete_file(file_id, current_user)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.post("/{file_id}/process")
def trigger_file_processing(
    file_id: int,
    request: FileProcessingRequest,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Trigger processing for a specific file.
    """
    from app.tasks.file_processing import process_uploaded_file

    file_record = file_service.get_file_by_id(file_id, current_user)

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    if file_record.status == FileStatus.PROCESSING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is already being processed",
        )

    # Log processing request
    file_service.log_processing_step(
        file_id,
        "processing_requested",
        f"Processing requested by user {current_user.username}",
        "info",
    )

    # Queue background processing task with Celery
    task = process_uploaded_file.delay(file_id, request.processing_options)

    # Log task creation
    file_service.log_processing_step(
        file_id,
        "task_queued",
        f"Background processing task queued with ID: {task.id}",
        "info",
    )

    return {
        "message": "File processing started",
        "file_id": file_id,
        "task_id": task.id,
    }


@router.post("/{file_id}/cancel")
def cancel_file_processing(
    file_id: int,
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Cancel processing for a specific file.
    """
    from app.core.celery_app import celery_app

    file_record = file_service.get_file_by_id(file_id, current_user)

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    if file_record.status != FileStatus.PROCESSING:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File is not currently being processed",
        )

    # Try to revoke the Celery task
    # Note: This requires finding the task ID, which we should store in the database
    # For now, just update the status

    # Update status to cancelled
    file_service.update_file_status(file_id, FileStatus.CANCELLED)

    # Log cancellation
    file_service.log_processing_step(
        file_id,
        "processing_cancelled",
        f"Processing cancelled by user {current_user.username}",
        "warning",
    )

    return {"message": "File processing cancelled", "file_id": file_id}


@router.get("/task/{task_id}/status")
def get_task_status(
    task_id: str, current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get the status of a processing task.
    """
    from app.tasks.file_processing import get_processing_status

    try:
        status_info = get_processing_status(task_id)
        return status_info
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get task status: {str(e)}",
        )


@router.get("/{file_id}/preview", response_model=FilePreviewResponse)
def get_file_preview(
    file_id: int,
    max_rows: int = Query(
        10, ge=1, le=100, description="Maximum rows to preview per sheet"
    ),
    current_user: User = Depends(get_current_active_user),
    file_service: FileService = Depends(get_file_service),
) -> Any:
    """
    Get a preview of the first few rows of an Excel file.
    """
    file_record = file_service.get_file_by_id(file_id, current_user)

    if not file_record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="File not found"
        )

    # Check if file is Excel
    if file_record.file_type not in ["excel"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File preview is only available for Excel files",
        )

    try:
        from app.services.excel_parser import ExcelParser

        parser = ExcelParser()

        # Get basic file structure
        sheets_data = parser.parse(file_record.file_path)

        # Generate preview data
        preview_sheets = []
        detected_statements = []

        for sheet_name, df in sheets_data.items():
            # Get preview rows
            preview_data = (
                df.head(max_rows).to_dict("records")
                if not df.empty
                else []
            )

            sheet_info = {
                "name": sheet_name,
                "row_count": len(df),
                "column_count": len(df.columns) if not df.empty else 0,
                "columns": list(df.columns) if not df.empty else [],
                "preview_data": preview_data,
            }
            preview_sheets.append(sheet_info)

            # Try to detect statement type
            try:
                # Use simplified detection for preview
                sheet_name_lower = sheet_name.lower()
                if any(
                    keyword in sheet_name_lower
                    for keyword in [
                        "profit",
                        "loss",
                        "income",
                        "p&l",
                        "pnl",
                    ]
                ):
                    detected_statements.append(
                        {
                            "sheet_name": sheet_name,
                            "statement_type": "PROFIT_LOSS",
                            "confidence": 0.8,
                        }
                    )
                elif any(
                    keyword in sheet_name_lower
                    for keyword in ["balance", "sheet", "position"]
                ):
                    detected_statements.append(
                        {
                            "sheet_name": sheet_name,
                            "statement_type": "BALANCE_SHEET",
                            "confidence": 0.8,
                        }
                    )
                elif any(
                    keyword in sheet_name_lower
                    for keyword in ["cash", "flow", "cf"]
                ):
                    detected_statements.append(
                        {
                            "sheet_name": sheet_name,
                            "statement_type": "CASH_FLOW",
                            "confidence": 0.8,
                        }
                    )
            except Exception:
                # Ignore detection errors in preview
                pass

        return FilePreviewResponse(
            file_id=file_id,
            file_name=file_record.original_filename,
            sheets=preview_sheets,
            preview_data={"max_rows_per_sheet": max_rows},
            detected_statements=detected_statements,
            metadata={
                "file_size": file_record.file_size,
                "upload_date": file_record.upload_date.isoformat()
                if file_record.upload_date
                else None,
                "total_sheets": len(preview_sheets),
            },
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate file preview: {str(e)}",
        )
