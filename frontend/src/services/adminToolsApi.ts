import { apiClient } from './api';

export interface AdminIntervention {
  id: number;
  type: 'data_correction' | 'parameter_adjustment' | 'calculation_fix' | 'system_recovery' | 'user_assistance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  title: string;
  description: string;
  file_id?: number;
  user_id?: number;
  model_id?: number;
  requested_by: number;
  assigned_to?: number;
  request_data: Record<string, any>;
  execution_plan?: string[];
  execution_log?: string[];
  estimated_duration_minutes?: number;
  actual_duration_minutes?: number;
  created_at: string;
  updated_at: string;
  started_at?: string;
  completed_at?: string;
  error_message?: string;
}

export interface InterventionRequest {
  type: 'data_correction' | 'parameter_adjustment' | 'calculation_fix' | 'system_recovery' | 'user_assistance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string;
  file_id?: number;
  user_id?: number;
  model_id?: number;
  request_data: Record<string, any>;
  estimated_duration_minutes?: number;
}

export interface RecoveryOption {
  id: string;
  type: 'backup_restore' | 'data_repair' | 'recalculation' | 'manual_intervention';
  name: string;
  description: string;
  risk_level: 'low' | 'medium' | 'high';
  estimated_duration_minutes: number;
  success_probability: number;
  prerequisites: string[];
  consequences: string[];
  recovery_steps: Array<{
    step_number: number;
    description: string;
    estimated_duration_minutes: number;
    rollback_possible: boolean;
  }>;
  metadata: Record<string, any>;
}

export interface RecoveryExecution {
  id: number;
  file_id: number;
  recovery_option_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number;
  current_step: number;
  total_steps: number;
  execution_log: Array<{
    timestamp: string;
    step_number: number;
    message: string;
    status: 'info' | 'warning' | 'error' | 'success';
  }>;
  started_at: string;
  completed_at?: string;
  executed_by: number;
  rollback_available: boolean;
  results?: Record<string, any>;
}

export interface PartialProcessingAnalysis {
  file_id: number;
  analysis: {
    total_records: number;
    processed_records: number;
    failed_records: number;
    processing_percentage: number;
    failure_points: Array<{
      record_number: number;
      error_type: string;
      error_message: string;
      context: Record<string, any>;
    }>;
    salvageable_data: {
      percentage: number;
      record_count: number;
      quality_score: number;
    };
    recommendations: string[];
  };
  options: Array<{
    id: string;
    name: string;
    description: string;
    salvage_percentage: number;
    estimated_duration_minutes: number;
    confidence: number;
  }>;
}

export interface PartialProcessingExecution {
  id: number;
  file_id: number;
  option_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  results: {
    salvaged_records: number;
    discarded_records: number;
    quality_score: number;
    warnings: string[];
    data_integrity_score: number;
  };
  started_at: string;
  completed_at?: string;
  executed_by: number;
}

export interface SystemHealthDiagnostics {
  overall_health: 'healthy' | 'warning' | 'critical';
  components: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'critical' | 'unknown';
    response_time_ms: number;
    last_check: string;
    issues: string[];
    recommendations: string[];
  }>;
  performance_metrics: {
    cpu_usage: number;
    memory_usage: number;
    disk_usage: number;
    active_connections: number;
    response_time_avg: number;
    error_rate: number;
  };
  recent_errors: Array<{
    timestamp: string;
    error_type: string;
    message: string;
    severity: string;
    count: number;
  }>;
  recommendations: string[];
}

export interface SystemStatistics {
  uptime_seconds: number;
  total_requests: number;
  successful_requests: number;
  failed_requests: number;
  average_response_time: number;
  active_users: number;
  total_users: number;
  database_stats: {
    total_queries: number;
    slow_queries: number;
    connection_pool_size: number;
    active_connections: number;
  };
  cache_stats: {
    hit_rate: number;
    memory_usage: number;
    total_keys: number;
  };
  storage_stats: {
    total_files: number;
    total_size_gb: number;
    processed_files_today: number;
    failed_files_today: number;
  };
}

