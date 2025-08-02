/**
 * Dashboard Integration Tests
 * 
 * Tests for the new dashboard API integration and mock data removal
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DashboardApiService } from '../services/dashboardApi';
import { useCashFlowDashboard, usePLDashboard } from '../hooks/useDashboardData';
import DashboardCacheManager from '../utils/dashboardCache';

// Mock the API service
vi.mock('../services/dashboardApi');

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

  describe('API Service Integration', () => {
    it('should call the correct API endpoint for cash flow data', async () => {
      const mockData = {
        metrics: [],
        charts: {
          cash_waterfall: [],
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
        data_quality_score: 0.9,
        generated_at: '2024-01-01T00:00:00Z',
      };

      vi.mocked(DashboardApiService.getCashFlowMetrics).mockResolvedValue(mockData);

      // Create a test component that uses the hook
      const TestComponent = () => {
        const { data } = useCashFlowDashboard('ytd');
        return <div data-testid="test-data">{data ? 'Data loaded' : 'Loading'}</div>;
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

    it('should call the correct API endpoint for P&L data', async () => {
      const mockData = {
        metrics: [],
        charts: {
          revenue_trend: [],
          profit_margins: [],
          expense_breakdown: [],
          gross_margin_trend: [],
          operating_margin_trend: [],
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
        return <div data-testid="test-data">{data ? 'Data loaded' : 'Loading'}</div>;
      };

      render(
        <QueryClientProvider client={queryClient}>
          <TestComponent />
        </QueryClientProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-data')).toHaveTextContent('Data loaded');
      });

      expect(DashboardApiService.getPLMetrics).toHaveBeenCalledWith('qtd', undefined);
    });
  });

  describe('Cache Manager', () => {
    it('should generate correct cache keys', () => {
      const cashFlowKey = DashboardCacheManager.getCacheKey('CASH_FLOW', 'ytd', 123);
      const plKey = DashboardCacheManager.getCacheKey('PL', 'qtd');

      expect(cashFlowKey).toEqual(['cash-flow-dashboard', 'ytd', '123']);
      expect(plKey).toEqual(['pl-dashboard', 'qtd']);
    });

    it('should optimize chart data for large datasets', () => {
      const largeDataset = Array.from({ length: 200 }, (_, i) => ({
        period: `Period ${i}`,
        value: i * 100,
      }));

      const optimized = DashboardCacheManager.optimizeChartData(largeDataset, 50);

      expect(optimized.length).toBeLessThanOrEqual(50);
      expect(optimized[0]).toEqual({ period: 'Period 0', value: 0 });
    });

    it('should compress data by rounding numbers', () => {
      const testData = [
        { name: 'Test', value: 123.456789, description: 'Sample data' },
        { name: 'Test2', value: 999.999999, nullField: null, undefinedField: undefined },
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

      vi.mocked(DashboardApiService.getCashFlowMetrics).mockRejectedValue(errorResponse);

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

      await waitFor(() => {
        expect(screen.getByTestId('error-display')).toHaveTextContent('API Error');
      }, { timeout: 3000 });
    });
  });
});