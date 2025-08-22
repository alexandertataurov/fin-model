/**
 * Unified Dashboard Types
 *
 * Centralized TypeScript interfaces for all dashboard data
 */

export interface DashboardMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  format_type: 'currency' | 'percentage' | 'number';
  change?: number;
  change_percentage?: number;
  trend?: 'up' | 'down' | 'stable';
  period: string;
  last_updated: string;
  category?: string;
  description?: string;
  display_order: number;
}

export interface DashboardChartData {
  period: string;
  value: number;
  date: string;
  label?: string;
  category?: string;
  name?: string;
  type?: string;
}

export interface DashboardData {
  metrics: DashboardMetric[];
  charts: {
    [key: string]: DashboardChartData[];
  };
  period_info: {
    period: string;
    start_date: string;
    end_date: string;
    description?: string;
  };
  last_updated: string;
  data_quality_score: number;
  statement_id?: string;
  generated_at: string;
}

export interface CashFlowDashboardData extends DashboardData {
  charts: {
    cash_waterfall: DashboardChartData[];
    cash_position: DashboardChartData[];
    operating_cash_flow: DashboardChartData[];
    investing_cash_flow: DashboardChartData[];
    financing_cash_flow: DashboardChartData[];
  };
}

export interface PLDashboardData extends DashboardData {
  charts: {
    revenue_trend: DashboardChartData[];
    profit_margins: DashboardChartData[];
    expense_breakdown: DashboardChartData[];
    gross_margin_trend: DashboardChartData[];
    operating_margin_trend: DashboardChartData[];
  };
}

export type DashboardPeriod =
  | 'mtd'
  | 'qtd'
  | 'ytd'
  | 'last_30_days'
  | 'last_90_days'
  | 'last_12_months';

export interface DashboardError {
  message: string;
  code?: string;
  details?: Record<string, unknown>;
}

export interface DashboardLoadingState {
  isLoading: boolean;
  isRefreshing: boolean;
  error?: DashboardError | null;
}

// Chart specific types for compatibility
export interface WaterfallDataPoint {
  name: string;
  value: number;
  type: 'start' | 'positive' | 'negative' | 'total';
}

export interface LineChartDataPoint {
  period: string;
  value: number;
  [key: string]: string | number; // Dynamic keys for Recharts
}

export interface BarChartDataPoint {
  period?: string;
  month?: string;
  category?: string;
  value: number;
  [key: string]: string | number | undefined; // Dynamic keys for Recharts
}

// Balance Sheet specific types
export interface BalanceSheetMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  format_type: 'currency' | 'percentage' | 'number';
  category: 'assets' | 'liabilities' | 'equity';
  subcategory: string;
  period: string;
  last_updated: string;
  display_order: number;
  change_percentage?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface FinancialRatio {
  name: string;
  value: number;
  category: 'liquidity' | 'leverage' | 'efficiency' | 'profitability';
  benchmark?: number;
  interpretation: string;
}

export interface BalanceSheetDashboardData extends DashboardData {
  metrics: BalanceSheetMetric[];
  ratios: FinancialRatio[];
  charts: {
    assets_breakdown: DashboardChartData[];
    liabilities_breakdown: DashboardChartData[];
    equity_trend: DashboardChartData[];
    liquidity_ratios: DashboardChartData[];
  };
  data_quality_score: number;
  period_info: {
    period: string;
    start_date: string;
    end_date: string;
    description?: string;
  };
  last_updated: string;
}
