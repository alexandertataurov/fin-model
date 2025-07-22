import { Layout as LayoutItem } from 'react-grid-layout';
import { DashboardLayout } from './DashboardGrid';

// Template layout configurations
export const DASHBOARD_TEMPLATES = {
  PL_DASHBOARD: 'pl_dashboard',
  CASH_FLOW_DASHBOARD: 'cash_flow_dashboard',
  BALANCE_SHEET_DASHBOARD: 'balance_sheet_dashboard',
  OVERVIEW_DASHBOARD: 'overview_dashboard',
} as const;

export type DashboardTemplateKey = typeof DASHBOARD_TEMPLATES[keyof typeof DASHBOARD_TEMPLATES];

// P&L Dashboard Template
const PLDashboardLayout: { [key: string]: LayoutItem[] } = {
  lg: [
    { i: 'revenue-trend', x: 0, y: 0, w: 8, h: 4, minW: 4, minH: 3 },
    { i: 'revenue-breakdown', x: 8, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'profit-margins', x: 0, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'expense-breakdown', x: 6, y: 4, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'quarterly-comparison', x: 0, y: 8, w: 12, h: 4, minW: 6, minH: 3 },
  ],
  md: [
    { i: 'revenue-trend', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'revenue-breakdown', x: 6, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'profit-margins', x: 0, y: 4, w: 5, h: 4, minW: 4, minH: 3 },
    { i: 'expense-breakdown', x: 5, y: 4, w: 5, h: 4, minW: 4, minH: 3 },
    { i: 'quarterly-comparison', x: 0, y: 8, w: 10, h: 4, minW: 6, minH: 3 },
  ],
  sm: [
    { i: 'revenue-trend', x: 0, y: 0, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'revenue-breakdown', x: 0, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'profit-margins', x: 0, y: 8, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'expense-breakdown', x: 0, y: 12, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'quarterly-comparison', x: 0, y: 16, w: 6, h: 4, minW: 6, minH: 3 },
  ],
  xs: [
    { i: 'revenue-trend', x: 0, y: 0, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'revenue-breakdown', x: 0, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'profit-margins', x: 0, y: 8, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'expense-breakdown', x: 0, y: 12, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'quarterly-comparison', x: 0, y: 16, w: 4, h: 4, minW: 4, minH: 3 },
  ],
  xxs: [
    { i: 'revenue-trend', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'revenue-breakdown', x: 0, y: 4, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'profit-margins', x: 0, y: 8, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'expense-breakdown', x: 0, y: 12, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'quarterly-comparison', x: 0, y: 16, w: 2, h: 4, minW: 2, minH: 3 },
  ],
};

// Cash Flow Dashboard Template
const CashFlowDashboardLayout: { [key: string]: LayoutItem[] } = {
  lg: [
    { i: 'cash-waterfall', x: 0, y: 0, w: 8, h: 5, minW: 6, minH: 4 },
    { i: 'cash-position', x: 8, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'operating-cash-flow', x: 0, y: 5, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'free-cash-flow', x: 6, y: 5, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'cash-conversion-cycle', x: 0, y: 9, w: 12, h: 3, minW: 6, minH: 2 },
  ],
  md: [
    { i: 'cash-waterfall', x: 0, y: 0, w: 6, h: 5, minW: 6, minH: 4 },
    { i: 'cash-position', x: 6, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'operating-cash-flow', x: 0, y: 5, w: 5, h: 4, minW: 4, minH: 3 },
    { i: 'free-cash-flow', x: 5, y: 5, w: 5, h: 4, minW: 4, minH: 3 },
    { i: 'cash-conversion-cycle', x: 0, y: 9, w: 10, h: 3, minW: 6, minH: 2 },
  ],
  sm: [
    { i: 'cash-waterfall', x: 0, y: 0, w: 6, h: 5, minW: 6, minH: 4 },
    { i: 'cash-position', x: 0, y: 5, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'operating-cash-flow', x: 0, y: 9, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'free-cash-flow', x: 0, y: 13, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'cash-conversion-cycle', x: 0, y: 17, w: 6, h: 3, minW: 6, minH: 2 },
  ],
  xs: [
    { i: 'cash-waterfall', x: 0, y: 0, w: 4, h: 5, minW: 4, minH: 4 },
    { i: 'cash-position', x: 0, y: 5, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'operating-cash-flow', x: 0, y: 9, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'free-cash-flow', x: 0, y: 13, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'cash-conversion-cycle', x: 0, y: 17, w: 4, h: 3, minW: 4, minH: 2 },
  ],
  xxs: [
    { i: 'cash-waterfall', x: 0, y: 0, w: 2, h: 5, minW: 2, minH: 4 },
    { i: 'cash-position', x: 0, y: 5, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'operating-cash-flow', x: 0, y: 9, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'free-cash-flow', x: 0, y: 13, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'cash-conversion-cycle', x: 0, y: 17, w: 2, h: 3, minW: 2, minH: 2 },
  ],
};