export const adminToolsApi = {
  /**
   * Request admin intervention
   */
  async requestIntervention(data: InterventionRequest): Promise<AdminIntervention> {
    const response = await apiClient.post('/admin-tools/interventions/request', data);
    return response.data;
  },

  /**
   * Get pending interventions
   */
  async getPendingInterventions(): Promise<AdminIntervention[]> {
    const response = await apiClient.get('/admin-tools/interventions/pending');
    return response.data;
  },

  /**
   * Get all interventions with filters
   */
  async getInterventions(filters?: {
    status?: string;
    type?: string;
    priority?: string;
    assigned_to?: number;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<{ interventions: AdminIntervention[]; total_count: number }> {
    const response = await apiClient.get('/admin-tools/interventions', { params: filters });
    return response.data;
  },

  /**
   * Execute intervention
   */
  async executeIntervention(index: number): Promise<{ success: boolean; execution_id: string }> {
    const response = await apiClient.post(`/admin-tools/interventions/${index}/execute`);
    return response.data;
  },

  /**
   * Get intervention history for a file
   */
  async getInterventionHistory(fileId: number): Promise<AdminIntervention[]> {
    const response = await apiClient.get(`/admin-tools/interventions/${fileId}/history`);
    return response.data;
  },

  /**
   * Update intervention status
   */
  async updateInterventionStatus(interventionId: number, data: {
    status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
    notes?: string;
    assigned_to?: number;
  }): Promise<AdminIntervention> {
    const response = await apiClient.put(`/admin-tools/interventions/${interventionId}/status`, data);
    return response.data;
  },

  // Recovery Tools
  /**
   * Get recovery options for a file
   */
  async getRecoveryOptions(fileId: number): Promise<RecoveryOption[]> {
    const response = await apiClient.get(`/admin-tools/recovery/${fileId}/options`);
    return response.data;
  },

  /**
   * Execute recovery option
   */
  async executeRecovery(data: {
    file_id: number;
    recovery_option_id: string;
    parameters?: Record<string, any>;
    confirm_risks: boolean;
  }): Promise<RecoveryExecution> {
    const response = await apiClient.post('/admin-tools/recovery/execute', data);
    return response.data;
  },

  /**
   * Get recovery execution status
   */
  async getRecoveryStatus(executionId: number): Promise<RecoveryExecution> {
    const response = await apiClient.get(`/admin-tools/recovery/executions/${executionId}`);
    return response.data;
  },

  /**
   * Cancel recovery execution
   */
  async cancelRecovery(executionId: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post(`/admin-tools/recovery/executions/${executionId}/cancel`);
    return response.data;
  },

  /**
   * Rollback recovery execution
   */
  async rollbackRecovery(executionId: number): Promise<{ success: boolean; rollback_id: number }> {
    const response = await apiClient.post(`/admin-tools/recovery/executions/${executionId}/rollback`);
    return response.data;
  },

  // Partial Processing Tools
  /**
   * Analyze partial processing options
   */
  async analyzePartialProcessing(fileId: number): Promise<PartialProcessingAnalysis> {
    const response = await apiClient.post('/admin-tools/partial-processing/analyze', {
      file_id: fileId,
    });
    return response.data;
  },

  /**
   * Execute partial processing
   */
  async executePartialProcessing(data: {
    file_id: number;
    option_id: string;
    parameters?: Record<string, any>;
  }): Promise<PartialProcessingExecution> {
    const response = await apiClient.post('/admin-tools/partial-processing/execute', data);
    return response.data;
  },

  /**
   * Get partial processing execution status
   */
  async getPartialProcessingStatus(executionId: number): Promise<PartialProcessingExecution> {
    const response = await apiClient.get(`/admin-tools/partial-processing/executions/${executionId}`);
    return response.data;
  },

  // System Health and Diagnostics
  /**
   * Get comprehensive system health diagnostics
   */
  async getSystemHealth(): Promise<SystemHealthDiagnostics> {
    const response = await apiClient.get('/admin-tools/system/health');
    return response.data;
  },

  /**
   * Get system statistics
   */
  async getSystemStatistics(): Promise<SystemStatistics> {
    const response = await apiClient.get('/admin-tools/system/stats');
    return response.data;
  },

  /**
   * Run system diagnostics
   */
  async runSystemDiagnostics(): Promise<{
    diagnostic_id: string;
    status: 'running' | 'completed';
    results?: SystemHealthDiagnostics;
  }> {
    const response = await apiClient.post('/admin-tools/system/diagnostics/run');
    return response.data;
  },

  /**
   * Clear system caches
   */
  async clearSystemCaches(cacheTypes?: string[]): Promise<{
    cleared_caches: string[];
    total_keys_cleared: number;
    memory_freed_mb: number;
  }> {
    const response = await apiClient.post('/admin-tools/system/clear-caches', {
      cache_types: cacheTypes,
    });
    return response.data;
  },

  /**
   * Restart system services
   */
  async restartServices(services?: string[]): Promise<{
    restarted_services: string[];
    failed_services: string[];
    warnings: string[];
  }> {
    const response = await apiClient.post('/admin-tools/system/restart-services', {
      services: services,
    });
    return response.data;
  },

  /**
   * Export system logs
   */
  async exportSystemLogs(filters: {
    start_date?: string;
    end_date?: string;
    log_level?: string;
    component?: string;
    format: 'json' | 'csv' | 'text';
  }): Promise<{ download_url: string; expires_at: string; file_size_mb: number }> {
    const response = await apiClient.post('/admin-tools/system/export-logs', filters);
    return response.data;
  },

  /**
   * Get maintenance mode status
   */
  async getMaintenanceMode(): Promise<{
    enabled: boolean;
    scheduled_at?: string;
    duration_minutes?: number;
    message?: string;
    allowed_users: number[];
  }> {
    const response = await apiClient.get('/admin-tools/system/maintenance-mode');
    return response.data;
  },

  /**
   * Enable/disable maintenance mode
   */
  async setMaintenanceMode(data: {
    enabled: boolean;
    duration_minutes?: number;
    message?: string;
    allowed_users?: number[];
    immediate?: boolean;
  }): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.post('/admin-tools/system/maintenance-mode', data);
    return response.data;
  },
};

/**
 * Admin tools utility functions
 */
export const adminToolsUtils = {
  /**
   * Get intervention priority color
   */
  getPriorityColor(priority: 'low' | 'medium' | 'high' | 'critical'): string {
    const colors = {
      low: '#6B7280',
      medium: '#F59E0B',
      high: '#EF4444',
      critical: '#DC2626',
    };
    return colors[priority];
  },

  /**
   * Get intervention status badge
   */
  getStatusBadge(status: string): { color: string; icon: string; label: string } {
    const badges: Record<string, { color: string; icon: string; label: string }> = {
      pending: { color: '#6B7280', icon: '⏳', label: 'Pending' },
      in_progress: { color: '#3B82F6', icon: '🔄', label: 'In Progress' },
      completed: { color: '#10B981', icon: '✅', label: 'Completed' },
      failed: { color: '#EF4444', icon: '❌', label: 'Failed' },
      cancelled: { color: '#9CA3AF', icon: '🚫', label: 'Cancelled' },
    };
    return badges[status] || { color: '#9CA3AF', icon: '❓', label: 'Unknown' };
  },

  /**
   * Format intervention duration
   */
  formatDuration(minutes?: number): string {
    if (!minutes) return 'Unknown';
    
    if (minutes < 60) {
      return `${minutes} min`;
    } else if (minutes < 1440) {
      const hours = Math.floor(minutes / 60);
      const remainingMinutes = minutes % 60;
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    } else {
      const days = Math.floor(minutes / 1440);
      const remainingHours = Math.floor((minutes % 1440) / 60);
      return remainingHours > 0 ? `${days}d ${remainingHours}h` : `${days}d`;
    }
  },

  /**
   * Get recovery risk level color
   */
  getRiskLevelColor(riskLevel: 'low' | 'medium' | 'high'): string {
    const colors = {
      low: '#10B981',
      medium: '#F59E0B',
      high: '#EF4444',
    };
    return colors[riskLevel];
  },

  /**
   * Calculate success probability display
   */
  getSuccessProbabilityDisplay(probability: number): { color: string; label: string } {
    if (probability >= 0.9) {
      return { color: '#10B981', label: 'Very High' };
    } else if (probability >= 0.7) {
      return { color: '#10B981', label: 'High' };
    } else if (probability >= 0.5) {
      return { color: '#F59E0B', label: 'Medium' };
    } else if (probability >= 0.3) {
      return { color: '#EF4444', label: 'Low' };
    } else {
      return { color: '#DC2626', label: 'Very Low' };
    }
  },

  /**
   * Format system health percentage
   */
  formatHealthPercentage(value: number): { percentage: string; status: string; color: string } {
    const percentage = `${value.toFixed(1)}%`;
    
    if (value >= 95) {
      return { percentage, status: 'Excellent', color: '#10B981' };
    } else if (value >= 80) {
      return { percentage, status: 'Good', color: '#10B981' };
    } else if (value >= 60) {
      return { percentage, status: 'Warning', color: '#F59E0B' };
    } else {
      return { percentage, status: 'Critical', color: '#EF4444' };
    }
  },

  /**
   * Generate recovery recommendations
   */
  generateRecoveryRecommendations(analysis: PartialProcessingAnalysis): string[] {
    const recommendations: string[] = [];
    const { salvageable_data, failure_points } = analysis.analysis;

    if (salvageable_data.percentage > 80) {
      recommendations.push('High data recovery potential - proceed with partial processing');
    } else if (salvageable_data.percentage > 50) {
      recommendations.push('Moderate data recovery potential - review salvageable data quality');
    } else {
      recommendations.push('Low data recovery potential - consider alternative approaches');
    }

    if (failure_points.length > analysis.analysis.total_records * 0.1) {
      recommendations.push('High failure rate detected - investigate common error patterns');
    }

    if (salvageable_data.quality_score < 0.7) {
      recommendations.push('Data quality concerns - validate results after recovery');
    }

    return recommendations;
  },

  /**
   * Get intervention type icon
   */
  getInterventionTypeIcon(type: string): string {
    const icons: Record<string, string> = {
      data_correction: '🔧',
      parameter_adjustment: '⚙️',
      calculation_fix: '🧮',
      system_recovery: '🔄',
      user_assistance: '🆘',
    };
    return icons[type] || '❓';
  },

  /**
   * Estimate recovery time based on file size and complexity
   */
  estimateRecoveryTime(fileSize: number, recordCount: number, complexity: 'low' | 'medium' | 'high'): number {
    const baseTimePerRecord = {
      low: 0.1,    // 0.1 seconds per record
      medium: 0.5, // 0.5 seconds per record
      high: 2.0,   // 2 seconds per record
    };

    const fileSizeFactor = Math.max(1, fileSize / (1024 * 1024)); // MB
    const timeSeconds = recordCount * baseTimePerRecord[complexity] * Math.sqrt(fileSizeFactor);
    
    return Math.max(1, Math.round(timeSeconds / 60)); // Convert to minutes, minimum 1 minute
  },
};

export default adminToolsApi;