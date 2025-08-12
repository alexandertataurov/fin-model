from datetime import datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel


class SystemStatsResponse(BaseModel):
    users: Dict[str, int]
    files: Dict[str, int]
    financial_data: Dict[str, int]
    system: Dict[str, Any]
    performance: Dict[str, float]


class SystemMetricsResponse(BaseModel):
    cpu_usage: Optional[float]
    memory_usage: Optional[float]
    disk_usage: Optional[float]
    active_connections: int
    request_count_24h: int
    error_rate_24h: float
    avg_response_time: float


class DataIntegrityResponse(BaseModel):
    table_name: str
    record_count: int
    last_updated: Optional[datetime]
    integrity_issues: List[str]
    recommendations: List[str]


class SecurityAuditResponse(BaseModel):
    failed_logins_24h: int
    suspicious_activities: List[Dict[str, Any]]
    rate_limit_violations: int
    password_policy_violations: int
    recommendations: List[str]


class MaintenanceScheduleItem(BaseModel):
    id: str
    name: str
    task: str
    schedule: str
    enabled: bool


class MaintenanceSchedules(BaseModel):
    items: List[MaintenanceScheduleItem]
