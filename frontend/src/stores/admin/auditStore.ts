import { StateCreator } from 'zustand';
import * as AdminApi from '@/services/admin';
import type { AuditEntry } from '@/services/admin';
import {
  AuditState,
  NormalizedApiResponse,
  createNormalizedResponse,
} from './types';

export interface AuditSlice {
  audit: AuditState & NormalizedApiResponse<AuditEntry[]>;
  fetchAuditData: () => Promise<void>;
  updateAuditFilters: (filters: Partial<Omit<AuditState, 'items' | 'total'>>) => void;
  fetchAudit: () => Promise<void>;
}

export const createAuditSlice: StateCreator<AuditSlice, [], [], AuditSlice> = (
  set,
  get
) => ({
  audit: {
    ...createNormalizedResponse<AuditEntry[]>(),
    items: [],
    total: 0,
    skip: 0,
    limit: 100,
    from: '',
    to: '',
  },

  fetchAuditData: async () => {
    await get().fetchAudit();
  },

  updateAuditFilters: (filters) => {
    set((state: any) => ({
      audit: { ...state.audit, ...filters },
    }));
  },

  fetchAudit: async () => {
    set((state: any) => ({
      audit: { ...state.audit, loading: true, error: null },
    }));

    try {
      const { audit } = get() as any;
      const response: any = await AdminApi.getAuditLogs(
        audit.skip,
        audit.limit,
        audit.userId,
        audit.action,
        {
          from: audit.from || undefined,
          to: audit.to || undefined,
          envelope: true,
        }
      );

      if ('items' in response) {
        set((state: any) => ({
          audit: {
            ...state.audit,
            data: response.items,
            items: response.items,
            total: response.total ?? response.pagination?.total ?? response.items.length,
            skip: response.skip ?? response.pagination?.page ?? 0,
            loading: false,
            lastUpdated: Date.now(),
          },
        }));
      } else if ('logs' in response) {
        set((state: any) => ({
          audit: {
            ...state.audit,
            data: response.logs,
            items: response.logs,
            total: response.total,
            skip: response.skip,
            loading: false,
            lastUpdated: Date.now(),
          },
        }));
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Failed to fetch audit logs';
      set((state: any) => ({
        audit: { ...state.audit, loading: false, error: message },
      }));
    }
  },
});
