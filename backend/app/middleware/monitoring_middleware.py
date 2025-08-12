import time
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.monitoring import performance_monitor


class MonitoringMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()

        # Extract endpoint info
        method = request.method
        endpoint = str(request.url.path)

        try:
            response = await call_next(request)

            # Record successful request
            duration = time.time() - start_time
            performance_monitor.record_request(
                method=method,
                endpoint=endpoint,
                duration=duration,
                status_code=response.status_code,
            )

            # Add performance headers
            response.headers["X-Response-Time"] = f"{duration:.3f}s"

            return response

        except Exception as e:
            # Record failed request
            duration = time.time() - start_time
            performance_monitor.record_request(
                method=method,
                endpoint=endpoint,
                duration=duration,
                status_code=500,
            )
            raise


# Database query monitoring decorator
def monitor_db_query(query_type: str):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            start_time = time.time()
            try:
                result = await func(*args, **kwargs)
                duration = time.time() - start_time
                performance_monitor.record_database_query(query_type, duration)
                return result
            except Exception as e:
                duration = time.time() - start_time
                performance_monitor.record_database_query(
                    f"{query_type}_error", duration
                )
                raise

        return wrapper

    return decorator
