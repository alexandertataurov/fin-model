import type { Meta, StoryObj } from '@storybook/react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';

const meta: Meta = {
  title: 'Charts/Financial Charts',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Financial Charts

Interactive chart components built with Recharts for financial data visualization. These charts are specifically designed for FinVision's financial modeling and reporting needs.

## Chart Types

- **LineChart**: Time-series data, trends, and projections
- **BarChart**: Comparative analysis and category breakdown
- **PieChart**: Portfolio composition and percentage breakdowns
- **WaterfallChart**: Cash flow and variance analysis

## Key Features

- **Responsive**: Automatically adapts to container size
- **Interactive**: Hover tooltips and click handlers
- **Customizable**: Configurable colors, labels, and styling
- **Export**: Built-in export functionality (PNG, SVG, PDF)
- **Accessibility**: Screen reader friendly with proper ARIA labels

## Data Format

All charts expect data in a consistent format with configurable series and styling options.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Sample financial data
const revenueData = [
  { period: 'Q1 2023', revenue: 1200000, expenses: 850000, profit: 350000 },
  { period: 'Q2 2023', revenue: 1350000, expenses: 920000, profit: 430000 },
  { period: 'Q3 2023', revenue: 1480000, expenses: 980000, profit: 500000 },
  { period: 'Q4 2023', revenue: 1620000, expenses: 1050000, profit: 570000 },
  { period: 'Q1 2024', revenue: 1780000, expenses: 1120000, profit: 660000 },
  { period: 'Q2 2024', revenue: 1950000, expenses: 1200000, profit: 750000 },
];

const monthlyData = [
  { month: 'Jan', actual: 125000, budget: 120000, forecast: 130000 },
  { month: 'Feb', actual: 132000, budget: 125000, forecast: 135000 },
  { month: 'Mar', actual: 148000, budget: 140000, forecast: 145000 },
  { month: 'Apr', actual: 156000, budget: 150000, forecast: 160000 },
  { month: 'May', actual: 167000, budget: 160000, forecast: 165000 },
  { month: 'Jun', actual: 178000, budget: 170000, forecast: 175000 },
];

const categoryData = [
  { name: 'Salaries', value: 450000, percentage: 45 },
  { name: 'Marketing', value: 200000, percentage: 20 },
  { name: 'Operations', value: 150000, percentage: 15 },
  { name: 'Technology', value: 100000, percentage: 10 },
  { name: 'Other', value: 100000, percentage: 10 },
];

export const RevenueGrowthLine: Story = {
  render: () => (
    <div className="w-full h-96">
      <LineChart
        data={revenueData}
        series={[
          {
            dataKey: 'revenue',
            name: 'Revenue',
            color: 'var(--chart-1)',
            strokeWidth: 3,
          },
          {
            dataKey: 'profit',
            name: 'Profit',
            color: 'var(--chart-2)',
            strokeWidth: 2,
          },
        ]}
        title="Revenue Growth Trend"
        subtitle="Quarterly revenue and profit over time"
        xAxisKey="period"
        yAxisLabel="Amount ($)"
        currency="USD"
        showGrid={true}
        showLegend={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Line chart showing revenue growth trends over multiple quarters.',
      },
    },
  },
};

export const MonthlyComparison: Story = {
  render: () => (
    <div className="w-full h-96">
      <BarChart
        data={monthlyData}
        series={[
          {
            dataKey: 'actual',
            name: 'Actual',
            color: 'var(--chart-1)',
          },
          {
            dataKey: 'budget',
            name: 'Budget',
            color: 'var(--chart-2)',
          },
          {
            dataKey: 'forecast',
            name: 'Forecast',
            color: 'var(--chart-3)',
          },
        ]}
        title="Monthly Performance"
        subtitle="Actual vs Budget vs Forecast"
        xAxisKey="month"
        yAxisLabel="Revenue ($)"
        currency="USD"
        showGrid={true}
        showLegend={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Bar chart comparing actual performance against budget and forecast.',
      },
    },
  },
};

export const ExpenseBreakdown: Story = {
  render: () => (
    <div className="w-full h-96">
      <PieChart
        data={categoryData}
        title="Expense Breakdown"
        subtitle="Operating expenses by category"

        currency="USD"
        showPercentages={true}
        showLegend={true}

      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Pie chart showing expense distribution across different categories.',
      },
    },
  },
};

export const LoadingState: Story = {
  render: () => (
    <div className="w-full h-96">
      <LineChart
        data={[]}
        series={[]}
        title="Loading Chart Data"
        subtitle="Please wait while we fetch your data"
        loading={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chart component in loading state with spinner.',
      },
    },
  },
};

export const ErrorState: Story = {
  render: () => (
    <div className="w-full h-96">
      <LineChart
        data={[]}
        series={[]}
        title="Revenue Analysis"
        subtitle="Historical revenue data"
        error="Failed to load chart data. Please try again."
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Chart component displaying error state with retry option.',
      },
    },
  },
};

