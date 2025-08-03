/**
 * Dashboard Integration Tests
 *
 * Tests for the new dashboard API integration and mock data removal
 */

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import {
  useCashFlowDashboard,
  usePLDashboard,
} from '../hooks/useDashboardData';
import { DashboardApiService } from '../services/dashboardApi';

// Mock the dashboard API service
vi.mock('../services/dashboardApi', () => ({
  DashboardApiService: {
    getCashFlowMetrics: vi.fn(),
    getPLMetrics: vi.fn(),
    getBalanceSheetMetrics: vi.fn(),
    refreshDashboard: vi.fn(),
  },
}));

// Mock the cache manager
vi.mock('../utils/dashboardCache', () => ({
  DashboardCacheManager: {
    getCacheKey: vi.fn((type, period, fileId) => {
      const keys = {
        CASH_FLOW: 'cash-flow-dashboard',
        PL: 'pl-dashboard',
        BALANCE_SHEET: 'balance-sheet-dashboard',
      };
      return [keys[type] || type, period, fileId?.toString()].filter(Boolean);
    }),
    getQueryConfig: vi.fn(() => ({ staleTime: 300000, cacheTime: 600000 })),
    optimizeChartData: vi.fn(data => data),
    compressData: vi.fn(data => data),
    invalidateCache: vi.fn(),
    prefetchDashboard: vi.fn(),
    getCachedData: vi.fn(),
    isDataStale: vi.fn(),
    cleanup: vi.fn(),
  },
}));

describe('Dashboard Integration', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  describe('Cash Flow Dashboard', () => {
    it('should fetch cash flow data successfully', async () => {
      const mockData = {
        overview: {
          total_cash_flow: 1000000,
          operating_cash_flow: 500000,
          investing_cash_flow: -200000,
          financing_cash_flow: 300000,
        },
        charts: {
          monthly_cash_flow: [
            { month: 'Jan', value: 100000 },
            { month: 'Feb', value: 150000 },
          ],
        },
        period_info: {
          period: 'ytd',
          start_date: '2024-01-01',
          end_date: '2024-12-31',
        },
        last_updated: '2024-01-01T00:00:00Z',
        data_quality_score: 0.85,
        generated_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(DashboardApiService.getCashFlowMetrics).mockResolvedValue(
        mockData
      );

      const TestComponent = () => {
        const { data } = useCashFlowDashboard('ytd');
        return (
          <div data-testid="test-data">{data ? 'Data loaded' : 'Loading'}</div>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-data')).toHaveTextContent(
          'Data loaded'
        );
      });

      expect(DashboardApiService.getCashFlowMetrics).toHaveBeenCalledWith(
        'ytd',
        undefined
      );
    });
  });

  describe('P&L Dashboard', () => {
    it('should fetch P&L data successfully', async () => {
      const mockData = {
        overview: {
          total_revenue: 2000000,
          total_expenses: 1500000,
          net_income: 500000,
          gross_margin: 0.75,
        },
        charts: {
          revenue_by_month: [
            { month: 'Jan', value: 200000 },
            { month: 'Feb', value: 250000 },
          ],
        },
        period_info: {
          period: 'qtd',
          start_date: '2024-01-01',
          end_date: '2024-03-31',
        },
        last_updated: '2024-01-01T00:00:00Z',
        data_quality_score: 0.85,
        generated_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(DashboardApiService.getPLMetrics).mockResolvedValue(mockData);

      const TestComponent = () => {
        const { data } = usePLDashboard('qtd');
        return (
          <div data-testid="test-data">{data ? 'Data loaded' : 'Loading'}</div>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-data')).toHaveTextContent(
          'Data loaded'
        );
      });

      expect(DashboardApiService.getPLMetrics).toHaveBeenCalledWith(
        'qtd',
        undefined
      );
    });
  });

  describe('Cache Manager', () => {
    it('should generate correct cache keys', () => {
      const { DashboardCacheManager } = require('../utils/dashboardCache');
      const cashFlowKey = DashboardCacheManager.getCacheKey(
        'CASH_FLOW',
        'ytd',
        123
      );
      const plKey = DashboardCacheManager.getCacheKey('PL', 'qtd');

      expect(cashFlowKey).toEqual(['cash-flow-dashboard', 'ytd', '123']);
      expect(plKey).toEqual(['pl-dashboard', 'qtd']);
    });

    it('should optimize chart data for large datasets', () => {
      const { DashboardCacheManager } = require('../utils/dashboardCache');
      const largeDataset = Array.from({ length: 200 }, (_, i) => ({
        period: `Period ${i}`,
        value: i * 100,
      }));

      const optimized = DashboardCacheManager.optimizeChartData(
        largeDataset,
        50
      );

      expect(optimized.length).toBeLessThanOrEqual(50);
      expect(optimized[0]).toEqual({ period: 'Period 0', value: 0 });
    });

    it('should compress data by rounding numbers', () => {
      const { DashboardCacheManager } = require('../utils/dashboardCache');
      const testData = [
        { name: 'Test', value: 123.456789, description: 'Sample data' },
        {
          name: 'Test2',
          value: 999.999999,
          nullField: null,
          undefinedField: undefined,
        },
      ];

      const compressed = DashboardCacheManager.compressData(testData);

      expect(compressed).toEqual([
        { name: 'Test', value: 123.46, description: 'Sample data' },
        { name: 'Test2', value: 1000 },
      ]);
    });
  });

  describe('Error Handling', () => {
    it('should handle API errors gracefully', async () => {
      const errorResponse = {
        response: {
          data: { message: 'API Error' },
          status: 500,
        },
      };

      vi.mocked(DashboardApiService.getCashFlowMetrics).mockRejectedValue(
        errorResponse
      );

      const TestComponent = () => {
        const { error, isError } = useCashFlowDashboard('ytd');
        return (
          <div data-testid="error-display">
            {isError && error ? error.message : 'No error'}
          </div>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>
      );

      // Wait for the error to be set
      await waitFor(
        () => {
          expect(screen.getByTestId('error-display')).toHaveTextContent(
            'Failed to fetch cash flow dashboard data'
          );
        },
        { timeout: 5000 }
      );
    });
  });
});
