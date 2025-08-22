from typing import Any, Dict

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.rate_limiter import RateLimit


def clear_rate_limits(db: Session) -> Dict[str, Any]:
    """Remove all rate limiting records and report how many were cleared."""
    try:
        deleted_count = db.query(RateLimit).delete()
        db.commit()
        return {
            "message": "Rate limits cleared successfully",
            "cleared_records": deleted_count,
        }
    except Exception as e:  # pragma: no cover - defensive programming
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to clear rate limits: {str(e)}",
        )
