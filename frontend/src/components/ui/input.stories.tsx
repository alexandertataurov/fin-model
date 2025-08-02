import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Label } from './label';
import { Search, Mail, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Input Component

A flexible input component built with accessibility and form integration in mind. Supports error states, helper text, and various input types.

## Key Features

- **Accessibility**: Built-in focus management and ARIA attributes
- **Error States**: Visual feedback for validation errors
- **Helper Text**: Additional context for users
- **Icon Integration**: Works well with icon components
- **Type Safety**: Full TypeScript support

## Usage in FinVision

- **Login/Register Forms**: Email and password inputs
- **Parameter Forms**: Numeric inputs for financial parameters
- **Search**: Search functionality across the platform
- **File Upload**: Filename and metadata inputs
        `,
      },
    },
  },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
      description: 'HTML input type',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disable the input',
    },
    error: {
      control: 'boolean',
      description: 'Show error state',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below input',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="email">Email Address</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};

export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <Label htmlFor="error-input">Email Address</Label>
      <Input
        id="error-input"
        type="email"
        placeholder="Enter your email"
        aria-invalid="true"
        className="border-destructive focus-visible:ring-destructive/20"
      />
      <p className="text-sm text-destructive">
        Please enter a valid email address
      </p>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Input with error state and validation message.',
      },
    },
  },
};

export const Types: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <Label>Text Input</Label>
        <Input type="text" placeholder="Enter text" />
      </div>
      <div className="space-y-2">
        <Label>Email Input</Label>
        <Input type="email" placeholder="Enter email" />
      </div>
      <div className="space-y-2">
        <Label>Password Input</Label>
        <Input type="password" placeholder="Enter password" />
      </div>
      <div className="space-y-2">
        <Label>Number Input</Label>
        <Input type="number" placeholder="Enter number" />
      </div>
      <div className="space-y-2">
        <Label>Search Input</Label>
        <Input type="search" placeholder="Search..." />
      </div>
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <Label>Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search financial data..."
            className="pl-10"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label>Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            placeholder="Enter your email"
            className="pl-10"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Inputs with icon integration for better UX.',
      },
    },
  },
};

export const PasswordWithToggle: Story = {
  render: () => {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-80 space-y-2">
        <Label>Password</Label>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Password input with visibility toggle functionality.',
      },
    },
  },
};

export const LoginFormExample: Story = {
  render: () => (
    <div className="w-80 space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Login Form</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login-email">Email</Label>
          <Input id="login-email" type="email" placeholder="Enter your email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="login-password">Password</Label>
          <Input
            id="login-password"
            type="password"
            placeholder="Enter your password"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Example usage from the FinVision login form.',
      },
    },
  },
};

export const ParameterInputExample: Story = {
  render: () => (
    <div className="w-80 space-y-4 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold">Financial Parameters</h3>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="revenue">Revenue Growth Rate</Label>
          <Input
            id="revenue"
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            max="1"
          />
          <p className="text-xs text-muted-foreground">
            Enter as decimal (e.g., 0.15 for 15%)
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discount">Discount Rate</Label>
          <Input
            id="discount"
            type="number"
            placeholder="0.00"
            step="0.001"
            min="0"
            max="1"
          />
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Example usage for financial parameter inputs in the modeling interface.',
      },
    },
  },
};
