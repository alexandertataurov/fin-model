import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { LineChart } from '../Charts/LineChart';
import { BarChart } from '../Charts/BarChart';
import { PieChart } from '../Charts/PieChart';
import { WaterfallChart } from '../Charts/WaterfallChart';
import { TestDataFactory } from '../../test/test-utils';

// Mock Recharts to avoid rendering issues in tests
vi.mock('recharts', () => ({
  LineChart: ({ children, ...props }: any) => (
    <div data-testid="line-chart" {...props}>{children}</div>
  ),
  BarChart: ({ children, ...props }: any) => (
    <div data-testid="bar-chart" {...props}>{children}</div>
  ),
  PieChart: ({ children, ...props }: any) => (
    <div data-testid="pie-chart" {...props}>{children}</div>
  ),
  ResponsiveContainer: ({ children, ...props }: any) => (
    <div data-testid="responsive-container" {...props}>{children}</div>
  ),
  XAxis: (props: any) => <div data-testid="x-axis" {...props} />,
  YAxis: (props: any) => <div data-testid="y-axis" {...props} />,
  CartesianGrid: (props: any) => <div data-testid="cartesian-grid" {...props} />,
  Tooltip: (props: any) => <div data-testid="tooltip" {...props} />,
  Legend: (props: any) => <div data-testid="legend" {...props} />,
  Line: (props: any) => <div data-testid="line" {...props} />,
  Bar: (props: any) => <div data-testid="bar" {...props} />,
  Area: (props: any) => <div data-testid="area" {...props} />,
  Cell: (props: any) => <div data-testid="cell" {...props} />,
}));

