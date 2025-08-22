import api from '../api';
import {
  AdminDataTransformer,
  NormalizedSystemStats,
  NormalizedSystemMetrics,
} from '@/types/admin';

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

export interface DatabaseHealth {
  status: string;
  connection_pool: any;
  table_statistics: any;
  performance_metrics: any;
}

export async function getSystemStats(): Promise<SystemStats> {
  const response = await api.get('/admin/stats');
  return response.data;
}

export async function getNormalizedSystemStats(): Promise<NormalizedSystemStats> {
  const response = await api.get('/admin/stats');
  return AdminDataTransformer.normalizeSystemStats(response.data);
}

export async function getSystemMetrics(): Promise<SystemMetrics> {
  const response = await api.get('/admin/system/metrics');
  return response.data;
}

export async function getNormalizedSystemMetrics(): Promise<NormalizedSystemMetrics> {
  const response = await api.get('/admin/system/metrics');
  return AdminDataTransformer.normalizeSystemMetrics(response.data);
}

export async function checkDataIntegrity(): Promise<DataIntegrityCheck[]> {
  const response = await api.get('/admin/data/integrity');
  return response.data;
}

export async function getSecurityAudit(opts?: {
  from?: string;
  to?: string;
}): Promise<SecurityAudit> {
  const response = await api.get('/admin/security/audit', {
    params: { from_ts: opts?.from, to_ts: opts?.to },
  });
  return response.data;
}

export async function getSystemHealth(): Promise<any> {
  const response = await api.get('/admin/system/health');
  return response.data;
}

export async function getDatabaseHealth(): Promise<DatabaseHealth> {
  const response = await api.get('/admin/database/health');
  return response.data;
}

export async function getDatabasePerformance(
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

export async function getTableInformation(): Promise<Record<string, any>> {
  const response = await api.get('/admin/database/tables');
  return response.data;
}

export async function cleanupDatabase(dryRun = true): Promise<any> {
  const response = await api.post('/admin/database/cleanup', null, {
    params: { dry_run: dryRun },
  });
  return response.data;
}

export async function clearRateLimits(): Promise<{
  message: string;
  cleared_records: number;
}> {
  const response = await api.post('/admin/rate-limits/clear');
  return response.data;
}

export async function devClearRateLimits(): Promise<{
  message: string;
  cleared_records: number;
}> {
  const response = await api.post('/admin/dev-clear-rate-limits');
  return response.data;
}

export async function cleanupFiles(dryRun = true): Promise<{
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

export async function backupDatabase(): Promise<{
  job_id: string;
  message: string;
}> {
  const response = await api.post('/admin/database/backup');
  return response.data;
}

export async function exportDatabase(payload: {
  table?: string;
  format: 'json' | 'csv';
}): Promise<{ file_url: string; message: string }> {
  const response = await api.post('/admin/database/export', payload);
  return response.data;
}

export async function reindexDatabase(): Promise<{
  job_id: string;
  message: string;
}> {
  const response = await api.post('/admin/database/reindex');
  return response.data;
}
