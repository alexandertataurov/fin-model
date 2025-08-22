import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  SectionHeader,
  Card,
  applyTypographyStyle,
} from '../components';

const meta: Meta = {
  title: '1 - Foundations / Shadows',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Shadows"
            subtitle="Complete shadow system with elevation levels, interactive states, and depth hierarchy for sophisticated financial interfaces."
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
};
export default meta;

type Story = StoryObj<typeof meta>;

// ============================================================================
// COMPONENTS
// ============================================================================

function ShadowSwatch({
  name,
  shadow,
  description,
  category,
}: {
  name: string;
  shadow: string;
  description?: string;
  category?: string;
}) {
  const truncatedShadow =
    shadow.length > 30 ? shadow.substring(0, 27) + '...' : shadow;
  return (
    <Card className="group relative p-4 hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className="h-16 w-16 rounded-lg border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-200 bg-white"
          style={{ boxShadow: shadow }}
        />
        <div className="flex-1 min-w-0">
          <div
            style={applyTypographyStyle('subtitle')}
            className="text-gray-900 mb-1"
          >
            {name}
          </div>
          {category && (
            <div
              style={applyTypographyStyle('caption')}
              className="text-gray-400 mb-1 font-medium"
            >
              {category}
            </div>
          )}
          <div
            style={applyTypographyStyle('caption')}
            className="text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border break-all"
            title={shadow}
          >
            {truncatedShadow}
          </div>
          {description && (
            <div
              style={applyTypographyStyle('caption')}
              className="text-gray-600 mt-2 italic"
            >
              {description}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

const GuidelineItem = ({
  keyText,
  description,
}: {
  keyText: string;
  description: string;
}) => (
  <li className="flex items-start space-x-2">
    <span className="font-bold text-gray-700 flex-shrink-0">{keyText}:</span>
    <span className="text-gray-600">{description}</span>
  </li>
);

// ============================================================================
// STORIES
// ============================================================================

export const ShadowPalette: Story = {
  render: () => (
    <div className="space-y-16">
      {/* Basic Shadows */}
      <div className="space-y-8">
        <div className="text-center">
          <h3
            style={applyTypographyStyle('headline')}
            className="text-gray-900 mb-4"
          >
            Basic Shadow Scale
          </h3>
          <p
            style={applyTypographyStyle('subtitle')}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Progressive shadow intensities for different elevation levels
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            {
              name: 'Extra Small',
              key: 'xs',
              description: 'Subtle depth for small elements',
            },
            {
              name: 'Small',
              key: 'base',
              description: 'Light elevation for cards and buttons',
            },
            {
              name: 'Medium',
              key: 'md',
              description: 'Standard elevation for interactive elements',
            },
            {
              name: 'Large',
              key: 'lg',
              description: 'Prominent elevation for modals and overlays',
            },
            {
              name: 'Extra Large',
              key: 'xl',
              description: 'Strong elevation for important content',
            },
            {
              name: '2X Large',
              key: '2xl',
              description: 'Maximum elevation for hero elements',
            },
            {
              name: '3X Large',
              key: '3xl',
              description: 'Ultimate elevation for premium content',
            },
          ].map(({ name, key, description }) => (
            <ShadowSwatch
              key={key}
              name={name}
              shadow={tokens.shadows[key as keyof typeof tokens.shadows]}
              description={description}
              category="Basic"
            />
          ))}
        </div>
      </div>

      {/* Interactive Shadows */}
      <div className="space-y-8">
        <div className="text-center">
          <h3
            style={applyTypographyStyle('headline')}
            className="text-gray-900 mb-4"
          >
            Interactive Shadows
          </h3>
          <p
            style={applyTypographyStyle('subtitle')}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Shadows for different interaction states and components
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            {
              name: 'Card',
              shadow: tokens.shadows.md,
              description: 'Default card shadow',
            },
            {
              name: 'Card Hover',
              shadow: tokens.shadows.lg,
              description: 'Elevated state on hover',
            },
            {
              name: 'Button',
              shadow: tokens.shadows.sm,
              description: 'Default button shadow',
            },
            {
              name: 'Button Hover',
              shadow: tokens.shadows.md,
              description: 'Elevated state on hover',
            },
            {
              name: 'Button Active',
              shadow: tokens.shadows.xs,
              description: 'Pressed state shadow',
            },
            {
              name: 'Modal',
              shadow: tokens.shadows.xl,
              description: 'Modal overlay shadow',
            },
            {
              name: 'Dropdown',
              shadow: tokens.shadows.lg,
              description: 'Dropdown menu shadow',
            },
            {
              name: 'Tooltip',
              shadow: tokens.shadows.md,
              description: 'Tooltip shadow',
            },
          ].map(({ name, shadow, description }) => (
            <ShadowSwatch
              key={name}
              name={name}
              shadow={shadow}
              description={description}
              category="Interactive"
            />
          ))}
        </div>
      </div>

      {/* Special Effects */}
      <div className="space-y-8">
        <div className="text-center">
          <h3
            style={applyTypographyStyle('headline')}
            className="text-gray-900 mb-4"
          >
            Special Effects
          </h3>
          <p
            style={applyTypographyStyle('subtitle')}
            className="text-gray-600 max-w-2xl mx-auto"
          >
            Glow effects, inner shadows, and focus states
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            {
              name: 'Primary Glow',
              shadow: `0 0 0 1px ${tokens.colors.primary[500]}20, 0 0 0 4px ${tokens.colors.primary[500]}10`,
              description: 'Primary brand glow effect',
            },
            {
              name: 'Large Glow',
              shadow: `0 0 0 1px ${tokens.colors.primary[500]}20, 0 0 0 8px ${tokens.colors.primary[500]}10`,
              description: 'Enhanced glow for emphasis',
            },
            {
              name: 'Accent Glow',
              shadow: `0 0 0 1px ${tokens.colors.accent[500]}20, 0 0 0 4px ${tokens.colors.accent[500]}10`,
              description: 'Success state glow',
            },
            {
              name: 'Destructive Glow',
              shadow: `0 0 0 1px ${tokens.colors.destructive[500]}20, 0 0 0 4px ${tokens.colors.destructive[500]}10`,
              description: 'Error state glow',
            },
            {
              name: 'Inner Shadow',
              shadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)',
              description: 'Pressed or inset effect',
            },
            {
              name: 'Large Inner',
              shadow: 'inset 0 4px 8px 0 rgb(0 0 0 / 0.1)',
              description: 'Stronger inset effect',
            },
            {
              name: 'Focus Ring',
              shadow: `0 0 0 3px ${tokens.colors.primary[500]}20`,
              description: 'Primary focus indicator',
            },
            {
              name: 'Accent Focus',
              shadow: `0 0 0 3px ${tokens.colors.accent[500]}20`,
              description: 'Accent focus indicator',
            },
            {
              name: 'Destructive Focus',
              shadow: `0 0 0 3px ${tokens.colors.destructive[500]}20`,
              description: 'Error focus indicator',
            },
          ].map(({ name, shadow, description }) => (
            <ShadowSwatch
              key={name}
              name={name}
              shadow={shadow}
              description={description}
              category="Special"
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const ShadowHierarchy: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <SectionHeader
          title="Shadow Hierarchy"
          subtitle="Understanding depth and elevation in our design system"
        />

        {/* Interactive Hierarchy Demo */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h4
              style={applyTypographyStyle('title')}
              className="text-gray-900 mb-2"
            >
              Layered Interface Example
            </h4>
            <p style={applyTypographyStyle('body')} className="text-gray-600">
              How shadows create visual hierarchy in complex interfaces
            </p>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden p-8">
            {/* Background Layer */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Base Layer */}
            <div
              className="absolute bottom-8 left-8 w-32 h-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600"
              style={{ boxShadow: tokens.shadows.sm }}
            >
              Base Layer
            </div>

            {/* Card Layer */}
            <div
              className="absolute bottom-16 left-24 w-40 h-32 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600"
              style={{ boxShadow: tokens.shadows.md }}
            >
              Card Layer
            </div>

            {/* Modal Layer */}
            <div
              className="absolute bottom-24 left-40 w-48 h-36 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600"
              style={{ boxShadow: tokens.shadows.lg }}
            >
              Modal Layer
            </div>

            {/* Hero Layer */}
            <div
              className="absolute bottom-32 left-56 w-56 h-40 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600"
              style={{ boxShadow: tokens.shadows.xl }}
            >
              Hero Layer
            </div>

            {/* Floating Action */}
            <div
              className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600"
              style={{ boxShadow: tokens.shadows['2xl'] }}
            >
              FAB
            </div>

            {/* Glow Effect */}
            <div
              className="absolute top-24 right-8 w-20 h-20 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600"
              style={{
                boxShadow: `0 0 0 1px ${tokens.colors.primary[500]}20, 0 0 0 4px ${tokens.colors.primary[500]}10`,
              }}
            >
              Glow
            </div>
          </div>
        </div>

        {/* Hierarchy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="group p-8 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs"
                style={{ boxShadow: tokens.shadows.sm }}
              >
                1
              </div>
              <h4
                style={applyTypographyStyle('title')}
                className="text-gray-900"
              >
                Base Level
              </h4>
            </div>
            <p
              style={applyTypographyStyle('body')}
              className="text-gray-600 mb-6"
            >
              Subtle shadows for background elements, borders, and low-priority
              content.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Shadow:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  xs, sm
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Use Cases:</span>
                <span className="text-gray-500">Borders, backgrounds</span>
              </div>
            </div>
          </Card>

          <Card className="group p-8 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs"
                style={{ boxShadow: tokens.shadows.md }}
              >
                2
              </div>
              <h4
                style={applyTypographyStyle('title')}
                className="text-gray-900"
              >
                Content Level
              </h4>
            </div>
            <p
              style={applyTypographyStyle('body')}
              className="text-gray-600 mb-6"
            >
              Standard elevation for cards, buttons, and interactive elements.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Shadow:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  md, lg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Use Cases:</span>
                <span className="text-gray-500">Cards, buttons</span>
              </div>
            </div>
          </Card>

          <Card className="group p-8 hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div
                className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs"
                style={{ boxShadow: tokens.shadows.xl }}
              >
                3
              </div>
              <h4
                style={applyTypographyStyle('title')}
                className="text-gray-900"
              >
                Overlay Level
              </h4>
            </div>
            <p
              style={applyTypographyStyle('body')}
              className="text-gray-600 mb-6"
            >
              High elevation for modals, dropdowns, and floating elements.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Shadow:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">
                  xl, 2xl
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Use Cases:</span>
                <span className="text-gray-500">Modals, overlays</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Interactive States"
        subtitle="How shadows respond to user interactions"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {[
          {
            name: 'Card States',
            states: [
              { name: 'Default', shadow: tokens.shadows.md },
              { name: 'Hover', shadow: tokens.shadows.lg },
              { name: 'Active', shadow: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.06)' },
            ],
          },
          {
            name: 'Button States',
            states: [
              { name: 'Default', shadow: tokens.shadows.sm },
              { name: 'Hover', shadow: tokens.shadows.md },
              { name: 'Active', shadow: tokens.shadows.xs },
            ],
          },
          {
            name: 'Focus States',
            states: [
              {
                name: 'Primary',
                shadow: `0 0 0 3px ${tokens.colors.primary[500]}20`,
              },
              {
                name: 'Accent',
                shadow: `0 0 0 3px ${tokens.colors.accent[500]}20`,
              },
              {
                name: 'Destructive',
                shadow: `0 0 0 3px ${tokens.colors.destructive[500]}20`,
              },
            ],
          },
          {
            name: 'Glow Effects',
            states: [
              {
                name: 'Primary',
                shadow: `0 0 0 1px ${tokens.colors.primary[500]}20, 0 0 0 4px ${tokens.colors.primary[500]}10`,
              },
              {
                name: 'Accent',
                shadow: `0 0 0 1px ${tokens.colors.accent[500]}20, 0 0 0 4px ${tokens.colors.accent[500]}10`,
              },
              {
                name: 'Destructive',
                shadow: `0 0 0 1px ${tokens.colors.destructive[500]}20, 0 0 0 4px ${tokens.colors.destructive[500]}10`,
              },
            ],
          },
        ].map(({ name, states }) => (
          <Card key={name} className="p-6">
            <h4
              style={applyTypographyStyle('title')}
              className="text-gray-900 mb-4"
            >
              {name}
            </h4>
            <div className="space-y-3">
              {states.map(({ name: stateName, shadow }) => (
                <div
                  key={stateName}
                  className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100"
                >
                  <div
                    className="h-10 w-10 rounded-lg border-2 border-gray-200 bg-white"
                    style={{ boxShadow: shadow }}
                  />
                  <div className="flex-1">
                    <div
                      style={applyTypographyStyle('subtitle')}
                      className="text-gray-900"
                    >
                      {stateName}
                    </div>
                    <div
                      style={applyTypographyStyle('caption')}
                      className="text-gray-500 font-mono truncate"
                    >
                      {shadow}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  ),
};

export const FinancialDashboard: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Financial Dashboard Example"
        subtitle="Real-world application of our shadow system in financial interfaces"
      />

      {/* Dashboard Header */}
      <Card className="p-6" style={{ boxShadow: tokens.shadows.md }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
              style={{
                background: tokens.colors.primary[500],
                boxShadow: tokens.shadows.sm,
              }}
            >
              FV
            </div>
            <div>
              <h4
                style={applyTypographyStyle('title')}
                className="text-gray-900"
              >
                FinVision Analytics
              </h4>
              <p
                style={applyTypographyStyle('caption')}
                className="text-gray-500"
              >
                Portfolio Dashboard
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:shadow-md transition-shadow duration-200">
              Settings
            </div>
            <div
              className="w-8 h-8 rounded-full"
              style={{
                background: tokens.colors.secondary[300],
                boxShadow: tokens.shadows.sm,
              }}
            ></div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            {
              label: 'Total Assets',
              value: '$2.4M',
              change: '+12.3%',
              color: tokens.colors.accent[600],
            },
            {
              label: 'Risk Score',
              value: 'Low',
              change: 'Optimal',
              color: tokens.colors.accent[600],
            },
            {
              label: 'Performance',
              value: '+8.7%',
              change: 'YTD',
              color: tokens.colors.accent[600],
            },
            {
              label: 'Alerts',
              value: '2',
              change: 'Review',
              color: tokens.colors.warning,
            },
          ].map(({ label, value, change, color }) => (
            <div
              key={label}
              className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
            >
              <div
                style={applyTypographyStyle('caption')}
                className="text-gray-500 mb-1"
              >
                {label}
              </div>
              <div
                style={applyTypographyStyle('title')}
                className="text-gray-900"
              >
                {value}
              </div>
              <div style={{ ...applyTypographyStyle('caption'), color }}>
                {change}
              </div>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 p-4 rounded-lg border border-gray-200"
            style={{ boxShadow: tokens.shadows.sm }}
          >
            <h5
              style={applyTypographyStyle('subtitle')}
              className="text-gray-900 mb-4"
            >
              Portfolio Performance
            </h5>
            <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div
                  style={applyTypographyStyle('caption')}
                  className="text-gray-500 mb-2"
                >
                  Chart Visualization
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: tokens.colors.primary[500] }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: tokens.colors.accent[500] }}
                  ></div>
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ background: tokens.colors.secondary[400] }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="p-4 rounded-lg border border-gray-200"
            style={{ boxShadow: tokens.shadows.sm }}
          >
            <h5
              style={applyTypographyStyle('subtitle')}
              className="text-gray-900 mb-4"
            >
              Quick Actions
            </h5>
            <div className="space-y-3">
              <button
                className="w-full px-4 py-2 rounded-lg text-white font-medium transition-shadow duration-200 hover:shadow-lg"
                style={{
                  background: tokens.colors.primary[500],
                  boxShadow: tokens.shadows.sm,
                }}
              >
                Add Investment
              </button>
              <button
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                style={{ boxShadow: tokens.shadows.sm }}
              >
                Generate Report
              </button>
              <button
                className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                style={{ boxShadow: tokens.shadows.sm }}
              >
                Risk Analysis
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  ),
};

