import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import WaterfallChart from '@/components/Charts/WaterfallChart';

const meta: Meta<typeof WaterfallChart> = {
  title: 'Components/Charts/WaterfallChart',
  component: WaterfallChart,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

const data = [
  { name: 'Start', value: 100000, type: 'start' as const },
  { name: 'Revenue', value: 200000, type: 'positive' as const },
  { name: 'COGS', value: -90000, type: 'negative' as const },
  { name: 'Opex', value: -60000, type: 'negative' as const },
  { name: 'Interest', value: -5000, type: 'negative' as const },
  { name: 'Tax', value: -15000, type: 'negative' as const },
  { name: 'End', value: 120000, type: 'total' as const },
];

export const Basic: Story = {
  args: { data, title: 'Cash Flow Waterfall' },
};
