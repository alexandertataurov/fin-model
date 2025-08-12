import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../../tokens';
import { Title, Stories } from '@storybook/blocks';
import {
  AnimatedBanner,
  Card,
  applyTypographyStyle,
  SectionHeader
} from '../components';

const meta: Meta = {
  title: 'Design System/1 - Foundations/6 - Radius',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Foundation: Border Radius"
            subtitle="Sophisticated border radius system designed for financial applications. Features refined radius values that create elegant, professional interfaces with appropriate visual hierarchy and modern aesthetics."
            icon={
              <svg
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
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

function RadiusSwatch({ name, value, description, size = 'h-20' }: {
  name: string;
  value: string;
  description?: string;
  size?: string;
}) {
  return (
    <Card className="group relative p-4 hover:border-gray-300">
      <div className="flex items-center gap-4">
        <div
          className={`${size} w-16 rounded-lg border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-200`}
          style={{ borderRadius: value }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 mb-1">{name}</div>
          <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border">{value}</div>
          {description && <div className="text-xs text-gray-600 mt-2 italic">{description}</div>}
        </div>
      </div>
    </Card>
  );
}

export const Scale: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Border Radius Scale"
        subtitle="Complete range of border radius values from sharp corners to fully rounded elements"
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {Object.entries(tokens.borderRadius).map(([name, radius]) => (
          <Card key={name} className="p-4 space-y-3">
            <div className="text-sm text-muted-foreground font-medium">{name}</div>
            <div
              className="h-20 bg-primary/10 border"
              style={{ borderRadius: radius as string }}
            />
            <div className="text-xs text-muted-foreground font-mono">
              {radius as string}
            </div>
          </Card>
        ))}
      </div>
    </div>
  ),
};

export const UsageExamples: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Usage Examples"
        subtitle="Common UI patterns and their appropriate border radius values"
      />

      {/* Buttons */}
      <div className="space-y-8">
        <div className="text-center">
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Buttons</h4>
          <p style={applyTextStyle('body')} className="text-gray-600">Different button styles with appropriate radius values</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Sharp', radius: tokens.borderRadius.none, description: 'Modern, tech-focused interfaces' },
            { name: 'Subtle', radius: tokens.borderRadius.sm, description: 'Professional, understated design' },
            { name: 'Standard', radius: tokens.borderRadius.base, description: 'Default button radius' },
            { name: 'Rounded', radius: tokens.borderRadius.lg, description: 'Friendly, approachable feel' },
          ].map(({ name, radius, description }) => (
            <Card key={name} className="p-6">
              <div className="text-sm font-medium text-gray-700 mb-4">{name}</div>
              <button
                className="w-full px-4 py-2 text-white font-medium mb-3"
                style={{
                  background: tokens.colors.primary[500],
                  borderRadius: radius as string
                }}
              >
                {name} Button
              </button>
              <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border mb-2">
                {radius as string}
              </div>
              <div className="text-xs text-gray-600">{description}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="space-y-8">
        <div className="text-center">
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Cards & Containers</h4>
          <p style={applyTextStyle('body')} className="text-gray-600">Container elements with different radius values</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Sharp Cards', radius: tokens.borderRadius.none, description: 'Data-heavy interfaces' },
            { name: 'Subtle Cards', radius: tokens.borderRadius.sm, description: 'Professional dashboards' },
            { name: 'Standard Cards', radius: tokens.borderRadius.base, description: 'General content areas' },
            { name: 'Rounded Cards', radius: tokens.borderRadius.lg, description: 'User-friendly interfaces' },
          ].map(({ name, radius, description }) => (
            <Card key={name} className="p-6">
              <div className="text-sm font-medium text-gray-700 mb-4">{name}</div>
              <div
                className="h-32 bg-gray-50 border border-gray-200 mb-3 flex items-center justify-center"
                style={{ borderRadius: radius as string }}
              >
                <div className="text-center">
                  <div className="text-sm text-gray-600">Card Content</div>
                  <div className="text-xs text-gray-500 mt-1">Sample</div>
                </div>
              </div>
              <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border mb-2">
                {radius as string}
              </div>
              <div className="text-xs text-gray-600">{description}</div>
            </Card>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="space-y-8">
        <div className="text-center">
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Form Inputs</h4>
          <p style={applyTextStyle('body')} className="text-gray-600">Input fields with appropriate radius values</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Sharp Inputs', radius: tokens.borderRadius.none, description: 'Technical forms' },
            { name: 'Subtle Inputs', radius: tokens.borderRadius.sm, description: 'Professional forms' },
            { name: 'Standard Inputs', radius: tokens.borderRadius.base, description: 'General forms' },
            { name: 'Rounded Inputs', radius: tokens.borderRadius.lg, description: 'User-friendly forms' },
          ].map(({ name, radius, description }) => (
            <Card key={name} className="p-6">
              <div className="text-sm font-medium text-gray-700 mb-4">{name}</div>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-3 py-2 border border-gray-300 mb-3"
                style={{ borderRadius: radius as string }}
              />
              <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border mb-2">
                {radius as string}
              </div>
              <div className="text-xs text-gray-600">{description}</div>
            </Card>
          ))}
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
        subtitle="How border radius affects different interactive states and hover effects"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[
          {
            name: 'Buttons',
            radius: tokens.borderRadius.base,
            states: ['Default', 'Hover', 'Active', 'Focus']
          },
          {
            name: 'Cards',
            radius: tokens.borderRadius.lg,
            states: ['Default', 'Hover', 'Selected', 'Loading']
          },
          {
            name: 'Inputs',
            radius: tokens.borderRadius.sm,
            states: ['Default', 'Focus', 'Error', 'Success']
          },
        ].map(({ name, radius, states }) => (
          <Card key={name} className="p-6">
            <h4 className="font-semibold text-gray-900 capitalize mb-4 text-lg">{name}</h4>
            <div className="space-y-3">
              {states.map((state) => (
                <div key={state} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div
                    className="h-10 w-10 rounded-lg border-2 border-gray-200 shadow-sm flex items-center justify-center text-xs font-medium"
                    style={{ borderRadius: radius as string }}
                  >
                    {state.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{state}</div>
                    <div className="text-xs text-gray-500 font-mono">{radius as string}</div>
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
        subtitle="Real-world application of our radius system in financial interfaces"
      />

      {/* Dashboard Header */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm" style={{ borderRadius: tokens.borderRadius.xl }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 flex items-center justify-center text-white font-bold"
              style={{
                background: tokens.colors.primary[500],
                borderRadius: tokens.borderRadius.lg
              }}
            >
              FV
            </div>
            <div>
              <h4 style={applyTextStyle('title')} className="text-gray-900">FinVision Analytics</h4>
              <p style={applyTextStyle('caption')} className="text-gray-500">Portfolio Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="px-4 py-2 border border-gray-200 text-gray-600 text-sm"
              style={{ borderRadius: tokens.borderRadius.base }}
            >
              Settings
            </div>
            <div
              className="w-8 h-8"
              style={{
                background: tokens.colors.secondary[300],
                borderRadius: tokens.borderRadius.full
              }}
            ></div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total Assets', value: '$2.4M', change: '+12.3%' },
            { label: 'Risk Score', value: 'Low', change: 'Optimal' },
            { label: 'Performance', value: '+8.7%', change: 'YTD' },
            { label: 'Alerts', value: '2', change: 'Review' },
          ].map(({ label, value, change }) => (
            <div
              key={label}
              className="p-4 border border-gray-200"
              style={{ borderRadius: tokens.borderRadius.lg }}
            >
              <div className="text-sm text-gray-500 mb-1">{label}</div>
              <div style={applyTextStyle('title')} className="text-gray-900">{value}</div>
              <div className="text-sm" style={{ color: tokens.colors.accent[600] }}>{change}</div>
            </div>
          ))}
        </div>

        {/* Chart Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div
            className="lg:col-span-2 p-4 border border-gray-200"
            style={{ borderRadius: tokens.borderRadius.lg }}
          >
            <h5 style={applyTextStyle('subtitle')} className="text-gray-900 mb-4">Portfolio Performance</h5>
            <div
              className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center"
              style={{ borderRadius: tokens.borderRadius.base }}
            >
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-2">Chart Visualization</div>
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-3 h-3" style={{ background: tokens.colors.primary[500], borderRadius: tokens.borderRadius.full }}></div>
                  <div className="w-3 h-3" style={{ background: tokens.colors.accent[500], borderRadius: tokens.borderRadius.full }}></div>
                  <div className="w-3 h-3" style={{ background: tokens.colors.secondary[400], borderRadius: tokens.borderRadius.full }}></div>
                </div>
              </div>
            </div>
          </div>
          <div
            className="p-4 border border-gray-200"
            style={{ borderRadius: tokens.borderRadius.lg }}
          >
            <h5 style={applyTextStyle('subtitle')} className="text-gray-900 mb-4">Quick Actions</h5>
            <div className="space-y-3">
              <button
                className="w-full px-4 py-2 text-white font-medium"
                style={{
                  background: tokens.colors.primary[500],
                  borderRadius: tokens.borderRadius.base
                }}
              >
                Add Investment
              </button>
              <button
                className="w-full px-4 py-2 border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                style={{ borderRadius: tokens.borderRadius.base }}
              >
                Generate Report
              </button>
              <button
                className="w-full px-4 py-2 border border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                style={{ borderRadius: tokens.borderRadius.base }}
              >
                Risk Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const RadiusCharacteristics: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Radius Characteristics"
        subtitle="Understanding the refined characteristics of our border radius system"
      />

      {/* Characteristic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="group p-8 hover:shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-12 w-12 shadow-md flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: tokens.colors.primary[500],
                borderRadius: tokens.borderRadius.none
              }}
            >
              Sharp
            </div>
            <h4 style={applyTextStyle('title')} className="text-gray-900">Sharp Corners</h4>
          </div>
          <p style={applyTextStyle('body')} className="text-gray-600 mb-6">Zero radius for modern, tech-focused interfaces. Conveys precision and efficiency.</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Value:</span>
              <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.borderRadius.none}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Use Cases:</span>
              <span className="text-gray-500">Data tables, charts</span>
            </div>
          </div>
        </Card>

        <Card className="group p-8 hover:shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-12 w-12 shadow-md flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: tokens.colors.secondary[500],
                borderRadius: tokens.borderRadius.sm
              }}
            >
              Subtle
            </div>
            <h4 style={applyTextStyle('title')} className="text-gray-900">Subtle Radius</h4>
          </div>
          <p style={applyTextStyle('body')} className="text-gray-600 mb-6">Minimal radius for professional, understated design. Maintains sophistication.</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Value:</span>
              <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.borderRadius.sm}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Use Cases:</span>
              <span className="text-gray-500">Inputs, buttons</span>
            </div>
          </div>
        </Card>

        <Card className="group p-8 hover:shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div
              className="h-12 w-12 shadow-md flex items-center justify-center text-white font-bold text-sm"
              style={{
                background: tokens.colors.accent[500],
                borderRadius: tokens.borderRadius.lg
              }}
            >
              Rounded
            </div>
            <h4 style={applyTextStyle('title')} className="text-gray-900">Rounded Elements</h4>
          </div>
          <p style={applyTextStyle('body')} className="text-gray-600 mb-6">Comfortable radius for user-friendly interfaces. Creates approachable feel.</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Value:</span>
              <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.borderRadius.lg}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Use Cases:</span>
              <span className="text-gray-500">Cards, modals</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Complete Radius Documentation"
        subtitle="Comprehensive guide to our sophisticated border radius system"
      />

      {/* Design Philosophy */}
      <Card className="p-8">
        <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">🌟 Design Philosophy</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: tokens.colors.primary[500],
                  borderRadius: tokens.borderRadius.none
                }}
              >
                0
              </div>
              <div>
                <div className="font-semibold text-gray-900">Sharp Precision</div>
                <div className="text-sm text-gray-600">For data-heavy, technical interfaces</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: tokens.colors.secondary[500],
                  borderRadius: tokens.borderRadius.sm
                }}
              >
                S
              </div>
              <div>
                <div className="font-semibold text-gray-900">Subtle Sophistication</div>
                <div className="text-sm text-gray-600">Professional, understated design</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: tokens.colors.accent[500],
                  borderRadius: tokens.borderRadius.lg
                }}
              >
                R
              </div>
              <div>
                <div className="font-semibold text-gray-900">Rounded Comfort</div>
                <div className="text-sm text-gray-600">User-friendly, approachable feel</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-4 h-4 flex items-center justify-center text-white text-xs font-bold"
                style={{
                  background: tokens.colors.danger,
                  borderRadius: tokens.borderRadius.full
                }}
              >
                F
              </div>
              <div>
                <div className="font-semibold text-gray-900">Full Round</div>
                <div className="text-sm text-gray-600">For avatars, pills, and special elements</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Usage Guidelines */}
      <Card className="p-8">
        <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">🚀 Usage Guidelines</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Sharp Elements (0px)</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Data tables and grids</li>
              <li>• Chart containers</li>
              <li>• Technical dashboards</li>
              <li>• Code blocks</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Subtle Elements (2px)</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Form inputs</li>
              <li>• Buttons</li>
              <li>• Tooltips</li>
              <li>• Small containers</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Rounded Elements (8px+)</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Cards and panels</li>
              <li>• Modals and dialogs</li>
              <li>• Navigation elements</li>
              <li>• User avatars</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Accessibility */}
      <Card className="p-8">
        <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">♿ Accessibility</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Visual Considerations</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Ensure sufficient contrast with backgrounds</li>
              <li>• Consider focus indicators on rounded elements</li>
              <li>• Test with different zoom levels</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-gray-900 mb-3">Best Practices</h5>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Use consistent radius values within components</li>
              <li>• Consider touch target sizes on mobile</li>
              <li>• Maintain visual hierarchy with radius</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  ),
};

