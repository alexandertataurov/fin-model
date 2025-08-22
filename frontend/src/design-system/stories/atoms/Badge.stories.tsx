import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../atoms';
import {
  SectionHeader,
  AnimatedBanner,
  GuidelinesSection,
  GuidelinesCard,
  ColorPalette,
  SemanticColor,
  SurfaceColor,
  InteractiveState,
  FormField,
  StatusIndicator,
  Notification,
  DashboardHeader,
  MetricCard,
  QuickActions,
  PhilosophyItem,
  Card
} from '../components';
import { Check, X, AlertTriangle, Info, Tag, Shield, Star, Zap } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Badge> = {
  title: '2 - Atoms / Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Badge"
            subtitle="A sophisticated badge component for status indicators, labels, and notifications. Perfect for financial applications requiring clear status communication and user feedback."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM12 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
        'muted',
      ],
      description: 'The visual style variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge',
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The spacing between elements inside the badge',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The internal padding of the badge',
    },
    margin: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The external margin of the badge',
    },
    borderRadius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
      description: 'The border radius of the badge',
    },
    shadow: {
      control: 'select',
      options: [
        'none',
        'sm',
        'base',
        'md',
        'lg',
        'xl',
        '2xl',
        'inner',
        'card',
        'button',
        'modal',
        'dropdown',
        'hover',
        'active',
        'focus',
        'glow',
        'error',
        'success',
      ],
      description: 'The shadow elevation of the badge',
    },
    layout: {
      control: 'select',
      options: ['flex', 'grid', 'block', 'inline'],
      description: 'The display layout of the badge',
    },
    flexDirection: {
      control: 'select',
      options: ['row', 'col', 'rowReverse', 'colReverse'],
      description: 'Flex direction for flex layout',
    },
    flexJustify: {
      control: 'select',
      options: ['start', 'center', 'end', 'between', 'around', 'evenly'],
      description: 'Flex justify content for flex layout',
    },
    flexAlign: {
      control: 'select',
      options: ['start', 'center', 'end', 'stretch', 'baseline'],
      description: 'Flex align items for flex layout',
    },
    gridColumns: {
      control: 'select',
      options: [1, 2, 3, 4, 5, 6, 12],
      description: 'Number of grid columns for grid layout',
    },
    gridGap: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'Gap between grid items for grid layout',
    },
    borderWidth: {
      control: 'select',
      options: ['none', 'thin', 'base', 'thick', 'extra'],
      description: 'Border width of the badge',
    },
    motion: {
      control: 'select',
      options: ['none', 'fast', 'normal', 'slow', 'slower', 'slowest'],
      description: 'Motion duration for transitions',
    },
    transition: {
      control: 'select',
      options: [
        'none',
        'fast',
        'normal',
        'slow',
        'slower',
        'colors',
        'transform',
        'opacity',
        'shadow',
      ],
      description: 'Transition properties for animations',
    },
    elevation: {
      control: 'select',
      options: ['none', 'low', 'medium', 'high', 'overlay', 'modal', 'tooltip'],
      description: 'Z-index elevation of the badge',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child component using Radix Slot',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================
// STORIES
// ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Badge Variants"
        subtitle="Explore the different visual styles and semantic meanings available for the Badge component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Default</h3>
          </div>
          <div className="space-y-3">
            <Badge variant="default">Default</Badge>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Primary actions</p>
              <p className="text-gray-600">Main brand color</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: default</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Secondary</h3>
          </div>
          <div className="space-y-3">
            <Badge variant="secondary">Secondary</Badge>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Neutral content</p>
              <p className="text-gray-600">Subtle emphasis</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: secondary</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Destructive</h3>
          </div>
          <div className="space-y-3">
            <Badge variant="destructive">Destructive</Badge>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Errors & warnings</p>
              <p className="text-gray-600">Critical actions</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: destructive</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <Info className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Outline</h3>
          </div>
          <div className="space-y-3">
            <Badge variant="outline">Outline</Badge>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Subtle emphasis</p>
              <p className="text-gray-600">Bordered style</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: outline</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Success</h3>
          </div>
          <div className="space-y-3">
            <Badge variant="success">Success</Badge>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Positive states</p>
              <p className="text-gray-600">Completed actions</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: success</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Warning</h3>
          </div>
          <div className="space-y-3">
            <Badge variant="warning">Warning</Badge>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Caution states</p>
              <p className="text-gray-600">Attention required</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: warning</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <Info className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Info</h3>
          </div>
          <div className="space-y-3">
            <Badge variant="info">Info</Badge>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Information</p>
              <p className="text-gray-600">Helpful context</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: info</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Muted</h3>
          </div>
          <div className="space-y-3">
            <Badge variant="muted">Muted</Badge>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Disabled states</p>
              <p className="text-gray-600">Inactive content</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: muted</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Badge Sizes and Shapes"
        subtitle="Comprehensive demonstration of all available sizes and styling options for the Badge component."
      />

      {/* Size Scale Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Scale</h3>
            <p className="text-sm text-gray-600">Three distinct sizes for different UI contexts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="relative mb-4">
              <Badge size="sm" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Small Badge
              </Badge>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">1</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Small</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Compact size</p>
            <p className="text-xs text-gray-600">Dense layouts, lists</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Badge size="md" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Medium Badge
              </Badge>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">2</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Medium</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Default size</p>
            <p className="text-xs text-gray-600">General use</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Badge size="lg" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Large Badge
              </Badge>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">3</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Large</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Prominent size</p>
            <p className="text-xs text-gray-600">Important status</p>
          </div>
        </div>
      </Card>

      {/* Border Radius Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Border Radius</h3>
            <p className="text-sm text-gray-600">Different corner roundness options</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center group">
            <div className="relative mb-4">
              <Badge borderRadius="none" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                None
              </Badge>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">A</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">None</p>
            <p className="text-xs font-mono text-gray-500 mb-1">border-radius: 0</p>
            <p className="text-xs text-gray-600">Sharp corners</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Badge borderRadius="md" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Medium
              </Badge>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">B</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Medium</p>
            <p className="text-xs font-mono text-gray-500 mb-1">border-radius: 0.375rem</p>
            <p className="text-xs text-gray-600">Default style</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Badge borderRadius="lg" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Large
              </Badge>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">C</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Large</p>
            <p className="text-xs font-mono text-gray-500 mb-1">border-radius: 0.5rem</p>
            <p className="text-xs text-gray-600">Rounded style</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Badge borderRadius="full" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Full
              </Badge>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">D</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Full</p>
            <p className="text-xs font-mono text-gray-500 mb-1">border-radius: 9999px</p>
            <p className="text-xs text-gray-600">Pill shape</p>
          </div>
        </div>
      </Card>

      {/* Size Comparison Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Tag className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Comparison</h3>
            <p className="text-sm text-gray-600">Visual scale showing relative sizes</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 h-24">
          <div className="text-center">
            <Badge size="sm" className="shadow-lg">
              Small
            </Badge>
            <p className="text-xs font-mono text-gray-500 mt-2">Compact</p>
          </div>
          <div className="text-center">
            <Badge size="md" className="shadow-lg">
              Medium
            </Badge>
            <p className="text-xs font-mono text-gray-500 mt-2">Default</p>
          </div>
          <div className="text-center">
            <Badge size="lg" className="shadow-lg">
              Large
            </Badge>
            <p className="text-xs font-mono text-gray-500 mt-2">Prominent</p>
          </div>
        </div>
      </Card>
    </div>
  ),
};

export const UseCases: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Common Use Cases"
        subtitle="Real-world examples of Badge usage in typical UI patterns for financial applications."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Transaction Status */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Transaction Status</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Payment Processing</span>
              <Badge variant="info">Processing</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Investment Complete</span>
              <Badge variant="success">Completed</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Transfer Failed</span>
              <Badge variant="destructive">Failed</Badge>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-2">role: transaction-status</p>
          </div>
        </Card>

        {/* Account Verification */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Account Verification</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-2">
              <Badge variant="success">
                <Check className="h-3 w-3" />
                Verified
              </Badge>
              <span className="text-sm text-gray-600">Email confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="warning">
                <AlertTriangle className="h-3 w-3" />
                Pending
              </Badge>
              <span className="text-sm text-gray-600">Phone verification</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="muted">
                <X className="h-3 w-3" />
                Required
              </Badge>
              <span className="text-sm text-gray-600">Identity documents</span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-2">role: verification-status</p>
          </div>
        </Card>

        {/* Investment Portfolio */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center">
              <Star className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Portfolio Tags</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex flex-wrap gap-2">
              <Badge variant="info">High Growth</Badge>
              <Badge variant="outline">ESG</Badge>
              <Badge variant="secondary">Tech</Badge>
              <Badge variant="success">Dividend</Badge>
            </div>
            <p className="text-sm text-gray-600">Investment categories and characteristics</p>
            <p className="text-xs font-mono text-gray-400 mt-2">role: portfolio-tags</p>
          </div>
        </Card>

        {/* Notification System */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Messages</span>
              <Badge variant="destructive" size="sm" borderRadius="full">
                3
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Alerts</span>
              <Badge variant="warning" size="sm" borderRadius="full">
                1
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-900">Updates</span>
              <Badge variant="info" size="sm" borderRadius="full">
                5
              </Badge>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-2">role: notification-counts</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive States"
        subtitle="Demonstrates how badges behave in different interactive contexts."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Tag className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Hover Effects</h3>
          </div>
          <div className="space-y-4">
            <Badge
              variant="default"
              className="cursor-pointer hover:scale-105 hover:shadow-lg transition-all"
            >
              Hover Me
            </Badge>
            <p className="text-sm text-gray-600 text-center">Scale and shadow on hover</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: interactive</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Loading State</h3>
          </div>
          <div className="space-y-4">
            <Badge
              variant="info"
              className="animate-pulse"
            >
              Loading...
            </Badge>
            <p className="text-sm text-gray-600 text-center">Pulse animation</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: loading • animation: pulse</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Focus State</h3>
          </div>
          <div className="space-y-4">
            <Badge
              variant="warning"
              className="focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
              tabIndex={0}
            >
              Focus Me
            </Badge>
            <p className="text-sm text-gray-600 text-center">Ring on focus</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: focus • ring: amber</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Usage Guidelines"
        subtitle="Guidelines for using the Badge component effectively."
      />

      <Card className="p-8">
        <GuidelinesSection title="Do">
          <GuidelinesCard
            title="Do"
            variant="success"
            icon={<Check />}
            items={[
              'Use badges for short, <strong>scannable</strong> status or metadata.',
              'Choose variants that match <strong>semantic meaning</strong> (success, warning, etc.).',
              'Combine with icons for enhanced clarity.',
              'Use appropriate sizes for context hierarchy.',
              'Consider accessibility with proper contrast.',
            ]}
          />
        </GuidelinesSection>
        <GuidelinesSection title="Don't">
          <GuidelinesCard
            title="Don't"
            variant="warning"
            icon={<AlertTriangle />}
            items={[
              "Don't place long sentences inside badges.",
              'Avoid using only <strong>color</strong> to convey meaning.',
              "Don't overuse badges - they should enhance, not clutter.",
              'Avoid inconsistent variant usage across similar contexts.',
            ]}
          />
        </GuidelinesSection>
      </Card>

      <Card className="p-8">
        <GuidelinesSection
          title="Accessibility"
          items={[
            'Ensure <strong>contrast</strong> between badge background and text (WCAG AA).',
            'If icon-only, provide <code>aria-label</code>.',
            'Use semantic variants for screen reader compatibility.',
            'Consider color blindness in design decisions.',
          ]}
        />
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <Tag className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Interactive Badge</h3>
        </div>

        <div className="flex items-center justify-center mb-6">
          <Badge {...args}>
            Interactive Badge
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Variant</p>
            <p className="font-mono text-gray-600">{args.variant}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Size</p>
            <p className="font-mono text-gray-600">{args.size}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Use the controls panel on the right to experiment with different variants and sizes.
          </p>
        </div>
      </div>
    </div>
  ),
  args: {
    variant: 'default',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline', 'success', 'warning', 'info', 'muted'],
      description: 'The visual style variant of the badge',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive badge with configurable props. Use the controls to experiment with different variants and sizes.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Complete Badge Documentation"
        subtitle="Comprehensive guide to using the sophisticated Badge component."
      />

      <Card className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          🌟 Design Philosophy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PhilosophyItem
              color="#6366f1"
              title="Semantic Communication"
              description="Clear visual indicators that convey meaning instantly"
            />
            <PhilosophyItem
              color="#6b7280"
              title="Consistent Hierarchy"
              description="Maintains visual hierarchy through standardized variants"
            />
          </div>
          <div className="space-y-4">
            <PhilosophyItem
              color="#10b981"
              title="Accessible Design"
              description="Ensures all users can understand badge meanings"
            />
            <PhilosophyItem
              color="#ef4444"
              title="Contextual Relevance"
              description="Provides relevant information without overwhelming"
            />
          </div>
        </div>
      </Card>

      <Card className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          🚀 Usage Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GuidelinesSection
            title="Variant Selection"
            items={[
              '• <strong>success</strong>: Positive feedback, completed actions',
              '• <strong>warning</strong>: Caution states, attention required',
              '• <strong>destructive</strong>: Errors, critical issues',
              '• <strong>info</strong>: Informational content, help text',
            ]}
          />
          <GuidelinesSection
            title="Size Usage"
            items={[
              '• <strong>sm</strong>: Dense layouts, lists, notifications',
              '• <strong>md</strong>: Default size, general use',
              '• <strong>lg</strong>: Important status, prominent display',
            ]}
          />
          <GuidelinesSection
            title="Best Practices"
            items={[
              '• Keep text short and scannable',
              '• Use consistent variants across similar contexts',
              '• Combine with icons for enhanced clarity',
              '• Consider accessibility requirements',
            ]}
          />
        </div>
      </Card>

      <Card className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          ♿ Accessibility
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GuidelinesSection
            title="Visual Accessibility"
            items={[
              '• Ensure 4.5:1 contrast ratio for text',
              '• Test with color blindness simulators',
              '• Don\'t rely solely on color for meaning',
              '• Use semantic variants consistently',
            ]}
          />
          <GuidelinesSection
            title="Screen Reader Support"
            items={[
              '• Provide aria-label for icon-only badges',
              '• Use semantic HTML structure',
              '• Ensure proper focus indicators',
              '• Test with screen readers',
            ]}
          />
        </div>
      </Card>
    </div>
  ),
};
