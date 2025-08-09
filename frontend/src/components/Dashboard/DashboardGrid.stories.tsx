import type { Meta, StoryObj } from '@storybook/react';
import { DashboardGrid } from './DashboardGrid';

const meta: Meta<typeof DashboardGrid> = {
  title: 'Components/Dashboard/DashboardGrid',
  component: DashboardGrid,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
