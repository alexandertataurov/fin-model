import logging
from typing import Optional

from app.models.audit import AuditLog
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)


def log_audit(
    db: Session,
    *,
    user_id: int,
    action: str,
    resource: Optional[str] = None,
    resource_id: Optional[str] = None,
    details: Optional[str] = None,
    success: bool = True,
) -> Optional[AuditLog]:
    """Persist an audit log entry and handle commit/rollback.

    Returns the created :class:`AuditLog` on success. Any errors are
    swallowed to avoid impacting the calling flow.
    """
    try:
        entry = AuditLog(
            user_id=user_id,
            action=action,
            resource=resource,
            resource_id=resource_id,
            details=details,
            success="true" if success else "false",
        )
        db.add(entry)
        db.commit()
        return entry
    except Exception:
        logger.exception("Failed to log audit entry")
        try:
            db.rollback()
        except Exception:
            logger.exception("Rollback failed")
        return None
