import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '../components/Switch';

const meta: Meta<typeof Switch> = {
  title: 'Design System/Switch',
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  component: Switch,
  argTypes: {
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the switch is checked',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the switch is disabled',
    },
    onCheckedChange: {
      action: 'checked changed',
      description: 'Callback when checked state changes',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    checked: false,
  },
  render: (args) => <Switch {...args} />,
};

export const Checked: Story = {
  args: {
    checked: true,
  },
  render: (args) => <Switch {...args} />,
};

export const Disabled: Story = {
  args: {
    checked: false,
    disabled: true,
  },
  render: (args) => <Switch {...args} />,
};

export const DisabledChecked: Story = {
  args: {
    checked: true,
    disabled: true,
  },
  render: (args) => <Switch {...args} />,
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode">Airplane mode</label>
    </div>
  ),
};

export const FinancialToggle: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="real-time" />
        <label htmlFor="real-time">Real-time data updates</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="notifications" />
        <label htmlFor="notifications">Price alerts</label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="auto-save" />
        <label htmlFor="auto-save">Auto-save calculations</label>
      </div>
    </div>
  ),
};
