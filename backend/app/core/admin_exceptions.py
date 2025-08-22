"""
Centralized exception handling for admin API operations.
"""
from typing import Dict, Any, Optional
from fastapi import HTTPException, status
import logging

logger = logging.getLogger(__name__)


class AdminError(Exception):
    """Base class for admin-related errors."""

    def __init__(
        self,
        message: str,
        status_code: int = 500,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class AdminPermissionError(AdminError):
    """Raised when user lacks required permissions."""

    def __init__(
        self,
        message: str = "Insufficient permissions",
        details: Optional[Dict[str, Any]] = None,
    ):
        super().__init__(message, status.HTTP_403_FORBIDDEN, details)


class AdminValidationError(AdminError):
    """Raised when validation fails."""

    def __init__(
        self, message: str, details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, status.HTTP_400_BAD_REQUEST, details)


class AdminNotFoundError(AdminError):
    """Raised when resource is not found."""

    def __init__(
        self, message: str, details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, status.HTTP_404_NOT_FOUND, details)


class AdminSystemError(AdminError):
    """Raised when system operation fails."""

    def __init__(
        self, message: str, details: Optional[Dict[str, Any]] = None
    ):
        super().__init__(
            message, status.HTTP_500_INTERNAL_SERVER_ERROR, details
        )


def handle_admin_error(
    error: Exception, operation: str, user_id: Optional[int] = None
) -> HTTPException:
    """
    Centralized error handler for admin operations.

    Args:
        error: The exception that occurred
        operation: Description of the operation that failed
        user_id: ID of the user performing the operation (for logging)

    Returns:
        HTTPException with appropriate status code and message
    """
    if isinstance(error, AdminError):
        logger.warning(
            f"Admin operation failed: {operation} - {error.message}",
            extra={
                "user_id": user_id,
                "operation": operation,
                "error_type": type(error).__name__,
                "details": error.details,
            },
        )
        return HTTPException(
            status_code=error.status_code,
            detail={
                "message": error.message,
                "operation": operation,
                "details": error.details,
            },
        )

    # Log unexpected errors
    logger.error(
        f"Unexpected error in admin operation: {operation} - {str(error)}",
        extra={
            "user_id": user_id,
            "operation": operation,
            "error_type": type(error).__name__,
        },
        exc_info=True,
    )

    # Return generic error response for security
    return HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail={
            "message": f"Internal server error during {operation}",
            "operation": operation,
        },
    )


def validate_pagination_params(skip: int, limit: int) -> None:
    """
    Validate pagination parameters.

    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return

    Raises:
        AdminValidationError: If parameters are invalid
    """
    if skip < 0:
        raise AdminValidationError(
            "Skip parameter must be non-negative", {"skip": skip}
        )

    if limit <= 0:
        raise AdminValidationError(
            "Limit parameter must be positive", {"limit": limit}
        )

    if limit > 1000:
        raise AdminValidationError(
            "Limit parameter cannot exceed 1000", {"limit": limit}
        )


def validate_date_range(
    from_date: Optional[str], to_date: Optional[str]
) -> None:
    """
    Validate date range parameters.

    Args:
        from_date: Start date string
        to_date: End date string

    Raises:
        AdminValidationError: If date range is invalid
    """
    if from_date and to_date:
        try:
            from datetime import datetime

            start = datetime.fromisoformat(
                from_date.replace("Z", "+00:00")
            )
            end = datetime.fromisoformat(to_date.replace("Z", "+00:00"))

            if start >= end:
                raise AdminValidationError(
                    "Start date must be before end date",
                    {"from_date": from_date, "to_date": to_date},
                )
        except ValueError as e:
            raise AdminValidationError(
                f"Invalid date format: {str(e)}",
                {"from_date": from_date, "to_date": to_date},
            )


def create_pagination_response(
    items: list, total: int, skip: int, limit: int, envelope: bool = False
) -> Dict[str, Any]:
    """
    Create standardized pagination response.

    Args:
        items: List of items for current page
        total: Total number of items available
        skip: Number of items skipped
        limit: Maximum items per page
        envelope: Whether to wrap response in pagination envelope

    Returns:
        Pagination response dict
    """
    if envelope:
        return {
            "items": items,
            "pagination": {
                "skip": skip,
                "limit": limit,
                "total": total,
                "has_more": skip + len(items) < total,
                "page": (skip // limit) + 1 if limit > 0 else 1,
                "total_pages": (total + limit - 1) // limit
                if limit > 0
                else 1,
            },
        }
    else:
        return items
