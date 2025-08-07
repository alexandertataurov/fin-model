import { apiClient } from './api';

export interface SystemMetrics {
  timestamp: string;
  cpu: {
    usage_percentage: number;
    load_average: number[];
    core_count: number;
  };
  memory: {
    total: number;
    used: number;
    available: number;
    usage_percentage: number;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usage_percentage: number;
    io_read: number;
    io_write: number;
  };
  network: {
    bytes_sent: number;
    bytes_received: number;
    packets_sent: number;
    packets_received: number;
    connections_active: number;
  };
}

export interface PerformanceMetrics {
  timestamp: string;
  application: {
    active_connections: number;
    total_requests: number;
    requests_per_second: number;
    response_time_avg: number;
    response_time_p95: number;
    response_time_p99: number;
    error_rate: number;
    active_sessions: number;
  };
  database: {
    active_connections: number;
    queries_per_second: number;
    query_time_avg: number;
    slow_queries: number;
    deadlocks: number;
    cache_hit_rate: number;
  };
  cache: {
    hit_rate: number;
    memory_usage: number;
    keys_count: number;
    operations_per_second: number;
  };
  background_tasks: {
    queue_length: number;
    processing_time_avg: number;
    completed_tasks: number;
    failed_tasks: number;
  };
}

export interface HealthCheckResult {
  service: string;
  status: 'healthy' | 'warning' | 'critical' | 'unknown';
  response_time: number;
  last_check: string;
  details: {
    message?: string;
    error?: string;
    metadata?: Record<string, any>;
  };
  history: Array<{
    timestamp: string;
    status: string;
    response_time: number;
  }>;
}

export interface SystemHealth {
  overall_status: 'healthy' | 'warning' | 'critical';
  services: HealthCheckResult[];
  uptime: number;
  last_restart: string;
  version: string;
  environment: string;
}

export interface MonitoringAlert {
  id: number;
  type: 'cpu' | 'memory' | 'disk' | 'network' | 'application' | 'database' | 'custom';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  threshold_value: number;
  current_value: number;
  condition: 'greater_than' | 'less_than' | 'equals' | 'not_equals';
  triggered_at: string;
  acknowledged_at?: string;
  resolved_at?: string;
  status: 'active' | 'acknowledged' | 'resolved';
  metadata: Record<string, any>;
}

export interface MonitoringConfiguration {
  metrics_retention_days: number;
  alert_thresholds: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    response_time: number;
    error_rate: number;
  };
  notification_settings: {
    email_enabled: boolean;
    webhook_enabled: boolean;
    email_recipients: string[];
    webhook_url?: string;
  };
  collection_intervals: {
    system_metrics: number; // seconds
    performance_metrics: number; // seconds
    health_checks: number; // seconds
  };
}

export interface ResourceUsageTrend {
  resource_type: 'cpu' | 'memory' | 'disk' | 'network';
  time_range: string;
  data_points: Array<{
    timestamp: string;
    value: number;
    threshold?: number;
  }>;
  trend_analysis: {
    direction: 'increasing' | 'decreasing' | 'stable';
    rate_of_change: number;
    predicted_exhaustion?: string;
  };
}

export interface LogEntry {
  id: number;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  source: string;
  message: string;
  metadata?: Record<string, any>;
  user_id?: number;
  request_id?: string;
}

