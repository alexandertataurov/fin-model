import type { Meta, StoryObj } from '@storybook/react';
import LineChart from './LineChart';
import { tokens } from '@/design-system/tokens';

const meta: Meta<typeof LineChart> = {
  title: 'Components/Charts/Theming',
  component: LineChart,
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof LineChart>;

const sampleData = [
  { period: 'Jan', revenue: 12000, profit: 3200, cost: 8800 },
  { period: 'Feb', revenue: 14000, profit: 3800, cost: 10200 },
  { period: 'Mar', revenue: 16000, profit: 4200, cost: 11800 },
  { period: 'Apr', revenue: 15500, profit: 4000, cost: 11500 },
  { period: 'May', revenue: 18000, profit: 5200, cost: 12800 },
];

export const TokenColorsLight: Story = {
  args: {
    data: sampleData,
    series: [
      {
        dataKey: 'revenue',
        name: 'Revenue',
        color: tokens.colors.primary[600],
      },
      {
        dataKey: 'profit',
        name: 'Profit',
        color: tokens.colors.success[500],
      },
      {
        dataKey: 'cost',
        name: 'Cost',
        color: tokens.colors.error[500],
      },
    ],
    title: 'Token-driven Colors (Light)',
    subtitle: 'Using design tokens to theme charts',
    showDots: true,
    smooth: true,
  },
  parameters: {
    designSystem: { theme: 'light' },
  },
};

export const TokenColorsDark: Story = {
  args: {
    data: sampleData,
    series: [
      {
        dataKey: 'revenue',
        name: 'Revenue',
        color: tokens.colors.primary[400],
      },
      {
        dataKey: 'profit',
        name: 'Profit',
        color: tokens.colors.success[400],
      },
      {
        dataKey: 'cost',
        name: 'Cost',
        color: tokens.colors.error[400],
      },
    ],
    title: 'Token-driven Colors (Dark)',
    subtitle: 'Colors adjusted for dark tokens',
    showDots: true,
    smooth: true,
  },
  parameters: {
    backgrounds: { default: 'dark' },
    designSystem: { theme: 'dark' },
  },
};
