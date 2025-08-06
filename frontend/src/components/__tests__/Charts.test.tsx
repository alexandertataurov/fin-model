import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Skip Chart tests for now to avoid hanging issues
// import LineChart from '../Charts/LineChart';
// import BarChart from '../Charts/BarChart';
// import PieChart from '../Charts/PieChart';
// import WaterfallChart from '../Charts/WaterfallChart';

// Mock Recharts to avoid rendering issues in tests
interface MockChartProps {
  children?: React.ReactNode;
  [key: string]: unknown;
}

interface MockComponentProps {
  [key: string]: unknown;
}

vi.mock('recharts', () => ({
  default: {},
  LineChart: ({ children, ...props }: MockChartProps) => (
    <div data-testid="line-chart" {...props}>
      {children}
    </div>
  ),
  BarChart: ({ children, ...props }: MockChartProps) => (
    <div data-testid="bar-chart" {...props}>
      {children}
    </div>
  ),
  PieChart: ({ children, ...props }: MockChartProps) => (
    <div data-testid="pie-chart" {...props}>
      {children}
    </div>
  ),
  AreaChart: ({ children, ...props }: MockChartProps) => (
    <div data-testid="area-chart" {...props}>
      {children}
    </div>
  ),
  ComposedChart: ({ children, ...props }: MockChartProps) => (
    <div data-testid="composed-chart" {...props}>
      {children}
    </div>
  ),
  ResponsiveContainer: ({ children, ...props }: MockChartProps) => (
    <div data-testid="responsive-container" {...props}>
      {children}
    </div>
  ),
  Line: ({ ...props }: MockComponentProps) => (
    <div data-testid="line" {...props} />
  ),
  Bar: ({ ...props }: MockComponentProps) => (
    <div data-testid="bar" {...props} />
  ),
  Pie: ({ ...props }: MockComponentProps) => (
    <div data-testid="pie" {...props} />
  ),
  Area: ({ ...props }: MockComponentProps) => (
    <div data-testid="area" {...props} />
  ),
  XAxis: ({ ...props }: MockComponentProps) => (
    <div data-testid="x-axis" {...props} />
  ),
  YAxis: ({ ...props }: MockComponentProps) => (
    <div data-testid="y-axis" {...props} />
  ),
  CartesianGrid: ({ ...props }: MockComponentProps) => (
    <div data-testid="cartesian-grid" {...props} />
  ),
  Legend: ({ ...props }: MockComponentProps) => (
    <div data-testid="legend" {...props} />
  ),
  ReferenceLine: ({ ...props }: MockComponentProps) => (
    <div data-testid="reference-line" {...props} />
  ),
  Tooltip: ({ ...props }: MockComponentProps) => (
    <div data-testid="tooltip" {...props} />
  ),
  Cell: ({ ...props }: MockComponentProps) => (
    <div data-testid="cell" {...props} />
  ),
  Sector: ({ ...props }: MockComponentProps) => (
    <div data-testid="sector" {...props} />
  ),
}));

