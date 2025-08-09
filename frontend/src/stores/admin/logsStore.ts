import { StateCreator } from 'zustand';
import * as AdminApi from '@/services/admin';
import type { LogEntry } from '@/services/admin';
import {
  LogsState,
  NormalizedApiResponse,
  createNormalizedResponse,
} from './types';

export interface LogsSlice {
  logs: LogsState & NormalizedApiResponse<LogEntry[]>;
  fetchLogsData: () => Promise<void>;
  updateLogsFilters: (filters: Partial<Omit<LogsState, 'items' | 'total'>>) => void;
  fetchLogs: () => Promise<void>;
}

export const createLogsSlice: StateCreator<LogsSlice, [], [], LogsSlice> = (
  set,
  get
) => ({
  logs: {
    ...createNormalizedResponse<LogEntry[]>(),
    items: [],
    total: 0,
    skip: 0,
    limit: 100,
    level: 'ERROR',
    search: '',
    from: '',
    to: '',
  },

  fetchLogsData: async () => {
    await get().fetchLogs();
  },

  updateLogsFilters: (filters) => {
    set((state: any) => ({
      logs: { ...state.logs, ...filters },
    }));
  },

  fetchLogs: async () => {
    set((state: any) => ({
      logs: { ...state.logs, loading: true, error: null },
    }));

    try {
      const { logs } = get() as any;
      const response: any = await AdminApi.getSystemLogs(logs.level, logs.limit, {
        from: logs.from || undefined,
        to: logs.to || undefined,
        search: logs.search || undefined,
        skip: logs.skip,
        envelope: true,
      });

      if ('items' in response) {
        set((state: any) => ({
          logs: {
            ...state.logs,
            data: response.items,
            items: response.items,
            total: response.total ?? response.pagination?.total ?? response.items.length,
            skip: response.skip ?? response.pagination?.page ?? 0,
            loading: false,
            lastUpdated: Date.now(),
          },
        }));
      } else {
        set((state: any) => ({
          logs: {
            ...state.logs,
            data: response,
            items: response,
            loading: false,
            lastUpdated: Date.now(),
          },
        }));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch logs';
      set((state: any) => ({
        logs: { ...state.logs, loading: false, error: message },
      }));
    }
  },
});
