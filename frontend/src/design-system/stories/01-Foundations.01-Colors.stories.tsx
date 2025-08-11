import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { tokens } from '../tokens';

const meta: Meta = {
  title: 'Design System/Foundations/Colors',
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'padded'
  },
  tags: ['autodocs'],
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Primary Palette</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Sophisticated indigo tones for primary actions and branding</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Secondary Palette</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Elegant gray tones for secondary elements and text</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Accent Palette</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Refined teal tones for success states and highlights</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Destructive Palette</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Professional red tones for errors and destructive actions</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Semantic Color Roles</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Predefined semantic colors for consistent UI patterns</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Surface Colors</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Background and surface colors for layout hierarchy</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Interactive States</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Hover, active, and focus states for interactive elements</p>
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
            <h3 className="text-2xl font-bold capitalize text-gray-900 mb-2">{name}</h3>
            <p className="text-base text-gray-600">Complete color scale from lightest to darkest</p>
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
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Color Characteristics</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Understanding the refined characteristics of our classy color palette</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="group p-8 rounded-xl border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full shadow-md" style={{ background: tokens.colors.primary[500] }} />
              <h4 className="font-bold text-xl text-gray-900">Sophisticated Indigo</h4>
            </div>
            <p className="text-base text-gray-600 mb-6 leading-relaxed">Our primary indigo conveys trust, professionalism, and luxury. Perfect for financial applications.</p>
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

export const UsageGuidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <div>
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-3">Color Usage Guidelines</h3>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Best practices for implementing our sophisticated color system</p>
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