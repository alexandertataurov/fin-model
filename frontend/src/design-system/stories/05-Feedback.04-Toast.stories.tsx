import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../components/Button';
import {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from '../components/Toast';

const meta: Meta<typeof Toast> = {
  title: 'Design System/Toast',
  component: Toast,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the toast is open',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback when toast open state changes',
    },
    duration: {
      control: { type: 'number', min: 1000, max: 10000, step: 500 },
      description: 'Duration in milliseconds',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: false,
  },
  render: (args) => (
    <ToastProvider>
      <Toast {...args}>
        <ToastTitle>Default Toast</ToastTitle>
        <ToastDescription>This is a default toast notification.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const Basic: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);
    return (
      <ToastProvider>
        <Button onClick={() => setOpen(true)}>Show toast</Button>
        <Toast open={open} onOpenChange={setOpen}>
          <ToastTitle>Saved</ToastTitle>
          <ToastDescription>Your changes have been saved.</ToastDescription>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>
    );
  },
};

export const Success: Story = {
  render: () => (
    <ToastProvider>
      <Toast open={true}>
        <ToastTitle>Success</ToastTitle>
        <ToastDescription>Operation completed successfully.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const Error: Story = {
  render: () => (
    <ToastProvider>
      <Toast open={true}>
        <ToastTitle>Error</ToastTitle>
        <ToastDescription>Something went wrong. Please try again.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};

export const LongDuration: Story = {
  render: () => (
    <ToastProvider>
      <Toast open={true} duration={10000}>
        <ToastTitle>Long Duration</ToastTitle>
        <ToastDescription>This toast will stay open for 10 seconds.</ToastDescription>
        <ToastClose />
      </Toast>
      <ToastViewport />
    </ToastProvider>
  ),
};
