/**
 * Normalized Admin Data Types
 *
 * Consistent data models for admin dashboard
 */

// Base response wrapper for all API calls
export interface ApiResponse<T> {
  data: T;
  meta?: {
    timestamp: number;
    requestId: string;
    version: string;
  };
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

// Normalized system stats
export interface NormalizedSystemStats {
  users: UserStats;
  files: FileStats;
  financial: FinancialStats;
  system: SystemInfo;
  performance: PerformanceStats;
  timestamp: number;
}

export interface UserStats {
  total: number;
  active: number;
  verified: number;
  new24h: number;
  activePercentage: number;
  verifiedPercentage: number;
}

export interface FileStats {
  total: number;
  completed: number;
  processing: number;
  failed: number;
  completedPercentage: number;
  avgProcessingTime?: number;
}

export interface FinancialStats {
  statements: number;
  parameters: number;
  totalSize: string;
  avgStatementSize?: number;
}

export interface SystemInfo {
  databaseSize: string;
  uptime: number;
  version: string;
  environment: 'development' | 'staging' | 'production';
}

export interface PerformanceStats {
  avgFileSizeMb: number;
  avgResponseTime: number;
  throughput: number;
  errorRate: number;
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

// Normalized user activity
export interface NormalizedUserActivity {
  userId: number;
  username: string;
  email: string;
  lastLogin: Date | null;
  loginCount: number;
  filesUploaded: number;
  modelsCreated: number;
  isActive: boolean;
  isVerified: boolean;
  createdAt: Date;
  activityScore: number;
}

// Normalized system metrics
export interface NormalizedSystemMetrics {
  timestamp: number;
  cpu: ResourceUsage;
  memory: ResourceUsage;
  disk: ResourceUsage;
  network: NetworkMetrics;
  database: DatabaseMetrics;
  application: ApplicationMetrics;
}

export interface ResourceUsage {
  current: number;
  average: number;
  peak: number;
  threshold: {
    warning: number;
    critical: number;
  };
  status: 'healthy' | 'warning' | 'critical';
}

export interface NetworkMetrics {
  activeConnections: number;
  requestCount24h: number;
  errorRate: number;
  avgLatency: number;
}

export interface DatabaseMetrics {
  connections: {
    active: number;
    idle: number;
    max: number;
  };
  queryPerformance: {
    avgDuration: number;
    slowQueries: number;
  };
  size: string;
}

export interface ApplicationMetrics {
  sessions: number;
  queueSize: number;
  backgroundJobs: {
    pending: number;
    running: number;
    failed: number;
  };
}

// Normalized log entry
export interface NormalizedLogEntry {
  id: string;
  timestamp: Date;
  level: LogLevel;
  message: string;
  module: string;
  userId?: number;
  metadata?: Record<string, any>;
  duration?: number;
  requestId?: string;
}

export type LogLevel = 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';

// Normalized audit entry
export interface NormalizedAuditEntry {
  id: string;
  timestamp: Date;
  userId?: number;
  username?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  result: 'success' | 'failure' | 'partial';
}

// Health check response
export interface NormalizedHealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  checks: HealthCheckItem[];
  overallScore: number;
}

export interface HealthCheckItem {
  name: string;
  status: 'pass' | 'warn' | 'fail';
  duration: number;
  message?: string;
  details?: Record<string, any>;
}

// User permissions
export interface NormalizedUserPermissions {
  userId: number;
  roles: Role[];
  permissions: Permission[];
  isAdmin: boolean;
  isAnalyst: boolean;
  restrictions?: string[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  level: number;
}

export interface Permission {
  id: string;
  name: string;
  resource: string;
  actions: string[];
}

// Data transformation utilities
export class AdminDataTransformer {
  static normalizeSystemStats(raw: any): NormalizedSystemStats {
    return {
      users: {
        total: raw.users?.total || 0,
        active: raw.users?.active || 0,
        verified: raw.users?.verified || 0,
        new24h: raw.users?.new_24h || 0,
        activePercentage:
          raw.users?.total > 0 ? (raw.users.active / raw.users.total) * 100 : 0,
        verifiedPercentage:
          raw.users?.total > 0
            ? (raw.users.verified / raw.users.total) * 100
            : 0,
      },
      files: {
        total: raw.files?.total || 0,
        completed: raw.files?.completed || 0,
        processing: raw.files?.processing || 0,
        failed: raw.files?.failed || 0,
        completedPercentage:
          raw.files?.total > 0
            ? (raw.files.completed / raw.files.total) * 100
            : 0,
      },
      financial: {
        statements: raw.financial_data?.statements || 0,
        parameters: raw.financial_data?.parameters || 0,
        totalSize: raw.system?.database_size || '0 MB',
      },
      system: {
        databaseSize: raw.system?.database_size || '0 MB',
        uptime:
          Date.now() - new Date(raw.system?.timestamp || Date.now()).getTime(),
        version: raw.system?.version || '1.0.0',
        environment: raw.system?.environment || 'development',
      },
      performance: {
        avgFileSizeMb: raw.performance?.avg_file_size_mb || 0,
        avgResponseTime: raw.performance?.avg_response_time || 0,
        throughput: raw.performance?.throughput || 0,
        errorRate: raw.performance?.error_rate_24h || 0,
      },
      timestamp: Date.now(),
    };
  }

