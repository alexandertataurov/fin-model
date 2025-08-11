import type { Meta, StoryObj } from '@storybook/react';
import { CashFlowTabEnhanced } from './CashFlowTabEnhanced';

const meta: Meta<typeof CashFlowTabEnhanced> = {
  title: 'Components/CashFlowTabEnhanced',
  component: CashFlowTabEnhanced,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    cashFlowData: {
      control: { type: 'object' },
      description: 'Cash flow data to display',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    onDataChange: {
      action: 'data changed',
      description: 'Callback when data changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    cashFlowData: {
      operatingCashFlow: 2500000,
      investingCashFlow: -1800000,
      financingCashFlow: -500000,
      netCashFlow: 200000,
      freeCashFlow: 1800000,
      periods: [
        { period: 'Q1 2024', operating: 600000, investing: -450000, financing: -100000, net: 50000 },
        { period: 'Q2 2024', operating: 650000, investing: -500000, financing: -150000, net: 0 },
        { period: 'Q3 2024', operating: 700000, investing: -550000, financing: -200000, net: -50000 },
        { period: 'Q4 2024', operating: 550000, investing: -300000, financing: -50000, net: 200000 },
      ],
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <CashFlowTabEnhanced {...args} />,
};

export const Loading: Story = {
  args: {
    isLoading: true,
    cashFlowData: null,
    error: null,
  },
  render: (args) => <CashFlowTabEnhanced {...args} />,
};

export const Empty: Story = {
  args: {
    isLoading: false,
    cashFlowData: null,
    error: null,
  },
  render: (args) => <CashFlowTabEnhanced {...args} />,
};

export const Error: Story = {
  args: {
    isLoading: false,
    cashFlowData: null,
    error: 'Failed to load cash flow data. Please try again.',
  },
  render: (args) => <CashFlowTabEnhanced {...args} />,
};

export const GrowthCompany: Story = {
  args: {
    cashFlowData: {
      operatingCashFlow: 8000000,
      investingCashFlow: -12000000,
      financingCashFlow: 5000000,
      netCashFlow: 1000000,
      freeCashFlow: 6000000,
      periods: [
        { period: 'Q1 2024', operating: 1800000, investing: -3000000, financing: 1500000, net: 300000 },
        { period: 'Q2 2024', operating: 2000000, investing: -3500000, financing: 1800000, net: 300000 },
        { period: 'Q3 2024', operating: 2200000, investing: -4000000, financing: 2000000, net: 200000 },
        { period: 'Q4 2024', operating: 2000000, investing: -1500000, financing: -300000, net: 200000 },
      ],
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <CashFlowTabEnhanced {...args} />,
};

export const MatureCompany: Story = {
  args: {
    cashFlowData: {
      operatingCashFlow: 15000000,
      investingCashFlow: -8000000,
      financingCashFlow: -6000000,
      netCashFlow: 1000000,
      freeCashFlow: 12000000,
      periods: [
        { period: 'Q1 2024', operating: 3500000, investing: -2000000, financing: -1500000, net: 0 },
        { period: 'Q2 2024', operating: 3800000, investing: -2200000, financing: -1600000, net: 0 },
        { period: 'Q3 2024', operating: 4000000, investing: -2400000, financing: -1700000, net: -100000 },
        { period: 'Q4 2024', operating: 3700000, investing: -1400000, financing: -1200000, net: 1100000 },
      ],
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <CashFlowTabEnhanced {...args} />,
};
