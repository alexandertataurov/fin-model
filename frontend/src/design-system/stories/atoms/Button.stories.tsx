import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../atoms/Button';
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
import { Plus, ArrowRight, Download, Settings, Info, Check, AlertTriangle, Play, Zap, Shield, Star } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Button> = {
  title: '2 - Atoms / Button',
  component: Button,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Button"
            subtitle="A sophisticated button component with multiple variants, sizes, and states. Perfect for financial applications requiring clear call-to-actions and user interactions."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-5-4v6m4-6v6m-9 0h9a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2z"
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
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'success',
        'warning',
        'info',
      ],
      description: 'The visual style variant of the button',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', 'icon'],
      description: 'The size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Whether the button is in a loading state',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the button is disabled',
    },
    asChild: {
      control: 'boolean',
      description: 'Whether to render as a child component using Radix Slot',
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The spacing between elements inside the button',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The internal padding of the button',
    },
    margin: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The external margin of the button',
    },
    borderRadius: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', 'full'],
      description: 'The border radius of the button',
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
      description: 'The shadow elevation of the button',
    },
    layout: {
      control: 'select',
      options: ['flex', 'grid', 'block', 'inline'],
      description: 'The display layout of the button',
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
      description: 'Border width of the button',
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
      description: 'Z-index elevation of the button',
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
        title="Button Variants"
        subtitle="Explore the different visual styles and semantic meanings available for the Button component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Default</h3>
          </div>
          <div className="space-y-3">
            <Button variant="default">Default Button</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Primary actions</p>
              <p className="text-gray-600">Main call-to-action</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: default</p>
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
            <Button variant="destructive">Delete</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Dangerous actions</p>
              <p className="text-gray-600">Irreversible operations</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: destructive</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-500 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Outline</h3>
          </div>
          <div className="space-y-3">
            <Button variant="outline">Outline Button</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Secondary actions</p>
              <p className="text-gray-600">Bordered style</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: outline</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center">
              <Settings className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Secondary</h3>
          </div>
          <div className="space-y-3">
            <Button variant="secondary">Secondary</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Supporting actions</p>
              <p className="text-gray-600">Less emphasis</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: secondary</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <Info className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Ghost</h3>
          </div>
          <div className="space-y-3">
            <Button variant="ghost">Ghost Button</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Subtle interactions</p>
              <p className="text-gray-600">Minimal styling</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: ghost</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
              <ArrowRight className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Link</h3>
          </div>
          <div className="space-y-3">
            <Button variant="link">Link Button</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Navigation actions</p>
              <p className="text-gray-600">Text-based style</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: link</p>
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
            <Button variant="success">Success</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Positive actions</p>
              <p className="text-gray-600">Confirm operations</p>
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
            <Button variant="warning">Warning</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Caution actions</p>
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
            <Button variant="info">Info</Button>
            <div className="text-sm">
              <p className="font-medium text-gray-900">Informational</p>
              <p className="text-gray-600">Helpful context</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: info</p>
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
        title="Button Sizes and Shapes"
        subtitle="Comprehensive demonstration of all available sizes and styling options for the Button component."
      />

      {/* Size Scale Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Play className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Scale</h3>
            <p className="text-sm text-gray-600">Five distinct sizes for different UI contexts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="text-center group">
            <div className="relative mb-4">
              <Button size="xs" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Extra Small
              </Button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">1</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Extra Small</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Compact size</p>
            <p className="text-xs text-gray-600">Dense layouts</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Button size="sm" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Small
              </Button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">2</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Small</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Reduced size</p>
            <p className="text-xs text-gray-600">Secondary actions</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Button size="md" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Medium
              </Button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">3</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Medium</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Default size</p>
            <p className="text-xs text-gray-600">General use</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Button size="lg" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Large
              </Button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">4</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Large</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Prominent size</p>
            <p className="text-xs text-gray-600">Primary actions</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Button size="xl" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                Extra Large
              </Button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">5</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Extra Large</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Hero size</p>
            <p className="text-xs text-gray-600">Call-to-action</p>
          </div>
        </div>
      </Card>

      {/* Icon Buttons Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Icon Buttons</h3>
            <p className="text-sm text-gray-600">Buttons designed to primarily display an icon</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center group">
            <div className="relative mb-4">
              <Button size="icon" variant="outline" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <Settings className="h-4 w-4" />
              </Button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">A</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Settings</p>
            <p className="text-xs font-mono text-gray-500 mb-1">size: icon</p>
            <p className="text-xs text-gray-600">Configuration</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Button size="icon" variant="outline" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <Download className="h-4 w-4" />
              </Button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">B</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Download</p>
            <p className="text-xs font-mono text-gray-500 mb-1">size: icon</p>
            <p className="text-xs text-gray-600">File actions</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Button size="icon" variant="outline" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow">
                <Plus className="h-4 w-4" />
              </Button>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">C</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Add</p>
            <p className="text-xs font-mono text-gray-500 mb-1">size: icon</p>
            <p className="text-xs text-gray-600">Create actions</p>
          </div>
        </div>
      </Card>

      {/* Size Comparison Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Play className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Comparison</h3>
            <p className="text-sm text-gray-600">Visual scale showing relative sizes</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 h-32">
          <div className="text-center">
            <Button size="xs" className="shadow-lg">
              XS
            </Button>
            <p className="text-xs font-mono text-gray-500 mt-2">Compact</p>
          </div>
          <div className="text-center">
            <Button size="sm" className="shadow-lg">
              SM
            </Button>
            <p className="text-xs font-mono text-gray-500 mt-2">Small</p>
          </div>
          <div className="text-center">
            <Button size="md" className="shadow-lg">
              MD
            </Button>
            <p className="text-xs font-mono text-gray-500 mt-2">Default</p>
          </div>
          <div className="text-center">
            <Button size="lg" className="shadow-lg">
              LG
            </Button>
            <p className="text-xs font-mono text-gray-500 mt-2">Large</p>
          </div>
          <div className="text-center">
            <Button size="xl" className="shadow-lg">
              XL
            </Button>
            <p className="text-xs font-mono text-gray-500 mt-2">Hero</p>
          </div>
        </div>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive Examples"
        subtitle="Explore button interactions, states, and advanced features."
      />

      {/* States Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Button States</h3>
            <p className="text-sm text-gray-600">Different states and interactions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <Button className="mb-3">Normal</Button>
            <p className="text-sm text-gray-600">Default state</p>
          </div>

          <div className="text-center">
            <Button loading className="mb-3">Loading</Button>
            <p className="text-sm text-gray-600">Async operations</p>
          </div>

          <div className="text-center">
            <Button disabled className="mb-3">Disabled</Button>
            <p className="text-sm text-gray-600">Unavailable action</p>
          </div>

          <div className="text-center">
            <Button variant="outline" className="mb-3">
              <Download className="w-4 h-4 mr-2" />
              With Icon
            </Button>
            <p className="text-sm text-gray-600">Icon + text</p>
          </div>
        </div>
      </Card>

      {/* Advanced Features */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-sm">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Advanced Features</h3>
            <p className="text-sm text-gray-600">Sophisticated button capabilities</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">AsChild Pattern</h4>
            <p className="text-sm text-gray-600 mb-4">
              Use the asChild prop to render the button as a different element while maintaining all styling and behavior.
            </p>
            <Button asChild>
              <a href="#" className="inline-flex">
                Link Button
              </a>
            </Button>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Styling</h4>
            <p className="text-sm text-gray-600 mb-4">
              Apply custom styling props for precise control over appearance.
            </p>
            <Button
              borderRadius="full"
              shadow="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              Custom Style
            </Button>
          </div>
        </div>
      </Card>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Button Documentation"
        subtitle="Comprehensive guide to using the Button component."
      />
      <Card className="p-8">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use <code className="bg-gray-100 px-1 rounded">variant</code> to define the visual style and hierarchy of the
            button.
          </li>
          <li>
            Choose an appropriate <code className="bg-gray-100 px-1 rounded">size</code> for the button based on its context and
            importance.
          </li>
          <li>
            Utilize <code className="bg-gray-100 px-1 rounded">loading</code> and <code className="bg-gray-100 px-1 rounded">disabled</code> states to provide clear feedback to
            the user during interactions.
          </li>
          <li>
            Consider adding <code className="bg-gray-100 px-1 rounded">leftIcon</code> or <code className="bg-gray-100 px-1 rounded">rightIcon</code> for enhanced clarity and
            visual appeal.
          </li>
          <li>
            Explore various styling props like <code className="bg-gray-100 px-1 rounded">spacing</code>, <code className="bg-gray-100 px-1 rounded">padding</code>, <code className="bg-gray-100 px-1 rounded">margin</code>,
            <code className="bg-gray-100 px-1 rounded">borderRadius</code>, <code className="bg-gray-100 px-1 rounded">shadow</code>, <code className="bg-gray-100 px-1 rounded">layout</code>, <code className="bg-gray-100 px-1 rounded">motion</code>, and <code className="bg-gray-100 px-1 rounded">elevation</code> for
            custom designs.
          </li>
        </ul>
      </Card>
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Usage Guidelines"
        subtitle="Best practices for when and how to use buttons."
      />
      <Card className="p-8">
        <GuidelinesSection
          title="Do"
          icon={<Check />}
          items={[
            'Use a single <strong>primary</strong> action per view to guide focus.',
            'Reserve <strong>destructive</strong> for irreversible actions.',
            'Indicate work with a clear <strong>loading</strong> state.',
            'Pair <strong>icon + label</strong> unless universally recognized.',
          ]}
        />
        <GuidelinesCard
          title="Don't"
          variant="warning"
          icon={<AlertTriangle />}
          items={[
            'Avoid more than <strong>3–4</strong> adjacent buttons.',
            'Don\'t rely on color alone; ensure <strong>contrast</strong> and text.',
            'Don\'t hide focus; keep a <strong>visible focus</strong> style.',
          ]}
        />
      </Card>

      <GuidelinesSection
        title="Accessibility"
        description="Ensure buttons are perceivable and operable for all users."
        items={[
          'Provide an accessible name with text, <code>aria-label</code>, or <code>aria-labelledby</code>.',
          'Maintain focus visibility and color contrast (≥ 3:1 for adjacent states).',
          'For async actions use <code>aria-busy</code> or communicate status where appropriate.',
        ]}
      />
    </div>
  ),
};
