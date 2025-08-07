/**
 * Dashboard API Service
 *
 * Frontend API client for dashboard data integration
 */

import { apiClient } from './api';
import {
  DashboardData,
  CashFlowDashboardData,
  BalanceSheetDashboardData,
  FinancialRatio,
  DashboardPeriod,
} from '../types/dashboard';
import type { PLDashboardData as PLDashboardDataType } from '../types/dashboard';

export interface DashboardOverview {
  statements: FinancialStatement[];
  active_statement: FinancialStatement | null;
  key_metrics: KeyMetrics;
  chart_data: ChartDatasets;
  last_updated: string;
  data_quality_score: number;
  period_info: PeriodInfo;
  generated_at: string;
}

export interface FinancialStatement {
  id: string;
  type: 'pl' | 'balance_sheet' | 'cash_flow';
  name: string;
  period_start: string;
  period_end: string;
  period_type: string;
  currency: string;
  data_quality_score: number;
  line_items_count: number;
  last_updated: string;
}

export interface KeyMetrics {
  revenue: MetricValue;
  net_income: MetricValue;
  gross_margin: MetricValue;
  operating_margin: MetricValue;
  current_ratio: MetricValue;
  debt_to_equity: MetricValue;
  return_on_assets: MetricValue;
  return_on_equity: MetricValue;
}

export interface MetricValue {
  current: number;
  previous?: number;
  change_percent?: number;
  trend: 'up' | 'down' | 'stable';
  unit: string;
  benchmark?: number;
}

export interface ChartDatasets {
  revenue_trend: ChartData[];
  expense_breakdown: ChartData[];
  profit_margins: ChartData[];
  cash_flow_waterfall: ChartData[];
  balance_sheet_composition: ChartData[];
  financial_ratios_trend: ChartData[];
}

export interface ChartData {
  name: string;
  value: number;
  date?: string;
  category?: string;
  color?: string;
  metadata?: Record<string, any>;
}

export interface PeriodInfo {
  filter: string;
  start_date: string;
  end_date: string;
  description: string;
}

export interface PLDashboardData {
  statement_id: string;
  period: string;
  revenue_data: ChartData[];
  expense_data: ChartData[];
  margin_analysis: ChartData[];
  key_metrics: KeyMetrics;
  time_series: ChartData[];
  generated_at: string;
}

export interface BalanceSheetData {
  statement_id: string;
  period: string;
  asset_composition: ChartData[];
  liability_breakdown: ChartData[];
  equity_structure: ChartData[];
  liquidity_ratios: ChartData[];
  leverage_metrics: KeyMetrics;
  generated_at: string;
}

export interface CashFlowData {
  statement_id: string;
  period: string;
  waterfall_data: ChartData[];
  operating_cash_flow: ChartData[];
  investing_cash_flow: ChartData[];
  financing_cash_flow: ChartData[];
  cash_position_trend: ChartData[];
  generated_at: string;
}

export interface TimeSeriesParams {
  metric_key: string;
  statement_type: string;
  periods?: number;
}

export interface ComparisonParams {
  statement_id_1: string;
  statement_id_2: string;
}

export interface ExportParams {
  format: 'pdf' | 'excel' | 'json';
  period?: string;
  statement_ids?: string[];
}

// Period filter options
export enum PeriodFilter {
  MTD = 'mtd',
  QTD = 'qtd',
  YTD = 'ytd',
  LAST_30_DAYS = 'last_30_days',
  LAST_90_DAYS = 'last_90_days',
  LAST_12_MONTHS = 'last_12_months',
  CUSTOM = 'custom',
}

export class DashboardApiService {
  /**
   * Get complete dashboard overview
   */
  static async getDashboardOverview(
    period: PeriodFilter = PeriodFilter.YTD,
    fallback: 'demo' | 'empty' = 'demo'
  ): Promise<DashboardOverview> {
    const response = await apiClient.get('/dashboard/overview', {
      params: { period, fallback },
    });
    return response.data;
  }

  /**
   * Get Cash Flow dashboard metrics with real backend data
   */
  static async getCashFlowMetrics(
    period: DashboardPeriod,
    fileId?: number
  ): Promise<CashFlowDashboardData> {
    const params: any = { period };
    if (fileId) params.file_id = fileId;

    const response = await apiClient.get('/dashboard/metrics/cash-flow', {
      params,
    });
    return response.data;
  }

