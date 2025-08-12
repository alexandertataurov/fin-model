import time
import psutil
import logging
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from dataclasses import dataclass
from prometheus_client import Counter, Histogram, Gauge, start_http_server
import json

# Prometheus metrics
request_count = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"],
)
request_duration = Histogram(
    "http_request_duration_seconds",
    "HTTP request duration",
    ["method", "endpoint"],
)
active_connections = Gauge(
    "active_websocket_connections", "Active WebSocket connections"
)
database_query_duration = Histogram(
    "database_query_duration_seconds",
    "Database query duration",
    ["query_type"],
)
memory_usage = Gauge("memory_usage_bytes", "Memory usage in bytes")
cpu_usage = Gauge("cpu_usage_percent", "CPU usage percentage")


@dataclass
class PerformanceMetric:
    timestamp: datetime
    metric_type: str
    value: float
    tags: Dict[str, str]
    context: Optional[Dict] = None


class PerformanceMonitor:
    def __init__(self):
        self.metrics_buffer: List[PerformanceMetric] = []
        self.alert_thresholds = {
            "response_time": 3.0,  # seconds
            "error_rate": 0.05,  # 5%
            "memory_usage": 0.85,  # 85%
            "cpu_usage": 0.80,  # 80%
        }
        self._setup_logging()

    def _setup_logging(self):
        """Setup logging for performance monitoring"""
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )
        self.logger = logging.getLogger("performance_monitor")

    def record_request(
        self, method: str, endpoint: str, duration: float, status_code: int
    ):
        """Record HTTP request metrics"""
        request_count.labels(
            method=method, endpoint=endpoint, status_code=status_code
        ).inc()
        request_duration.labels(method=method, endpoint=endpoint).observe(duration)

        # Store detailed metric
        metric = PerformanceMetric(
            timestamp=datetime.utcnow(),
            metric_type="http_request",
            value=duration,
            tags={
                "method": method,
                "endpoint": endpoint,
                "status_code": str(status_code),
            },
        )
        self.metrics_buffer.append(metric)

        # Check for performance alerts
        if duration > self.alert_thresholds["response_time"]:
            self.trigger_alert(
                "slow_request",
                {
                    "endpoint": endpoint,
                    "duration": duration,
                    "threshold": self.alert_thresholds["response_time"],
                },
            )

    def record_database_query(
        self, query_type: str, duration: float, query: str = None
    ):
        """Record database query performance"""
        database_query_duration.labels(query_type=query_type).observe(duration)

        metric = PerformanceMetric(
            timestamp=datetime.utcnow(),
            metric_type="database_query",
            value=duration,
            tags={"query_type": query_type},
            context={"query": query[:200] if query else None},  # Truncate long queries
        )
        self.metrics_buffer.append(metric)

    def update_system_metrics(self):
        """Update system resource metrics"""
        # Memory usage
        memory = psutil.virtual_memory()
        memory_usage.set(memory.used)

        # CPU usage
        cpu_percent = psutil.cpu_percent(interval=1)
        cpu_usage.set(cpu_percent)

        # Check thresholds
        if memory.percent / 100 > self.alert_thresholds["memory_usage"]:
            self.trigger_alert(
                "high_memory_usage",
                {
                    "current": memory.percent,
                    "threshold": self.alert_thresholds["memory_usage"] * 100,
                },
            )

        if cpu_percent / 100 > self.alert_thresholds["cpu_usage"]:
            self.trigger_alert(
                "high_cpu_usage",
                {
                    "current": cpu_percent,
                    "threshold": self.alert_thresholds["cpu_usage"] * 100,
                },
            )

    def trigger_alert(self, alert_type: str, context: Dict):
        """Trigger performance alert"""
        self.logger.warning(f"Performance alert: {alert_type}", extra=context)
        # Here you could integrate with alerting services like PagerDuty, Slack, etc.

    def get_metrics_summary(self, hours: int = 24) -> Dict:
        """Get metrics summary for the last N hours"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        recent_metrics = [m for m in self.metrics_buffer if m.timestamp > cutoff_time]

        if not recent_metrics:
            return {"message": "No metrics available for the specified period"}

        # Calculate statistics
        request_metrics = [m for m in recent_metrics if m.metric_type == "http_request"]
        db_metrics = [m for m in recent_metrics if m.metric_type == "database_query"]

        summary = {
            "period_hours": hours,
            "total_requests": len(request_metrics),
            "total_db_queries": len(db_metrics),
            "avg_request_time": sum(m.value for m in request_metrics)
            / len(request_metrics)
            if request_metrics
            else 0,
            "avg_db_query_time": sum(m.value for m in db_metrics) / len(db_metrics)
            if db_metrics
            else 0,
            "max_request_time": max(m.value for m in request_metrics)
            if request_metrics
            else 0,
            "max_db_query_time": max(m.value for m in db_metrics) if db_metrics else 0,
        }

        return summary

    def clear_old_metrics(self, hours: int = 24):
        """Clear metrics older than specified hours"""
        cutoff_time = datetime.utcnow() - timedelta(hours=hours)
        self.metrics_buffer = [
            m for m in self.metrics_buffer if m.timestamp > cutoff_time
        ]


# Create global monitor instance
performance_monitor = PerformanceMonitor()
