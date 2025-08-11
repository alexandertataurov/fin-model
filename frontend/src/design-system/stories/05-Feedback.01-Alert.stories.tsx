import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from '../components/Alert';

const meta: Meta<typeof Alert> = {
  title: 'Design System/Alert',
  component: Alert,
  parameters: {
    docs: {
      description: {
        component:
          'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.',
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive'],
      description: 'Alert variant style',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Info: Story = {
  render: () => (
    <Alert className="max-w-md">
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>
        You can use this alert component to show contextual feedback.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert className="border-destructive/50 text-destructive max-w-md">
      <AlertTitle>Something went wrong</AlertTitle>
      <AlertDescription>
        There was a problem with your request. Please try again.
      </AlertDescription>
    </Alert>
  ),
};

export const Success: Story = {
  render: () => (
    <Alert className="border-green-500/50 text-green-700 bg-green-50 max-w-md">
      <AlertTitle>Success!</AlertTitle>
      <AlertDescription>
        Your financial model has been saved successfully.
      </AlertDescription>
    </Alert>
  ),
};

export const Warning: Story = {
  render: () => (
    <Alert className="border-yellow-500/50 text-yellow-700 bg-yellow-50 max-w-md">
      <AlertTitle>Warning</AlertTitle>
      <AlertDescription>
        Some parameters are outside recommended ranges. Please review your inputs.
      </AlertDescription>
    </Alert>
  ),
};

export const FinancialAlert: Story = {
  render: () => (
    <Alert className="border-blue-500/50 text-blue-700 bg-blue-50 max-w-md">
      <AlertTitle>Market Update</AlertTitle>
      <AlertDescription>
        Exchange rates have been updated. Your calculations may need adjustment.
      </AlertDescription>
    </Alert>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
