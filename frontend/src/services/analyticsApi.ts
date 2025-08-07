import { apiClient } from './api';

export interface ProcessingOverview {
  total_files_processed: number;
  successful_processing: number;
  failed_processing: number;
  processing_rate: number;
  average_processing_time: number;
  total_data_volume: number;
  active_users: number;
  system_uptime: number;
  last_updated: string;
}

export interface DailyStatistics {
  date: string;
  files_processed: number;
  processing_time_avg: number;
  processing_time_max: number;
  success_rate: number;
  error_count: number;
  unique_users: number;
  data_volume: number;
  peak_concurrent_users: number;
}

export interface FileTypeDistribution {
  file_type: string;
  count: number;
  percentage: number;
  success_rate: number;
  average_size: number;
  average_processing_time: number;
}

export interface ErrorAnalysis {
  error_type: string;
  count: number;
  percentage: number;
  first_occurrence: string;
  last_occurrence: string;
  affected_files: number;
  resolution_status: 'open' | 'investigating' | 'resolved';
  examples: Array<{
    file_id: number;
    error_message: string;
    timestamp: string;
  }>;
}

export interface DashboardSummary {
  overview: {
    total_models: number;
    active_models: number;
    total_scenarios: number;
    completed_calculations: number;
    total_users: number;
    active_users_today: number;
  };
  recent_activity: Array<{
    id: number;
    type: 'model_created' | 'scenario_calculated' | 'user_login' | 'file_uploaded';
    description: string;
    timestamp: string;
    user_id?: number;
    user_name?: string;
  }>;
  performance_metrics: {
    average_response_time: number;
    system_load: number;
    memory_usage: number;
    cpu_usage: number;
  };
  alerts: Array<{
    id: number;
    level: 'info' | 'warning' | 'error';
    message: string;
    timestamp: string;
    resolved: boolean;
  }>;
}

export interface UserActivityStats {
  user_id: number;
  username: string;
  email: string;
  login_count: number;
  last_login: string;
  session_duration_avg: number;
  files_processed: number;
  models_created: number;
  scenarios_run: number;
  api_calls_count: number;
  activity_by_hour: Record<string, number>;
  activity_by_day: Record<string, number>;
}

export interface PerformanceMetrics {
  timestamp: string;
  response_time: {
    api_average: number;
    api_p95: number;
    api_p99: number;
    database_average: number;
    database_p95: number;
  };
  throughput: {
    requests_per_second: number;
    calculations_per_minute: number;
    file_processing_rate: number;
  };
  resource_usage: {
    cpu_percentage: number;
    memory_percentage: number;
    disk_io: number;
    network_io: number;
  };
  error_rates: {
    api_error_rate: number;
    calculation_error_rate: number;
    system_error_rate: number;
  };
}

export interface AnalyticsFilters {
  start_date?: string;
  end_date?: string;
  user_id?: number;
  file_type?: string;
  error_type?: string;
  model_id?: number;
  interval?: 'hour' | 'day' | 'week' | 'month';
}

export const analyticsApi = {
  /**
   * Get processing overview statistics
   */
  async getProcessingOverview(filters?: AnalyticsFilters): Promise<ProcessingOverview> {
    const response = await apiClient.get('/analytics/overview', { params: filters });
    return response.data;
  },

  /**
   * Get daily processing statistics
   */
  async getDailyStatistics(filters?: AnalyticsFilters): Promise<DailyStatistics[]> {
    const response = await apiClient.get('/analytics/daily-stats', { params: filters });
    return response.data;
  },

  /**
   * Get file type distribution analysis
   */
  async getFileTypeDistribution(filters?: AnalyticsFilters): Promise<FileTypeDistribution[]> {
    const response = await apiClient.get('/analytics/file-types', { params: filters });
    return response.data;
  },

  /**
   * Get error analysis data
   */
  async getErrorAnalysis(filters?: AnalyticsFilters): Promise<ErrorAnalysis[]> {
    const response = await apiClient.get('/analytics/errors', { params: filters });
    return response.data;
  },

  /**
   * Get dashboard summary
   */
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response = await apiClient.get('/analytics/dashboard');
    return response.data;
  },

  /**
   * Get user activity statistics
   */
  async getUserActivityStats(filters?: AnalyticsFilters): Promise<UserActivityStats[]> {
    const response = await apiClient.get('/analytics/user-activity', { params: filters });
    return response.data;
  },

  /**
   * Get performance metrics
   */
  async getPerformanceMetrics(filters?: AnalyticsFilters): Promise<PerformanceMetrics[]> {
    const response = await apiClient.get('/analytics/performance', { params: filters });
    return response.data;
  },

  /**
   * Export analytics data
   */
  async exportAnalyticsData(type: 'overview' | 'daily' | 'errors' | 'performance', filters?: AnalyticsFilters): Promise<{ download_url: string; expires_at: string }> {
    const response = await apiClient.post('/analytics/export', { type, filters });
    return response.data;
  },

  /**
   * Get custom analytics query
   */
  async getCustomAnalytics(query: {
    metrics: string[];
    dimensions: string[];
    filters: Record<string, any>;
    group_by?: string[];
    order_by?: string;
    limit?: number;
  }): Promise<{ data: any[]; metadata: any }> {
    const response = await apiClient.post('/analytics/custom', query);
    return response.data;
  },

  /**
   * Get analytics insights
   */
  async getAnalyticsInsights(type: 'trends' | 'anomalies' | 'predictions', timeframe: string): Promise<{
    insights: Array<{
      type: string;
      message: string;
      confidence: number;
      data_points: any[];
    }>;
  }> {
    const response = await apiClient.get('/analytics/insights', {
      params: { type, timeframe },
    });
    return response.data;
  },
};

