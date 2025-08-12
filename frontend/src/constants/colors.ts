// Centralized color constants using design system tokens
// Use these instead of hardcoded colors throughout the application

export const CHART_COLORS = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  quaternary: 'var(--chart-4)',
  quinary: 'var(--chart-5)',
  senary: 'var(--chart-6)',
  septenary: 'var(--chart-7)',
  octonary: 'var(--chart-8)',
} as const;

export const DEFAULT_CHART_COLORS = [
  CHART_COLORS.primary,
  CHART_COLORS.secondary,
  CHART_COLORS.tertiary,
  CHART_COLORS.quaternary,
  CHART_COLORS.quinary,
  CHART_COLORS.senary,
  CHART_COLORS.septenary,
  CHART_COLORS.octonary,
] as const;

export const SEMANTIC_COLORS = {
  positive: 'var(--success)',
  negative: 'var(--destructive)',
  neutral: 'var(--muted-foreground)',
  warning: 'var(--warning)',
  info: 'var(--info)',
} as const;

// Financial-specific color mappings
export const FINANCIAL_COLORS = {
  revenue: CHART_COLORS.primary,
  expenses: CHART_COLORS.secondary,
  profit: SEMANTIC_COLORS.positive,
  loss: SEMANTIC_COLORS.negative,
  assets: CHART_COLORS.tertiary,
  liabilities: CHART_COLORS.quaternary,
  equity: CHART_COLORS.quinary,
} as const;
