import type { Meta, StoryObj } from '@storybook/react';
import DCFTab from './DCFTab';

const meta: Meta<typeof DCFTab> = {
  title: 'Components/DCFTab',
  component: DCFTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  argTypes: {
    dcfData: {
      control: { type: 'object' },
      description: 'DCF valuation data',
    },
    isLoading: {
      control: { type: 'boolean' },
      description: 'Loading state',
    },
    error: {
      control: { type: 'text' },
      description: 'Error message',
    },
    onParameterChange: {
      action: 'parameter changed',
      description: 'Callback when parameter changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    dcfData: {
      enterpriseValue: 15000000,
      equityValue: 12500000,
      presentValue: 8500000,
      terminalValue: 6500000,
      wacc: 12.5,
      growthRate: 5.2,
      freeCashFlows: [
        { year: 1, value: 1200000 },
        { year: 2, value: 1350000 },
        { year: 3, value: 1500000 },
        { year: 4, value: 1650000 },
        { year: 5, value: 1800000 },
      ],
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <DCFTab {...args} />,
};

export const Loading: Story = {
  args: {
    isLoading: true,
    dcfData: null,
    error: null,
  },
  render: (args) => <DCFTab {...args} />,
};

export const Empty: Story = {
  args: {
    isLoading: false,
    dcfData: null,
    error: null,
  },
  render: (args) => <DCFTab {...args} />,
};

export const Error: Story = {
  args: {
    isLoading: false,
    dcfData: null,
    error: 'Failed to calculate DCF valuation. Please check your inputs.',
  },
  render: (args) => <DCFTab {...args} />,
};

export const HighValueCompany: Story = {
  args: {
    dcfData: {
      enterpriseValue: 50000000,
      equityValue: 42000000,
      presentValue: 28000000,
      terminalValue: 22000000,
      wacc: 10.0,
      growthRate: 8.5,
      freeCashFlows: [
        { year: 1, value: 3500000 },
        { year: 2, value: 4200000 },
        { year: 3, value: 4900000 },
        { year: 4, value: 5600000 },
        { year: 5, value: 6300000 },
      ],
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <DCFTab {...args} />,
};

export const StartupValuation: Story = {
  args: {
    dcfData: {
      enterpriseValue: 5000000,
      equityValue: 3500000,
      presentValue: 2000000,
      terminalValue: 1500000,
      wacc: 18.0,
      growthRate: 25.0,
      freeCashFlows: [
        { year: 1, value: -500000 },
        { year: 2, value: 200000 },
        { year: 3, value: 800000 },
        { year: 4, value: 1500000 },
        { year: 5, value: 2500000 },
      ],
    },
    isLoading: false,
    error: null,
  },
  render: (args) => <DCFTab {...args} />,
};
