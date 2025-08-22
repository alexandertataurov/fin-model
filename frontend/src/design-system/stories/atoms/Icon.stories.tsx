import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from '../../atoms';
import * as LucideIcons from 'lucide-react';
import {
  SectionHeader,
  AnimatedBanner,
  GuidelinesSection,
  GuidelinesCard,
  Card
} from '../components';
import { Check, AlertTriangle, Star, Heart, Home, Settings, User } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

// Only include valid PascalCase Lucide icon names (functions)
const lucideIconNames = Object.keys(LucideIcons).filter(
  (name) => typeof (LucideIcons as any)[name] === 'function' && /^[A-Z][a-zA-Z0-9]+$/.test(name)
);

const meta: Meta<typeof Icon> = {
  title: 'Atoms / Icon',
  component: Icon,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Icon"
            subtitle="A sophisticated icon component for displaying Lucide icons with consistent sizing and styling. Perfect for financial applications requiring clear visual communication and consistent iconography."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    name: {
      control: 'select',
      options: lucideIconNames,
      description: 'The Lucide icon name',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The size of the icon',
    },
    color: {
      control: 'color',
      description: 'The color of the icon',
    },
  },
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
        title="Lucide Icon Variants"
        subtitle="Browse all available Lucide icons."
      />
      <Card className="p-8">
        <div className="grid grid-cols-6 md:grid-cols-10 gap-6">
          {lucideIconNames.slice(0, 60).map((iconName) => (
            <div key={iconName} className="flex flex-col items-center text-center gap-2">
              <Icon name={iconName} size="md" />
              <span className="text-xs break-all text-gray-500">{iconName}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  ),
};

export const SizesAndShapes: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Icon Sizes and Colors"
        subtitle="Comprehensive demonstration of all available sizes and color options for the Icon component."
      />

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Star className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Scale</h3>
            <p className="text-sm text-gray-600">Five distinct sizes for different UI contexts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {['xs', 'sm', 'md', 'lg', 'xl'].map((size) => (
            <div key={size} className="text-center group">
              <div className="relative mb-4">
                <Icon name="Star" size={size as any} color="#f59e42" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold text-indigo-600">{size.toUpperCase()}</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900">{size.toUpperCase()}</p>
              <p className="text-xs font-mono text-gray-500 mb-1">size: {size}</p>
              <p className="text-xs text-gray-600">Icon size</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Color Variants</h3>
            <p className="text-sm text-gray-600">Different color options for various contexts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center group">
            <div className="relative mb-4">
              <Icon name="Heart" size="lg" color="#ef4444" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-red-600">A</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Red</p>
            <p className="text-xs font-mono text-gray-500 mb-1">#ef4444</p>
            <p className="text-xs text-gray-600">Error states</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Icon name="Check" size="lg" color="#22c55e" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-green-600">B</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Green</p>
            <p className="text-xs font-mono text-gray-500 mb-1">#22c55e</p>
            <p className="text-xs text-gray-600">Success states</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Icon name="Star" size="lg" color="#f59e42" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-amber-600">C</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Amber</p>
            <p className="text-xs font-mono text-gray-500 mb-1">#f59e42</p>
            <p className="text-xs text-gray-600">Warning states</p>
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
        subtitle="Real-world examples of Icon usage in typical UI patterns for financial applications."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Home className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Navigation Icons</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Icon name="Home" size="sm" />
              <span className="text-sm text-gray-600">Home navigation</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Settings" size="sm" />
              <span className="text-sm text-gray-600">Settings menu</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="User" size="sm" />
              <span className="text-sm text-gray-600">User profile</span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-2">role: navigation-icons</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Status Icons</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-3">
              <Icon name="Check" size="sm" color="#22c55e" />
              <span className="text-sm text-gray-600">Success state</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="AlertTriangle" size="sm" color="#f59e42" />
              <span className="text-sm text-gray-600">Warning state</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="X" size="sm" color="#ef4444" />
              <span className="text-sm text-gray-600">Error state</span>
            </div>
            <p className="text-xs font-mono text-gray-400 mt-2">role: status-indicators</p>
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
        subtitle="Guidelines for using the Icon component effectively."
      />
      <Card className="p-8">
        <GuidelinesSection title="Do">
          <GuidelinesCard
            title="Do"
            variant="success"
            icon={<Check />}
            items={[
              'Use icons to enhance clarity and visual hierarchy.',
              'Choose icons that match the intended meaning.',
              'Maintain consistent sizing and color for icons.',
              'Provide accessible labels for icon-only buttons.',
            ]}
          />
        </GuidelinesSection>
        <GuidelinesSection title="Don't">
          <GuidelinesCard
            title="Don't"
            variant="warning"
            icon={<AlertTriangle />}
            items={[
              'Don\'t use icons without clear meaning.',
              'Avoid using too many different icon styles.',
              'Don\'t rely solely on color to convey meaning.',
            ]}
          />
        </GuidelinesSection>
      </Card>
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Interactive Icon</h3>
        </div>

        <div className="flex items-center justify-center mb-6">
          <Icon name={args.name || 'Home'} size={args.size} color={args.color} />
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Icon</p>
            <p className="font-mono text-gray-600">{args.name || 'Home'}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Size</p>
            <p className="font-mono text-gray-600">{args.size}</p>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="font-medium text-gray-900">Current Color</p>
            <p className="font-mono text-gray-600">{args.color || 'default'}</p>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Use the controls panel on the right to experiment with different icons, sizes, and colors.
          </p>
        </div>
      </Card>
    </div>
  ),
  args: {
    name: 'Home',
    size: 'md',
    color: '',
  },
  argTypes: {
    name: {
      control: 'select',
      options: ['Home', 'Settings', 'User', 'Star', 'Heart', 'Check', 'AlertTriangle'],
      description: 'The Lucide icon name',
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'The size of the icon',
    },
    color: {
      control: 'color',
      description: 'The color of the icon',
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Complete Icon Documentation"
        subtitle="Comprehensive guide to using the sophisticated Icon component."
      />
      <Card className="p-8">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          🌟 Design Philosophy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Visual Communication</h5>
                <p className="text-sm text-gray-600">Enhances clarity and reduces cognitive load through consistent iconography</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Settings className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Consistent Sizing</h5>
                <p className="text-sm text-gray-600">Maintains visual hierarchy through standardized size tokens</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Check className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Accessible Design</h5>
                <p className="text-sm text-gray-600">Ensures all users can understand icon meanings and interactions</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <h5 className="font-semibold text-gray-900">Lucide Integration</h5>
                <p className="text-sm text-gray-600">Leverages the comprehensive Lucide icon library for consistency</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  ),
};