/**
 * Analytics utility functions
 */
export const analyticsUtils = {
  /**
   * Calculate percentage change
   */
  calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  },

  /**
   * Format duration in human-readable format
   */
  formatDuration(seconds: number): string {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)}h`;
    return `${(seconds / 86400).toFixed(1)}d`;
  },

  /**
   * Format bytes in human-readable format
   */
  formatBytes(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  },

  /**
   * Get trend indicator
   */
  getTrendIndicator(current: number, previous: number): { direction: 'up' | 'down' | 'stable'; percentage: number } {
    const change = this.calculatePercentageChange(current, previous);
    const direction = Math.abs(change) < 1 ? 'stable' : change > 0 ? 'up' : 'down';
    
    return { direction, percentage: Math.abs(change) };
  },

  /**
   * Calculate success rate
   */
  calculateSuccessRate(successful: number, total: number): number {
    if (total === 0) return 0;
    return (successful / total) * 100;
  },

  /**
   * Get performance status
   */
  getPerformanceStatus(metrics: PerformanceMetrics): 'excellent' | 'good' | 'warning' | 'critical' {
    const { response_time, resource_usage, error_rates } = metrics;

    // Critical conditions
    if (
      response_time.api_p95 > 5000 ||
      resource_usage.cpu_percentage > 90 ||
      resource_usage.memory_percentage > 90 ||
      error_rates.api_error_rate > 10
    ) {
      return 'critical';
    }

    // Warning conditions
    if (
      response_time.api_p95 > 2000 ||
      resource_usage.cpu_percentage > 70 ||
      resource_usage.memory_percentage > 70 ||
      error_rates.api_error_rate > 5
    ) {
      return 'warning';
    }

    // Good conditions
    if (
      response_time.api_p95 < 1000 &&
      resource_usage.cpu_percentage < 50 &&
      resource_usage.memory_percentage < 50 &&
      error_rates.api_error_rate < 1
    ) {
      return 'excellent';
    }

    return 'good';
  },

  /**
   * Generate color for chart based on value range
   */
  getChartColor(value: number, min: number, max: number, type: 'performance' | 'error' | 'usage' = 'performance'): string {
    const normalized = (value - min) / (max - min);

    switch (type) {
      case 'performance':
        // Green for good performance, red for poor performance
        return normalized > 0.8 ? '#EF4444' : normalized > 0.6 ? '#F59E0B' : normalized > 0.4 ? '#10B981' : '#059669';
      
      case 'error':
        // Red for high errors, green for low errors
        return normalized > 0.7 ? '#DC2626' : normalized > 0.4 ? '#F59E0B' : normalized > 0.1 ? '#10B981' : '#059669';
      
      case 'usage':
        // Blue gradient for usage
        return normalized > 0.8 ? '#1E40AF' : normalized > 0.6 ? '#3B82F6' : normalized > 0.4 ? '#60A5FA' : '#93C5FD';
      
      default:
        return '#6B7280';
    }
  },

  /**
   * Format large numbers with appropriate suffixes
   */
  formatLargeNumber(num: number): string {
    if (num >= 1e9) return `${(num / 1e9).toFixed(1)}B`;
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}K`;
    return num.toString();
  },

  /**
   * Calculate moving average
   */
  calculateMovingAverage(data: number[], window: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      const start = Math.max(0, i - window + 1);
      const subset = data.slice(start, i + 1);
      const average = subset.reduce((sum, val) => sum + val, 0) / subset.length;
      result.push(average);
    }
    return result;
  },

  /**
   * Detect anomalies in time series data
   */
  detectAnomalies(data: Array<{ timestamp: string; value: number }>, threshold: number = 2): Array<{ timestamp: string; value: number; anomaly: boolean }> {
    const values = data.map(d => d.value);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length);

    return data.map(point => ({
      ...point,
      anomaly: Math.abs(point.value - mean) > threshold * stdDev,
    }));
  },

  /**
   * Generate time range options
   */
  getTimeRangeOptions(): Array<{ label: string; value: string; start: Date; end: Date }> {
    const now = new Date();
    const options = [
      {
        label: 'Last Hour',
        value: '1h',
        start: new Date(now.getTime() - 60 * 60 * 1000),
        end: now,
      },
      {
        label: 'Last 24 Hours',
        value: '24h',
        start: new Date(now.getTime() - 24 * 60 * 60 * 1000),
        end: now,
      },
      {
        label: 'Last 7 Days',
        value: '7d',
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
        end: now,
      },
      {
        label: 'Last 30 Days',
        value: '30d',
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
        end: now,
      },
      {
        label: 'Last 90 Days',
        value: '90d',
        start: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
        end: now,
      },
    ];

    return options;
  },
};

export default analyticsApi;