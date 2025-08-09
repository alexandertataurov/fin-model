"""
Cache utilities for FastAPI application.

This module provides caching functionality using Redis as the backend,
with fallback functionality when Redis is not available.
"""

import json
import logging
from typing import Optional, Callable, Any
from functools import wraps

logger = logging.getLogger(__name__)

# Try to import Redis client
try:
    from app.core.celery_app import redis_client

    REDIS_AVAILABLE = True
    logger.info("Redis caching is available")
except ImportError:
    REDIS_AVAILABLE = False
    redis_client = None
    logger.info("Redis caching not available")


def redis_cache(expire: int = 300, key_prefix: str = "cache"):
    """
    Redis-based cache decorator.

    Args:
        expire: Cache expiration time in seconds
        key_prefix: Prefix for cache keys

    Returns:
        Decorator function
    """

    def decorator(func):
        @wraps(func)
        async def async_wrapper(*args, **kwargs):
            if not REDIS_AVAILABLE:
                return await func(*args, **kwargs)

            # Build cache key
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(sorted(kwargs.items())))}"

            try:
                # Try to get from cache
                cached_result = redis_client.get(cache_key)
                if cached_result:
                    logger.debug(f"Cache hit for {cache_key}")
                    return json.loads(cached_result)

                # Execute function and cache result
                result = await func(*args, **kwargs)
                redis_client.setex(
                    cache_key, expire, json.dumps(result, default=str)
                )
                logger.debug(f"Cached result for {cache_key}")
                return result

            except Exception as e:
                logger.warning(
                    f"Cache error for {cache_key}: {e}, executing without cache"
                )
                return await func(*args, **kwargs)

        @wraps(func)
        def sync_wrapper(*args, **kwargs):
            if not REDIS_AVAILABLE:
                return func(*args, **kwargs)

            # Build cache key
            cache_key = f"{key_prefix}:{func.__name__}:{hash(str(args) + str(sorted(kwargs.items())))}"

            try:
                # Try to get from cache
                cached_result = redis_client.get(cache_key)
                if cached_result:
                    logger.debug(f"Cache hit for {cache_key}")
                    return json.loads(cached_result)

                # Execute function and cache result
                result = func(*args, **kwargs)
                redis_client.setex(
                    cache_key, expire, json.dumps(result, default=str)
                )
                logger.debug(f"Cached result for {cache_key}")
                return result

            except Exception as e:
                logger.warning(
                    f"Cache error for {cache_key}: {e}, executing without cache"
                )
                return func(*args, **kwargs)

        # Return appropriate wrapper based on function type
        import asyncio

        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper

    return decorator


def safe_cache(expire: int = 300, key_builder: Optional[Callable] = None):
    """
    Safe cache decorator that uses Redis caching.

    Args:
        expire: Cache expiration time in seconds
        key_builder: Function to build cache keys (not used in Redis implementation)

    Returns:
        Decorator function
    """
    return redis_cache(expire=expire, key_prefix="safe_cache")


def cache_key_builder(func: Callable, *args, **kwargs) -> str:
    """
    Default cache key builder for functions.

    Args:
        func: The function being cached
        *args: Function arguments
        **kwargs: Function keyword arguments

    Returns:
        Cache key string
    """
    # Create a simple key based on function name and arguments
    key_parts = [func.__name__]

    # Add args (skip first if it's self for methods)
    if args and hasattr(args[0], "__class__"):
        # Skip self parameter for methods
        key_parts.extend([str(arg) for arg in args[1:]])
    else:
        key_parts.extend([str(arg) for arg in args])

    # Add kwargs
    for key, value in sorted(kwargs.items()):
        key_parts.append(f"{key}:{value}")

    return ":".join(key_parts)


def clear_cache_pattern(pattern: str) -> bool:
    """
    Clear cache entries matching a pattern.

    Args:
        pattern: Pattern to match cache keys

    Returns:
        True if cache clearing was attempted, False if not available
    """
    if REDIS_AVAILABLE:
        try:
            keys = redis_client.keys(pattern)
            if keys:
                redis_client.delete(*keys)
                logger.info(
                    f"Cleared {len(keys)} cache entries matching pattern '{pattern}'"
                )
            return True
        except Exception as e:
            logger.error(f"Failed to clear cache: {e}")
            return False
    else:
        logger.debug("Redis cache not available - no cache to clear")
        return False


def get_cache_status() -> dict:
    """
    Get cache system status.

    Returns:
        Dictionary with cache status information
    """
    return {
        "available": REDIS_AVAILABLE,
        "backend": "redis" if REDIS_AVAILABLE else "none",
        "status": "enabled" if REDIS_AVAILABLE else "disabled",
    }
