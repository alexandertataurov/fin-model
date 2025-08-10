import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Toaster } from '../components/Sonner';
import { Button } from '../components/Button';
import { toast } from 'sonner';

const meta: Meta<typeof Toaster> = {
  title: 'Design System/Toaster (Sonner)',
  component: Toaster,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    richColors: {
      control: { type: 'boolean' },
      description: 'Enable rich colors for toasts',
    },
    closeButton: {
      control: { type: 'boolean' },
      description: 'Show close button on toasts',
    },
    position: {
      control: { type: 'select' },
      options: ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'],
      description: 'Position of toasts',
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
    richColors: true,
    closeButton: true,
    position: 'top-right',
    duration: 4000,
  },
  render: (args) => (
    <div>
      <div className="space-x-2 mb-4">
        <Button onClick={() => toast('Default notification')}>Default</Button>
        <Button onClick={() => toast.success('Success notification')}>Success</Button>
        <Button onClick={() => toast.error('Error notification')}>Error</Button>
      </div>
      <Toaster {...args} />
    </div>
  ),
};

export const Basic: Story = {
  render: () => (
    <div className="space-x-2">
      <Button onClick={() => toast('Saved successfully')}>Notify</Button>
      <Button
        variant="outline"
        onClick={() => toast.error('Something went wrong')}
      >
        Error
      </Button>
      <Toaster richColors />
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div>
      <div className="space-x-2 mb-4">
        <Button onClick={() => toast('Default notification')}>Default</Button>
        <Button onClick={() => toast.success('Success notification')}>Success</Button>
        <Button onClick={() => toast.error('Error notification')}>Error</Button>
        <Button onClick={() => toast.warning('Warning notification')}>Warning</Button>
        <Button onClick={() => toast.info('Info notification')}>Info</Button>
      </div>
      <Toaster richColors closeButton position="top-right" />
    </div>
  ),
};

export const CustomDuration: Story = {
  render: () => (
    <div>
      <div className="space-x-2 mb-4">
        <Button onClick={() => toast('Short notification', { duration: 2000 })}>Short (2s)</Button>
        <Button onClick={() => toast('Long notification', { duration: 8000 })}>Long (8s)</Button>
        <Button onClick={() => toast('Persistent notification', { duration: Infinity })}>Persistent</Button>
      </div>
      <Toaster richColors />
    </div>
  ),
};

export const DifferentPositions: Story = {
  render: () => (
    <div>
      <div className="space-x-2 mb-4">
        <Button onClick={() => toast('Top-left notification')}>Top-Left</Button>
        <Button onClick={() => toast('Bottom-right notification')}>Bottom-Right</Button>
        <Button onClick={() => toast('Center notification')}>Center</Button>
      </div>
      <Toaster position="top-left" />
      <Toaster position="bottom-right" />
      <Toaster position="top-center" />
    </div>
  ),
};
