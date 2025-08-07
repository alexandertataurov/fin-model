import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { Label } from './label';

const meta: Meta<typeof Switch> = {
  title: '🧩 UI Components/Switch',
  component: Switch,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Switch Component

A toggle switch component built with Radix UI primitives for consistent styling and accessibility across the FinVision platform.

## Key Features

- **Accessibility**: Built-in focus management and ARIA attributes
- **Controlled/Uncontrolled**: Supports both controlled and uncontrolled usage
- **Label Integration**: Works seamlessly with Label component
- **Disabled States**: Visual feedback for disabled state
- **Smooth Animations**: Smooth transitions between states

## Usage in FinVision

- **Feature Toggles**: Enable/disable advanced features
- **User Preferences**: Toggle user settings and notifications
- **Model Parameters**: Quick on/off parameters
- **Display Options**: Toggle chart and table display options
        `,
      },
    },
  },
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'Checked state',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the switch',
    },
    id: {
      control: 'text',
      description: 'Unique identifier',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane mode</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="notifications" defaultChecked />
      <Label htmlFor="notifications">Notifications</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Switch id="disabled-off" disabled />
        <Label htmlFor="disabled-off">Disabled off</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Switch id="disabled-on" disabled defaultChecked />
        <Label htmlFor="disabled-on">Disabled on</Label>
      </div>
    </div>
  ),
};

export const MultipleSwitches: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="auto-save">Auto-save</Label>
        <Switch id="auto-save" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="dark-mode">Dark mode</Label>
        <Switch id="dark-mode" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="notifications">Email notifications</Label>
        <Switch id="notifications" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="analytics">Analytics tracking</Label>
        <Switch id="analytics" />
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Label htmlFor="advanced-mode">Advanced mode</Label>
          <p className="text-sm text-muted-foreground">
            Enable advanced financial modeling features
          </p>
        </div>
        <Switch id="advanced-mode" className="mt-1" />
      </div>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <Label htmlFor="real-time">Real-time updates</Label>
          <p className="text-sm text-muted-foreground">
            Update model calculations in real-time
          </p>
        </div>
        <Switch id="real-time" className="mt-1" defaultChecked />
      </div>
    </div>
  ),
};
