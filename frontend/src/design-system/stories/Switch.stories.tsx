import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../components/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Design System/Switch',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  component: Switch,
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => <Switch />,
};
