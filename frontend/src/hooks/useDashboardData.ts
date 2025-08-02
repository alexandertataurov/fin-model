/**
 * Custom hooks for dashboard data fetching
 * 
 * Provides consistent data fetching patterns with error handling and caching
 */

import { useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { DashboardApiService } from '../services/dashboardApi';
import { 
  CashFlowDashboardData, 
  PLDashboardData, 
  DashboardData,
  DashboardPeriod,
  DashboardError,
  BalanceSheetDashboardData,
  FinancialRatio 
} from '../types/dashboard';
import DashboardCacheManager from '../utils/dashboardCache';

export interface DashboardQueryOptions {
  enabled?: boolean;
  staleTime?: number;
  cacheTime?: number;
  refetchOnWindowFocus?: boolean;
}

const DEFAULT_OPTIONS: DashboardQueryOptions = {
  enabled: true,
  ...DashboardCacheManager.getQueryConfig(),
};

/**
 * Hook for fetching cash flow dashboard data
 */
export const useCashFlowDashboard = (
  period: DashboardPeriod,
  fileId?: number,
  options: DashboardQueryOptions = {}
): UseQueryResult<CashFlowDashboardData, DashboardError> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  return useQuery({
    queryKey: DashboardCacheManager.getCacheKey('CASH_FLOW', period, fileId),
    queryFn: async () => {
      try {
        const data = await DashboardApiService.getCashFlowMetrics(period, fileId);
        // Optimize chart data for better performance
        if (data.charts) {
          Object.keys(data.charts).forEach(chartKey => {
            data.charts[chartKey as keyof typeof data.charts] = 
              DashboardCacheManager.optimizeChartData(
                data.charts[chartKey as keyof typeof data.charts], 
                100
              );
          });
        }
        return data;
      } catch (error: any) {
        const dashboardError: DashboardError = {
          message: error.response?.data?.message || 'Failed to fetch cash flow dashboard data',
          code: error.response?.status?.toString(),
          details: error.response?.data
        };
        throw dashboardError;
      }
    },
    ...mergedOptions,
  });
};

/**
 * Hook for fetching P&L dashboard data
 */
export const usePLDashboard = (
  period: DashboardPeriod,
  fileId?: number,
  options: DashboardQueryOptions = {}
): UseQueryResult<PLDashboardData, DashboardError> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  return useQuery({
    queryKey: DashboardCacheManager.getCacheKey('PL', period, fileId),
    queryFn: async () => {
      try {
        const data = await DashboardApiService.getPLMetrics(period, fileId);
        // Optimize chart data for better performance
        if (data.charts) {
          Object.keys(data.charts).forEach(chartKey => {
            data.charts[chartKey as keyof typeof data.charts] = 
              DashboardCacheManager.optimizeChartData(
                data.charts[chartKey as keyof typeof data.charts], 
                100
              );
          });
        }
        return data;
      } catch (error: any) {
        const dashboardError: DashboardError = {
          message: error.response?.data?.message || 'Failed to fetch P&L dashboard data',
          code: error.response?.status?.toString(),
          details: error.response?.data
        };
        throw dashboardError;
      }
    },
    ...mergedOptions,
  });
};

/**
 * Hook for fetching ratio metrics
 */
export const useRatioMetrics = (
  period: DashboardPeriod,
  fileId?: number,
  options: DashboardQueryOptions = {}
): UseQueryResult<DashboardData, DashboardError> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  return useQuery({
    queryKey: ['ratio-metrics', period, fileId],
    queryFn: async () => {
      try {
        return await DashboardApiService.getRatioMetrics(period, fileId);
      } catch (error: any) {
        const dashboardError: DashboardError = {
          message: error.response?.data?.message || 'Failed to fetch ratio metrics',
          code: error.response?.status?.toString(),
          details: error.response?.data
        };
        throw dashboardError;
      }
    },
    ...mergedOptions,
  });
};

/**
 * Hook for fetching balance sheet dashboard data
 */