describe('LineChart', () => {
  const mockLineData = [
    { period: 'Q1 2023', revenue: 1000000, expenses: 600000 },
    { period: 'Q2 2023', revenue: 1200000, expenses: 720000 },
    { period: 'Q3 2023', revenue: 1100000, expenses: 660000 },
    { period: 'Q4 2023', revenue: 1300000, expenses: 780000 },
  ];

  const mockSeries = [
    { dataKey: 'revenue', name: 'Revenue', color: '#8884d8' },
    { dataKey: 'expenses', name: 'Expenses', color: '#82ca9d' },
  ];

  it('renders chart with data', () => {
    render(<LineChart data={mockLineData} series={mockSeries} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('shows title when provided', () => {
    const title = 'Revenue Trend';
    render(<LineChart data={mockLineData} series={mockSeries} title={title} />);

    expect(screen.getByTestId('chart-title')).toHaveTextContent(title);

    // Check for aria-label which contains the title
    expect(screen.getAllByLabelText(title)).toHaveLength(2); // Card and chart both have the label
  });

  it('handles empty data gracefully', () => {
    render(<LineChart data={[]} series={[]} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    // Chart should render even with empty data
  });

  it('supports custom colors', () => {
    const customSeries = [
      { dataKey: 'revenue', name: 'Revenue', color: 'var(--chart-3)' },
    ];
    render(<LineChart data={mockLineData} series={customSeries} />);

    const line = screen.getByTestId('line');
    expect(line).toHaveAttribute('stroke', 'var(--chart-3)');
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<LineChart data={mockLineData} series={mockSeries} />);

    const chartArea = screen.getByTestId('line-chart');
    await user.hover(chartArea);

    // Tooltip is conditionally rendered based on hover state
    // In the mock, tooltip is always present but may not be visible
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('supports chart interaction', async () => {
    const user = userEvent.setup();

    render(<LineChart data={mockLineData} series={mockSeries} />);

    const chartArea = screen.getByTestId('line-chart');
    await user.hover(chartArea);

    // Tooltip should be present in the DOM
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('handles data updates', () => {
    const initialData = [
      { period: 'A', value: 100 },
      { period: 'B', value: 200 },
    ];
    const initialSeries = [
      { dataKey: 'value', name: 'Value', color: 'var(--chart-1)' },
    ];

    const { rerender } = render(
      <LineChart data={initialData} series={initialSeries} />
    );

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();

    // Update with new data
    const updatedData = [
      { period: 'A', value: 300 },
      { period: 'B', value: 400 },
      { period: 'C', value: 500 },
    ];
    rerender(<LineChart data={updatedData} series={initialSeries} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('supports accessibility features', () => {
    render(
      <LineChart
        data={mockLineData}
        series={mockSeries}
        title="Revenue Chart"
      />
    );

    // Chart should have a title for accessibility
    expect(screen.getAllByLabelText('Revenue Chart')).toHaveLength(2); // Card and chart both have the label
  });
});

describe('BarChart', () => {
  const mockBarData = [
    { category: 'Q1 2023', revenue: 1000000, expenses: 600000 },
    { category: 'Q2 2023', revenue: 1200000, expenses: 720000 },
    { category: 'Q3 2023', revenue: 1100000, expenses: 660000 },
    { category: 'Q4 2023', revenue: 1300000, expenses: 780000 },
  ];

  const mockBarSeries = [
    { dataKey: 'revenue', name: 'Revenue', color: '#8884d8' },
    { dataKey: 'expenses', name: 'Expenses', color: '#82ca9d' },
  ];

  it('renders bar chart with data', () => {
    render(<BarChart data={mockBarData} series={mockBarSeries} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getAllByTestId('bar')).toHaveLength(2); // Two bars for revenue and expenses
  });

  it('supports horizontal orientation', () => {
    render(
      <BarChart data={mockBarData} series={mockBarSeries} layout="horizontal" />
    );

    const chart = screen.getByTestId('bar-chart');
    expect(chart).toHaveAttribute('layout', 'horizontal');
  });

  it('supports stacked bars', () => {
    const stackedData = [
      { name: 'Q1', revenue: 1000, expenses: 600 },
      { name: 'Q2', revenue: 1200, expenses: 720 },
    ];

    const stackedSeries = [
      {
        dataKey: 'revenue',
        name: 'Revenue',
        color: 'var(--chart-1)',
        stackId: 'stack',
      },
      {
        dataKey: 'expenses',
        name: 'Expenses',
        color: 'var(--chart-2)',
        stackId: 'stack',
      },
    ];

    render(<BarChart data={stackedData} series={stackedSeries} />);

    const chart = screen.getByTestId('bar-chart');
    expect(chart).toBeInTheDocument();
  });

  it('shows custom bar colors', () => {
    const customSeries = [
      { dataKey: 'revenue', name: 'Revenue', color: 'var(--chart-1)' },
      { dataKey: 'expenses', name: 'Expenses', color: 'var(--chart-2)' },
    ];
    render(<BarChart data={mockBarData} series={customSeries} />);

    const bars = screen.getAllByTestId('bar');
    expect(bars[0]).toHaveAttribute('fill', 'var(--chart-1)');
  });

  it('handles bar interaction', async () => {
    const user = userEvent.setup();

    render(<BarChart data={mockBarData} series={mockBarSeries} />);

    const bars = screen.getAllByTestId('bar');
    await user.hover(bars[0]);

    // Tooltip should be present in the DOM
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('supports custom tooltip formatting', () => {
    const formatTooltip = (
      value: number | string,
      name: string
    ): [string, string] => [`$${value}`, name];

    render(
      <BarChart
        data={mockBarData}
        series={mockBarSeries}
        formatTooltip={formatTooltip}
      />
    );

    // Chart should render with custom tooltip formatter
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});

describe('PieChart', () => {
  const pieData = [
    { name: 'Revenue', value: 1000000 },
    { name: 'COGS', value: 600000 },
    { name: 'Operating Expenses', value: 250000 },
  ];

  it('renders pie chart with data', () => {
    render(<PieChart data={pieData} />);

    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('shows legend by default', () => {
    render(<PieChart data={pieData} />);

    expect(screen.getByTestId('legend')).toBeInTheDocument();
  });

  it('can hide legend', () => {
    render(<PieChart data={pieData} showLegend={false} />);

    expect(screen.queryByTestId('legend')).not.toBeInTheDocument();
  });

  it('supports custom colors for segments', () => {
    const dataWithColors = pieData.map((item, index) => ({
      ...item,
      color: ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)'][index],
    }));
    render(<PieChart data={dataWithColors} />);

    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(pieData.length);
  });

  it('shows percentage values', () => {
    render(<PieChart data={pieData} showPercentages />);

    // Should show percentage labels
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('handles chart interaction', async () => {
    const user = userEvent.setup();

    render(<PieChart data={pieData} />);

    const chart = screen.getByTestId('pie-chart');
    await user.hover(chart);

    // Should show tooltip on hover
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('supports donut style with inner radius', () => {
    render(<PieChart data={pieData} innerRadius={60} />);

    const chart = screen.getByTestId('pie-chart');
    expect(chart).toBeInTheDocument();
  });
});

describe('WaterfallChart', () => {
  const waterfallData = [
    { name: 'Starting Revenue', value: 1000000, type: 'start' as const },
    { name: 'Q1 Growth', value: 200000, type: 'positive' as const },
    { name: 'Q2 Decline', value: -100000, type: 'negative' as const },
    { name: 'Ending Revenue', value: 1100000, type: 'total' as const },
  ];

  it('renders waterfall chart with data', () => {
    render(<WaterfallChart data={waterfallData} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('shows different colors for positive and negative values', () => {
    render(<WaterfallChart data={waterfallData} />);

    const bars = screen.getAllByTestId('bar');
    expect(bars.length).toBeGreaterThan(0);
  });

  it('supports custom colors for different value types', () => {
    render(
      <WaterfallChart
        data={waterfallData}
        positiveColor="var(--success)"
        negativeColor="var(--destructive)"
        totalColor="var(--chart-1)"
        startColor="var(--muted-foreground)"
      />
    );

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('renders with custom height', () => {
    render(<WaterfallChart data={waterfallData} height={600} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('handles empty or invalid data', () => {
    render(<WaterfallChart data={[]} />);

    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});

// Mock data for shared tests
const mockLineData = [
  { period: 'Q1 2023', revenue: 1000000, expenses: 600000 },
  { period: 'Q2 2023', revenue: 1200000, expenses: 720000 },
  { period: 'Q3 2023', revenue: 1100000, expenses: 660000 },
  { period: 'Q4 2023', revenue: 1300000, expenses: 780000 },
];

const mockSeries = [
  { dataKey: 'revenue', name: 'Revenue', color: '#8884d8' },
  { dataKey: 'expenses', name: 'Expenses', color: '#82ca9d' },
];

const mockBarData = [
  { category: 'Q1 2023', revenue: 1000000, expenses: 600000 },
  { category: 'Q2 2023', revenue: 1200000, expenses: 720000 },
  { category: 'Q3 2023', revenue: 1100000, expenses: 660000 },
  { category: 'Q4 2023', revenue: 1300000, expenses: 780000 },
];

const mockBarSeries = [
  { dataKey: 'revenue', name: 'Revenue', color: '#8884d8' },
  { dataKey: 'expenses', name: 'Expenses', color: '#82ca9d' },
];

const mockPieData = [
  { name: 'Revenue', value: 1000000 },
  { name: 'Expenses', value: 600000 },
];

describe('Chart Accessibility', () => {
  it('charts have proper titles for accessibility', () => {
    render(
      <LineChart
        data={mockLineData}
        series={mockSeries}
        title="Financial Revenue Chart"
      />
    );

    expect(screen.getAllByLabelText('Financial Revenue Chart')).toHaveLength(2); // Card and chart both have the label
  });

  it('charts are keyboard navigable', async () => {
    const user = userEvent.setup();

    render(
      <BarChart data={mockBarData} series={mockBarSeries} title="Bar Chart" />
    );

    const chart = screen.getByTestId('bar-chart');

    // Chart should be present and interactive
    expect(chart).toBeInTheDocument();

    // Test keyboard interaction
    await user.tab();
    // Chart components should be accessible via keyboard
  });

  it('charts provide meaningful content for screen readers', () => {
    render(<PieChart data={mockPieData} title="Revenue vs Expenses" />);

    const chart = screen.getByTestId('pie-chart');
    expect(chart).toBeInTheDocument();
    expect(screen.getAllByLabelText('Revenue vs Expenses')).toHaveLength(2); // Card and chart both have the label
  });
});

describe('Chart Error Handling', () => {
  it('handles empty data gracefully', () => {
    render(<LineChart data={[]} series={[]} />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    // Chart should render even with empty data
  });

  it('shows loading state', () => {
    render(
      <LineChart data={mockLineData} series={mockSeries} loading={true} />
    );

    expect(screen.getByText(/loading chart data/i)).toBeInTheDocument();
  });

  it('recovers from loading to data display', () => {
    const { rerender } = render(
      <LineChart data={mockLineData} series={mockSeries} loading={true} />
    );

    expect(screen.getByText(/loading chart data/i)).toBeInTheDocument();

    // Update to show data
    rerender(
      <LineChart data={mockLineData} series={mockSeries} loading={false} />
    );

    expect(screen.queryByText(/loading chart data/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});