export const monitoringApi = {
  /**
   * Get current performance metrics
   */
  async getPerformanceMetrics(timeRange?: string): Promise<PerformanceMetrics[]> {
    const response = await apiClient.get('/monitoring/metrics', {
      params: timeRange ? { time_range: timeRange } : undefined,
    });
    return response.data;
  },

  /**
   * Get system resource metrics
   */
  async getSystemMetrics(timeRange?: string): Promise<SystemMetrics[]> {
    const response = await apiClient.get('/monitoring/system', {
      params: timeRange ? { time_range: timeRange } : undefined,
    });
    return response.data;
  },

  /**
   * Get system health status
   */
  async getSystemHealth(): Promise<SystemHealth> {
    const response = await apiClient.get('/monitoring/health');
    return response.data;
  },

  /**
   * Clear old metrics data
   */
  async clearOldMetrics(olderThanDays: number): Promise<{ deleted_count: number }> {
    const response = await apiClient.post('/monitoring/clear-metrics', {
      older_than_days: olderThanDays,
    });
    return response.data;
  },

  /**
   * Get monitoring alerts
   */
  async getMonitoringAlerts(filters?: {
    status?: string;
    severity?: string;
    type?: string;
    start_date?: string;
    end_date?: string;
  }): Promise<MonitoringAlert[]> {
    const response = await apiClient.get('/monitoring/alerts', { params: filters });
    return response.data;
  },

  /**
   * Acknowledge monitoring alert
   */
  async acknowledgeAlert(alertId: number, notes?: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/monitoring/alerts/${alertId}/acknowledge`, {
      notes,
    });
    return response.data;
  },

  /**
   * Resolve monitoring alert
   */
  async resolveAlert(alertId: number, resolution_notes?: string): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/monitoring/alerts/${alertId}/resolve`, {
      resolution_notes,
    });
    return response.data;
  },

  /**
   * Get monitoring configuration
   */
  async getMonitoringConfiguration(): Promise<MonitoringConfiguration> {
    const response = await apiClient.get('/monitoring/configuration');
    return response.data;
  },

  /**
   * Update monitoring configuration
   */
  async updateMonitoringConfiguration(config: Partial<MonitoringConfiguration>): Promise<MonitoringConfiguration> {
    const response = await apiClient.put('/monitoring/configuration', config);
    return response.data;
  },

  /**
   * Get resource usage trends
   */
  async getResourceUsageTrends(resourceType: string, timeRange: string): Promise<ResourceUsageTrend> {
    const response = await apiClient.get('/monitoring/trends', {
      params: { resource_type: resourceType, time_range: timeRange },
    });
    return response.data;
  },

  /**
   * Get system logs
   */
  async getSystemLogs(filters?: {
    level?: string;
    source?: string;
    start_date?: string;
    end_date?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ logs: LogEntry[]; total_count: number }> {
    const response = await apiClient.get('/monitoring/logs', { params: filters });
    return response.data;
  },

  /**
   * Export monitoring data
   */
  async exportMonitoringData(type: 'metrics' | 'alerts' | 'logs', filters?: Record<string, any>): Promise<{ download_url: string; expires_at: string }> {
    const response = await apiClient.post('/monitoring/export', { type, filters });
    return response.data;
  },

  /**
   * Trigger manual health check
   */
  async triggerHealthCheck(serviceName?: string): Promise<{ triggered_services: string[] }> {
    const response = await apiClient.post('/monitoring/health-check/trigger', {
      service_name: serviceName,
    });
    return response.data;
  },

  /**
   * Get uptime statistics
   */
  async getUptimeStats(timeRange: string): Promise<{
    uptime_percentage: number;
    total_downtime_minutes: number;
    incidents_count: number;
    mttr_minutes: number; // Mean Time To Recovery
    mtbf_hours: number; // Mean Time Between Failures
  }> {
    const response = await apiClient.get('/monitoring/uptime', {
      params: { time_range: timeRange },
    });
    return response.data;
  },
};

/**
 * Monitoring utility functions
 */
