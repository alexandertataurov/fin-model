import type { Meta, StoryObj } from '@storybook/react';
import { ScatterPlot } from './ScatterPlot';

const meta: Meta<typeof ScatterPlot> = {
  title: 'Components/ScatterPlot',
  component: ScatterPlot,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Scatter plot component for visualizing correlations between financial variables and simulation results.',
      },
    },
  },
  argTypes: {
    data: {
      control: { type: 'object' },
      description: 'Scatter plot data points',
    },
    xAxis: {
      control: { type: 'text' },
      description: 'X-axis variable name',
    },
    yAxis: {
      control: { type: 'text' },
      description: 'Y-axis variable name',
    },
    title: {
      control: { type: 'text' },
      description: 'Chart title',
    },
    showTrendLine: {
      control: { type: 'boolean' },
      description: 'Show trend line',
    },
    showCorrelation: {
      control: { type: 'boolean' },
      description: 'Show correlation coefficient',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    height: {
      control: { type: 'number' },
      description: 'Chart height in pixels',
    },
    width: {
      control: { type: 'number' },
      description: 'Chart width in pixels',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

const mockScatterData = [
  { x: 0.05, y: 1200000 },
  { x: 0.08, y: 1350000 },
  { x: 0.10, y: 1500000 },
  { x: 0.12, y: 1650000 },
  { x: 0.15, y: 1800000 },
  { x: 0.18, y: 1950000 },
  { x: 0.20, y: 2100000 },
  { x: 0.22, y: 2250000 },
  { x: 0.25, y: 2400000 },
  { x: 0.28, y: 2550000 },
  { x: 0.30, y: 2700000 },
  { x: 0.32, y: 2850000 },
  { x: 0.35, y: 3000000 },
];

const mockRevenueGrowthData = [
  { x: 0.10, y: 800000 },
  { x: 0.15, y: 950000 },
  { x: 0.20, y: 1100000 },
  { x: 0.25, y: 1250000 },
  { x: 0.30, y: 1400000 },
  { x: 0.35, y: 1550000 },
  { x: 0.40, y: 1700000 },
  { x: 0.45, y: 1850000 },
  { x: 0.50, y: 2000000 },
];

export const Default: Story = {
  args: {
    data: mockScatterData,
    xAxis: 'Discount Rate',
    yAxis: 'Valuation (USD)',
    title: 'Discount Rate vs. Company Valuation',
    showTrendLine: true,
    showCorrelation: true,
    isLoading: false,
    height: 400,
    width: 600,
  },
};

export const Loading: Story = {
  args: {
    data: [],
    xAxis: 'Variable X',
    yAxis: 'Variable Y',
    title: 'Loading Scatter Plot...',
    showTrendLine: false,
    showCorrelation: false,
    isLoading: true,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scatter plot component in loading state while processing data.',
      },
    },
  },
};

export const Empty: Story = {
  args: {
    data: [],
    xAxis: 'Variable X',
    yAxis: 'Variable Y',
    title: 'No Data Available',
    showTrendLine: false,
    showCorrelation: false,
    isLoading: false,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scatter plot component with no data to display.',
      },
    },
  },
};

export const Error: Story = {
  args: {
    data: [],
    xAxis: 'Variable X',
    yAxis: 'Variable Y',
    title: 'Error Loading Data',
    showTrendLine: false,
    showCorrelation: false,
    isLoading: false,
    error: 'Failed to load scatter plot data. Please try again.',
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scatter plot component showing error state when data loading fails.',
      },
    },
  },
};

export const RevenueGrowthCorrelation: Story = {
  args: {
    data: mockRevenueGrowthData,
    xAxis: 'Growth Rate',
    yAxis: 'Revenue (USD)',
    title: 'Growth Rate vs. Revenue Correlation',
    showTrendLine: true,
    showCorrelation: true,
    isLoading: false,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scatter plot showing correlation between growth rate and revenue projections.',
      },
    },
  },
};

export const WithoutTrendLine: Story = {
  args: {
    data: mockScatterData,
    xAxis: 'Discount Rate',
    yAxis: 'Valuation (USD)',
    title: 'Discount Rate vs. Valuation (No Trend)',
    showTrendLine: false,
    showCorrelation: true,
    isLoading: false,
    height: 400,
    width: 600,
  },
  parameters: {
    docs: {
      description: {
        story: 'Scatter plot without trend line, showing only data points and correlation.',
      },
    },
  },
};
