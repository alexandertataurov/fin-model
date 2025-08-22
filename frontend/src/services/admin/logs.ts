import api from '../api';

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

export async function getSystemLogs(
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL' = 'ERROR',
  limit = 100,
  opts?: {
    from?: string;
    to?: string;
    search?: string;
    skip?: number;
    envelope?: boolean;
  }
): Promise<
  LogEntry[] | { items: LogEntry[]; skip: number; limit: number; total: number }
> {
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

export async function getAuditLogs(
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
  | { items: AuditEntry[]; skip: number; limit: number; total: number }
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
