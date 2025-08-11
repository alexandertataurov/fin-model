import type { Meta, StoryObj } from '@storybook/react';
import { SalesTab } from './SalesTab';

const meta: Meta<typeof SalesTab> = {
  title: 'Components/SalesTab',
  component: SalesTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    salesData: {
      control: { type: 'object' },
      description: 'Sales data to display',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    salesData: {
      totalRevenue: 1250000,
      growthRate: 15.2,
      topProducts: [
        { name: 'Product A', revenue: 450000, growth: 12.5 },
        { name: 'Product B', revenue: 380000, growth: 18.3 },
        { name: 'Product C', revenue: 320000, growth: 8.7 },
      ],
      monthlyData: [
        { month: 'Jan', revenue: 95000 },
        { month: 'Feb', revenue: 102000 },
        { month: 'Mar', revenue: 118000 },
        { month: 'Apr', revenue: 125000 },
      ],
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <SalesTab {...args} />,
};

export const Loading: Story = {
  args: {
    isLoading: true,
    salesData: null,
    error: null,
  },
  render: (args) => <SalesTab {...args} />,
};

export const Empty: Story = {
  args: {
    isLoading: false,
    salesData: null,
    error: null,
  },
  render: (args) => <SalesTab {...args} />,
};

export const Error: Story = {
  args: {
    isLoading: false,
    salesData: null,
    error: 'Failed to load sales data. Please try again.',
  },
  render: (args) => <SalesTab {...args} />,
};

export const HighGrowth: Story = {
  args: {
    salesData: {
      totalRevenue: 2500000,
      growthRate: 45.8,
      topProducts: [
        { name: 'Premium Product', revenue: 1200000, growth: 65.2 },
        { name: 'Enterprise Solution', revenue: 800000, growth: 42.1 },
        { name: 'Standard Package', revenue: 500000, growth: 28.9 },
      ],
      monthlyData: [
        { month: 'Jan', revenue: 180000 },
        { month: 'Feb', revenue: 220000 },
        { month: 'Mar', revenue: 280000 },
        { month: 'Apr', revenue: 320000 },
      ],
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <SalesTab {...args} />,
};
