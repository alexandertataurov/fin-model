// Test color constants using design system tokens
// Use these in tests instead of hardcoded colors

export const TEST_CHART_COLORS = {
  primary: 'var(--chart-1)',
  secondary: 'var(--chart-2)',
  tertiary: 'var(--chart-3)',
  revenue: 'var(--chart-1)',
  expenses: 'var(--chart-2)',
  positive: 'var(--success)',
  negative: 'var(--destructive)',
  neutral: 'var(--muted-foreground)',
} as const;

// Legacy test data with design tokens
export const TEST_CHART_SERIES = [
  { dataKey: 'revenue', name: 'Revenue', color: TEST_CHART_COLORS.revenue },
  { dataKey: 'expenses', name: 'Expenses', color: TEST_CHART_COLORS.expenses },
] as const;

// Chart color arrays for testing
export const TEST_COLOR_ARRAYS = {
  basic: [
    TEST_CHART_COLORS.primary,
    TEST_CHART_COLORS.secondary,
    TEST_CHART_COLORS.tertiary,
  ],
  financial: [
    TEST_CHART_COLORS.revenue,
    TEST_CHART_COLORS.expenses,
    TEST_CHART_COLORS.positive,
  ],
} as const;
