/**
 * Admin API Service
 *
 * Frontend API client for administrative functionality with normalized responses
 */

import api from './api';
import {
  AdminDataTransformer,
  NormalizedSystemStats,
  NormalizedUserActivity,
  NormalizedSystemMetrics,
  NormalizedLogEntry,
  NormalizedAuditEntry,
  PaginatedResponse,
  UserActivity,
} from '@/types/admin';

// Types for admin API responses
export interface SystemStats {
  users: {
    total: number;
    active: number;
    verified: number;
    new_24h: number;
  };
  files: {
    total: number;
    completed: number;
    processing: number;
    failed: number;
  };
  financial_data: {
    statements: number;
    parameters: number;
  };
  system: {
    database_size: string;
    timestamp: string;
  };
  performance: {
    avg_file_size_mb: number;
  };
}
export interface SystemMetrics {
  cpu_usage: number | null;
  memory_usage: number | null;
  disk_usage: number | null;
  active_connections: number;
  request_count_24h: number;
  error_rate_24h: number;
  avg_response_time: number;
}

export interface DataIntegrityCheck {
  table_name: string;
  record_count: number;
  last_updated: string;
  integrity_issues: string[];
  recommendations: string[];
}

export interface SecurityAudit {
  failed_logins_24h: number;
  suspicious_activities: any[];
  rate_limit_violations: number;
  password_policy_violations: number;
  recommendations: string[];
}

export interface UserWithRoles {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  roles: string[];
}

export interface UserPermissions {
  user_id: number;
  roles: string[];
  permissions: string[];
  is_admin: boolean;
  is_analyst: boolean;
}

export interface DatabaseHealth {
  status: string;
  connection_pool: any;
  table_statistics: any;
  performance_metrics: any;
}

export interface BulkActionResult {
  message: string;
  results: {
    success: number;
    failed: number;
    errors: string[];
  };
  total_users: number;
}

export interface LogEntry {
  timestamp: string;
  level: string;
  message: string;
  module: string;
  user_id: number | null;
}

export interface AuditEntry {
  timestamp: string;
  level?: string;
  module?: string;
  action?: string;
  user_id?: number | null;
  message?: string;
  details?: any;
}

export interface MaintenanceScheduleItem {
  id: string;
  name: string;
  task: 'cleanup' | 'vacuum' | 'archive' | 'reindex' | 'backup';
  schedule: string;
  enabled: boolean;
}

export interface MaintenanceSchedules {
  items: MaintenanceScheduleItem[];
}

export class AdminApiService {
  /**
   * Get comprehensive system statistics (normalized)
   */
  static async getSystemStats(): Promise<SystemStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  /**
   * Get normalized system statistics
   */
  static async getNormalizedSystemStats(): Promise<NormalizedSystemStats> {
    const response = await api.get('/admin/stats');
    return AdminDataTransformer.normalizeSystemStats(response.data);
  }

  /**
   * Get user activity data
   */
  static async getUserActivity(
    limit = 50,
    activeOnly = false
  ): Promise<UserActivity[]> {
    const params: Record<string, unknown> = { limit };
    if (activeOnly) params.active_only = true;
    // Use new robust endpoint path to avoid legacy validation conflicts
    const response = await api.get('/admin/users/activity-list', { params });
    return response.data;
  }

  /**
   * Get normalized user activity data
   */
  static async getNormalizedUserActivity(
    limit = 50,
    activeOnly = false
  ): Promise<NormalizedUserActivity[]> {
    const params: Record<string, unknown> = { limit };
    if (activeOnly) params.active_only = true;
    const response = await api.get('/admin/users/activity-list', { params });
    return AdminDataTransformer.normalizeUserActivity(response.data);
  }

  /**
   * Get real-time system metrics
   */
  static async getSystemMetrics(): Promise<SystemMetrics> {
    const response = await api.get('/admin/system/metrics');
    return response.data;
  }

  /**
   * Check data integrity across all tables
   */
  static async checkDataIntegrity(): Promise<DataIntegrityCheck[]> {
    const response = await api.get('/admin/data/integrity');
    return response.data;
  }

  /**
   * Get security audit information
   */
  static async getSecurityAudit(opts?: {
    from?: string;
    to?: string;
  }): Promise<SecurityAudit> {
    const response = await api.get('/admin/security/audit', {
      params: { from_ts: opts?.from, to_ts: opts?.to },
    });
    return response.data;
  }

  /**
   * List all users with their roles
   */
  static async listUsers(
    skip = 0,
    limit = 100,
    envelope = false,
    opts?: {
      search?: string;
      is_active?: boolean;
      is_verified?: boolean;
      is_admin?: boolean;
    }
  ): Promise<UserWithRoles[] | PaginatedResponse<UserWithRoles>> {
    const response = await api.get('/admin/users', {
      params: { skip, limit, envelope, ...(opts || {}) },
    });
    return response.data;
  }

  /**
   * Get user by ID with roles
   */
  static async getUser(userId: number): Promise<UserWithRoles> {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  }

  /**
   * Update user information
   */
  static async updateUser(
    userId: number,
    updates: Partial<{
      username: string;
      email: string;
      first_name: string;
      last_name: string;
      is_active: boolean;
    }>
  ): Promise<UserWithRoles | any> {
    const response = await api.put(`/admin/users/${userId}`, updates);
    return response.data;
  }

  /**
   * Create a new user (admin)
   */
  static async createUser(payload: {
    email: string;
    username: string;
    first_name?: string;
    last_name?: string;
    password: string;
    role?: 'admin' | 'analyst' | 'viewer' | 'editor';
  }): Promise<UserWithRoles | any> {
    const response = await api.post('/admin/users', payload);
    return response.data;
  }

