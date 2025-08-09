import { LogEntry, AuditEntry } from '@/services/adminApi';

export interface NormalizedApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

export const createNormalizedResponse = <T>(): NormalizedApiResponse<T> => ({
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
});

export const updateNormalizedResponse = <T>(
  current: NormalizedApiResponse<T>,
  updates: Partial<NormalizedApiResponse<T>>
): NormalizedApiResponse<T> => ({
  ...current,
  ...updates,
  lastUpdated: updates.data !== undefined ? Date.now() : current.lastUpdated,
});

export interface LogsState {
  items: LogEntry[];
  total: number;
  skip: number;
  limit: number;
  level: 'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL';
  search: string;
  from: string;
  to: string;
}

export interface AuditState {
  items: AuditEntry[];
  total: number;
  skip: number;
  limit: number;
  userId?: number;
  action?: string;
  from: string;
  to: string;
}
