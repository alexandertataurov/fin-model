/**
 * Dashboard Data Hooks
 *
 * React Query hooks for dashboard data fetching and state management
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import DashboardApiService, {
  DashboardOverview,
  PLDashboardData,
  BalanceSheetData,
  CashFlowData,
  KeyMetrics,
  FinancialStatement,
  PeriodFilter,
  TimeSeriesParams,
  ComparisonParams,
  ExportParams,
} from '../services/dashboardApi';

// Query keys for cache management
export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: (period: PeriodFilter) =>
    ['dashboard', 'overview', period] as const,
  plData: (statementId: string) => ['dashboard', 'pl', statementId] as const,
  balanceData: (statementId: string) =>
    ['dashboard', 'balance', statementId] as const,
  cashflowData: (statementId: string) =>
    ['dashboard', 'cashflow', statementId] as const,
  metrics: (statementId: string) =>
    ['dashboard', 'metrics', statementId] as const,
  statements: (type?: string, limit?: number) =>
    ['dashboard', 'statements', type, limit] as const,
  timeSeries: (params: TimeSeriesParams) =>
    ['dashboard', 'timeSeries', params] as const,
  comparisons: (params: ComparisonParams) =>
    ['dashboard', 'comparisons', params] as const,
};

/**
 * Hook to get dashboard overview data
 */
export function useDashboardOverview(period: PeriodFilter = PeriodFilter.YTD) {
  return useQuery({
    queryKey: dashboardKeys.overview(period),
    queryFn: () => DashboardApiService.getDashboardOverview(period),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
    meta: {
      errorMessage: 'Failed to load dashboard overview',
    },
  });
}

/**
 * Hook to get P&L dashboard data
 */
export function usePLDashboard(statementId: string | null) {
  return useQuery({
    queryKey: dashboardKeys.plData(statementId || ''),
    queryFn: () => DashboardApiService.getPLData(statementId!),
    enabled: !!statementId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to load P&L dashboard data',
    },
  });
}

/**
 * Hook to get Balance Sheet dashboard data
 */
export function useBalanceSheetDashboard(statementId: string | null) {
  return useQuery({
    queryKey: dashboardKeys.balanceData(statementId || ''),
    queryFn: () => DashboardApiService.getBalanceSheetData(statementId!),
    enabled: !!statementId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to load Balance Sheet dashboard data',
    },
  });
}

/**
 * Hook to get Cash Flow dashboard data
 */
export function useCashFlowDashboard(statementId: string | null) {
  return useQuery({
    queryKey: dashboardKeys.cashflowData(statementId || ''),
    queryFn: () => DashboardApiService.getCashFlowData(statementId!),
    enabled: !!statementId,
    staleTime: 3 * 60 * 1000, // 3 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to load Cash Flow dashboard data',
    },
  });
}

/**
 * Hook to get statement metrics
 */
export function useStatementMetrics(statementId: string | null) {
  return useQuery({
    queryKey: dashboardKeys.metrics(statementId || ''),
    queryFn: () => DashboardApiService.getStatementMetrics(statementId!),
    enabled: !!statementId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to load statement metrics',
    },
  });
}

/**
 * Hook to get user's financial statements
 */
export function useUserStatements(statementType?: string, limit = 10) {
  return useQuery({
    queryKey: dashboardKeys.statements(statementType, limit),
    queryFn: () => DashboardApiService.getUserStatements(statementType, limit),
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to load financial statements',
    },
  });
}

/**
 * Hook to get time series data
 */
export function useTimeSeriesData(params: TimeSeriesParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.timeSeries(params),
    queryFn: () => DashboardApiService.getTimeSeriesData(params),
    enabled: enabled && !!params.metric_key && !!params.statement_type,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to load time series data',
    },
  });
}

/**
 * Hook to get period comparisons
 */
export function usePeriodComparisons(params: ComparisonParams, enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.comparisons(params),
    queryFn: () => DashboardApiService.getPeriodComparisons(params),
    enabled: enabled && !!params.statement_id_1 && !!params.statement_id_2,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    meta: {
      errorMessage: 'Failed to load period comparisons',
    },
  });
}

/**
 * Hook to refresh dashboard data
 */
export function useRefreshDashboard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: DashboardApiService.refreshDashboard,
    onSuccess: () => {
      // Invalidate all dashboard queries to trigger refetch
      queryClient.invalidateQueries({ queryKey: dashboardKeys.all });
      toast.success('Dashboard data refreshed successfully');
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || 'Failed to refresh dashboard'
      );
    },
  });
}

/**
 * Hook to export dashboard data
 */
export function useExportDashboard() {
  return useMutation({
    mutationFn: (params: ExportParams) =>
      DashboardApiService.exportDashboardData(params),
    onSuccess: data => {
      if (data.download_url) {
        // For file downloads, trigger download
        window.open(data.download_url, '_blank');
        toast.success('Export ready for download');
      } else if (data.data) {
        // For JSON exports, handle inline data
        const blob = new Blob([JSON.stringify(data.data, null, 2)], {
          type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-export-${
          new Date().toISOString().split('T')[0]
        }.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Dashboard data exported successfully');
      } else {
        toast.success(data.message || 'Export initiated successfully');
      }
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data?.detail || 'Failed to export dashboard data'
      );
    },
  });
}

/**
 * Custom hook for managing active statement selection
 */
export function useActiveStatement(defaultStatementId?: string) {
  const [activeStatementId, setActiveStatementId] = useState<string | null>(
    defaultStatementId || null
  );

  const { data: statements } = useUserStatements();

  // Auto-select first statement if none selected
  useEffect(() => {
    if (
      !activeStatementId &&
      statements?.statements &&
      statements.statements.length > 0
    ) {
      setActiveStatementId(statements.statements[0].id);
    }
  }, [activeStatementId, statements]);

  const activeStatement = useMemo(() => {
    return (
      statements?.statements?.find(s => s.id === activeStatementId) || null
    );
  }, [statements, activeStatementId]);

  return {
    activeStatementId,
    setActiveStatementId,
    activeStatement,
    statements: statements?.statements || [],
  };
}

/**
 * Custom hook for dashboard loading states
 */
export function useDashboardLoading() {
  const overviewQuery = useQuery({
    queryKey: dashboardKeys.overview(PeriodFilter.YTD),
    enabled: false, // We'll control this manually
  });

  const statementsQuery = useQuery({
    queryKey: dashboardKeys.statements(),
    queryFn: () => DashboardApiService.getUserStatements(),
    enabled: false,
  });

  const isLoading = overviewQuery.isLoading || statementsQuery.isLoading;
  const hasError = overviewQuery.isError || statementsQuery.isError;
  const isEmpty =
    !statementsQuery.data?.statements ||
    statementsQuery.data.statements.length === 0;

  return {
    isLoading,
    hasError,
    isEmpty,
    refetch: () => {
      overviewQuery.refetch();
      statementsQuery.refetch();
    },
  };
}

// Re-export types for convenience
export type {
  DashboardOverview,
  PLDashboardData,
  BalanceSheetData,
  CashFlowData,
  KeyMetrics,
  FinancialStatement,
  PeriodFilter,
};