  /**
   * Delete (deactivate) user
   */
  static async deleteUser(userId: number): Promise<{ message: string }> {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data;
  }

  /**
   * Assign role to user
   */
  static async assignRole(
    userId: number,
    role: string
  ): Promise<{ message: string }> {
    const response = await api.post(`/admin/users/${userId}/roles/${role}`);
    return response.data;
  }

  /**
   * Remove role from user
   */
  static async removeRole(
    userId: number,
    role: string
  ): Promise<{ message: string }> {
    const response = await api.delete(`/admin/users/${userId}/roles/${role}`);
    return response.data;
  }

  /**
   * Get current user's permissions
   */
  static async getUserPermissions(): Promise<UserPermissions> {
    const response = await api.get('/admin/permissions');
    return response.data;
  }

  /**
   * Get system health information
   */
  static async getSystemHealth(): Promise<any> {
    const response = await api.get('/admin/system/health');
    return response.data;
  }

  /**
   * Get database health information
   */
  static async getDatabaseHealth(): Promise<DatabaseHealth> {
    const response = await api.get('/admin/database/health');
    return response.data;
  }

  /**
   * Get database performance data
   */
  static async getDatabasePerformance(
    limit = 10,
    opts?: { window?: '1h' | '24h' | '7d'; from?: string; to?: string }
  ): Promise<any[]> {
    const response = await api.get('/admin/database/performance', {
      params: {
        limit,
        window: opts?.window,
        from_ts: opts?.from,
        to_ts: opts?.to,
      },
    });
    return response.data;
  }

  /**
   * Get table information
   */
  static async getTableInformation(): Promise<Record<string, any>> {
    const response = await api.get('/admin/database/tables');
    return response.data;
  }

  /**
   * Clean up database
   */
  static async cleanupDatabase(dryRun = true): Promise<any> {
    const response = await api.post('/admin/database/cleanup', null, {
      params: { dry_run: dryRun },
    });
    return response.data;
  }

  /**
   * Clear rate limits
   */
  static async clearRateLimits(): Promise<{
    message: string;
    cleared_records: number;
  }> {
    const response = await api.post('/admin/rate-limits/clear');
    return response.data;
  }

  /**
   * Development-only: clear rate limits without authentication
   */
  static async devClearRateLimits(): Promise<{
    message: string;
    cleared_records: number;
  }> {
    const response = await api.post('/admin/dev-clear-rate-limits');
    return response.data;
  }

  /**
   * Clean up orphaned files
   */
  static async cleanupFiles(dryRun = true): Promise<{
    message: string;
    orphaned_files: number;
    failed_files: number;
    dry_run: boolean;
  }> {
    const response = await api.post('/admin/files/cleanup', null, {
      params: { dry_run: dryRun },
    });
    return response.data;
  }

  /**
   * Perform bulk actions on users
   */
  static async bulkUserAction(
    userIds: number[],
    action: 'activate' | 'deactivate' | 'verify' | 'send_reminder'
  ): Promise<BulkActionResult> {
    const response = await api.post('/admin/users/bulk-action', {
      user_ids: userIds,
      action,
    });
    return response.data;
  }

  /**
   * Get system logs
   */
  static async getSystemLogs(
    level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' = 'ERROR',
    limit = 100,
    opts?: {
      from?: string;
      to?: string;
      search?: string;
      skip?: number;
      envelope?: boolean;
    }
  ): Promise<LogEntry[] | PaginatedResponse<LogEntry>> {
    const response = await api.get('/admin/system/logs', {
      params: {
        level,
        limit,
        skip: opts?.skip ?? 0,
        from_ts: opts?.from,
        to_ts: opts?.to,
        search: opts?.search,
        envelope: opts?.envelope ?? false,
      },
    });
    return response.data;
  }

  /**
   * Get audit logs (placeholder - not implemented in lean version)
   */
  static async getAuditLogs(
    skip = 0,
    limit = 100,
    userId?: number,
    action?: string,
    opts?: { from?: string; to?: string; envelope?: boolean }
  ): Promise<
    | {
        logs: AuditEntry[];
        skip: number;
        limit: number;
        total: number;
      }
    | PaginatedResponse<AuditEntry>
  > {
    const response = await api.get('/admin/audit-logs', {
      params: {
        skip,
        limit,
        user_id: userId,
        action,
        from_ts: opts?.from,
        to_ts: opts?.to,
        envelope: opts?.envelope ?? false,
      },
    });
    return response.data;
  }

  // Maintenance schedules
  static async getMaintenanceSchedules(): Promise<MaintenanceSchedules> {
    const response = await api.get('/admin/maintenance/schedules');
    return response.data;
  }

  static async updateMaintenanceSchedules(
    schedules: MaintenanceSchedules
  ): Promise<MaintenanceSchedules> {
    const response = await api.put('/admin/maintenance/schedules', schedules);
    return response.data;
  }

  // Manual operations
  static async backupDatabase(): Promise<{ job_id: string; message: string }> {
    const response = await api.post('/admin/database/backup');
    return response.data;
  }

  static async exportDatabase(payload: {
    table?: string;
    format: 'json' | 'csv';
  }): Promise<{ file_url: string; message: string }> {
    const response = await api.post('/admin/database/export', payload);
    return response.data;
  }

  static async reindexDatabase(): Promise<{ job_id: string; message: string }> {
    const response = await api.post('/admin/database/reindex');
    return response.data;
  }

  // Reports
  static async getAdminOverviewReport(
    format: 'json' | 'csv' = 'json'
  ): Promise<any> {
    const response = await api.get('/admin/reports/overview', {
      params: { format },
      responseType: format === 'csv' ? 'blob' : 'json',
    });
    return response.data;
  }
}

export default AdminApiService;