export const ComponentExamples: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Component Examples"
        subtitle="Shadows in action across different UI components"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Form Example */}
        <Card className="p-6" style={{ boxShadow: tokens.shadows.md }}>
          <h4
            style={applyTypographyStyle('title')}
            className="text-gray-900 mb-4"
          >
            Form Elements
          </h4>
          <div className="space-y-4">
            <div>
              <label
                style={applyTypographyStyle('subtitle')}
                className="block text-gray-700 mb-2"
              >
                Email Address
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition-shadow duration-200"
                placeholder="Enter your email"
                style={{ boxShadow: tokens.shadows.sm }}
              />
            </div>
            <div>
              <label
                style={applyTypographyStyle('subtitle')}
                className="block text-gray-700 mb-2"
              >
                Investment Amount
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition-shadow duration-200"
                placeholder="$10,000"
                style={{ boxShadow: tokens.shadows.sm }}
              />
            </div>
            <div className="flex gap-3">
              <button
                className="flex-1 px-4 py-2 rounded-lg text-white font-medium transition-shadow duration-200 hover:shadow-lg"
                style={{
                  background: tokens.colors.primary[500],
                  boxShadow: tokens.shadows.sm,
                }}
              >
                Submit
              </button>
              <button
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                style={{ boxShadow: tokens.shadows.sm }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Card>

        {/* Status Indicators */}
        <Card className="p-6" style={{ boxShadow: tokens.shadows.md }}>
          <h4
            style={applyTypographyStyle('title')}
            className="text-gray-900 mb-4"
          >
            Status Indicators
          </h4>
          <div className="space-y-4">
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
              style={{ boxShadow: tokens.shadows.sm }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: tokens.colors.accent[500] }}
              ></div>
              <span
                style={applyTypographyStyle('body')}
                className="text-gray-700"
              >
                Transaction Successful
              </span>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
              style={{ boxShadow: tokens.shadows.sm }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: tokens.colors.warning }}
              ></div>
              <span
                style={applyTypographyStyle('body')}
                className="text-gray-700"
              >
                Risk Level: Medium
              </span>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
              style={{ boxShadow: tokens.shadows.sm }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: tokens.colors.danger }}
              ></div>
              <span
                style={applyTypographyStyle('body')}
                className="text-gray-700"
              >
                Account Locked
              </span>
            </div>
            <div
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200"
              style={{ boxShadow: tokens.shadows.sm }}
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ background: tokens.colors.info }}
              ></div>
              <span
                style={applyTypographyStyle('body')}
                className="text-gray-700"
              >
                New Feature Available
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Notification Examples */}
      <Card className="p-6" style={{ boxShadow: tokens.shadows.md }}>
        <h4
          style={applyTypographyStyle('title')}
          className="text-gray-900 mb-4"
        >
          Notification System
        </h4>
        <div className="space-y-3">
          <div
            className="p-4 rounded-lg border-l-4"
            style={{
              background: `${tokens.colors.accent[50]}`,
              borderLeftColor: tokens.colors.accent[500],
              boxShadow: tokens.shadows.sm,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: tokens.colors.accent[500] }}
              ></div>
              <div>
                <div
                  style={applyTypographyStyle('subtitle')}
                  className="text-gray-900"
                >
                  Investment Completed
                </div>
                <div
                  style={applyTypographyStyle('body')}
                  className="text-gray-600"
                >
                  Your $5,000 investment has been successfully processed.
                </div>
              </div>
            </div>
          </div>
          <div
            className="p-4 rounded-lg border-l-4"
            style={{
              background: `${tokens.colors.warning}10`,
              borderLeftColor: tokens.colors.warning,
              boxShadow: tokens.shadows.sm,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: tokens.colors.warning }}
              ></div>
              <div>
                <div
                  style={applyTypographyStyle('subtitle')}
                  className="text-gray-900"
                >
                  Security Alert
                </div>
                <div
                  style={applyTypographyStyle('body')}
                  className="text-gray-600"
                >
                  Unusual login activity detected. Please review your account.
                </div>
              </div>
            </div>
          </div>
          <div
            className="p-4 rounded-lg border-l-4"
            style={{
              background: `${tokens.colors.danger}10`,
              borderLeftColor: tokens.colors.danger,
              boxShadow: tokens.shadows.sm,
            }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: tokens.colors.danger }}
              ></div>
              <div>
                <div
                  style={applyTypographyStyle('subtitle')}
                  className="text-gray-900"
                >
                  Transaction Failed
                </div>
                <div
                  style={applyTypographyStyle('body')}
                  className="text-gray-600"
                >
                  Insufficient funds. Please check your account balance.
                </div>
              </div>
            </div>
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
        title="Complete Shadow Documentation"
        subtitle="Comprehensive guide to our sophisticated shadow system"
      />

      {/* Design Philosophy */}
      <Card className="p-8" style={{ boxShadow: tokens.shadows.md }}>
        <h4
          style={applyTypographyStyle('title')}
          className="text-gray-900 mb-6"
        >
          🌟 Design Philosophy
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-lg bg-white border border-gray-200"
                style={{ boxShadow: tokens.shadows.sm }}
              ></div>
              <div>
                <div
                  style={applyTypographyStyle('subtitle')}
                  className="text-gray-900"
                >
                  Subtle Depth
                </div>
                <div
                  style={applyTypographyStyle('body')}
                  className="text-gray-600"
                >
                  Shadows create hierarchy without overwhelming the interface
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-lg bg-white border border-gray-200"
                style={{ boxShadow: tokens.shadows.md }}
              ></div>
              <div>
                <div
                  style={applyTypographyStyle('subtitle')}
                  className="text-gray-900"
                >
                  Consistent Elevation
                </div>
                <div
                  style={applyTypographyStyle('body')}
                  className="text-gray-600"
                >
                  Systematic shadow levels for predictable depth
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-lg bg-white border border-gray-200"
                style={{
                  boxShadow: `0 0 0 1px ${tokens.colors.primary[500]}20, 0 0 0 4px ${tokens.colors.primary[500]}10`,
                }}
              ></div>
              <div>
                <div
                  style={applyTypographyStyle('subtitle')}
                  className="text-gray-900"
                >
                  Interactive Feedback
                </div>
                <div
                  style={applyTypographyStyle('body')}
                  className="text-gray-600"
                >
                  Shadows respond to user interactions
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 rounded-lg bg-white border border-gray-200"
                style={{
                  boxShadow: `0 0 0 3px ${tokens.colors.primary[500]}20`,
                }}
              ></div>
              <div>
                <div
                  style={applyTypographyStyle('subtitle')}
                  className="text-gray-900"
                >
                  Accessibility
                </div>
                <div
                  style={applyTypographyStyle('body')}
                  className="text-gray-600"
                >
                  Clear focus indicators and contrast
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Guidelines */}
      <Card className="p-8" style={{ boxShadow: tokens.shadows.md }}>
        <h4
          style={applyTypographyStyle('title')}
          className="text-gray-900 mb-6"
        >
          🚀 Usage Guidelines
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5
              style={applyTypographyStyle('subtitle')}
              className="text-gray-900 mb-3"
            >
              Basic Shadows
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                • <strong>xs</strong>: Subtle depth for small elements
              </li>
              <li>
                • <strong>sm</strong>: Light elevation for cards
              </li>
              <li>
                • <strong>md</strong>: Standard elevation for buttons
              </li>
              <li>
                • <strong>lg</strong>: Prominent elevation for modals
              </li>
            </ul>
          </div>
          <div>
            <h5
              style={applyTypographyStyle('subtitle')}
              className="text-gray-900 mb-3"
            >
              Interactive Shadows
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                • <strong>card</strong>: Default card shadow
              </li>
              <li>
                • <strong>card-hover</strong>: Elevated state on hover
              </li>
              <li>
                • <strong>button</strong>: Default button shadow
              </li>
              <li>
                • <strong>button-hover</strong>: Elevated state on hover
              </li>
            </ul>
          </div>
          <div>
            <h5
              style={applyTypographyStyle('subtitle')}
              className="text-gray-900 mb-3"
            >
              Special Effects
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                • <strong>glow</strong>: Primary brand glow effect
              </li>
              <li>
                • <strong>inner</strong>: Pressed or inset effect
              </li>
              <li>
                • <strong>focus</strong>: Focus indicator
              </li>
              <li>
                • <strong>modal</strong>: Modal overlay shadow
              </li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Best Practices */}
      <Card className="p-8" style={{ boxShadow: tokens.shadows.md }}>
        <h4
          style={applyTypographyStyle('title')}
          className="text-gray-900 mb-6"
        >
          ✨ Best Practices
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5
              style={applyTypographyStyle('subtitle')}
              className="text-gray-900 mb-3"
            >
              Do's
            </h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use consistent shadow levels for similar elements</li>
              <li>• Apply hover shadows for interactive feedback</li>
              <li>• Use focus shadows for accessibility</li>
              <li>• Consider shadow direction for light sources</li>
            </ul>
          </div>
          <div>
            <h5
              style={applyTypographyStyle('subtitle')}
              className="text-gray-900 mb-3"
            >
              Don'ts
            </h5>
            <ul className="space-y-2 text-sm">
              <GuidelineItem
                keyText="Don't use too many shadow levels"
                description="at once"
              />
              <GuidelineItem
                keyText="Avoid shadows"
                description="that compete with content"
              />
              <GuidelineItem
                keyText="Don't use shadows"
                description="as the only interaction indicator"
              />
              <GuidelineItem
                keyText="Avoid inconsistent shadow directions"
                description=""
              />
            </ul>
          </div>
        </div>
      </Card>
    </div>
  ),
};

export const ElevationOnDark: Story = {
  render: () => (
    <div
      className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 p-4 rounded-lg"
      style={{ background: 'hsl(0 0% 10%)' }}
    >
      {Object.entries(tokens.shadows).map(([name, shadow]) => (
        <div
          key={name}
          className="p-4 rounded-lg border bg-card/80 backdrop-blur"
        >
          <div
            style={applyTypographyStyle('caption')}
            className="text-muted-foreground mb-3"
          >
            {name}
          </div>
          <div
            className="h-24 rounded-md bg-background"
            style={{ boxShadow: String(shadow) }}
          />
          <div
            style={applyTypographyStyle('caption')}
            className="text-muted-foreground mt-2"
          >
            {String(shadow)}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: { backgrounds: { default: 'dark' } },
};
