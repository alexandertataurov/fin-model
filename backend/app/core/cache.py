"""
Cache utilities for FastAPI application.

This module provides a safe wrapper around fastapi_cache decorators
with fallback functionality when caching is not available.
"""

import logging
from typing import Optional, Callable

logger = logging.getLogger(__name__)

# Try to import fastapi_cache decorator
try:
    from fastapi_cache.decorator import cache
    CACHE_DECORATOR_AVAILABLE = True
    logger.info("fastapi_cache decorator is available")
except ImportError:
    CACHE_DECORATOR_AVAILABLE = False
    logger.warning("fastapi_cache decorator not available")


def safe_cache(expire: int = 300, key_builder: Optional[Callable] = None):
    """
    Safe cache decorator that works with or without fastapi_cache.
    
    Args:
        expire: Cache expiration time in seconds
        key_builder: Optional function to build cache keys
    
    Returns:
        Decorated function with caching if available, otherwise no-op
    """
    def decorator(func: Callable) -> Callable:
        if CACHE_DECORATOR_AVAILABLE:
            try:
                if key_builder:
                    return cache(expire=expire, key_builder=key_builder)(func)
                else:
                    return cache(expire=expire)(func)
            except Exception as e:
                logger.error(f"Failed to apply cache decorator: {e}")
                return func
        else:
            # Return function unchanged if caching is not available
            logger.debug(f"Caching disabled for {func.__name__}")
            return func
    
    return decorator


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
    if args and hasattr(args[0], '__class__'):
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
    if CACHE_DECORATOR_AVAILABLE:
        try:
            # This would need to be implemented based on the cache backend
            logger.info(f"Cache clear pattern '{pattern}' requested")
            return True
        except Exception as e:
            logger.error(f"Failed to clear cache: {e}")
            return False
    else:
        logger.debug("Cache clearing skipped - caching not available")
        return False


def get_cache_status() -> dict:
    """
    Get cache system status.
    
    Returns:
        Dictionary with cache status information
    """
    return {
        "available": CACHE_DECORATOR_AVAILABLE,
        "backend": "fastapi_cache" if CACHE_DECORATOR_AVAILABLE else "none",
        "status": "enabled" if CACHE_DECORATOR_AVAILABLE else "disabled"
    } 