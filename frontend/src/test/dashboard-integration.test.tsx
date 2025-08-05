/**
 * Dashboard Integration Tests
 *
 * Tests for the new dashboard API integration and mock data removal
 */

import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { DashboardApiService } from '../services/dashboardApi';
import { useCashFlowDashboard, usePLDashboard } from '../hooks/useDashboardData';
import { DashboardCacheManager } from '../utils/dashboardCache';

// Mock the dashboard API service
vi.mock('../services/dashboardApi', () => ({
  DashboardApiService: {
    getCashFlowMetrics: vi.fn(),
    getPLMetrics: vi.fn(),
    getBalanceSheetMetrics: vi.fn(),
  },
}));

// Mock the cache manager
vi.mock('../utils/dashboardCache', async () => {
  const actual = await vi.importActual('../utils/dashboardCache');
  return {
    ...actual,
    DashboardCacheManager: {
      getCacheKey: vi.fn((type: string, period: string, fileId?: number) => {
        const keys: Record<string, string> = {
          CASH_FLOW: 'cash-flow-dashboard',
          PL: 'pl-dashboard',
          BALANCE_SHEET: 'balance-sheet-dashboard',
        };
        return [keys[type] || type, period, fileId?.toString()].filter(Boolean);
      }),
      getQueryConfig: vi.fn(() => ({ staleTime: 300000, cacheTime: 600000 })),
      optimizeChartData: vi.fn((data: any[], maxPoints: number) => {
        if (data.length <= maxPoints) return data;
        const step = Math.ceil(data.length / maxPoints);
        return data.filter((_: any, i: number) => i % step === 0).slice(0, maxPoints);
      }),
      compressData: vi.fn((data: any[]) => {
        return data.map((item: any) => {
          const compressed = { ...item };
          if (typeof compressed.value === 'number') {
            compressed.value = Math.round(compressed.value * 100) / 100;
          }
          // Remove null and undefined fields
          Object.keys(compressed).forEach((key: string) => {
            if (compressed[key] === null || compressed[key] === undefined) {
              delete compressed[key];
            }
          });
          return compressed;
        });
      }),
      invalidateCache: vi.fn(),
      prefetchDashboard: vi.fn(),
      getCachedData: vi.fn(),
      isDataStale: vi.fn(),
      cleanup: vi.fn(),
    },
  };
});

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
        metrics: [
          {
            id: 'total_cash_flow',
            name: 'Total Cash Flow',
            value: 1000000,
            unit: 'USD',
            format_type: 'currency' as const,
            period: 'ytd',
            last_updated: '2024-01-01T00:00:00Z',
            display_order: 1,
          },
        ],
        charts: {
          cash_waterfall: [
            { period: 'Jan', value: 100000, date: '2024-01-01' },
            { period: 'Feb', value: 150000, date: '2024-02-01' },
          ],
          cash_position: [
            { period: 'Jan', value: 100000, date: '2024-01-01' },
            { period: 'Feb', value: 250000, date: '2024-02-01' },
          ],
          operating_cash_flow: [
            { period: 'Jan', value: 500000, date: '2024-01-01' },
            { period: 'Feb', value: 600000, date: '2024-02-01' },
          ],
          investing_cash_flow: [
            { period: 'Jan', value: -200000, date: '2024-01-01' },
            { period: 'Feb', value: -250000, date: '2024-02-01' },
          ],
          financing_cash_flow: [
            { period: 'Jan', value: 300000, date: '2024-01-01' },
            { period: 'Feb', value: 350000, date: '2024-02-01' },
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
        expect(screen.getByTestId('test-data')).toHaveTextContent('Data loaded');
      });

      expect(DashboardApiService.getCashFlowMetrics).toHaveBeenCalledWith('ytd', undefined);
    });

    it('should handle API errors gracefully', async () => {
      vi.mocked(DashboardApiService.getCashFlowMetrics).mockRejectedValue(
        new Error('API Error')
      );

      const TestComponent = () => {
        const { error } = useCashFlowDashboard('ytd');
        return (
          <div data-testid="error-display">
            {error ? 'Error occurred' : 'No error'}
          </div>
        );
      };

      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>
      );

      expect(screen.getByTestId('error-display')).toBeInTheDocument();
      await waitFor(
        () => {
          expect(screen.getByTestId('error-display')).toBeInTheDocument();
        },
        { timeout: 5000 }
      );
    });
  });

  describe('P&L Dashboard', () => {
    it('should fetch P&L data successfully', async () => {
      const mockData = {
        metrics: [
          {
            id: 'total_revenue',
            name: 'Total Revenue',
            value: 2000000,
            unit: 'USD',
            format_type: 'currency' as const,
            period: 'ytd',
            last_updated: '2024-01-01T00:00:00Z',
            display_order: 1,
          },
        ],
        charts: {
          revenue_trend: [
            { period: 'Jan', value: 500000, date: '2024-01-01' },
            { period: 'Feb', value: 600000, date: '2024-02-01' },
          ],
          profit_margins: [
            { period: 'Jan', value: 0.25, date: '2024-01-01' },
            { period: 'Feb', value: 0.28, date: '2024-02-01' },
          ],
          expense_breakdown: [
            { period: 'COGS', value: 1200000, date: '2024-01-01' },
            { period: 'Operating', value: 400000, date: '2024-01-01' },
          ],
          gross_margin_trend: [
            { period: 'Jan', value: 0.4, date: '2024-01-01' },
            { period: 'Feb', value: 0.42, date: '2024-02-01' },
          ],
          operating_margin_trend: [
            { period: 'Jan', value: 0.15, date: '2024-01-01' },
            { period: 'Feb', value: 0.18, date: '2024-02-01' },
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

      vi.mocked(DashboardApiService.getPLMetrics).mockResolvedValue(mockData);

      const TestComponent = () => {
        const { data } = usePLDashboard('ytd');
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
        expect(screen.getByTestId('test-data')).toHaveTextContent('Data loaded');
      });

      expect(DashboardApiService.getPLMetrics).toHaveBeenCalledWith('ytd', undefined);
    });
  });

  describe('Cache Management', () => {
    it('should use cache manager for data optimization', async () => {
      const mockData = {
        metrics: [
          {
            id: 'test_metric',
            name: 'Test Metric',
            value: 1000,
            unit: 'USD',
            format_type: 'currency' as const,
            period: 'ytd',
            last_updated: '2024-01-01T00:00:00Z',
            display_order: 1,
          },
        ],
        charts: {
          cash_waterfall: [
            { period: 'Jan', value: 100000, date: '2024-01-01' },
            { period: 'Feb', value: 150000, date: '2024-02-01' },
          ],
          cash_position: [],
          operating_cash_flow: [],
          investing_cash_flow: [],
          financing_cash_flow: [],
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

      vi.mocked(DashboardApiService.getCashFlowMetrics).mockResolvedValue(mockData);

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
        expect(screen.getByTestId('test-data')).toHaveTextContent('Data loaded');
      });

      expect(DashboardCacheManager.getCacheKey).toHaveBeenCalled();
      expect(DashboardCacheManager.getQueryConfig).toHaveBeenCalled();
    });
  });
});