  /**
   * Get P&L dashboard metrics with real backend data
   */
  static async getPLMetrics(
    period: DashboardPeriod,
    fileId?: number
  ): Promise<PLDashboardDataType> {
    const params: any = { period };
    if (fileId) params.file_id = fileId;

    const response = await apiClient.get('/dashboard/metrics/pl', {
      params,
    });
    return response.data;
  }

  /**
   * Get ratio metrics for analysis
   */
  static async getRatioMetrics(
    period: DashboardPeriod,
    fileId?: number
  ): Promise<DashboardData> {
    const params: any = { period };
    if (fileId) params.file_id = fileId;

    const response = await apiClient.get('/dashboard/metrics/ratios', {
      params,
    });
    return response.data;
  }

  /**
   * Get variance analysis metrics
   */
  static async getVarianceMetrics(
    period: DashboardPeriod,
    fileId?: number
  ): Promise<DashboardData> {
    const params: any = { period };
    if (fileId) params.file_id = fileId;

    const response = await apiClient.get('/dashboard/metrics/variance', {
      params,
    });
    return response.data;
  }

  /**
   * Get Balance Sheet dashboard metrics with real backend data
   */
  static async getBalanceSheetMetrics(
    period: DashboardPeriod,
    fileId?: number
  ): Promise<BalanceSheetDashboardData> {
    const params: any = { period };
    if (fileId) params.file_id = fileId;

    const response = await apiClient.get('/dashboard/metrics/balance-sheet', {
      params,
    });
    return response.data;
  }

  /**
   * Get financial ratios with filtering
   */
  static async getFinancialRatios(
    period: DashboardPeriod,
    category?: string,
    fileId?: number
  ): Promise<FinancialRatio[]> {
    const params: any = { period };
    if (fileId) params.file_id = fileId;
    if (category) params.ratio_category = category;

    const response = await apiClient.get('/dashboard/metrics/ratios', {
      params,
    });
    return response.data.ratios || [];
  }

  /**
   * Get P&L dashboard data for specific statement
   */
  static async getPLData(statementId: string): Promise<PLDashboardData> {
    const response = await apiClient.get(`/dashboard/pl/${statementId}`);
    return response.data;
  }

  /**
   * Get Balance Sheet dashboard data
   */
  static async getBalanceSheetData(
    statementId: string
  ): Promise<BalanceSheetData> {
    const response = await apiClient.get(`/dashboard/balance/${statementId}`);
    return response.data;
  }

  /**
   * Get Cash Flow dashboard data
   */
  static async getCashFlowData(statementId: string): Promise<CashFlowData> {
    const response = await apiClient.get(`/dashboard/cashflow/${statementId}`);
    return response.data;
  }

  /**
   * Get key metrics for specific statement
   */
  static async getStatementMetrics(statementId: string): Promise<KeyMetrics> {
    const response = await apiClient.get(`/dashboard/metrics/${statementId}`);
    return response.data;
  }

  /**
   * Get list of user's financial statements
   */
  static async getUserStatements(
    statementType?: string,
    limit = 10
  ): Promise<{ statements: FinancialStatement[]; total_count: number }> {
    const response = await apiClient.get('/dashboard/statements', {
      params: { statement_type: statementType, limit },
    });
    return response.data;
  }

  /**
   * Get time series data for charts
   */
  static async getTimeSeriesData(params: TimeSeriesParams): Promise<{
    time_series: {
      periods: string[];
      values: number[];
      dates: string[];
      unit: string;
    };
    statistics: Record<string, any>;
    forecast: ChartData[];
  }> {
    const response = await apiClient.get('/dashboard/time-series', {
      params,
    });
    return response.data;
  }

  /**
   * Get period-over-period comparisons
   */
  static async getPeriodComparisons(params: ComparisonParams): Promise<{
    statement_1: any;
    statement_2: any;
    comparisons: Record<string, any>;
    significant_changes: any[];
    summary: Record<string, any>;
  }> {
    const response = await apiClient.get('/dashboard/comparisons', {
      params,
    });
    return response.data;
  }

  /**
   * Export dashboard data
   */
  static async exportDashboardData(params: ExportParams): Promise<{
    export_id?: string;
    download_url?: string;
    data?: any;
    message: string;
  }> {
    const response = await apiClient.get(`/dashboard/export/${params.format}`, {
      params: {
        period: params.period,
        statement_ids: params.statement_ids?.join(','),
      },
    });
    return response.data;
  }

  /**
   * Refresh dashboard cache
   */
  static async refreshDashboard(): Promise<{ message: string }> {
    const response = await apiClient.post('/dashboard/refresh-cache');
    return response.data;
  }
}

export default DashboardApiService;
