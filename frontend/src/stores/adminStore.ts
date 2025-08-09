/**
 * Admin Dashboard Store
 *
 * Centralized state management for admin dashboard data using Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as AdminApi from '@/services/admin';
import type {
  SystemStats,
  UserActivity,
  SystemMetrics,
  DataIntegrityCheck,
  SecurityAudit,
  LogEntry,
  UserPermissions,
  AuditEntry,
} from '@/services/admin';
import { toast } from 'sonner';

// Normalized data types
export interface NormalizedApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

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

export interface AdminStoreState {
  // Tab management
  activeTab: string;
  autoRefreshEnabled: boolean;
  refreshing: boolean;

  // Data sections with normalized structure
  systemStats: NormalizedApiResponse<SystemStats>;
  userActivity: NormalizedApiResponse<UserActivity[]>;
  systemMetrics: NormalizedApiResponse<SystemMetrics>;
  dataIntegrity: NormalizedApiResponse<DataIntegrityCheck[]>;
  securityAudit: NormalizedApiResponse<SecurityAudit>;
  systemHealth: NormalizedApiResponse<any>;
  databaseHealth: NormalizedApiResponse<any>;
  userPermissions: NormalizedApiResponse<UserPermissions>;

  // Complex state
  logs: LogsState & NormalizedApiResponse<LogEntry[]>;
  audit: AuditState & NormalizedApiResponse<AuditEntry[]>;

  // Maintenance
  maintenanceLoading: boolean;

  // Actions
  setActiveTab: (tab: string) => void;
  setAutoRefresh: (enabled: boolean) => void;

  // Data fetching actions - context-aware
  fetchOverviewData: () => Promise<void>;
  fetchSystemData: () => Promise<void>;
  fetchLogsData: () => Promise<void>;
  fetchAuditData: () => Promise<void>;
  fetchHealthData: () => Promise<void>;

  // Specific data fetchers
  fetchSystemStats: () => Promise<void>;
  fetchUserActivity: () => Promise<void>;
  fetchSystemMetrics: () => Promise<void>;
  fetchSecurityAudit: () => Promise<void>;

  // Log management
  updateLogsFilters: (filters: Partial<Omit<LogsState, 'items' | 'total'>>) => void;
  fetchLogs: () => Promise<void>;

  // Audit management
  updateAuditFilters: (filters: Partial<Omit<AuditState, 'items' | 'total'>>) => void;
  fetchAudit: () => Promise<void>;

  // Utilities
  refreshAll: () => Promise<void>;
  clearErrors: () => void;
}

// Helper to create normalized response
const createNormalizedResponse = <T>(): NormalizedApiResponse<T> => ({
  data: null,
  loading: false,
  error: null,
  lastUpdated: null,
});

// Helper to update normalized response
const updateNormalizedResponse = <T>(
  current: NormalizedApiResponse<T>,
  updates: Partial<NormalizedApiResponse<T>>
): NormalizedApiResponse<T> => ({
  ...current,
  ...updates,
  lastUpdated: updates.data !== undefined ? Date.now() : current.lastUpdated,
});

export const useAdminStore = create<AdminStoreState>()(
  devtools(
    (set, get) => ({
      // Initial state
      activeTab: 'overview',
      autoRefreshEnabled: true,
      refreshing: false,
      maintenanceLoading: false,

      // Normalized data
      systemStats: createNormalizedResponse<SystemStats>(),
      userActivity: createNormalizedResponse<UserActivity[]>(),
      systemMetrics: createNormalizedResponse<SystemMetrics>(),
      dataIntegrity: createNormalizedResponse<DataIntegrityCheck[]>(),
      securityAudit: createNormalizedResponse<SecurityAudit>(),
      systemHealth: createNormalizedResponse<any>(),
      databaseHealth: createNormalizedResponse<any>(),
      userPermissions: createNormalizedResponse<UserPermissions>(),

      // Complex state
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

      audit: {
        ...createNormalizedResponse<AuditEntry[]>(),
        items: [],
        total: 0,
        skip: 0,
        limit: 100,
        from: '',
        to: '',
      },

      // Basic actions
      setActiveTab: (tab: string) => set({ activeTab: tab }),
      setAutoRefresh: (enabled: boolean) => set({ autoRefreshEnabled: enabled }),

      // Context-aware data fetching
      fetchOverviewData: async () => {
        set({ refreshing: true });

        const state = get();
        const promises = [
          get().fetchSystemStats(),
          get().fetchUserActivity(),
          get().fetchSystemMetrics(),
        ];

        // Only fetch security audit if filters are set
        if (state.securityAudit.data || state.audit.from || state.audit.to) {
          promises.push(get().fetchSecurityAudit());
        }

        await Promise.allSettled(promises);
        set({ refreshing: false });
      },

      fetchSystemData: async () => {
        set({ refreshing: true });

        await Promise.allSettled([
          get().fetchSystemMetrics(),
          get().fetchSystemStats(),
        ]);

        set({ refreshing: false });
      },

      fetchLogsData: async () => {
        await get().fetchLogs();
      },

      fetchAuditData: async () => {
        await get().fetchAudit();
      },

      fetchHealthData: async () => {
        set({ refreshing: true });

        await Promise.allSettled([
          get().fetchSystemHealth(),
          get().fetchDatabaseHealth(),
        ]);

        set({ refreshing: false });
      },

      // Specific fetchers
      fetchSystemStats: async () => {
        set(state => ({
          systemStats: updateNormalizedResponse(state.systemStats, { loading: true, error: null })
        }));

        try {
          const data = await AdminApi.getSystemStats();
          set(state => ({
            systemStats: updateNormalizedResponse(state.systemStats, { data, loading: false })
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch system stats';
          set(state => ({
            systemStats: updateNormalizedResponse(state.systemStats, {
              loading: false,
              error: message
            })
          }));
        }
      },

      fetchUserActivity: async () => {
        set(state => ({
          userActivity: updateNormalizedResponse(state.userActivity, { loading: true, error: null })
        }));

        try {
          const data = await AdminApi.getUserActivity(20);
          set(state => ({
            userActivity: updateNormalizedResponse(state.userActivity, { data, loading: false })
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch user activity';
          set(state => ({
            userActivity: updateNormalizedResponse(state.userActivity, {
              loading: false,
              error: message
            })
          }));
        }
      },

      fetchSystemMetrics: async () => {
        set(state => ({
          systemMetrics: updateNormalizedResponse(state.systemMetrics, { loading: true, error: null })
        }));

        try {
          const data = await AdminApi.getSystemMetrics();
          set(state => ({
            systemMetrics: updateNormalizedResponse(state.systemMetrics, { data, loading: false })
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch system metrics';
          set(state => ({
            systemMetrics: updateNormalizedResponse(state.systemMetrics, {
              loading: false,
              error: message
            })
          }));
        }
      },

      fetchSecurityAudit: async () => {
        set(state => ({
          securityAudit: updateNormalizedResponse(state.securityAudit, { loading: true, error: null })
        }));

        try {
          const { audit } = get();
          const data = await AdminApi.getSecurityAudit({
            from: audit.from || undefined,
            to: audit.to || undefined,
          });
          set(state => ({
            securityAudit: updateNormalizedResponse(state.securityAudit, { data, loading: false })
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch security audit';
          set(state => ({
            securityAudit: updateNormalizedResponse(state.securityAudit, {
              loading: false,
              error: message
            })
          }));
        }
      },

      fetchSystemHealth: async () => {
        set(state => ({
          systemHealth: updateNormalizedResponse(state.systemHealth, { loading: true, error: null })
        }));

        try {
          const data = await AdminApi.getSystemHealth();
          set(state => ({
            systemHealth: updateNormalizedResponse(state.systemHealth, { data, loading: false })
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch system health';
          set(state => ({
            systemHealth: updateNormalizedResponse(state.systemHealth, {
              loading: false,
              error: message
            })
          }));
        }
      },

      fetchDatabaseHealth: async () => {
        set(state => ({
          databaseHealth: updateNormalizedResponse(state.databaseHealth, { loading: true, error: null })
        }));

        try {
          const data = await AdminApi.getDatabaseHealth();
          set(state => ({
            databaseHealth: updateNormalizedResponse(state.databaseHealth, { data, loading: false })
          }));
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch database health';
          set(state => ({
            databaseHealth: updateNormalizedResponse(state.databaseHealth, {
              loading: false,
              error: message
            })
          }));
        }
      },

      // Log management
      updateLogsFilters: (filters) => {
        set(state => ({
          logs: { ...state.logs, ...filters }
        }));
      },

      fetchLogs: async () => {
        set(state => ({
          logs: { ...state.logs, loading: true, error: null }
        }));

        try {
          const { logs } = get();
          const response = await AdminApi.getSystemLogs(logs.level, logs.limit, {
            from: logs.from || undefined,
            to: logs.to || undefined,
            search: logs.search || undefined,
            skip: logs.skip,
            envelope: true,
          });

          if ('items' in response) {
            set(state => ({
              logs: {
                ...state.logs,
                data: response.items,
                items: response.items,
                total: response.total,
                skip: response.skip,
                loading: false,
                lastUpdated: Date.now(),
              }
            }));
          } else {
            set(state => ({
              logs: {
                ...state.logs,
                data: response,
                items: response,
                loading: false,
                lastUpdated: Date.now(),
              }
            }));
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch logs';
          set(state => ({
            logs: { ...state.logs, loading: false, error: message }
          }));
        }
      },

      // Audit management
      updateAuditFilters: (filters) => {
        set(state => ({
          audit: { ...state.audit, ...filters }
        }));
      },

      fetchAudit: async () => {
        set(state => ({
          audit: { ...state.audit, loading: true, error: null }
        }));

        try {
          const { audit } = get();
          const response = await AdminApi.getAuditLogs(
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
            set(state => ({
              audit: {
                ...state.audit,
                data: response.items,
                items: response.items,
                total: response.total,
                skip: response.skip,
                loading: false,
                lastUpdated: Date.now(),
              }
            }));
          } else if ('logs' in response) {
            set(state => ({
              audit: {
                ...state.audit,
                data: response.logs,
                items: response.logs,
                total: response.total,
                skip: response.skip,
                loading: false,
                lastUpdated: Date.now(),
              }
            }));
          }
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to fetch audit logs';
          set(state => ({
            audit: { ...state.audit, loading: false, error: message }
          }));
        }
      },

      // Utilities
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
    {
      name: 'admin-store',
    }
  )
);
