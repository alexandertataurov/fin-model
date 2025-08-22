import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { createOverviewSlice, OverviewSlice } from './overviewStore';
import { createLogsSlice, LogsSlice } from './logsStore';
import { createAuditSlice, AuditSlice } from './auditStore';

interface CoreSlice {
  activeTab: string;
  autoRefreshEnabled: boolean;
  refreshing: boolean;
  maintenanceLoading: boolean;

  setActiveTab: (tab: string) => void;
  setAutoRefresh: (enabled: boolean) => void;
  refreshAll: () => Promise<void>;
  clearErrors: () => void;
}

export type AdminStoreState = OverviewSlice &
  LogsSlice &
  AuditSlice &
  CoreSlice;

export const useAdminStore = create<AdminStoreState>()(
  devtools(
    (set, get) => ({
      activeTab: 'overview',
      autoRefreshEnabled: true,
      refreshing: false,
      maintenanceLoading: false,
      ...createOverviewSlice(set as any, get as any, undefined as any),
      ...createLogsSlice(set as any, get as any, undefined as any),
      ...createAuditSlice(set as any, get as any, undefined as any),
      setActiveTab: (tab: string) => set({ activeTab: tab }),
      setAutoRefresh: (enabled: boolean) =>
        set({ autoRefreshEnabled: enabled }),
      refreshAll: async () => {
        const { activeTab } = get();

        switch (activeTab) {
          case 'overview':
            await get().fetchOverviewData();
            break;
          case 'system':
            await get().fetchSystemData();
            break;
          case 'logs':
            await get().fetchLogsData();
            break;
          case 'audit':
            await get().fetchAuditData();
            break;
          case 'health':
            await get().fetchHealthData();
            break;
          default:
            await get().fetchOverviewData();
        }
      },
      clearErrors: () => {
        set(state => ({
          systemStats: { ...state.systemStats, error: null },
          userActivity: { ...state.userActivity, error: null },
          systemMetrics: { ...state.systemMetrics, error: null },
          dataIntegrity: { ...state.dataIntegrity, error: null },
          securityAudit: { ...state.securityAudit, error: null },
          systemHealth: { ...state.systemHealth, error: null },
          databaseHealth: { ...state.databaseHealth, error: null },
          userPermissions: { ...state.userPermissions, error: null },
          logs: { ...state.logs, error: null },
          audit: { ...state.audit, error: null },
        }));
      },
    }),
    { name: 'admin-store' }
  )
);

export type { NormalizedApiResponse } from './types';
