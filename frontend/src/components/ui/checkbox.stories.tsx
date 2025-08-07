import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from './label';

const meta: Meta<typeof Checkbox> = {
  title: '🧩 UI Components/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Checkbox Component

A checkbox component built with Radix UI primitives for consistent styling and accessibility across the FinVision platform.

## Key Features

- **Accessibility**: Built-in focus management and ARIA attributes
- **Controlled/Uncontrolled**: Supports both controlled and uncontrolled usage
- **Label Integration**: Works seamlessly with Label component
- **Disabled States**: Visual feedback for disabled state
- **Indeterminate State**: Support for indeterminate checkbox state

## Usage in FinVision

- **Parameter Selection**: Enable/disable model parameters
- **Report Options**: Select report sections to include
- **User Preferences**: Toggle user settings and preferences
- **Data Filtering**: Filter data tables and charts
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
      description: 'Disable the checkbox',
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
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept terms and conditions</Label>
    </div>
  ),
};

export const Checked: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Checkbox id="newsletter" defaultChecked />
      <Label htmlFor="newsletter">Subscribe to newsletter</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-unchecked" disabled />
        <Label htmlFor="disabled-unchecked">Disabled unchecked</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="disabled-checked" disabled defaultChecked />
        <Label htmlFor="disabled-checked">Disabled checked</Label>
      </div>
    </div>
  ),
};

export const MultipleOptions: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Checkbox id="option1" />
        <Label htmlFor="option1">Include revenue projections</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option2" />
        <Label htmlFor="option2">Include expense breakdown</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option3" />
        <Label htmlFor="option3">Include cash flow analysis</Label>
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="option4" />
        <Label htmlFor="option4">Include sensitivity analysis</Label>
      </div>
    </div>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-start space-x-2">
        <Checkbox id="advanced" className="mt-1" />
        <div className="space-y-1">
          <Label htmlFor="advanced">Advanced mode</Label>
          <p className="text-sm text-muted-foreground">
            Enable advanced features including Monte Carlo simulations and
            scenario analysis
          </p>
        </div>
      </div>
      <div className="flex items-start space-x-2">
        <Checkbox id="export" className="mt-1" />
        <div className="space-y-1">
          <Label htmlFor="export">Export data</Label>
          <p className="text-sm text-muted-foreground">
            Include raw data in export files for external analysis
          </p>
        </div>
      </div>
    </div>
  ),
};
