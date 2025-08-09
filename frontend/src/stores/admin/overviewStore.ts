import { StateCreator } from 'zustand';
import AdminApiService, {
  SystemStats,
  UserActivity,
  SystemMetrics,
  DataIntegrityCheck,
  SecurityAudit,
  UserPermissions,
} from '@/services/adminApi';
import {
  NormalizedApiResponse,
  createNormalizedResponse,
  updateNormalizedResponse,
} from './types';

export interface OverviewSlice {
  systemStats: NormalizedApiResponse<SystemStats>;
  userActivity: NormalizedApiResponse<UserActivity[]>;
  systemMetrics: NormalizedApiResponse<SystemMetrics>;
  dataIntegrity: NormalizedApiResponse<DataIntegrityCheck[]>;
  securityAudit: NormalizedApiResponse<SecurityAudit>;
  systemHealth: NormalizedApiResponse<any>;
  databaseHealth: NormalizedApiResponse<any>;
  userPermissions: NormalizedApiResponse<UserPermissions>;

  fetchOverviewData: () => Promise<void>;
  fetchSystemData: () => Promise<void>;
  fetchHealthData: () => Promise<void>;
  fetchSystemStats: () => Promise<void>;
  fetchUserActivity: () => Promise<void>;
  fetchSystemMetrics: () => Promise<void>;
  fetchSecurityAudit: () => Promise<void>;
  fetchSystemHealth: () => Promise<void>;
  fetchDatabaseHealth: () => Promise<void>;
}

export const createOverviewSlice: StateCreator<
  OverviewSlice,
  [],
  [],
  OverviewSlice
> = (set, get) => ({
  systemStats: createNormalizedResponse<SystemStats>(),
  userActivity: createNormalizedResponse<UserActivity[]>(),
  systemMetrics: createNormalizedResponse<SystemMetrics>(),
  dataIntegrity: createNormalizedResponse<DataIntegrityCheck[]>(),
  securityAudit: createNormalizedResponse<SecurityAudit>(),
  systemHealth: createNormalizedResponse<any>(),
  databaseHealth: createNormalizedResponse<any>(),
  userPermissions: createNormalizedResponse<UserPermissions>(),

  fetchOverviewData: async () => {
    set({ refreshing: true });

    const state: any = get();
    const promises = [
      get().fetchSystemStats(),
      get().fetchUserActivity(),
      get().fetchSystemMetrics(),
    ];

    if (state.securityAudit.data || state.audit?.from || state.audit?.to) {
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

  fetchHealthData: async () => {
    set({ refreshing: true });

    await Promise.allSettled([
      get().fetchSystemHealth(),
      get().fetchDatabaseHealth(),
    ]);

    set({ refreshing: false });
  },

  fetchSystemStats: async () => {
    set(state => ({
      systemStats: updateNormalizedResponse(state.systemStats, { loading: true, error: null })
    }));

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

  fetchUserActivity: async () => {
    set(state => ({
      userActivity: updateNormalizedResponse(state.userActivity, { loading: true, error: null })
    }));

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

  fetchSystemMetrics: async () => {
    set(state => ({
      systemMetrics: updateNormalizedResponse(state.systemMetrics, { loading: true, error: null })
    }));

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
      const audit: any = get().audit;
      const data = await AdminApiService.getSecurityAudit({
        from: audit?.from || undefined,
        to: audit?.to || undefined,
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
});
