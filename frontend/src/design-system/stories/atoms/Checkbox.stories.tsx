import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from '../../atoms';
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
import { Check, AlertTriangle, Square, CheckSquare, Minus } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Checkbox> = {
  title: '2 - Atoms / Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Atom: Checkbox"
            subtitle="A sophisticated checkbox component for boolean input and multi-selection. Perfect for financial applications requiring clear data selection and form validation."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
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
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the checkbox',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'success', 'warning', 'destructive'],
      description: 'The visual style variant of the checkbox',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is disabled',
    },
    indeterminate: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is in an indeterminate state',
    },
    checked: {
      control: { type: 'boolean' },
      description: 'Whether the checkbox is checked',
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
        title="Checkbox Variants"
        subtitle="Explore the different visual styles and semantic meanings available for the Checkbox component."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <Square className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Default</h3>
          </div>
          <div className="space-y-3">
            <Checkbox />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Standard selection</p>
              <p className="text-gray-600">Basic boolean input</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: default</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Success</h3>
          </div>
          <div className="space-y-3">
            <Checkbox variant="success" defaultChecked />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Positive confirmation</p>
              <p className="text-gray-600">Validated selection</p>
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
            <Checkbox variant="warning" defaultChecked />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Caution states</p>
              <p className="text-gray-600">Attention required</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: warning</p>
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
            <Checkbox variant="destructive" defaultChecked />
            <div className="text-sm">
              <p className="font-medium text-gray-900">Error states</p>
              <p className="text-gray-600">Invalid selection</p>
              <p className="text-xs font-mono text-gray-500 mt-1">variant: destructive</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const SizesAndStates: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Checkbox Sizes and States"
        subtitle="Comprehensive demonstration of all available sizes and interactive states for the Checkbox component."
      />

      {/* Size Scale Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-sm">
            <Square className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Scale</h3>
            <p className="text-sm text-gray-600">Three distinct sizes for different UI contexts</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center group">
            <div className="relative mb-4">
              <Checkbox size="sm" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
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
              <Checkbox size="md" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
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
              <Checkbox size="lg" className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-indigo-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-indigo-600">3</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Large</p>
            <p className="text-xs font-mono text-gray-500 mb-1">Prominent size</p>
            <p className="text-xs text-gray-600">Important selections</p>
          </div>
        </div>
      </Card>

      {/* Interactive States Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-sm">
            <CheckSquare className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Interactive States</h3>
            <p className="text-sm text-gray-600">Different states for user interaction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center group">
            <div className="relative mb-4">
              <Checkbox defaultChecked className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">A</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Checked</p>
            <p className="text-xs font-mono text-gray-500 mb-1">checked: true</p>
            <p className="text-xs text-gray-600">Selected state</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Checkbox indeterminate className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">B</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Indeterminate</p>
            <p className="text-xs font-mono text-gray-500 mb-1">indeterminate: true</p>
            <p className="text-xs text-gray-600">Mixed selection</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Checkbox disabled className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">C</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Disabled</p>
            <p className="text-xs font-mono text-gray-500 mb-1">disabled: true</p>
            <p className="text-xs text-gray-600">Inactive state</p>
          </div>

          <div className="text-center group">
            <div className="relative mb-4">
              <Checkbox disabled defaultChecked className="mx-auto shadow-md group-hover:shadow-lg transition-shadow" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-teal-100 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-teal-600">D</span>
              </div>
            </div>
            <p className="text-sm font-semibold text-gray-900">Disabled Checked</p>
            <p className="text-xs font-mono text-gray-500 mb-1">disabled + checked</p>
            <p className="text-xs text-gray-600">Locked selection</p>
          </div>
        </div>
      </Card>

      {/* Size Comparison Section */}
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-sm">
            <Square className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Size Comparison</h3>
            <p className="text-sm text-gray-600">Visual scale showing relative sizes</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 h-24">
          <div className="text-center">
            <Checkbox size="sm" className="shadow-lg" />
            <p className="text-xs font-mono text-gray-500 mt-2">Small</p>
          </div>
          <div className="text-center">
            <Checkbox size="md" className="shadow-lg" />
            <p className="text-xs font-mono text-gray-500 mt-2">Medium</p>
          </div>
          <div className="text-center">
            <Checkbox size="lg" className="shadow-lg" />
            <p className="text-xs font-mono text-gray-500 mt-2">Large</p>
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
        subtitle="Real-world examples of Checkbox usage in typical UI patterns for financial applications."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Investment Preferences */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Investment Preferences</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox defaultChecked />
              <span className="text-sm font-medium text-gray-900">High Growth Stocks</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox />
              <span className="text-sm font-medium text-gray-900">Dividend Stocks</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox defaultChecked />
              <span className="text-sm font-medium text-gray-900">Bonds</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox />
              <span className="text-sm font-medium text-gray-900">Real Estate</span>
            </label>
            <p className="text-xs font-mono text-gray-400 mt-2">role: investment-preferences</p>
          </div>
        </Card>

        {/* Account Settings */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox defaultChecked />
              <span className="text-sm font-medium text-gray-900">Email Notifications</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox />
              <span className="text-sm font-medium text-gray-900">SMS Alerts</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox defaultChecked />
              <span className="text-sm font-medium text-gray-900">Push Notifications</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox />
              <span className="text-sm font-medium text-gray-900">Marketing Emails</span>
            </label>
            <p className="text-xs font-mono text-gray-400 mt-2">role: account-settings</p>
          </div>
        </Card>

        {/* Terms and Conditions */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Terms Agreement</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <Checkbox />
              <span className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="#" className="text-blue-600 hover:underline font-medium">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-blue-600 hover:underline font-medium">
                  Privacy Policy
                </a>
              </span>
            </label>
            <label className="flex items-start gap-2 cursor-pointer select-none">
              <Checkbox />
              <span className="text-sm text-gray-700">
                I consent to receive electronic communications about my account
              </span>
            </label>
            <p className="text-xs font-mono text-gray-400 mt-2">role: terms-agreement</p>
          </div>
        </Card>

        {/* Data Export Options */}
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Export Options</h3>
          </div>
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox defaultChecked />
              <span className="text-sm font-medium text-gray-900">Transaction History</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox />
              <span className="text-sm font-medium text-gray-900">Portfolio Summary</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox defaultChecked />
              <span className="text-sm font-medium text-gray-900">Tax Documents</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Checkbox />
              <span className="text-sm font-medium text-gray-900">Performance Reports</span>
            </label>
            <p className="text-xs font-mono text-gray-400 mt-2">role: export-options</p>
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
        subtitle="Demonstrates how checkboxes behave in different interactive contexts."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Hover Effects</h3>
          </div>
          <div className="space-y-4">
            <Checkbox
              className="cursor-pointer hover:scale-105 hover:shadow-lg transition-all"
            />
            <p className="text-sm text-gray-600 text-center">Scale and shadow on hover</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: interactive</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Check className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Focus State</h3>
          </div>
          <div className="space-y-4">
            <Checkbox
              className="focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              tabIndex={0}
            />
            <p className="text-sm text-gray-600 text-center">Ring on focus</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: focus • ring: indigo</p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
              <Minus className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Indeterminate</h3>
          </div>
          <div className="space-y-4">
            <Checkbox
              indeterminate
              className="cursor-pointer"
            />
            <p className="text-sm text-gray-600 text-center">Mixed selection state</p>
            <p className="text-xs font-mono text-gray-500 text-center mt-1">state: indeterminate</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Usage Guidelines"
        subtitle="Best practices and recommendations for using the Checkbox component effectively."
      />
      <Card className="p-8">
        <GuidelinesSection title="Do">
          <GuidelinesCard
            title="Do"
            variant="success"
            icon={<Check />}
            items={[
              'Use checkboxes for <strong>multi-select</strong> options.',
              'Make the <strong>label</strong> clickable and descriptive.',
              'Group related options with a clear group label.',
              'Use <strong>indeterminate</strong> state for parent-child relationships.',
              'Provide clear visual feedback for all states.',
            ]}
          />
        </GuidelinesSection>
        <GuidelinesSection title="Don't">
          <GuidelinesCard
            title="Don't"
            variant="warning"
            icon={<AlertTriangle />}
            items={[
              'Don\'t use checkboxes for <strong>single</strong> selection — use radios.',
              'Avoid ambiguous labels like "Option 1".',
              'Don\'t hide disabled states without explanation.',
              'Avoid nesting checkboxes too deeply.',
            ]}
          />
        </GuidelinesSection>
      </Card>

      <GuidelinesSection
        title="Accessibility"
        items={[
          'Associate label with <code>htmlFor</code> and <code>id</code>.',
          'Support keyboard: Space toggles; focus is visible.',
          'Indicate errors with <code>aria-invalid</code> and helper text via <code>aria-describedby</code>.',
          'Use <code>aria-checked</code> for indeterminate states.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  render: (args) => (
    <div className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center">
            <CheckSquare className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">Interactive Checkbox</h3>
        </div>

        <div className="flex items-center justify-center mb-6">
          <Checkbox {...args} />
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
      options: ['default', 'success', 'warning', 'destructive'],
      description: 'The visual style variant of the checkbox',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'The size of the checkbox',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Interactive checkbox with configurable props. Use the controls to experiment with different variants and sizes.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Complete Checkbox Documentation"
        subtitle="Comprehensive guide to using the sophisticated Checkbox component."
      />

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          🌟 Design Philosophy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <PhilosophyItem
              color="#6366f1"
              title="Clear Selection"
              description="Provides unambiguous boolean input with visual feedback"
            />
            <PhilosophyItem
              color="#6b7280"
              title="Consistent States"
              description="Maintains visual consistency across all interaction states"
            />
          </div>
          <div className="space-y-4">
            <PhilosophyItem
              color="#10b981"
              title="Accessible Design"
              description="Ensures all users can interact with selection controls"
            />
            <PhilosophyItem
              color="#ef4444"
              title="Semantic Meaning"
              description="Uses appropriate variants to convey meaning"
            />
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          🚀 Usage Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GuidelinesSection
            title="Variant Selection"
            items={[
              '• <strong>default</strong>: Standard boolean selection',
              '• <strong>success</strong>: Positive confirmation states',
              '• <strong>warning</strong>: Caution or attention states',
              '• <strong>destructive</strong>: Error or invalid states',
            ]}
          />
          <GuidelinesSection
            title="Size Usage"
            items={[
              '• <strong>sm</strong>: Dense layouts, lists, tables',
              '• <strong>md</strong>: Default size, general use',
              '• <strong>lg</strong>: Important selections, forms',
            ]}
          />
          <GuidelinesSection
            title="Best Practices"
            items={[
              '• Keep labels clear and descriptive',
              '• Use indeterminate state for parent-child relationships',
              '• Group related options logically',
              '• Provide proper accessibility attributes',
            ]}
          />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-2xl font-bold text-gray-900 mb-6 tracking-tight">
          ♿ Accessibility
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <GuidelinesSection
            title="Visual Accessibility"
            items={[
              '• Ensure 4.5:1 contrast ratio for all states',
              '• Test with color blindness simulators',
              '• Don\'t rely solely on color for meaning',
              '• Use semantic variants consistently',
            ]}
          />
          <GuidelinesSection
            title="Screen Reader Support"
            items={[
              '• Provide proper label associations',
              '• Use semantic HTML structure',
              '• Ensure proper focus indicators',
              '• Test with screen readers',
            ]}
          />
        </div>
      </div>
    </div>
  ),
};
