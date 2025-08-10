import type { Meta, StoryObj } from '@storybook/react';
import { LineChart } from '@/components/Charts/LineChart';

const meta: Meta<typeof LineChart> = {
  title: 'Components/Charts/LineChart',
  component: LineChart,
  parameters: {
    layout: 'padded',
  },
  args: {
    height: 320,
    showLegend: true,
    showGrid: true,
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleData = [
  { period: 'Q1', revenue: 120000, costs: 80000 },
  { period: 'Q2', revenue: 150000, costs: 90000 },
  { period: 'Q3', revenue: 170000, costs: 100000 },
  { period: 'Q4', revenue: 200000, costs: 120000 },
];

const series = [
  { dataKey: 'revenue', name: 'Revenue', color: 'var(--chart-1)' },
  { dataKey: 'costs', name: 'Costs', color: 'var(--chart-2)' },
];

export const Basic: Story = {
  args: {
    data: sampleData,
    series,
    title: 'Revenue vs Costs',
    xAxisKey: 'period',
  },
};

export const WithReferenceLine: Story = {
  args: {
    data: sampleData,
    series,
    title: 'Revenue vs Costs with Target',
    xAxisKey: 'period',
    referenceLines: [
      { value: 150000, label: 'Target', color: 'var(--muted-foreground)' },
    ],
  },
};
