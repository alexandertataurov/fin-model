/**
 * Admin Store Tests
 * 
 * Comprehensive tests for the admin dashboard state management
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAdminStore } from '../adminStore';
import AdminApiService from '../../services/adminApi';

// Mock the API service
vi.mock('../../services/adminApi');
const mockAdminApiService = vi.mocked(AdminApiService);

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('AdminStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAdminStore.setState(useAdminStore.getInitialState());
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAdminStore());
      
      expect(result.current.activeTab).toBe('overview');
      expect(result.current.autoRefreshEnabled).toBe(true);
      expect(result.current.refreshing).toBe(false);
      expect(result.current.systemStats.data).toBeNull();
      expect(result.current.systemStats.loading).toBe(false);
      expect(result.current.userActivity.data).toBeNull();
      expect(result.current.logs.items).toEqual([]);
    });
  });

  describe('Tab Management', () => {
    it('should update active tab', () => {
      const { result } = renderHook(() => useAdminStore());
      
      act(() => {
        result.current.setActiveTab('users');
      });
      
      expect(result.current.activeTab).toBe('users');
    });

    it('should update auto refresh setting', () => {
      const { result } = renderHook(() => useAdminStore());
      
      act(() => {
        result.current.setAutoRefresh(false);
      });
      
      expect(result.current.autoRefreshEnabled).toBe(false);
    });
  });

  describe('Data Fetching', () => {
    it('should fetch system stats successfully', async () => {
      const mockStats = {
        users: { total: 100, active: 80, verified: 75, new_24h: 5 },
        files: { total: 1000, completed: 950, processing: 30, failed: 20 },
        financial_data: { statements: 500, parameters: 200 },
        system: { database_size: '2.5 GB', timestamp: '2023-01-01T00:00:00Z' },
        performance: { avg_file_size_mb: 1.2 },
      };

      mockAdminApiService.getSystemStats.mockResolvedValueOnce(mockStats);

      const { result } = renderHook(() => useAdminStore());

      await act(async () => {
        await result.current.fetchSystemStats();
      });

      expect(result.current.systemStats.data).toEqual(mockStats);
      expect(result.current.systemStats.loading).toBe(false);
      expect(result.current.systemStats.error).toBeNull();
      expect(result.current.systemStats.lastUpdated).toBeTypeOf('number');
    });

    it('should handle system stats fetch error', async () => {
      const error = new Error('Network error');
      mockAdminApiService.getSystemStats.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAdminStore());

      await act(async () => {
        await result.current.fetchSystemStats();
      });

      expect(result.current.systemStats.data).toBeNull();
      expect(result.current.systemStats.loading).toBe(false);
      expect(result.current.systemStats.error).toBe('Network error');
    });

    it('should fetch user activity successfully', async () => {
      const mockActivity = [
        {
          user_id: 1,
          username: 'testuser',
          last_login: '2023-01-01T12:00:00Z',
          login_count: 10,
          files_uploaded: 5,
          models_created: 3,
          is_active: true,
        },
      ];

      mockAdminApiService.getUserActivity.mockResolvedValueOnce(mockActivity);

      const { result } = renderHook(() => useAdminStore());

      await act(async () => {
        await result.current.fetchUserActivity();
      });

      expect(result.current.userActivity.data).toEqual(mockActivity);
      expect(result.current.userActivity.loading).toBe(false);
      expect(result.current.userActivity.error).toBeNull();
    });

    it('should fetch system metrics successfully', async () => {
      const mockMetrics = {
        cpu_usage: 45.2,
        memory_usage: 67.8,
        disk_usage: 23.1,
        active_connections: 15,
        request_count_24h: 1234,
        error_rate_24h: 0.02,
        avg_response_time: 250,
      };

      mockAdminApiService.getSystemMetrics.mockResolvedValueOnce(mockMetrics);

      const { result } = renderHook(() => useAdminStore());

      await act(async () => {
        await result.current.fetchSystemMetrics();
      });

      expect(result.current.systemMetrics.data).toEqual(mockMetrics);
    });
  });

  describe('Context-Aware Fetching', () => {
    it('should fetch overview data', async () => {
      const mockStats = { users: { total: 100 } };
      const mockActivity = [{ user_id: 1, username: 'test' }];
      const mockMetrics = { cpu_usage: 50 };

      mockAdminApiService.getSystemStats.mockResolvedValueOnce(mockStats);
      mockAdminApiService.getUserActivity.mockResolvedValueOnce(mockActivity);
      mockAdminApiService.getSystemMetrics.mockResolvedValueOnce(mockMetrics);

      const { result } = renderHook(() => useAdminStore());

      await act(async () => {
        await result.current.fetchOverviewData();
      });

      expect(mockAdminApiService.getSystemStats).toHaveBeenCalled();
      expect(mockAdminApiService.getUserActivity).toHaveBeenCalled();
      expect(mockAdminApiService.getSystemMetrics).toHaveBeenCalled();
      expect(result.current.refreshing).toBe(false);
    });

    it('should fetch system data', async () => {
      const mockMetrics = { cpu_usage: 50 };
      const mockStats = { users: { total: 100 } };

      mockAdminApiService.getSystemMetrics.mockResolvedValueOnce(mockMetrics);
      mockAdminApiService.getSystemStats.mockResolvedValueOnce(mockStats);

      const { result } = renderHook(() => useAdminStore());

      await act(async () => {
        await result.current.fetchSystemData();
      });

      expect(mockAdminApiService.getSystemMetrics).toHaveBeenCalled();
      expect(mockAdminApiService.getSystemStats).toHaveBeenCalled();
    });
  });

  describe('Logs Management', () => {
    it('should update logs filters', () => {
      const { result } = renderHook(() => useAdminStore());

      act(() => {
        result.current.updateLogsFilters({
          level: 'ERROR',
          search: 'test error',
          limit: 50,
        });
      });

      expect(result.current.logs.level).toBe('ERROR');
      expect(result.current.logs.search).toBe('test error');
      expect(result.current.logs.limit).toBe(50);
    });

    it('should fetch logs with envelope response', async () => {
      const mockLogsResponse = {
        items: [
          {
            timestamp: '2023-01-01T12:00:00Z',
            level: 'ERROR',
            message: 'Test error',
            module: 'auth',
          },
        ],
        total: 1,
        skip: 0,
      };

      mockAdminApiService.getSystemLogs.mockResolvedValueOnce(mockLogsResponse);

      const { result } = renderHook(() => useAdminStore());

      await act(async () => {
        await result.current.fetchLogs();
      });

      expect(result.current.logs.items).toEqual(mockLogsResponse.items);
      expect(result.current.logs.total).toBe(1);
      expect(result.current.logs.loading).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should clear all errors', () => {
      const { result } = renderHook(() => useAdminStore());

      // Set some errors first
      act(() => {
        useAdminStore.setState({
          systemStats: { 
            data: null, 
            loading: false, 
            error: 'Test error', 
            lastUpdated: null 
          },
          userActivity: { 
            data: null, 
            loading: false, 
            error: 'Another error', 
            lastUpdated: null 
          },
        });
      });

      act(() => {
        result.current.clearErrors();
      });

      expect(result.current.systemStats.error).toBeNull();
      expect(result.current.userActivity.error).toBeNull();
    });
  });

  describe('Refresh All', () => {
    it('should refresh data based on active tab', async () => {
      const { result } = renderHook(() => useAdminStore());

      // Mock all API calls
      mockAdminApiService.getSystemStats.mockResolvedValue({});
      mockAdminApiService.getUserActivity.mockResolvedValue([]);
      mockAdminApiService.getSystemMetrics.mockResolvedValue({});

      // Test overview tab
      act(() => {
        result.current.setActiveTab('overview');
      });

      await act(async () => {
        await result.current.refreshAll();
      });

      expect(mockAdminApiService.getSystemStats).toHaveBeenCalled();
      expect(mockAdminApiService.getUserActivity).toHaveBeenCalled();
      expect(mockAdminApiService.getSystemMetrics).toHaveBeenCalled();

      vi.clearAllMocks();

      // Test logs tab
      mockAdminApiService.getSystemLogs.mockResolvedValue({ items: [], total: 0 });

      act(() => {
        result.current.setActiveTab('logs');
      });

      await act(async () => {
        await result.current.refreshAll();
      });

      expect(mockAdminApiService.getSystemLogs).toHaveBeenCalled();
    });
  });

  describe('Loading States', () => {
    it('should set loading state during fetch', async () => {
      let resolvePromise: (value: any) => void;
      const promise = new Promise(resolve => {
        resolvePromise = resolve;
      });

      mockAdminApiService.getSystemStats.mockReturnValueOnce(promise);

      const { result } = renderHook(() => useAdminStore());

      // Start fetch
      act(() => {
        result.current.fetchSystemStats();
      });

      // Should be loading
      expect(result.current.systemStats.loading).toBe(true);

      // Resolve promise
      await act(async () => {
        resolvePromise({});
        await promise;
      });

      // Should no longer be loading
      expect(result.current.systemStats.loading).toBe(false);
    });
  });

  describe('Data Normalization', () => {
    it('should preserve data structure consistency', async () => {
      const mockStats = {
        users: { total: 100, active: 80 },
        files: { total: 1000, completed: 950 },
      };

      mockAdminApiService.getSystemStats.mockResolvedValueOnce(mockStats);

      const { result } = renderHook(() => useAdminStore());

      await act(async () => {
        await result.current.fetchSystemStats();
      });

      expect(result.current.systemStats.data).toMatchObject({
        users: expect.objectContaining({
          total: expect.any(Number),
          active: expect.any(Number),
        }),
        files: expect.objectContaining({
          total: expect.any(Number),
          completed: expect.any(Number),
        }),
      });
    });
  });

  describe('Concurrent Operations', () => {
    it('should handle concurrent fetch operations', async () => {
      const mockStats1 = { users: { total: 100 } };
      const mockStats2 = { users: { total: 200 } };

      mockAdminApiService.getSystemStats
        .mockResolvedValueOnce(mockStats1)
        .mockResolvedValueOnce(mockStats2);

      const { result } = renderHook(() => useAdminStore());

      // Start two concurrent fetches
      const promise1 = act(async () => {
        await result.current.fetchSystemStats();
      });

      const promise2 = act(async () => {
        await result.current.fetchSystemStats();
      });

      await Promise.all([promise1, promise2]);

      // Should have the last resolved value
      expect(result.current.systemStats.data?.users.total).toBeDefined();
    });
  });
});
