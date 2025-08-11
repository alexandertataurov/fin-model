import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';
import { Title, Subtitle, Description, Stories } from '@storybook/blocks';

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
  title: 'Design System/Foundations/Colors',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '2rem',
          borderRadius: '12px',
          marginBottom: '2rem',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
        }}>
          <Title style={{
            color: 'white',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }} />
          <Subtitle style={{
            color: '#f0f0f0',
            fontSize: '1.5rem',
            marginBottom: '1rem',
            fontWeight: '500'
          }}>
            🎨 Foundation: Colors
          </Subtitle>
          <Description style={{
            color: '#e0e0e0',
            fontSize: '1.1rem',
            lineHeight: '1.6',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '1rem',
            borderRadius: '8px',
            backdropFilter: 'blur(10px)'
          }}>
            Explore our comprehensive color palette, design tokens, and accessibility guidelines.
            Each color is carefully crafted for optimal contrast and visual harmony.
          </Description>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(5px)'
            }}>
              🎯 Design Tokens
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(5px)'
            }}>
              ♿ Accessibility
            </div>
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '0.9rem',
              backdropFilter: 'blur(5px)'
            }}>
              🎨 Color Theory
            </div>
          </div>
        </div>
      ),
      stories: {
        includePrimary: false,
      },
    },
  },
};
export default meta;

type Story = StoryObj<typeof meta>;