export const useBalanceSheetDashboard = (
  period: DashboardPeriod,
  fileId?: number,
  options: DashboardQueryOptions = {}
): UseQueryResult<BalanceSheetDashboardData, DashboardError> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  return useQuery({
    queryKey: DashboardCacheManager.getCacheKey('BALANCE_SHEET', period, fileId),
    queryFn: async () => {
      try {
        const data = await DashboardApiService.getBalanceSheetMetrics(period, fileId);
        // Optimize chart data for better performance
        if (data.charts) {
          Object.keys(data.charts).forEach(chartKey => {
            data.charts[chartKey as keyof typeof data.charts] = 
              DashboardCacheManager.optimizeChartData(
                data.charts[chartKey as keyof typeof data.charts], 
                100
              );
          });
        }
        return data;
      } catch (error: any) {
        const dashboardError: DashboardError = {
          message: error.response?.data?.message || 'Failed to fetch balance sheet dashboard data',
          code: error.response?.status?.toString(),
          details: error.response?.data
        };
        throw dashboardError;
      }
    },
    ...mergedOptions,
  });
};

/**
 * Hook for fetching financial ratios with category filtering
 */
export const useFinancialRatios = (
  period: DashboardPeriod,
  category?: string,
  fileId?: number,
  options: DashboardQueryOptions = {}
): UseQueryResult<FinancialRatio[], DashboardError> => {
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  return useQuery({
    queryKey: ['financial-ratios', period, category, fileId],
    queryFn: async () => {
      try {
        return await DashboardApiService.getFinancialRatios(period, category, fileId);
      } catch (error: any) {
        const dashboardError: DashboardError = {
          message: error.response?.data?.message || 'Failed to fetch financial ratios',
          code: error.response?.status?.toString(),
          details: error.response?.data
        };
        throw dashboardError;
      }
    },
    ...mergedOptions,
  });
};

/**
 * Hook for dashboard refresh functionality
 */
export const useDashboardRefresh = () => {
  const queryClient = useQueryClient();

  const refreshDashboard = async (dashboardType?: 'cash-flow' | 'pl' | 'balance-sheet' | 'all') => {
    if (dashboardType === 'cash-flow') {
      await DashboardCacheManager.invalidateCache(queryClient, 'CASH_FLOW');
    } else if (dashboardType === 'pl') {
      await DashboardCacheManager.invalidateCache(queryClient, 'PL');
    } else if (dashboardType === 'balance-sheet') {
      await DashboardCacheManager.invalidateCache(queryClient, 'BALANCE_SHEET');
    } else {
      await DashboardCacheManager.invalidateCache(queryClient);
    }
  };

  const refreshCache = async () => {
    try {
      await DashboardApiService.refreshDashboard();
      await refreshDashboard('all');
    } catch (error) {
      console.error('Failed to refresh dashboard cache:', error);
      throw error;
    }
  };

  const cleanupCache = () => {
    DashboardCacheManager.cleanup(queryClient);
  };

  return {
    refreshDashboard,
    refreshCache,
    cleanupCache,
  };
};

/**
 * Hook for prefetching dashboard data
 */
export const useDashboardPrefetch = () => {
  const queryClient = useQueryClient();

  const prefetchCashFlow = async (period: DashboardPeriod, fileId?: number) => {
    await DashboardCacheManager.prefetchDashboard(
      queryClient,
      'CASH_FLOW',
      period,
      () => DashboardApiService.getCashFlowMetrics(period, fileId),
      fileId
    );
  };

  const prefetchPL = async (period: DashboardPeriod, fileId?: number) => {
    await DashboardCacheManager.prefetchDashboard(
      queryClient,
      'PL',
      period,
      () => DashboardApiService.getPLMetrics(period, fileId),
      fileId
    );
  };

  const prefetchBalanceSheet = async (period: DashboardPeriod, fileId?: number) => {
    await DashboardCacheManager.prefetchDashboard(
      queryClient,
      'BALANCE_SHEET',
      period,
      () => DashboardApiService.getBalanceSheetMetrics(period, fileId),
      fileId
    );
  };

  const getCachedData = <T>(type: 'CASH_FLOW' | 'PL' | 'BALANCE_SHEET', period: DashboardPeriod, fileId?: number): T | undefined => {
    return DashboardCacheManager.getCachedData<T>(queryClient, type, period, fileId);
  };

  const isDataStale = (type: 'CASH_FLOW' | 'PL' | 'BALANCE_SHEET', period: DashboardPeriod, fileId?: number): boolean => {
    return DashboardCacheManager.isDataStale(queryClient, type, period, fileId);
  };

  return {
    prefetchCashFlow,
    prefetchPL,
    prefetchBalanceSheet,
    getCachedData,
    isDataStale,
  };
};