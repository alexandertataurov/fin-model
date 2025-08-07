import type { Meta, StoryObj } from '@storybook/react';
import LineChart from './LineChart';
import BarChart from './BarChart';
import PieChart from './PieChart';

const meta: Meta = {
  title: '🏗️ Application Structure/📊 Data Visualization',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Advanced financial data visualization framework - interactive charts, graphs, and analytics components for displaying complex financial metrics and trends.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const DataVisualizationOverview: Story = {
  render: () => (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">📊 Data Visualization Framework</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Advanced financial data visualization and analytics components for
          displaying complex financial metrics and trends
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Chart Types</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Line Charts</p>
                <p className="text-sm text-muted-foreground">
                  Trend analysis and time series
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium">Bar Charts</p>
                <p className="text-sm text-muted-foreground">
                  Comparison and distribution
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div>
                <p className="font-medium">Pie Charts</p>
                <p className="text-sm text-muted-foreground">
                  Proportional breakdowns
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Features</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <div>
                <p className="font-medium">Interactive</p>
                <p className="text-sm text-muted-foreground">
                  Hover, zoom, and drill-down
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <p className="font-medium">Responsive</p>
                <p className="text-sm text-muted-foreground">
                  Adapts to screen sizes
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>
              <div>
                <p className="font-medium">Accessible</p>
                <p className="text-sm text-muted-foreground">
                  Screen reader support
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Use Cases</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
              <div>
                <p className="font-medium">Financial Reports</p>
                <p className="text-sm text-muted-foreground">
                  Revenue and performance
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-pink-500 rounded-full"></div>
              <div>
                <p className="font-medium">Dashboard Widgets</p>
                <p className="text-sm text-muted-foreground">
                  Real-time metrics
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div>
                <p className="font-medium">Scenario Analysis</p>
                <p className="text-sm text-muted-foreground">
                  What-if modeling
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-muted/50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Technical Specifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium mb-2">Performance</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Optimized rendering for large datasets</li>
              <li>• Lazy loading and virtualization</li>
              <li>• Efficient memory management</li>
              <li>• Smooth animations and transitions</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-2">Integration</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Seamless data binding</li>
              <li>• Real-time updates</li>
              <li>• Export capabilities (PNG, SVG, PDF)</li>
              <li>• Customizable themes and colors</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Comprehensive overview of the Data Visualization framework, showcasing chart types, features, and technical capabilities.',
      },
    },
  },
};

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
            color: 'var(--background)',
            strokeWidth: 3,
          },
          {
            dataKey: 'profit',
            name: 'Profit',
            color: 'var(--warning)',
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