  static normalizeUserActivity(raw: any[]): NormalizedUserActivity[] {
    return raw.map(user => ({
      userId: user.user_id,
      username: user.username,
      email: user.email || '',
      lastLogin: user.last_login ? new Date(user.last_login) : null,
      loginCount: user.login_count || 0,
      filesUploaded: user.files_uploaded || 0,
      modelsCreated: user.models_created || 0,
      isActive: user.is_active || false,
      isVerified: user.is_verified || false,
      createdAt: new Date(user.created_at || Date.now()),
      activityScore: this.calculateActivityScore(user),
    }));
  }

  static normalizeSystemMetrics(raw: any): NormalizedSystemMetrics {
    return {
      timestamp: Date.now(),
      cpu: this.normalizeResourceUsage(raw.cpu_usage, 'cpu'),
      memory: this.normalizeResourceUsage(raw.memory_usage, 'memory'),
      disk: this.normalizeResourceUsage(raw.disk_usage, 'disk'),
      network: {
        activeConnections: raw.active_connections || 0,
        requestCount24h: raw.request_count_24h || 0,
        errorRate: raw.error_rate_24h || 0,
        avgLatency: raw.avg_response_time || 0,
      },
      database: {
        connections: {
          active: raw.active_connections || 0,
          idle: raw.idle_connections || 0,
          max: raw.max_connections || 100,
        },
        queryPerformance: {
          avgDuration: raw.avg_query_duration || 0,
          slowQueries: raw.slow_queries || 0,
        },
        size: raw.database_size || '0 MB',
      },
      application: {
        sessions: raw.active_sessions || 0,
        queueSize: raw.queue_size || 0,
        backgroundJobs: {
          pending: raw.pending_jobs || 0,
          running: raw.running_jobs || 0,
          failed: raw.failed_jobs || 0,
        },
      },
    };
  }

  static normalizeLogEntry(raw: any): NormalizedLogEntry {
    return {
      id: raw.id || `${Date.now()}-${Math.random()}`,
      timestamp: new Date(raw.timestamp),
      level: raw.level as LogLevel,
      message: raw.message,
      module: raw.module || 'unknown',
      userId: raw.user_id,
      metadata: raw.metadata || {},
      duration: raw.duration,
      requestId: raw.request_id,
    };
  }

  static normalizeAuditEntry(raw: any): NormalizedAuditEntry {
    return {
      id: raw.id || `${Date.now()}-${Math.random()}`,
      timestamp: new Date(raw.timestamp),
      userId: raw.user_id,
      username: raw.username,
      action: raw.action,
      resource: raw.resource || 'unknown',
      resourceId: raw.resource_id,
      details: raw.details || {},
      ipAddress: raw.ip_address,
      userAgent: raw.user_agent,
      result: raw.result || 'success',
    };
  }

  private static normalizeResourceUsage(
    current: number,
    type: string
  ): ResourceUsage {
    const thresholds = {
      cpu: { warning: 70, critical: 90 },
      memory: { warning: 80, critical: 95 },
      disk: { warning: 85, critical: 95 },
    };

    const threshold = thresholds[type as keyof typeof thresholds] || {
      warning: 80,
      critical: 90,
    };

    return {
      current: current || 0,
      average: current || 0, // Would be calculated from historical data
      peak: current || 0, // Would be tracked over time
      threshold,
      status:
        current >= threshold.critical
          ? 'critical'
          : current >= threshold.warning
            ? 'warning'
            : 'healthy',
    };
  }

  private static calculateActivityScore(user: any): number {
    const weights = {
      login: 1,
      files: 5,
      models: 10,
    };

    return (
      (user.login_count || 0) * weights.login +
      (user.files_uploaded || 0) * weights.files +
      (user.models_created || 0) * weights.models
    );
  }
}
