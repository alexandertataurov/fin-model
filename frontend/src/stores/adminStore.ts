/**
 * Admin Dashboard Store
 *
 * Centralized state management for admin dashboard data using Zustand
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import AdminApiService, {
  SystemStats,
  SystemMetrics,
  DataIntegrityCheck,
  SecurityAudit,
  LogEntry,
  UserPermissions,
  AuditEntry,
} from '@/services/adminApi';
import { UserActivity } from '@/types/admin';
import { toast } from 'sonner';
import { createAsyncResource } from './utils';

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
      fetchSystemStats: createAsyncResource(
        set,
        get,
        'systemStats',
        async () => AdminApiService.getSystemStats()
      ),

<<<<<<< HEAD
      fetchUserActivity: createAsyncResource(
        set,
        get,
        'userActivity',
        async () => AdminApiService.getUserActivity(20)
      ),
=======
        try {
          const data = await AdminApiService.getSystemStats();
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
>>>>>>> pre-production

      fetchSystemMetrics: createAsyncResource(
        set,
        get,
        'systemMetrics',
        async () => AdminApiService.getSystemMetrics()
      ),

<<<<<<< HEAD
      fetchSecurityAudit: createAsyncResource(
        set,
        get,
        'securityAudit',
        async (state) =>
          AdminApiService.getSecurityAudit({
            from: state.audit.from || undefined,
            to: state.audit.to || undefined,
          })
      ),
=======
        try {
          const data = await AdminApiService.getUserActivity(20);
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
>>>>>>> pre-production

      fetchSystemHealth: createAsyncResource(
        set,
        get,
        'systemHealth',
        async () => AdminApiService.getSystemHealth()
      ),

<<<<<<< HEAD
      fetchDatabaseHealth: createAsyncResource(
        set,
        get,
        'databaseHealth',
        async () => AdminApiService.getDatabaseHealth()
      ),
=======
        try {
          const data = await AdminApiService.getSystemMetrics();
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
          const data = await AdminApiService.getSecurityAudit({
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
          const data = await AdminApiService.getSystemHealth();
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
          const data = await AdminApiService.getDatabaseHealth();
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
>>>>>>> pre-production

      // Log management
      updateLogsFilters: (filters) => {
        set(state => ({
          logs: { ...state.logs, ...filters }
        }));
      },

      fetchLogs: createAsyncResource(
        set,
        get,
        'logs',
        async (state) =>
          AdminApiService.getSystemLogs(state.logs.level, state.logs.limit, {
            from: state.logs.from || undefined,
            to: state.logs.to || undefined,
            search: state.logs.search || undefined,
            skip: state.logs.skip,
            envelope: true,
          }),
        (response) => {
          if ('items' in (response as any)) {
            const r: any = response;
            return {
              data: r.items,
              items: r.items,
              total: r.total,
              skip: r.skip,
            } as any;
          }
          return { data: response as any, items: response as any } as any;
        }
      ),

      // Audit management
      updateAuditFilters: (filters) => {
        set(state => ({
          audit: { ...state.audit, ...filters }
        }));
      },

      fetchAudit: createAsyncResource(
        set,
        get,
        'audit',
        async (state) =>
          AdminApiService.getAuditLogs(
            state.audit.skip,
            state.audit.limit,
            state.audit.userId,
            state.audit.action,
            {
              from: state.audit.from || undefined,
              to: state.audit.to || undefined,
              envelope: true,
            }
          ),
        (response) => {
          const r: any = response;
          if ('items' in r) {
            return {
              data: r.items,
              items: r.items,
              total: r.total,
              skip: r.skip,
            } as any;
          }
          if ('logs' in r) {
            return {
              data: r.logs,
              items: r.logs,
              total: r.total,
              skip: r.skip,
            } as any;
          }
          return { data: r } as any;
        }
      ),

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