// Balance Sheet Dashboard Template
const BalanceSheetDashboardLayout: { [key: string]: LayoutItem[] } = {
  lg: [
    { i: 'assets-breakdown', x: 0, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'liabilities-breakdown', x: 4, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'equity-breakdown', x: 8, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'financial-ratios', x: 0, y: 5, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'debt-equity-trend', x: 6, y: 5, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'liquidity-ratios', x: 0, y: 9, w: 12, h: 3, minW: 6, minH: 2 },
  ],
  md: [
    { i: 'assets-breakdown', x: 0, y: 0, w: 3, h: 5, minW: 3, minH: 4 },
    { i: 'liabilities-breakdown', x: 3, y: 0, w: 4, h: 5, minW: 3, minH: 4 },
    { i: 'equity-breakdown', x: 7, y: 0, w: 3, h: 5, minW: 3, minH: 4 },
    { i: 'financial-ratios', x: 0, y: 5, w: 5, h: 4, minW: 4, minH: 3 },
    { i: 'debt-equity-trend', x: 5, y: 5, w: 5, h: 4, minW: 4, minH: 3 },
    { i: 'liquidity-ratios', x: 0, y: 9, w: 10, h: 3, minW: 6, minH: 2 },
  ],
  sm: [
    { i: 'assets-breakdown', x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'liabilities-breakdown', x: 0, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'equity-breakdown', x: 0, y: 8, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'financial-ratios', x: 0, y: 12, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'debt-equity-trend', x: 0, y: 16, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'liquidity-ratios', x: 0, y: 20, w: 6, h: 3, minW: 6, minH: 2 },
  ],
  xs: [
    { i: 'assets-breakdown', x: 0, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'liabilities-breakdown', x: 0, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'equity-breakdown', x: 0, y: 8, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'financial-ratios', x: 0, y: 12, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'debt-equity-trend', x: 0, y: 16, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'liquidity-ratios', x: 0, y: 20, w: 4, h: 3, minW: 4, minH: 2 },
  ],
  xxs: [
    { i: 'assets-breakdown', x: 0, y: 0, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'liabilities-breakdown', x: 0, y: 4, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'equity-breakdown', x: 0, y: 8, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'financial-ratios', x: 0, y: 12, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'debt-equity-trend', x: 0, y: 16, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'liquidity-ratios', x: 0, y: 20, w: 2, h: 3, minW: 2, minH: 2 },
  ],
};

