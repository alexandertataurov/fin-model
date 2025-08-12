"""
Rate limiting middleware for authentication endpoints
"""
from datetime import datetime, timedelta, timezone
from typing import Optional, Dict, Any
from fastapi import HTTPException, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import Column, String, Integer, DateTime, Text
from sqlalchemy.sql import func
import uuid

from app.models.base import Base


class RateLimit(Base):
    """Rate limiting tracking table"""

    __tablename__ = "rate_limits"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    key = Column(String(255), nullable=False, unique=True, index=True)
    attempts = Column(Integer, nullable=False, default=0)
    window_start = Column(DateTime, nullable=False, index=True)
    blocked_until = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now(), nullable=False)
    updated_at = Column(
        DateTime,
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class RateLimiter:
    """Rate limiter for authentication endpoints"""

    def __init__(self, db: Session):
        self.db = db

    def check_rate_limit(
        self,
        request: Request,
        endpoint: str,
        max_attempts: int = 5,
        window_minutes: int = 15,
        block_minutes: int = 30,
    ) -> bool:
        """
        Check if request should be rate limited

        Args:
            request: FastAPI request object
            endpoint: Endpoint identifier (e.g., 'login', 'register')
            max_attempts: Maximum attempts per window
            window_minutes: Time window in minutes
            block_minutes: Block duration in minutes after limit exceeded

        Returns:
            True if request is allowed, False if rate limited

        Raises:
            HTTPException: If rate limit exceeded
        """
        # Create rate limit key based on IP and endpoint
        client_ip = self._get_client_ip(request)
        rate_key = f"{endpoint}:{client_ip}"

        now = datetime.now(timezone.utc)
        window_start = now - timedelta(minutes=window_minutes)

        # Get or create rate limit record
        rate_limit = self.db.query(RateLimit).filter(RateLimit.key == rate_key).first()

        if not rate_limit:
            # Create new rate limit record
            rate_limit = RateLimit(key=rate_key, attempts=1, window_start=now)
            self.db.add(rate_limit)
            self.db.commit()
            return True

        # Check if currently blocked
        if rate_limit.blocked_until:
            blocked_until_utc = (
                rate_limit.blocked_until.replace(tzinfo=timezone.utc)
                if rate_limit.blocked_until.tzinfo is None
                else rate_limit.blocked_until
            )
            if now < blocked_until_utc:
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Rate limit exceeded. Try again after {rate_limit.blocked_until.isoformat()}",
                )

        # Check if we need to reset the window
        window_start_utc = (
            rate_limit.window_start.replace(tzinfo=timezone.utc)
            if rate_limit.window_start.tzinfo is None
            else rate_limit.window_start
        )
        if window_start_utc < window_start:
            # Reset window
            rate_limit.window_start = now
            rate_limit.attempts = 1
            rate_limit.blocked_until = None
            self.db.commit()
            return True

        # Increment attempts
        rate_limit.attempts += 1

        # Check if limit exceeded
        if rate_limit.attempts > max_attempts:
            # Block the IP
            rate_limit.blocked_until = now + timedelta(minutes=block_minutes)
            self.db.commit()

            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Blocked until {rate_limit.blocked_until.isoformat()}",
            )

        self.db.commit()
        return True

    def record_successful_auth(self, request: Request, endpoint: str) -> None:
        """Record successful authentication to potentially reset counters"""
        client_ip = self._get_client_ip(request)
        rate_key = f"{endpoint}:{client_ip}"

        rate_limit = self.db.query(RateLimit).filter(RateLimit.key == rate_key).first()
        if rate_limit:
            # Reset attempts on successful auth
            rate_limit.attempts = 0
            rate_limit.blocked_until = None
            self.db.commit()

    def _get_client_ip(self, request: Request) -> str:
        """Extract client IP from request"""
        # Check for forwarded headers first (for proxies/load balancers)
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            # Take the first IP in the chain
            return forwarded_for.split(",")[0].strip()

        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip.strip()

        # Fall back to direct client IP
        if request.client:
            return request.client.host

        return "unknown"

    def cleanup_old_records(self, days_old: int = 7) -> int:
        """Clean up old rate limiting records"""
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days_old)

        deleted_count = (
            self.db.query(RateLimit).filter(RateLimit.created_at < cutoff_date).delete()
        )

        self.db.commit()
        return deleted_count


# Decorator for rate limiting endpoints
def rate_limit(
    max_attempts: int = 5,
    window_minutes: int = 15,
    block_minutes: int = 30,
    endpoint: Optional[str] = None,
):
    """
    Decorator to apply rate limiting to endpoints

    Usage:
        @rate_limit(max_attempts=5, window_minutes=15)
        async def login(request: Request, db: Session = Depends(get_db)):
            ...
    """

    def decorator(func):
        async def wrapper(*args, **kwargs):
            # Extract request and db from function arguments
            request = None
            db = None

            for arg in args:
                if isinstance(arg, Request):
                    request = arg
                elif hasattr(arg, "query"):  # Check if it's a database session
                    db = arg

            # Also check kwargs
            if not request:
                request = kwargs.get("request")
            if not db:
                db = kwargs.get("db")

            if not request or not db:
                raise ValueError("Rate limiter requires Request and Session objects")

            # Use function name as endpoint if not specified
            endpoint_name = endpoint or func.__name__

            # Check rate limit
            rate_limiter = RateLimiter(db)
            rate_limiter.check_rate_limit(
                request=request,
                endpoint=endpoint_name,
                max_attempts=max_attempts,
                window_minutes=window_minutes,
                block_minutes=block_minutes,
            )

            # Call the original function
            result = await func(*args, **kwargs)

            # Record successful auth if it's a login endpoint
            if endpoint_name in ["login", "register"]:
                rate_limiter.record_successful_auth(request, endpoint_name)

            return result

        return wrapper

    return decorator