function Swatch({ name, value, description }: { name: string; value: string; description?: string }) {
  return (
    <div className="group relative p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center gap-4">
        <div
          className="h-16 w-16 rounded-lg border-2 border-gray-100 shadow-sm group-hover:shadow-md transition-shadow duration-200"
          style={{ background: value }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-gray-900 mb-1">{name}</div>
          <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border">{value}</div>
          {description && <div className="text-xs text-gray-600 mt-2 italic">{description}</div>}
        </div>
      </div>
    </div>
  );
}

export const Palette: Story = {
  render: () => (
    <div className="space-y-16">
      {/* Primary Palette - Sophisticated Indigo */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Primary Palette</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Sophisticated indigo tones for primary actions and branding</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(tokens.colors.primary).map(([key, value]) => (
            <Swatch
              key={key}
              name={`Primary ${key}`}
              value={value}
              description={key === '500' ? 'Main brand color' : key === '600' ? 'Hover states' : undefined}
            />
          ))}
        </div>
      </div>

      {/* Secondary Palette - Elegant Gray */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Secondary Palette</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Elegant gray tones for secondary elements and text</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(tokens.colors.secondary).map(([key, value]) => (
            <Swatch
              key={key}
              name={`Secondary ${key}`}
              value={value}
              description={key === '500' ? 'Main text color' : key === '400' ? 'Muted text' : undefined}
            />
          ))}
        </div>
      </div>

      {/* Accent Palette - Refined Teal */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Accent Palette</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Refined teal tones for success states and highlights</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(tokens.colors.accent).map(([key, value]) => (
            <Swatch
              key={key}
              name={`Accent ${key}`}
              value={value}
              description={key === '500' ? 'Success states' : key === '600' ? 'Hover states' : undefined}
            />
          ))}
        </div>
      </div>

      {/* Destructive Palette - Professional Red */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Destructive Palette</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Professional red tones for errors and destructive actions</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Object.entries(tokens.colors.destructive).map(([key, value]) => (
            <Swatch
              key={key}
              name={`Destructive ${key}`}
              value={value}
              description={key === '500' ? 'Error states' : key === '600' ? 'Hover states' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  ),
};

export const SemanticColors: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Semantic Color Roles</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Predefined semantic colors for consistent UI patterns</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Success', value: tokens.colors.success, description: 'Sophisticated emerald for positive feedback' },
            { name: 'Warning', value: tokens.colors.warning, description: 'Warm amber for caution states' },
            { name: 'Info', value: tokens.colors.info, description: 'Trustworthy blue for information' },
            { name: 'Danger', value: tokens.colors.danger, description: 'Professional red for critical alerts' },
          ].map(({ name, value, description }) => (
            <div key={name} className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md">
              <div className="text-sm font-medium text-gray-700 mb-4">{name}</div>
              <div
                className="h-24 rounded-lg flex items-center justify-center font-semibold text-white mb-4 shadow-sm"
                style={{ background: value }}
              >
                {name}
              </div>
              <div className="text-sm text-gray-600 leading-relaxed">{description}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Surface Colors</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Background and surface colors for layout hierarchy</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Background', value: tokens.colors.background, fg: tokens.colors.foreground },
            { name: 'Surface', value: tokens.colors.surface, fg: tokens.colors.onSurface },
            { name: 'Input', value: tokens.colors.input, fg: tokens.colors.foreground },
            { name: 'Border', value: tokens.colors.border, fg: tokens.colors.foreground },
          ].map(({ name, value, fg }) => (
            <div key={name} className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md">
              <div className="text-sm font-medium text-gray-700 mb-4">{name}</div>
              <div
                className="h-24 rounded-lg flex items-center justify-center font-semibold border-2 border-gray-200 shadow-sm"
                style={{ background: value, color: fg }}
              >
                {name}
              </div>
            </div>
          ))}
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
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Hover, active, and focus states for interactive elements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              name: 'primary',
              default: tokens.colors.primary[500],
              hover: tokens.colors.hover.primary,
              active: tokens.colors.active.primary,
              focus: tokens.colors.focus.primary
            },
            {
              name: 'secondary',
              default: tokens.colors.secondary[500],
              hover: tokens.colors.hover.secondary,
              active: tokens.colors.active.secondary,
              focus: tokens.colors.focus.secondary
            },
            {
              name: 'accent',
              default: tokens.colors.accent[500],
              hover: tokens.colors.hover.accent,
              active: tokens.colors.active.accent,
              focus: tokens.colors.focus.accent
            },
            {
              name: 'destructive',
              default: tokens.colors.destructive[500],
              hover: tokens.colors.hover.destructive,
              active: tokens.colors.active.destructive,
              focus: tokens.colors.focus.destructive
            },
          ].map(({ name, default: defaultColor, hover, active, focus }) => (
            <div key={name} className="p-6 rounded-xl border border-gray-200 bg-white">
              <h4 className="font-semibold text-gray-900 capitalize mb-4 text-lg">{name}</h4>
              <div className="space-y-3">
                {[
                  { name: 'Default', value: defaultColor },
                  { name: 'Hover', value: hover },
                  { name: 'Active', value: active },
                  { name: 'Focus', value: focus },
                ].map(({ name: stateName, value }) => (
                  <div key={stateName} className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 border border-gray-100">
                    <div
                      className="h-10 w-10 rounded-lg border-2 border-gray-200 shadow-sm"
                      style={{ background: value }}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{stateName}</div>
                      <div className="text-xs text-gray-500 font-mono">{value}</div>
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

export const ColorScales: Story = {
  render: () => (
    <div className="space-y-16">
      {[
        { name: 'primary', colors: tokens.colors.primary },
        { name: 'secondary', colors: tokens.colors.secondary },
        { name: 'accent', colors: tokens.colors.accent },
        { name: 'destructive', colors: tokens.colors.destructive },
        { name: 'muted', colors: tokens.colors.muted },
      ].map(({ name, colors }) => (
        <div key={name} className="space-y-6">
          <div className="text-center">
            <h3 style={applyTextStyle('headline')} className="capitalize text-gray-900 mb-3">{name}</h3>
            <p style={applyTextStyle('subtitle')} className="text-gray-600">Complete color scale from lightest to darkest</p>
          </div>
          <div className="grid grid-cols-11 gap-3">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((shade) => {
              const colorValue = colors[shade as keyof typeof colors];
              return (
                <div key={shade} className="text-center group">
                  <div
                    className="h-20 w-full rounded-lg border-2 border-gray-200 shadow-sm mb-3 group-hover:shadow-md transition-shadow duration-200"
                    style={{ background: colorValue }}
                  />
                  <div className="text-sm font-semibold text-gray-900 mb-1">{shade}</div>
                  <div className="text-xs text-gray-500 font-mono bg-gray-50 px-2 py-1 rounded border">
                    {colorValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  ),
};

export const ColorCharacteristics: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Color Characteristics</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Understanding the refined characteristics of our classy color palette</p>
        </div>

        {/* Interactive Color Wheel */}
        <div className="mb-12">
          <div className="text-center mb-6">
            <h4 style={applyTextStyle('title')} className="text-gray-900 mb-2">Color Harmony Visualization</h4>
            <p style={applyTextStyle('body')} className="text-gray-600">Our palette creates sophisticated harmony for financial applications</p>
          </div>
          <div className="relative h-80 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-gray-200 overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            {/* Primary Indigo Center */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="w-24 h-24 rounded-full shadow-2xl border-4 border-white flex items-center justify-center text-white font-bold text-sm"
                style={{ background: tokens.colors.primary[500] }}
              >
                Primary
              </div>
            </div>

            {/* Secondary Gray Orbit */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '20s' }}>
              <div
                className="w-16 h-16 rounded-full shadow-lg border-2 border-white absolute -top-8 -left-8 flex items-center justify-center text-white font-medium text-xs"
                style={{ background: tokens.colors.secondary[500] }}
              >
                Text
              </div>
              <div
                className="w-12 h-12 rounded-full shadow-lg border-2 border-white absolute -top-6 -right-6 flex items-center justify-center text-white font-medium text-xs"
                style={{ background: tokens.colors.secondary[400] }}
              >
                Muted
              </div>
              <div
                className="w-10 h-10 rounded-full shadow-lg border-2 border-white absolute -bottom-5 -left-5 flex items-center justify-center text-white font-medium text-xs"
                style={{ background: tokens.colors.secondary[300] }}
              >
                Border
              </div>
            </div>

            {/* Accent Teal Orbit */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}>
              <div
                className="w-14 h-14 rounded-full shadow-lg border-2 border-white absolute -top-7 -right-7 flex items-center justify-center text-white font-medium text-xs"
                style={{ background: tokens.colors.accent[500] }}
              >
                Success
              </div>
              <div
                className="w-12 h-12 rounded-full shadow-lg border-2 border-white absolute -bottom-6 -right-6 flex items-center justify-center text-white font-medium text-xs"
                style={{ background: tokens.colors.accent[600] }}
              >
                Hover
              </div>
            </div>

            {/* Destructive Red Orbit */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
              <div
                className="w-16 h-16 rounded-full shadow-lg border-2 border-white absolute -top-8 -left-8 flex items-center justify-center text-white font-medium text-xs"
                style={{ background: tokens.colors.destructive[500] }}
              >
                Error
              </div>
            </div>
          </div>
        </div>

        {/* Characteristic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full shadow-md" style={{ background: tokens.colors.primary[500] }} />
              <h4 style={applyTextStyle('title')} className="text-gray-900">Sophisticated Indigo</h4>
            </div>
            <p style={applyTextStyle('body')} className="text-gray-600 mb-6">Our primary indigo conveys trust, professionalism, and luxury. Perfect for financial applications.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Main:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.primary[500]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Hover:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.primary[600]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Active:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.primary[700]}</span>
              </div>
            </div>
          </div>

          <div className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full shadow-md" style={{ background: tokens.colors.secondary[500] }} />
              <h4 className="font-bold text-xl text-gray-900">Elegant Neutrals</h4>
            </div>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">True neutral grays provide clean hierarchy without color bias. Professional and timeless.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Text:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.secondary[500]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Muted:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.secondary[400]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Border:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.secondary[200]}</span>
              </div>
            </div>
          </div>

          <div className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full shadow-md" style={{ background: tokens.colors.accent[500] }} />
              <h4 className="font-bold text-xl text-gray-900">Refined Teal</h4>
            </div>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">Sophisticated teal for success states. More elegant than traditional green.</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Success:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.accent[500]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Hover:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.accent[600]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Active:</span>
                <span className="font-mono text-gray-500 bg-gray-50 px-2 py-1 rounded">{tokens.colors.accent[700]}</span>
              </div>
            </div>
          </div>
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
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Real-world application of our color system in financial interfaces</p>
        </div>

        {/* Dashboard Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold" style={{ background: tokens.colors.primary[500] }}>
                FV
              </div>
              <div>
                <h4 style={applyTextStyle('title')} className="text-gray-900">FinVision Analytics</h4>
                <p style={applyTextStyle('caption')} className="text-gray-500">Portfolio Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 text-sm">Settings</div>
              <div className="w-8 h-8 rounded-full" style={{ background: tokens.colors.secondary[300] }}></div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Total Assets</div>
              <div style={applyTextStyle('title')} className="text-gray-900">$2.4M</div>
              <div className="text-sm" style={{ color: tokens.colors.accent[600] }}>+12.3%</div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Risk Score</div>
              <div style={applyTextStyle('title')} className="text-gray-900">Low</div>
              <div className="text-sm" style={{ color: tokens.colors.accent[600] }}>Optimal</div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Performance</div>
              <div style={applyTextStyle('title')} className="text-gray-900">+8.7%</div>
              <div className="text-sm" style={{ color: tokens.colors.accent[600] }}>YTD</div>
            </div>
            <div className="p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-500 mb-1">Alerts</div>
              <div style={applyTextStyle('title')} className="text-gray-900">2</div>
              <div className="text-sm" style={{ color: tokens.colors.warning }}>Review</div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-4 rounded-lg border border-gray-200">
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
            <div className="p-4 rounded-lg border border-gray-200">
              <h5 style={applyTextStyle('subtitle')} className="text-gray-900 mb-4">Quick Actions</h5>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 rounded-lg text-white font-medium" style={{ background: tokens.colors.primary[500] }}>
                  Add Investment
                </button>
                <button className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
                  Generate Report
                </button>
                <button className="w-full px-4 py-2 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50">
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

export const InteractiveExamples: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Interactive Examples</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">See our colors in action across different UI patterns</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form Example */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Form Elements</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Investment Amount</label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0"
                  placeholder="$10,000"
                />
              </div>
              <div className="flex gap-3">
                <button className="flex-1 px-4 py-2 rounded-lg text-white font-medium" style={{ background: tokens.colors.primary[500] }}>
                  Submit
                </button>
                <button className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </div>
          </div>

          {/* Status Indicators */}
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Status Indicators</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.accent[500] }}></div>
                <span className="text-sm text-gray-700">Transaction Successful</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.warning }}></div>
                <span className="text-sm text-gray-700">Risk Level: Medium</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.danger }}></div>
                <span className="text-sm text-gray-700">Account Locked</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ background: tokens.colors.info }}></div>
                <span className="text-sm text-gray-700">New Feature Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Examples */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-4">Notification System</h4>
          <div className="space-y-3">
            <div className="p-4 rounded-lg border-l-4" style={{ background: `${tokens.colors.accent[50]}`, borderLeftColor: tokens.colors.accent[500] }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.accent[500] }}></div>
                <div>
                  <div className="font-medium text-gray-900">Investment Completed</div>
                  <div className="text-sm text-gray-600">Your $5,000 investment has been successfully processed.</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border-l-4" style={{ background: `${tokens.colors.warning}10`, borderLeftColor: tokens.colors.warning }}>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full" style={{ background: tokens.colors.warning }}></div>
                <div>
                  <div className="font-medium text-gray-900">Security Alert</div>
                  <div className="text-sm text-gray-600">Unusual login activity detected. Please review your account.</div>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg border-l-4" style={{ background: `${tokens.colors.danger}10`, borderLeftColor: tokens.colors.danger }}>
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
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Complete Color Documentation</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Comprehensive guide to our sophisticated color system</p>
        </div>

        {/* Design Philosophy */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">🌟 Design Philosophy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ background: tokens.colors.primary[500] }}></div>
                <div>
                  <div className="font-semibold text-gray-900">Sophisticated Indigo Primary</div>
                  <div className="text-sm text-gray-600">Represents trust, stability, and innovation in financial technology</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ background: tokens.colors.secondary[500] }}></div>
                <div>
                  <div className="font-semibold text-gray-900">Elegant Neutral Grays</div>
                  <div className="text-sm text-gray-600">Provide clean hierarchy without color bias</div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ background: tokens.colors.accent[500] }}></div>
                <div>
                  <div className="font-semibold text-gray-900">Refined Teal Accents</div>
                  <div className="text-sm text-gray-600">Sophisticated success states that feel premium</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full" style={{ background: tokens.colors.danger }}></div>
                <div>
                  <div className="font-semibold text-gray-900">Professional Semantic Colors</div>
                  <div className="text-sm text-gray-600">Clear, accessible communication</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Guidelines */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">🚀 Usage Guidelines</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Primary Colors (Indigo)</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>500</strong>: Main brand elements, primary buttons, links</li>
                <li>• <strong>600</strong>: Hover states, active interactions</li>
                <li>• <strong>700</strong>: Pressed states, focus indicators</li>
                <li>• <strong>400</strong>: Secondary actions, subtle highlights</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Secondary Colors (Neutral Grays)</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>500</strong>: Primary text, headings</li>
                <li>• <strong>400</strong>: Secondary text, labels</li>
                <li>• <strong>300</strong>: Borders, dividers</li>
                <li>• <strong>200</strong>: Backgrounds, subtle surfaces</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Semantic Colors</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Success</strong>: Positive feedback, completed actions</li>
                <li>• <strong>Warning</strong>: Caution states, attention required</li>
                <li>• <strong>Info</strong>: Informational content, help text</li>
                <li>• <strong>Danger</strong>: Errors, destructive actions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Accessibility */}
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <h4 style={applyTextStyle('title')} className="text-gray-900 mb-6">♿ Accessibility</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Contrast Requirements</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• All colors meet WCAG 2.1 AA standards (4.5:1 contrast ratio)</li>
                <li>• Test all color combinations for compliance</li>
                <li>• Support high contrast mode preferences</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-900 mb-3">Best Practices</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Ensure color is not the only way to convey information</li>
                <li>• Consider color blindness in design decisions</li>
                <li>• Use semantic color roles consistently</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const UsageGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 style={applyTextStyle('headline')} className="text-gray-900 mb-4">Color Usage Guidelines</h3>
          <p style={applyTextStyle('subtitle')} className="text-gray-600 max-w-2xl mx-auto">Best practices for implementing our sophisticated color system</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md">
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Primary Colors</h4>
              <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
                <li>• Sophisticated indigo for brand identity</li>
                <li>• Use 500 for main elements</li>
                <li>• Use 600 for hover states</li>
                <li>• Use 700 for active states</li>
              </ul>
            </div>

            <div className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md">
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Secondary Colors</h4>
              <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
                <li>• Elegant neutral grays for hierarchy</li>
                <li>• Use 500 for main text</li>
                <li>• Use 400 for muted text</li>
                <li>• Use 200-300 for refined borders</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <div className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md">
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Semantic Colors</h4>
              <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
                <li>• Success: Sophisticated emerald</li>
                <li>• Warning: Warm amber</li>
                <li>• Info: Trustworthy blue</li>
                <li>• Danger: Professional red</li>
              </ul>
            </div>

            <div className="group p-6 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-md">
              <h4 className="font-semibold text-lg text-gray-900 mb-4">Accessibility</h4>
              <ul className="text-base text-gray-600 space-y-2 leading-relaxed">
                <li>• Ensure 4.5:1 contrast ratio</li>
                <li>• Test with color blindness</li>
                <li>• Don't rely solely on color</li>
                <li>• Use semantic color roles</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};