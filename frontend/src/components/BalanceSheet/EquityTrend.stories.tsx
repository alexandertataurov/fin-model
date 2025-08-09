import type { Meta, StoryObj } from '@storybook/react';
import EquityTrend from './EquityTrend';

const meta: Meta<typeof EquityTrend> = {
  title: 'Components/EquityTrend',
  component: EquityTrend,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Loading: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Empty: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Error: Story = { parameters: { docs: { description: { story: 'Error state.' } } } };
