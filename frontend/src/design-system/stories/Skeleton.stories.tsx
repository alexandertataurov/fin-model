import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../components/Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Design System/Skeleton',
  component: Skeleton,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: { type: 'text' },
      description: 'Additional CSS classes',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: 'h-4 w-32 rounded',
  },
};

export const Blocks: Story = {
  render: () => (
    <div className="w-96 space-y-3">
      <Skeleton className="h-5 w-2/3 rounded" />
      <Skeleton className="h-4 w-1/2 rounded" />
      <Skeleton className="h-10 w-full rounded" />
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="w-80 space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-4 w-1/2 rounded" />
        <Skeleton className="h-4 w-2/3 rounded" />
      </div>
    </div>
  ),
};

export const Avatar: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32 rounded" />
        <Skeleton className="h-4 w-24 rounded" />
      </div>
    </div>
  ),
};

export const Table: Story = {
  render: () => (
    <div className="w-full space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex space-x-4">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-4 w-1/4 rounded" />
        </div>
      ))}
    </div>
  ),
};