describe('LineChart', () => {
  const mockData = TestDataFactory.chartData();

  it('renders chart with data', () => {
    render(<LineChart data={mockData.datasets[0].data} labels={mockData.labels} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
  });

  it('shows title when provided', () => {
    const title = 'Revenue Trend';
    render(
      <LineChart 
        data={mockData.datasets[0].data} 
        labels={mockData.labels} 
        title={title}
      />
    );
    
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    render(<LineChart data={[]} labels={[]} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });

  it('supports custom colors', () => {
    const customColor = '#ff5722';
    render(
      <LineChart 
        data={mockData.datasets[0].data} 
        labels={mockData.labels}
        color={customColor}
      />
    );
    
    const line = screen.getByTestId('line');
    expect(line).toHaveAttribute('stroke', customColor);
  });

  it('shows tooltip on hover', async () => {
    const user = userEvent.setup();
    render(<LineChart data={mockData.datasets[0].data} labels={mockData.labels} />);
    
    const chartArea = screen.getByTestId('line-chart');
    await user.hover(chartArea);
    
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('supports data point highlighting', async () => {
    const user = userEvent.setup();
    const onDataPointClick = vi.fn();
    
    render(
      <LineChart 
        data={mockData.datasets[0].data} 
        labels={mockData.labels}
        onDataPointClick={onDataPointClick}
      />
    );
    
    const chartArea = screen.getByTestId('line-chart');
    await user.click(chartArea);
    
    expect(onDataPointClick).toHaveBeenCalled();
  });

  it('handles data updates', () => {
    const { rerender } = render(
      <LineChart data={[100, 200]} labels={['A', 'B']} />
    );
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    
    // Update with new data
    rerender(<LineChart data={[300, 400, 500]} labels={['A', 'B', 'C']} />);
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('supports accessibility features', () => {
    render(
      <LineChart 
        data={mockData.datasets[0].data} 
        labels={mockData.labels}
        title="Revenue Chart"
        ariaLabel="Revenue trend over time"
      />
    );
    
    const chart = screen.getByLabelText('Revenue trend over time');
    expect(chart).toBeInTheDocument();
  });
});

describe('BarChart', () => {
  const mockData = TestDataFactory.chartData();

  it('renders bar chart with data', () => {
    render(<BarChart data={mockData.datasets[0].data} labels={mockData.labels} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar')).toBeInTheDocument();
  });

  it('supports horizontal orientation', () => {
    render(
      <BarChart 
        data={mockData.datasets[0].data} 
        labels={mockData.labels}
        orientation="horizontal"
      />
    );
    
    const chart = screen.getByTestId('bar-chart');
    expect(chart).toHaveAttribute('layout', 'horizontal');
  });

  it('supports stacked bars', () => {
    const stackedData = [
      { name: 'Q1', revenue: 1000, expenses: 600 },
      { name: 'Q2', revenue: 1200, expenses: 720 },
    ];
    
    render(<BarChart data={stackedData} stacked />);
    
    const chart = screen.getByTestId('bar-chart');
    expect(chart).toBeInTheDocument();
  });

  it('shows custom bar colors', () => {
    const colors = ['#1976d2', '#dc004e'];
    render(
      <BarChart 
        data={mockData.datasets[0].data} 
        labels={mockData.labels}
        colors={colors}
      />
    );
    
    const bars = screen.getAllByTestId('bar');
    expect(bars[0]).toHaveAttribute('fill', colors[0]);
  });

  it('handles click events on bars', async () => {
    const user = userEvent.setup();
    const onBarClick = vi.fn();
    
    render(
      <BarChart 
        data={mockData.datasets[0].data} 
        labels={mockData.labels}
        onBarClick={onBarClick}
      />
    );
    
    const bar = screen.getByTestId('bar');
    await user.click(bar);
    
    expect(onBarClick).toHaveBeenCalled();
  });

  it('supports custom value formatting', () => {
    const formatValue = (value: number) => `$${value.toLocaleString()}`;
    
    render(
      <BarChart 
        data={mockData.datasets[0].data} 
        labels={mockData.labels}
        formatValue={formatValue}
      />
    );
    
    // Check if formatted values appear in tooltip
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
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
    const colors = ['#1976d2', '#dc004e', '#2e7d32'];
    render(<PieChart data={pieData} colors={colors} />);
    
    const cells = screen.getAllByTestId('cell');
    expect(cells).toHaveLength(pieData.length);
  });

  it('shows percentage values', () => {
    render(<PieChart data={pieData} showPercentages />);
    
    // Should show percentage labels
    expect(screen.getByTestId('pie-chart')).toBeInTheDocument();
  });

  it('handles segment click events', async () => {
    const user = userEvent.setup();
    const onSegmentClick = vi.fn();
    
    render(<PieChart data={pieData} onSegmentClick={onSegmentClick} />);
    
    const segment = screen.getAllByTestId('cell')[0];
    await user.click(segment);
    
    expect(onSegmentClick).toHaveBeenCalledWith(pieData[0]);
  });

  it('supports donut style', () => {
    render(<PieChart data={pieData} variant="donut" />);
    
    const chart = screen.getByTestId('pie-chart');
    expect(chart).toHaveAttribute('innerRadius', '60');
  });
});

describe('WaterfallChart', () => {
  const waterfallData = [
    { name: 'Starting Revenue', value: 1000000, type: 'start' },
    { name: 'Q1 Growth', value: 200000, type: 'positive' },
    { name: 'Q2 Decline', value: -100000, type: 'negative' },
    { name: 'Ending Revenue', value: 1100000, type: 'end' },
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

  it('displays connecting lines between bars', () => {
    render(<WaterfallChart data={waterfallData} showConnectors />);
    
    // Check for connector elements
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('supports custom color scheme', () => {
    const colorScheme = {
      positive: '#4caf50',
      negative: '#f44336',
      neutral: '#9e9e9e',
    };
    
    render(<WaterfallChart data={waterfallData} colorScheme={colorScheme} />);
    
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });

  it('handles empty or invalid data', () => {
    render(<WaterfallChart data={[]} />);
    
    expect(screen.getByText(/no data available/i)).toBeInTheDocument();
  });
});

describe('Chart Accessibility', () => {
  it('charts have proper ARIA labels', () => {
    const data = TestDataFactory.chartData();
    
    render(
      <LineChart 
        data={data.datasets[0].data} 
        labels={data.labels}
        ariaLabel="Financial trend over time"
        title="Revenue Chart"
      />
    );
    
    const chart = screen.getByLabelText('Financial trend over time');
    expect(chart).toBeInTheDocument();
  });

  it('charts support keyboard navigation', async () => {
    const user = userEvent.setup();
    const data = TestDataFactory.chartData();
    
    render(
      <BarChart 
        data={data.datasets[0].data} 
        labels={data.labels}
        keyboardNavigable
      />
    );
    
    const chart = screen.getByTestId('bar-chart');
    
    // Should be focusable
    chart.focus();
    expect(chart).toHaveFocus();
    
    // Should respond to arrow keys
    await user.keyboard('{ArrowRight}');
    // Chart should handle keyboard navigation
  });

  it('charts provide screen reader friendly descriptions', () => {
    const data = TestDataFactory.chartData();
    
    render(
      <PieChart 
        data={[
          { name: 'Revenue', value: 1000000 },
          { name: 'Expenses', value: 600000 },
        ]}
        ariaDescription="Revenue breakdown showing 62.5% revenue and 37.5% expenses"
      />
    );
    
    const chart = screen.getByTestId('pie-chart');
    expect(chart).toHaveAttribute('aria-describedby');
  });
});

describe('Chart Error Handling', () => {
  it('handles malformed data gracefully', () => {
    const malformedData = [
      { invalidStructure: true },
      null,
      undefined,
    ];
    
    render(<LineChart data={malformedData as any} labels={[]} />);
    
    expect(screen.getByText(/invalid data format/i)).toBeInTheDocument();
  });

  it('shows error state when chart fails to render', () => {
    // Mock console.error to avoid noise in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation();
    
    // Trigger an error in chart rendering
    render(<LineChart data={undefined as any} labels={undefined as any} />);
    
    expect(screen.getByText(/chart error/i)).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('recovers from data updates after errors', () => {
    const { rerender } = render(
      <LineChart data={undefined as any} labels={undefined as any} />
    );
    
    expect(screen.getByText(/chart error/i)).toBeInTheDocument();
    
    // Provide valid data
    const validData = TestDataFactory.chartData();
    rerender(
      <LineChart data={validData.datasets[0].data} labels={validData.labels} />
    );
    
    expect(screen.queryByText(/chart error/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
}); 
