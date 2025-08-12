import React from "react";
// Use the consolidated story definition below
import type { Meta, StoryObj } from '@storybook/react';
import BarChart from '@/components/Charts/BarChart';

const meta: Meta<typeof BarChart> = {
  title: 'Components/Charts/BarChart',
  component: BarChart,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

const data = [
  { category: 'Q1', revenue: 120000, costs: 80000 },
  { category: 'Q2', revenue: 150000, costs: 90000 },
  { category: 'Q3', revenue: 170000, costs: 100000 },
  { category: 'Q4', revenue: 200000, costs: 120000 },
];

const series = [
  { dataKey: 'revenue', name: 'Revenue', color: 'var(--chart-1)' },
  { dataKey: 'costs', name: 'Costs', color: 'var(--chart-2)' },
];

export const Basic: Story = {
  args: { data, series, title: 'Revenue vs Costs', xAxisKey: 'category' },
};

export const Stacked: Story = {
  args: {
    data,
    series: [
      {
        dataKey: 'revenue',
        name: 'Revenue',
        color: 'var(--chart-1)',
        stackId: 'a',
      },
      {
        dataKey: 'costs',
        name: 'Costs',
        color: 'var(--chart-2)',
        stackId: 'a',
      },
    ],
    title: 'Stacked Bars',
    xAxisKey: 'category',
  },
};
