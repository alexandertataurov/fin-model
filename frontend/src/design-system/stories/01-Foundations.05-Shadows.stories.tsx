import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';

// Helper function to apply text style (simplified version)
const applyTextStyle = (styleName: string) => {
  const styles: Record<string, React.CSSProperties> = {
    headline: {
      fontFamily: 'Playfair Display, Georgia, serif',
      fontSize: '2.25rem',
      fontWeight: 700,
      lineHeight: 1.25,
      letterSpacing: '-0.025em'
    },
    subheadline: {
      fontFamily: 'Playfair Display, Georgia, serif',
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: '0'
    },
    title: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.375,
      letterSpacing: '0'
    },
    subtitle: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1.125rem',
      fontWeight: 500,
      lineHeight: 1.5,
      letterSpacing: '0'
    },
    body: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.625,
      letterSpacing: '0'
    },
    caption: {
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.025em'
    }
  };

  return styles[styleName] || {};
};

const meta: Meta = {
  title: 'Design System/Foundations/Shadows',
  parameters: {
    layout: 'padded'
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

function ShadowSwatch({ name, shadow, description, category }: {
  name: string;
  shadow: string;
  description?: string;
  category?: string;
}) {
  return (
    <div className="group relative p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className="h-16 w-16 rounded-lg border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-200 bg-white"
          style={{ boxShadow: shadow }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 mb-1">{name}</div>
          {category && (
            <div className="text-xs text-gray-400 mb-1 font-medium">{category}</div>
          )}
          <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border break-all">{shadow}</div>
          {description && <div className="text-xs text-gray-600 mt-2 italic">{description}</div>}
        </div>
      </div>
    </div>
  );
}

export const ShadowPalette: Story = {
  render: () => (
    <div className="space-y-16">
      {/* Basic Shadows */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Basic Shadow Scale</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Progressive shadow intensities for different elevation levels</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { name: 'Extra Small', key: 'xs', description: 'Subtle depth for small elements' },
            { name: 'Small', key: 'sm', description: 'Light elevation for cards and buttons' },
            { name: 'Medium', key: 'md', description: 'Standard elevation for interactive elements' },
            { name: 'Large', key: 'lg', description: 'Prominent elevation for modals and overlays' },
            { name: 'Extra Large', key: 'xl', description: 'Strong elevation for important content' },
            { name: '2X Large', key: '2xl', description: 'Maximum elevation for hero elements' },
            { name: '3X Large', key: '3xl', description: 'Ultimate elevation for premium content' },
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

      {/* Elevation System */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Elevation System</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Systematic elevation levels for consistent depth hierarchy</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((level) => (
            <ShadowSwatch
              key={level}
              name={`Elevation ${level}`}
              shadow={tokens.shadows[`elevation-${level}` as keyof typeof tokens.shadows]}
              description={`Level ${level} elevation for systematic depth`}
              category="Elevation"
            />
          ))}
        </div>
      </div>

      {/* Interactive Shadows */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Interactive Shadows</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Shadows for different interaction states and components</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { name: 'Card', key: 'card', description: 'Default card shadow' },
            { name: 'Card Hover', key: 'card-hover', description: 'Elevated state on hover' },
            { name: 'Button', key: 'button', description: 'Default button shadow' },
            { name: 'Button Hover', key: 'button-hover', description: 'Elevated state on hover' },
            { name: 'Button Active', key: 'button-active', description: 'Pressed state shadow' },
            { name: 'Modal', key: 'modal', description: 'Modal overlay shadow' },
            { name: 'Dropdown', key: 'dropdown', description: 'Dropdown menu shadow' },
            { name: 'Tooltip', key: 'tooltip', description: 'Tooltip shadow' },
          ].map(({ name, key, description }) => (
            <ShadowSwatch
              key={key}
              name={name}
              shadow={tokens.shadows[key as keyof typeof tokens.shadows]}
              description={description}
              category="Interactive"
            />
          ))}
        </div>
      </div>

      {/* Special Effects */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Special Effects</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Glow effects, inner shadows, and focus states</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[
            { name: 'Primary Glow', key: 'glow', description: 'Primary brand glow effect' },
            { name: 'Large Glow', key: 'glow-lg', description: 'Enhanced glow for emphasis' },
            { name: 'Accent Glow', key: 'glow-accent', description: 'Success state glow' },
            { name: 'Destructive Glow', key: 'glow-destructive', description: 'Error state glow' },
            { name: 'Inner Shadow', key: 'inner', description: 'Pressed or inset effect' },
            { name: 'Large Inner', key: 'inner-lg', description: 'Stronger inset effect' },
            { name: 'Focus Ring', key: 'focus', description: 'Primary focus indicator' },
            { name: 'Accent Focus', key: 'focus-accent', description: 'Accent focus indicator' },
            { name: 'Destructive Focus', key: 'focus-destructive', description: 'Error focus indicator' },
          ].map(({ name, key, description }) => (
            <ShadowSwatch
              key={key}
              name={name}
              shadow={tokens.shadows[key as keyof typeof tokens.shadows]}
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
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Shadow Hierarchy</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Understanding depth and elevation in our design system</p>
        </div>

        {/* Interactive Hierarchy Demo */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h4 style={applyTextStyle('title')} className="text-gray-900 mb-2">Layered Interface Example</h4>
            <p style={applyTextStyle('body')} className="text-gray-600">How shadows create visual hierarchy in complex interfaces</p>
          </div>
          <div className="relative h-96 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden p-8">
            {/* Background Layer */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Base Layer */}
            <div className="absolute bottom-8 left-8 w-32 h-24 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600" style={{ boxShadow: tokens.shadows.sm }}>
              Base Layer
            </div>

            {/* Card Layer */}
            <div className="absolute bottom-16 left-24 w-40 h-32 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600" style={{ boxShadow: tokens.shadows.md }}>
              Card Layer
            </div>

            {/* Modal Layer */}
            <div className="absolute bottom-24 left-40 w-48 h-36 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600" style={{ boxShadow: tokens.shadows.lg }}>
              Modal Layer
            </div>

            {/* Hero Layer */}
            <div className="absolute bottom-32 left-56 w-56 h-40 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600" style={{ boxShadow: tokens.shadows.xl }}>
              Hero Layer
            </div>

            {/* Floating Action */}
            <div className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600" style={{ boxShadow: tokens.shadows['2xl'] }}>
              FAB
            </div>

            {/* Glow Effect */}
            <div className="absolute top-24 right-8 w-20 h-20 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-sm text-gray-600" style={{ boxShadow: tokens.shadows.glow }}>
              Glow
            </div>
          </div>
        </div>

        {/* Hierarchy Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs" style={{ boxShadow: tokens.shadows.sm }}>
                1
              </div>
              <h4 style={applyTextStyle('title')} className="text-gray-900">Base Level</h4>
            </div>
            <p style={applyTextStyle('body')} className="text-gray-600 mb-6">Subtle shadows for background elements, borders, and low-priority content.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Shadow:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">xs, sm</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Use Cases:</span>
                <span className="text-gray-500">Borders, backgrounds</span>
              </div>
            </div>
          </div>

          <div className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs" style={{ boxShadow: tokens.shadows.md }}>
                2
              </div>
              <h4 style={applyTextStyle('title')} className="text-gray-900">Content Level</h4>
            </div>
            <p style={applyTextStyle('body')} className="text-gray-600 mb-6">Standard elevation for cards, buttons, and interactive elements.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Shadow:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">md, lg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Use Cases:</span>
                <span className="text-gray-500">Cards, buttons</span>
              </div>
            </div>
          </div>

          <div className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-xs" style={{ boxShadow: tokens.shadows.xl }}>
                3
              </div>
              <h4 style={applyTextStyle('title')} className="text-gray-900">Overlay Level</h4>
            </div>
            <p style={applyTextStyle('body')} className="text-gray-600 mb-6">High elevation for modals, dropdowns, and floating elements.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Shadow:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">xl, 2xl</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Use Cases:</span>
                <span className="text-gray-500">Modals, overlays</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const InteractiveStates: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Interactive States</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">How shadows respond to user interactions</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'Card States',
              states: [
                { name: 'Default', shadow: tokens.shadows.card },
                { name: 'Hover', shadow: tokens.shadows['card-hover'] },
                { name: 'Active', shadow: tokens.shadows.inner },
              ]
            },
            {
              name: 'Button States',
              states: [
                { name: 'Default', shadow: tokens.shadows.button },
                { name: 'Hover', shadow: tokens.shadows['button-hover'] },
                { name: 'Active', shadow: tokens.shadows['button-active'] },
              ]
            },
            {
              name: 'Focus States',
              states: [
                { name: 'Primary', shadow: tokens.shadows.focus },
                { name: 'Accent', shadow: tokens.shadows['focus-accent'] },
                { name: 'Destructive', shadow: tokens.shadows['focus-destructive'] },
              ]
            },
            {
              name: 'Glow Effects',
              states: [
                { name: 'Primary', shadow: tokens.shadows.glow },
                { name: 'Accent', shadow: tokens.shadows['glow-accent'] },
                { name: 'Destructive', shadow: tokens.shadows['glow-destructive'] },
              ]
            },
          ].map(({ name, states }) => (
            <div key={name} className="p-6 rounded-xl border border-gray-200 bg-white">
              <h4 className="font-semibold text-gray-900 mb-4 text-lg">{name}</h4>
              <div className="space-y-3">
                {states.map(({ name: stateName, shadow }) => (
                  <div key={stateName} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div
                      className="h-10 w-10 rounded-lg border-2 border-gray-200 bg-white"
                      style={{ boxShadow: shadow }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{stateName}</div>
                      <div className="text-xs text-gray-500 font-mono truncate">{shadow}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

export const FinancialDashboard: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Financial Dashboard Example</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Real-world application of our shadow system in financial interfaces</p>
        </div>

        {/* Dashboard Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6" style={{ boxShadow: tokens.shadows.card }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: tokens.colors.primary[500], boxShadow: tokens.shadows.sm }}>
                FV
              </div>
              <div>
                <h4 style={applyTextStyle('title')} className="text-gray-900">FinVision Analytics</h4>
                <p style={applyTextStyle('caption')} className="text-gray-500">Portfolio Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm hover:shadow-md transition-shadow duration-200">Settings</div>
              <div className="w-8 h-8 rounded-full" style={{ background: tokens.colors.secondary[300], boxShadow: tokens.shadows.sm }}></div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Assets', value: '$2.4M', change: '+12.3%', color: tokens.colors.accent[600] },
              { label: 'Risk Score', value: 'Low', change: 'Optimal', color: tokens.colors.accent[600] },
              { label: 'Performance', value: '+8.7%', change: 'YTD', color: tokens.colors.accent[600] },
              { label: 'Alerts', value: '2', change: 'Review', color: tokens.colors.warning },
            ].map(({ label, value, change, color }) => (
              <div key={label} className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200">
                <div className="text-sm text-gray-500 mb-1">{label}</div>
                <div style={applyTextStyle('title')} className="text-gray-900">{value}</div>
                <div className="text-sm" style={{ color }}>{change}</div>
              </div>
            ))}
          </div>

          {/* Chart Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-4 rounded-lg border border-gray-200" style={{ boxShadow: tokens.shadows.sm }}>
              <h5 style={applyTextStyle('subtitle')} className="text-gray-900 mb-4">Portfolio Performance</h5>
              <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-gray-500 mb-2">Chart Visualization</div>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.primary[500] }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.accent[500] }}></div>
                    <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.secondary[400] }}></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200" style={{ boxShadow: tokens.shadows.sm }}>
              <h5 style={applyTextStyle('subtitle')} className="text-gray-900 mb-4">Quick Actions</h5>
              <div className="space-y-3">
                <button
                  className="w-full px-4 py-2 rounded-lg text-white font-medium transition-shadow duration-200 hover:shadow-lg"
                  style={{ background: tokens.colors.primary[500], boxShadow: tokens.shadows.button }}
                >
                  Add Investment
                </button>
                <button
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                  style={{ boxShadow: tokens.shadows.button }}
                >
                  Generate Report
                </button>
                <button
                  className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                  style={{ boxShadow: tokens.shadows.button }}
                >
                  Risk Analysis
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const ComponentExamples: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Component Examples</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Shadows in action across different UI components</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Example */}
          <div className="bg-white border border-gray-200 rounded-xl p-6" style={{ boxShadow: tokens.shadows.card }}>
            <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Form Elements</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none transition-shadow duration-200"
                  placeholder="Enter your email"
                  style={{ boxShadow: tokens.shadows.sm }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount</label>
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
                  style={{ background: tokens.colors.primary[500], boxShadow: tokens.shadows.button }}
                >
                  Submit
                </button>
                <button
                  className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all duration-200"
                  style={{ boxShadow: tokens.shadows.button }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="bg-white border border-gray-200 rounded-xl p-6" style={{ boxShadow: tokens.shadows.card }}>
            <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Status Indicators</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200" style={{ boxShadow: tokens.shadows.sm }}>
                <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.accent[500] }}></div>
                <span className="text-sm text-gray-700">Transaction Successful</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200" style={{ boxShadow: tokens.shadows.sm }}>
                <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.warning }}></div>
                <span className="text-sm text-gray-700">Risk Level: Medium</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200" style={{ boxShadow: tokens.shadows.sm }}>
                <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.danger }}></div>
                <span className="text-sm text-gray-700">Account Locked</span>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200" style={{ boxShadow: tokens.shadows.sm }}>
                <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.info }}></div>
                <span className="text-sm text-gray-700">New Feature Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Examples */}
        <div className="bg-white border border-gray-200 rounded-xl p-6" style={{ boxShadow: tokens.shadows.card }}>
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Notification System</h4>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border-l-4" style={{ background: `${tokens.colors.accent[50]}`, borderLeftColor: tokens.colors.accent[500], boxShadow: tokens.shadows.sm }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.accent[500] }}></div>
                <div>
                  <div className="font-medium text-gray-900">Investment Completed</div>
                  <div className="text-sm text-gray-600">Your $5,000 investment has been successfully processed.</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border-l-4" style={{ background: `${tokens.colors.warning}10`, borderLeftColor: tokens.colors.warning, boxShadow: tokens.shadows.sm }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.warning }}></div>
                <div>
                  <div className="font-medium text-gray-900">Security Alert</div>
                  <div className="text-sm text-gray-600">Unusual login activity detected. Please review your account.</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border-l-4" style={{ background: `${tokens.colors.danger}10`, borderLeftColor: tokens.colors.danger, boxShadow: tokens.shadows.sm }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.danger }}></div>
                <div>
                  <div className="font-medium text-gray-900">Transaction Failed</div>
                  <div className="text-sm text-gray-600">Insufficient funds. Please check your account balance.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Complete Shadow Documentation</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Comprehensive guide to our sophisticated shadow system</p>
        </div>

        {/* Design Philosophy */}
        <div className="bg-white border border-gray-200 rounded-xl p-8" style={{ boxShadow: tokens.shadows.card }}>
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">🌟 Design Philosophy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-lg bg-white border border-gray-200" style={{ boxShadow: tokens.shadows.sm }}></div>
                <div>
                  <div className="font-semibold text-gray-900">Subtle Depth</div>
                  <div className="text-sm text-gray-600">Shadows create hierarchy without overwhelming the interface</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-lg bg-white border border-gray-200" style={{ boxShadow: tokens.shadows.md }}></div>
                <div>
                  <div className="font-semibold text-gray-900">Consistent Elevation</div>
                  <div className="text-sm text-gray-600">Systematic shadow levels for predictable depth</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-lg bg-white border border-gray-200" style={{ boxShadow: tokens.shadows.glow }}></div>
                <div>
                  <div className="font-semibold text-gray-900">Interactive Feedback</div>
                  <div className="text-sm text-gray-600">Shadows respond to user interactions</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-lg bg-white border border-gray-200" style={{ boxShadow: tokens.shadows.focus }}></div>
                <div>
                  <div className="font-semibold text-gray-900">Accessibility</div>
                  <div className="text-sm text-gray-600">Clear focus indicators and contrast</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="bg-white border border-gray-200 rounded-xl p-8" style={{ boxShadow: tokens.shadows.card }}>
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">🚀 Usage Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Basic Shadows</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>xs</strong>: Subtle depth for small elements</li>
                <li>• <strong>sm</strong>: Light elevation for cards</li>
                <li>• <strong>md</strong>: Standard elevation for buttons</li>
                <li>• <strong>lg</strong>: Prominent elevation for modals</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Interactive Shadows</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>card</strong>: Default card shadow</li>
                <li>• <strong>card-hover</strong>: Elevated state on hover</li>
                <li>• <strong>button</strong>: Default button shadow</li>
                <li>• <strong>button-hover</strong>: Elevated state on hover</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Special Effects</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>glow</strong>: Primary brand glow effect</li>
                <li>• <strong>inner</strong>: Pressed or inset effect</li>
                <li>• <strong>focus</strong>: Focus indicator</li>
                <li>• <strong>modal</strong>: Modal overlay shadow</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="bg-white border border-gray-200 rounded-xl p-8" style={{ boxShadow: tokens.shadows.card }}>
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">✨ Best Practices</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Do's</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Use consistent shadow levels for similar elements</li>
                <li>• Apply hover shadows for interactive feedback</li>
                <li>• Use focus shadows for accessibility</li>
                <li>• Consider shadow direction for light sources</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Don'ts</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Don't use too many shadow levels at once</li>
                <li>• Avoid shadows that compete with content</li>
                <li>• Don't use shadows as the only interaction indicator</li>
                <li>• Avoid inconsistent shadow directions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
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
          <div className="text-sm text-muted-foreground mb-3">{name}</div>
          <div
            className="h-24 rounded-md bg-background"
            style={{ boxShadow: String(shadow) }}
          />
          <div className="text-xs text-muted-foreground mt-2">
            {String(shadow)}
          </div>
        </div>
      ))}
    </div>
  ),
  parameters: { backgrounds: { default: 'dark' } },
};
