import type { Meta, StoryObj } from '@storybook/react';
import { BalanceTabEnhanced } from './BalanceTabEnhanced';

const meta: Meta<typeof BalanceTabEnhanced> = {
  title: 'Components/BalanceTabEnhanced',
  component: BalanceTabEnhanced,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    balanceData: {
      control: { type: 'object' },
      description: 'Balance sheet data',
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
    balanceData: {
      assets: {
        current: 8500000,
        nonCurrent: 25000000,
        total: 33500000,
      },
      liabilities: {
        current: 6500000,
        nonCurrent: 12000000,
        total: 18500000,
      },
      equity: {
        commonStock: 5000000,
        retainedEarnings: 8000000,
        otherEquity: 2000000,
        total: 15000000,
      },
      ratios: {
        currentRatio: 1.31,
        debtToEquity: 1.23,
        returnOnEquity: 0.15,
      },
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <BalanceTabEnhanced {...args} />,
};

export const Loading: Story = {
  args: {
    isLoading: true,
    balanceData: null,
    error: null,
  },
  render: (args) => <BalanceTabEnhanced {...args} />,
};

export const Empty: Story = {
  args: {
    isLoading: false,
    balanceData: null,
    error: null,
  },
  render: (args) => <BalanceTabEnhanced {...args} />,
};

export const Error: Story = {
  args: {
    isLoading: false,
    balanceData: null,
    error: 'Failed to load balance sheet data. Please try again.',
  },
  render: (args) => <BalanceTabEnhanced {...args} />,
};

export const HighLeverage: Story = {
  args: {
    balanceData: {
      assets: {
        current: 12000000,
        nonCurrent: 40000000,
        total: 52000000,
      },
      liabilities: {
        current: 8000000,
        nonCurrent: 30000000,
        total: 38000000,
      },
      equity: {
        commonStock: 8000000,
        retainedEarnings: 4000000,
        otherEquity: 2000000,
        total: 14000000,
      },
      ratios: {
        currentRatio: 1.5,
        debtToEquity: 2.71,
        returnOnEquity: 0.12,
      },
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <BalanceTabEnhanced {...args} />,
};

export const Conservative: Story = {
  args: {
    balanceData: {
      assets: {
        current: 15000000,
        nonCurrent: 20000000,
        total: 35000000,
      },
      liabilities: {
        current: 5000000,
        nonCurrent: 8000000,
        total: 13000000,
      },
      equity: {
        commonStock: 10000000,
        retainedEarnings: 10000000,
        otherEquity: 2000000,
        total: 22000000,
      },
      ratios: {
        currentRatio: 3.0,
        debtToEquity: 0.59,
        returnOnEquity: 0.18,
      },
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <BalanceTabEnhanced {...args} />,
};
