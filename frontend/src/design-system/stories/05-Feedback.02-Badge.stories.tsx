import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../components/Badge';
import { CheckCircle, AlertCircle, Clock, XCircle } from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: 'Design System/5 - Feedback/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A badge component for displaying status, labels, and notifications.',
      },
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
      description: 'The visual style variant of the badge',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic badge stories
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

// Status badges
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <CheckCircle className="mr-1 h-3 w-3" />
        Active
      </Badge>
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Failed
      </Badge>
      <Badge variant="outline" className="border-yellow-200 text-yellow-800">
        <AlertCircle className="mr-1 h-3 w-3" />
        Warning
      </Badge>
    </div>
  ),
};

// Financial status badges
export const FinancialStatus: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        Profitable
      </Badge>
      <Badge variant="destructive">
        Loss
      </Badge>
      <Badge variant="secondary">
        Break-even
      </Badge>
      <Badge variant="outline">
        Projected
      </Badge>
    </div>
  ),
};

// Notification badges
export const NotificationBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
        New
      </Badge>
      <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
        Updated
      </Badge>
      <Badge variant="destructive">
        Critical
      </Badge>
      <Badge variant="outline">
        Draft
      </Badge>
    </div>
  ),
};

// Size variations
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge className="text-xs">Small</Badge>
      <Badge>Default</Badge>
      <Badge className="text-base px-3 py-1">Large</Badge>
    </div>
  ),
};

// With icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>
        <CheckCircle className="mr-1 h-3 w-3" />
        Success
      </Badge>
      <Badge variant="secondary">
        <Clock className="mr-1 h-3 w-3" />
        Processing
      </Badge>
      <Badge variant="destructive">
        <XCircle className="mr-1 h-3 w-3" />
        Error
      </Badge>
      <Badge variant="outline">
        <AlertCircle className="mr-1 h-3 w-3" />
        Warning
      </Badge>
    </div>
  ),
};

// Interactive badges
export const Interactive: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge className="cursor-pointer hover:bg-primary/80">
        Clickable
      </Badge>
      <Badge variant="outline" className="cursor-pointer hover:bg-secondary">
        Interactive
      </Badge>
      <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
        Hover Effect
      </Badge>
    </div>
  ),
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-2">Default Variants</h3>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium mb-2">Custom Colors</h3>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Success</Badge>
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Info</Badge>
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Warning</Badge>
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Error</Badge>
        </div>
      </div>
    </div>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