export const MinimalChart: Story = {
  render: () => (
    <div className="w-full h-64">
      <LineChart
        data={revenueData.slice(0, 4)}
        series={[
          {
            dataKey: 'revenue',
            name: 'Revenue',
            color: 'var(--chart-1)',
            strokeWidth: 2,
          },
        ]}
        xAxisKey="period"
        showGrid={false}
        showLegend={false}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Minimal chart without title, grid, or legend for dashboard widgets.',
      },
    },
  },
};

export const StackedBarChart: Story = {
  render: () => (
    <div className="w-full h-96">
      <BarChart
        data={revenueData}
        series={[
          {
            dataKey: 'revenue',
            name: 'Revenue',
            color: 'var(--chart-1)',
            stackId: 'a',
          },
          {
            dataKey: 'expenses',
            name: 'Expenses',
            color: 'var(--chart-4)',
            stackId: 'a',
          },
        ]}
        title="Revenue vs Expenses"
        subtitle="Stacked view of financial performance"
        xAxisKey="period"
        yAxisLabel="Amount ($)"
        currency="USD"
        showGrid={true}
        showLegend={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Stacked bar chart showing revenue and expenses in a single view.',
      },
    },
  },
};

export const DashboardWidget: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      <div className="h-64">
        <LineChart
          data={monthlyData.slice(0, 4)}
          series={[
            {
              dataKey: 'actual',
              name: 'Revenue',
              color: 'var(--chart-1)',
              strokeWidth: 2,
            },
          ]}
          title="Monthly Revenue"
          xAxisKey="month"
          showGrid={false}
          showLegend={false}
        />
      </div>
      <div className="h-64">
        <BarChart
          data={monthlyData.slice(0, 4)}
          series={[
            {
              dataKey: 'actual',
              name: 'Actual',
              color: 'var(--chart-2)',
            },
          ]}
          title="Performance"
          xAxisKey="month"
          showGrid={false}
          showLegend={false}
        />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Charts configured as dashboard widgets with compact styling.',
      },
    },
  },
};

// Advanced Chart Stories

export const AccessibleChart: Story = {
  render: () => (
    <div className="w-full h-96">
      <LineChart
        data={revenueData}
        series={[
          {
            dataKey: 'revenue',
            name: 'Revenue',
            color: 'var(--chart-1)',
            strokeWidth: 3,
          },
          {
            dataKey: 'profit',
            name: 'Profit',
            color: 'var(--chart-2)',
            strokeWidth: 2,
          },
        ]}
        title="Accessible Revenue Chart"
        subtitle="Chart optimized for screen readers and high contrast"
        xAxisKey="period"
        yAxisLabel="Amount ($)"
        currency="USD"
        showGrid={true}
        showLegend={true}
        showDots={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Chart with enhanced accessibility features including high contrast colors and visible data points.',
      },
    },
  },
};

export const GrayscaleChart: Story = {
  render: () => (
    <div className="w-full h-96">
      <BarChart
        data={monthlyData}
        series={[
          {
            dataKey: 'actual',
            name: 'Actual',
            color: 'var(--gray-700)',
          },
          {
            dataKey: 'budget',
            name: 'Budget',
            color: 'var(--gray-500)',
          },
          {
            dataKey: 'forecast',
            name: 'Forecast',
            color: 'var(--gray-300)',
          },
        ]}
        title="Grayscale Performance Chart"
        subtitle="Using design system grayscale colors"
        xAxisKey="month"
        yAxisLabel="Revenue ($)"
        currency="USD"
        showGrid={true}
        showLegend={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Chart demonstrating the new grayscale color tokens for print-friendly or monochromatic displays.',
      },
    },
  },
};

export const ExtendedColorPalette: Story = {
  render: () => {
    const extendedData = [
      { name: 'Category 1', value: 25 },
      { name: 'Category 2', value: 20 },
      { name: 'Category 3', value: 15 },
      { name: 'Category 4', value: 12 },
      { name: 'Category 5', value: 10 },
      { name: 'Category 6', value: 8 },
      { name: 'Category 7', value: 6 },
      { name: 'Category 8', value: 4 },
    ];

    return (
      <div className="w-full h-96">
        <PieChart
          data={extendedData}
          title="Extended Color Palette"
          subtitle="Showcasing the full range of chart colors"

          showPercentages={true}
          showLegend={true}

        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Chart demonstrating the extended color palette with 8 distinct chart colors.',
      },
    },
  },
};

export const HighContrastChart: Story = {
  render: () => (
    <div className="w-full h-96 bg-gray-900 p-4 rounded-lg">
      <LineChart
        data={revenueData}
        series={[
          {
            dataKey: 'revenue',
            name: 'Revenue',
            color: '#ffffff',
            strokeWidth: 3,
          },
          {
            dataKey: 'profit',
            name: 'Profit',
            color: '#fbbf24',
            strokeWidth: 2,
          },
        ]}
        title="High Contrast Chart"
        subtitle="Optimized for accessibility and dark backgrounds"
        xAxisKey="period"
        yAxisLabel="Amount ($)"
        currency="USD"
        showGrid={true}
        showLegend={true}
        showDots={true}
      />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'High contrast chart design for users with visual impairments or dark mode environments.',
      },
    },
  },
};
