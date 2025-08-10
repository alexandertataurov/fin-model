import type { Meta, StoryObj } from '@storybook/react';
import { PieChart } from '@/components/Charts/PieChart';

const meta: Meta<typeof PieChart> = {
  title: 'Components/Charts/PieChart',
  component: PieChart,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

const data = [
  { name: 'Product', value: 420000 },
  { name: 'Services', value: 180000 },
  { name: 'Licensing', value: 120000 },
  { name: 'Other', value: 60000 },
];

export const Basic: Story = {
  args: { data, title: 'Revenue Breakdown', showLegend: true },
};

export const Donut: Story = {
  args: {
    data,
    title: 'Revenue Breakdown (Donut)',
    innerRadius: 80,
    showLegend: true,
  },
};