export const UsageGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Radius Usage Guidelines"
        subtitle="Best practices for implementing our sophisticated border radius system"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card className="group p-6 hover:shadow-md">
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Sharp Elements</h4>
            <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
              <li>• Use for data-heavy interfaces</li>
              <li>• Technical dashboards and charts</li>
              <li>• Code blocks and monospace content</li>
              <li>• Grid layouts and tables</li>
            </ul>
          </Card>

          <Card className="group p-6 hover:shadow-md">
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Subtle Elements</h4>
            <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
              <li>• Form inputs and buttons</li>
              <li>• Professional, understated design</li>
              <li>• Small containers and badges</li>
              <li>• Tooltips and dropdowns</li>
            </ul>
          </Card>
        </div>

        <div className="space-y-4">
          <Card className="group p-6 hover:shadow-md">
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Rounded Elements</h4>
            <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
              <li>• Cards and content panels</li>
              <li>• Modals and dialogs</li>
              <li>• User-friendly interfaces</li>
              <li>• Navigation elements</li>
            </ul>
          </Card>

          <Card className="group p-6 hover:shadow-md">
            <h4 className="font-semibold text-lg text-gray-900 mb-4">Consistency</h4>
            <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
              <li>• Use consistent values within components</li>
              <li>• Maintain visual hierarchy</li>
              <li>• Consider touch targets on mobile</li>
              <li>• Test with different screen sizes</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  ),
};