// Overview Dashboard Template
const OverviewDashboardLayout: { [key: string]: LayoutItem[] } = {
  lg: [
    { i: 'key-metrics', x: 0, y: 0, w: 12, h: 2, minW: 6, minH: 2 },
    { i: 'revenue-profit-trend', x: 0, y: 2, w: 8, h: 4, minW: 6, minH: 3 },
    { i: 'cash-position', x: 8, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'expense-analysis', x: 0, y: 6, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'balance-sheet-summary', x: 6, y: 6, w: 6, h: 4, minW: 4, minH: 3 },
  ],
  md: [
    { i: 'key-metrics', x: 0, y: 0, w: 10, h: 2, minW: 6, minH: 2 },
    { i: 'revenue-profit-trend', x: 0, y: 2, w: 6, h: 4, minW: 6, minH: 3 },
    { i: 'cash-position', x: 6, y: 2, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'expense-analysis', x: 0, y: 6, w: 5, h: 4, minW: 4, minH: 3 },
    { i: 'balance-sheet-summary', x: 5, y: 6, w: 5, h: 4, minW: 4, minH: 3 },
  ],
  sm: [
    { i: 'key-metrics', x: 0, y: 0, w: 6, h: 2, minW: 6, minH: 2 },
    { i: 'revenue-profit-trend', x: 0, y: 2, w: 6, h: 4, minW: 6, minH: 3 },
    { i: 'cash-position', x: 0, y: 6, w: 6, h: 4, minW: 3, minH: 3 },
    { i: 'expense-analysis', x: 0, y: 10, w: 6, h: 4, minW: 4, minH: 3 },
    { i: 'balance-sheet-summary', x: 0, y: 14, w: 6, h: 4, minW: 4, minH: 3 },
  ],
  xs: [
    { i: 'key-metrics', x: 0, y: 0, w: 4, h: 2, minW: 4, minH: 2 },
    { i: 'revenue-profit-trend', x: 0, y: 2, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'cash-position', x: 0, y: 6, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'expense-analysis', x: 0, y: 10, w: 4, h: 4, minW: 4, minH: 3 },
    { i: 'balance-sheet-summary', x: 0, y: 14, w: 4, h: 4, minW: 4, minH: 3 },
  ],
  xxs: [
    { i: 'key-metrics', x: 0, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
    { i: 'revenue-profit-trend', x: 0, y: 2, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'cash-position', x: 0, y: 6, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'expense-analysis', x: 0, y: 10, w: 2, h: 4, minW: 2, minH: 3 },
    { i: 'balance-sheet-summary', x: 0, y: 14, w: 2, h: 4, minW: 2, minH: 3 },
  ],
};

// Template definitions
export const dashboardTemplates: Record<DashboardTemplateKey, DashboardLayout> = {
  [DASHBOARD_TEMPLATES.PL_DASHBOARD]: {
    layouts: PLDashboardLayout,
    widgets: [], // Will be populated with actual widget instances
  },
  [DASHBOARD_TEMPLATES.CASH_FLOW_DASHBOARD]: {
    layouts: CashFlowDashboardLayout,
    widgets: [],
  },
  [DASHBOARD_TEMPLATES.BALANCE_SHEET_DASHBOARD]: {
    layouts: BalanceSheetDashboardLayout,
    widgets: [],
  },
  [DASHBOARD_TEMPLATES.OVERVIEW_DASHBOARD]: {
    layouts: OverviewDashboardLayout,
    widgets: [],
  },
};

// Template metadata
export const templateMetadata = {
  [DASHBOARD_TEMPLATES.PL_DASHBOARD]: {
    name: 'P&L Dashboard',
    description: 'Revenue trends, profit margins, and expense analysis',
    icon: '📊',
    category: 'Financial Statements',
  },
  [DASHBOARD_TEMPLATES.CASH_FLOW_DASHBOARD]: {
    name: 'Cash Flow Dashboard',
    description: 'Cash position, waterfall analysis, and liquidity metrics',
    icon: '💰',
    category: 'Cash Management',
  },
  [DASHBOARD_TEMPLATES.BALANCE_SHEET_DASHBOARD]: {
    name: 'Balance Sheet Dashboard',
    description: 'Assets, liabilities, equity, and financial ratios',
    icon: '⚖️',
    category: 'Financial Position',
  },
  [DASHBOARD_TEMPLATES.OVERVIEW_DASHBOARD]: {
    name: 'Executive Overview',
    description: 'High-level financial metrics and key performance indicators',
    icon: '📈',
    category: 'Executive Summary',
  },
};

// Helper function to get template layout
export const getTemplateLayout = (templateKey: DashboardTemplateKey): DashboardLayout => {
  return dashboardTemplates[templateKey];
};

// Helper function to get all template options
export const getAvailableTemplates = () => {
  return Object.entries(templateMetadata).map(([key, metadata]) => ({
    key: key as DashboardTemplateKey,
    ...metadata,
  }));
}; 