export const monitoringUtils = {
  /**
   * Get status color based on health status
   */
  getStatusColor(status: 'healthy' | 'warning' | 'critical' | 'unknown'): string {
    const colors = {
      healthy: '#10B981',
      warning: '#F59E0B',
      critical: '#EF4444',
      unknown: '#6B7280',
    };
    return colors[status];
  },

  /**
   * Get severity color for alerts
   */
  getSeverityColor(severity: 'low' | 'medium' | 'high' | 'critical'): string {
    const colors = {
      low: '#6B7280',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626',
    };
    return colors[severity];
  },

  /**
   * Format uptime duration
   */
  formatUptime(seconds: number): string {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (days > 0) {
      return `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  },

  /**
   * Calculate health score based on metrics
   */
  calculateHealthScore(metrics: SystemMetrics & PerformanceMetrics): number {
    const scores = [];

    // CPU score (0-100, lower usage = higher score)
    scores.push(Math.max(0, 100 - metrics.cpu.usage_percentage));

    // Memory score
    scores.push(Math.max(0, 100 - metrics.memory.usage_percentage));

    // Disk score
    scores.push(Math.max(0, 100 - metrics.disk.usage_percentage));

    // Response time score (lower = better, normalize to 0-100)
    const responseTimeScore = Math.max(0, 100 - (metrics.application.response_time_avg / 10));
    scores.push(responseTimeScore);

    // Error rate score (lower = better)
    const errorRateScore = Math.max(0, 100 - (metrics.application.error_rate * 10));
    scores.push(errorRateScore);

    // Calculate average
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  },

  /**
   * Determine if a metric value is within acceptable range
   */
  isMetricHealthy(metricType: string, value: number): boolean {
    const thresholds: Record<string, number> = {
      'cpu_usage': 80,
      'memory_usage': 85,
      'disk_usage': 90,
      'response_time': 2000, // 2 seconds
      'error_rate': 5, // 5%
      'query_time': 1000, // 1 second
    };

    const threshold = thresholds[metricType];
    if (!threshold) return true;

    return value < threshold;
  },

  /**
   * Generate alert message based on metric and value
   */
  generateAlertMessage(metricType: string, currentValue: number, threshold: number): string {
    const messages: Record<string, string> = {
      'cpu_usage': `CPU usage is ${currentValue.toFixed(1)}%, exceeding threshold of ${threshold}%`,
      'memory_usage': `Memory usage is ${currentValue.toFixed(1)}%, exceeding threshold of ${threshold}%`,
      'disk_usage': `Disk usage is ${currentValue.toFixed(1)}%, exceeding threshold of ${threshold}%`,
      'response_time': `Response time is ${currentValue.toFixed(0)}ms, exceeding threshold of ${threshold}ms`,
      'error_rate': `Error rate is ${currentValue.toFixed(2)}%, exceeding threshold of ${threshold}%`,
    };

    return messages[metricType] || `Metric ${metricType} value ${currentValue} exceeds threshold ${threshold}`;
  },

  /**
   * Get log level color
   */
  getLogLevelColor(level: string): string {
    const colors: Record<string, string> = {
      'DEBUG': '#6B7280',
      'INFO': '#3B82F6',
      'WARNING': '#F59E0B',
      'ERROR': '#EF4444',
      'CRITICAL': '#DC2626',
    };
    return colors[level] || '#6B7280';
  },

  /**
   * Estimate time until resource exhaustion
   */
  estimateResourceExhaustion(trend: ResourceUsageTrend): string | null {
    if (trend.trend_analysis.direction !== 'increasing') {
      return null;
    }

    const ratePerHour = trend.trend_analysis.rate_of_change;
    if (ratePerHour <= 0) return null;

    const currentUsage = trend.data_points[trend.data_points.length - 1]?.value || 0;
    const remainingCapacity = 100 - currentUsage; // Assuming percentage

    if (remainingCapacity <= 0) {
      return 'Already at capacity';
    }

    const hoursToExhaustion = remainingCapacity / ratePerHour;

    if (hoursToExhaustion < 1) {
      return `${Math.round(hoursToExhaustion * 60)} minutes`;
    } else if (hoursToExhaustion < 24) {
      return `${Math.round(hoursToExhaustion)} hours`;
    } else {
      return `${Math.round(hoursToExhaustion / 24)} days`;
    }
  },

  /**
   * Group logs by time period
   */
  groupLogsByTimePeriod(logs: LogEntry[], period: 'hour' | 'day'): Record<string, LogEntry[]> {
    const grouped: Record<string, LogEntry[]> = {};

    logs.forEach(log => {
      const date = new Date(log.timestamp);
      let key: string;

      if (period === 'hour') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:00`;
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(log);
    });

    return grouped;
  },

  /**
   * Calculate availability percentage
   */
  calculateAvailability(uptimeMinutes: number, totalMinutes: number): number {
    if (totalMinutes === 0) return 100;
    return Math.max(0, Math.min(100, (uptimeMinutes / totalMinutes) * 100));
  },
};

export default monitoringApi;