/**
 * Admin API Service
 *
 * Frontend API client for administrative functionality
 */

import api from './api';

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

export interface UserActivity {
  user_id: number;
  username: string;
  last_login: string | null;
  login_count: number;
  files_uploaded: number;
  models_created: number;
  is_active: boolean;
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

export class AdminApiService {
  /**
   * Get comprehensive system statistics
   */
  static async getSystemStats(): Promise<SystemStats> {
    const response = await api.get('/admin/stats');
    return response.data;
  }

  /**
   * Get user activity data
   */
  static async getUserActivity(
    limit: number = 50,
    activeOnly: boolean = false
  ): Promise<UserActivity[]> {
    const params: Record<string, unknown> = { limit };
    if (activeOnly) params.active_only = true;
    // Use new robust endpoint path to avoid legacy validation conflicts
    const response = await api.get('/admin/users/activity-list', { params });
    return response.data;
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
  static async getSecurityAudit(): Promise<SecurityAudit> {
    const response = await api.get('/admin/security/audit');
    return response.data;
  }

  /**
   * List all users with their roles
   */
  static async listUsers(
    skip: number = 0,
    limit: number = 100
  ): Promise<UserWithRoles[]> {
    const response = await api.get('/admin/users', {
      params: { skip, limit },
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
  static async getDatabasePerformance(limit: number = 10): Promise<any[]> {
    const response = await api.get('/admin/database/performance', {
      params: { limit },
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
  static async cleanupDatabase(dryRun: boolean = true): Promise<any> {
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
  static async cleanupFiles(dryRun: boolean = true): Promise<{
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
    limit: number = 100
  ): Promise<LogEntry[]> {
    const response = await api.get('/admin/system/logs', {
      params: { level, limit },
    });
    return response.data;
  }

  /**
   * Get audit logs (placeholder - not implemented in lean version)
   */
  static async getAuditLogs(
    skip: number = 0,
    limit: number = 100,
    userId?: number,
    action?: string
  ): Promise<{ message: string }> {
    const response = await api.get('/admin/audit-logs', {
      params: { skip, limit, user_id: userId, action },
    });
    return response.data;
  }
}

export default AdminApiService;
