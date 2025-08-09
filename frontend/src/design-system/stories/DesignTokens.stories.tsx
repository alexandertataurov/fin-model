import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/Card';
import { tokens } from '../tokens';

const meta: Meta = {
  title: 'Design System/Foundations/Design Tokens',
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
## Design Tokens

This story showcases all the centralized design tokens used throughout the design system.

### Categories
- **Colors**: Primary, secondary, accent, and semantic color palettes
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale for layouts
- **Shadows**: Elevation and depth system
- **Border Radius**: Corner rounding values
- **Breakpoints**: Responsive design breakpoints
- **Z-Index**: Layering system for UI elements

### Usage
Import tokens from \`../tokens\` to maintain consistency across components.
        `,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * ## Color Palette
 *
 * Complete color system with primary, secondary, accent, and semantic colors.
 */
export const ColorPalette: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Primary Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Primary Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-11 gap-2">
            {Object.entries(tokens.colors.primary).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="h-16 rounded border"
                  style={{ backgroundColor: value }}
                />
                <p className="text-xs mt-1 font-mono">{key}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Secondary Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Secondary Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-11 gap-2">
            {Object.entries(tokens.colors.secondary).map(([key, value]) => (
              <div key={key} className="text-center">
                <div
                  className="h-16 rounded border"
                  style={{ backgroundColor: value }}
                />
                <p className="text-xs mt-1 font-mono">{key}</p>
                <p className="text-xs text-muted-foreground font-mono">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Semantic Colors */}
      <Card>
        <CardHeader>
          <CardTitle>Semantic Colors</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Accent (Success)</h4>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(tokens.colors.accent).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div
                      className="h-12 rounded border"
                      style={{ backgroundColor: value }}
                    />
                    <p className="text-xs mt-1 font-mono">{key}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2">Destructive (Error)</h4>
              <div className="grid grid-cols-6 gap-2">
                {Object.entries(tokens.colors.destructive).map(
                  ([key, value]) => (
                    <div key={key} className="text-center">
                      <div
                        className="h-12 rounded border"
                        style={{ backgroundColor: value }}
                      />
                      <p className="text-xs mt-1 font-mono">{key}</p>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * ## Typography System
 *
 * Font families, sizes, weights, and line heights for consistent text styling.
 */
export const TypographySystem: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Font Families */}
      <Card>
        <CardHeader>
          <CardTitle>Font Families</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Sans Serif</h4>
              <p
                className="text-lg"
                style={{
                  fontFamily: tokens.typography.fontFamily.sans.join(', '),
                }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {tokens.typography.fontFamily.sans.join(', ')}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Monospace</h4>
              <p
                className="text-lg"
                style={{
                  fontFamily: tokens.typography.fontFamily.mono.join(', '),
                }}
              >
                The quick brown fox jumps over the lazy dog
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {tokens.typography.fontFamily.mono.join(', ')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Font Sizes */}
      <Card>
        <CardHeader>
          <CardTitle>Font Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(tokens.typography.fontSize).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="font-mono text-sm">{key}</span>
                <span className="font-mono text-sm text-muted-foreground">
                  {value}
                </span>
                <span style={{ fontSize: value }}>Sample text</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Font Weights */}
      <Card>
        <CardHeader>
          <CardTitle>Font Weights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {Object.entries(tokens.typography.fontWeight).map(
              ([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="font-mono text-sm">{key}</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {value}
                  </span>
                  <span style={{ fontWeight: value }}>Sample text</span>
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

/**
 * ## Spacing Scale
 *
 * Consistent spacing values for margins, padding, and layout gaps.
 */
export const SpacingScale: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Spacing Scale</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(tokens.spacing).map(([key, value]) => (
            <div key={key} className="flex items-center space-x-4">
              <div className="w-16 text-sm font-mono">{key}</div>
              <div className="w-16 text-sm font-mono text-muted-foreground">
                {value}
              </div>
              <div
                className="bg-primary-500 rounded"
                style={{ width: value, height: '1rem' }}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * ## Shadow System
 *
 * Elevation and depth system for UI components.
 */
export const ShadowSystem: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Shadow System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(tokens.shadows).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="h-24 bg-white border rounded-lg mb-2 flex items-center justify-center"
                style={{ boxShadow: value }}
              >
                <span className="text-sm font-medium">{key}</span>
              </div>
              <p className="text-xs font-mono text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * ## Border Radius
 *
 * Corner rounding values for consistent component styling.
 */
export const BorderRadius: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Border Radius</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(tokens.borderRadius).map(([key, value]) => (
            <div key={key} className="text-center">
              <div
                className="h-20 bg-primary-100 border-2 border-primary-300 mb-2 flex items-center justify-center"
                style={{ borderRadius: value }}
              >
                <span className="text-sm font-medium">{key}</span>
              </div>
              <p className="text-xs font-mono text-muted-foreground">{value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * ## Breakpoints
 *
 * Responsive design breakpoints for mobile-first development.
 */
export const Breakpoints: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Breakpoints</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(tokens.breakpoints).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-muted rounded"
            >
              <span className="font-medium">{key}</span>
              <span className="font-mono text-sm text-muted-foreground">
                {value}
              </span>
              <div className="text-xs px-2 py-1 bg-primary-100 text-primary-700 rounded">
                {key === 'sm' && 'Mobile'}
                {key === 'md' && 'Tablet'}
                {key === 'lg' && 'Desktop'}
                {key === 'xl' && 'Large Desktop'}
                {key === '2xl' && 'Ultra Wide'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};

/**
 * ## Z-Index System
 *
 * Layering system for UI elements and components.
 */
export const ZIndexSystem: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Z-Index System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(tokens.zIndex).map(([key, value]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-muted rounded"
            >
              <span className="font-medium">{key}</span>
              <span className="font-mono text-sm text-muted-foreground">
                {value}
              </span>
              <div className="text-xs px-2 py-1 bg-accent-100 text-accent-700 rounded">
                {key === 'dropdown' && 'Dropdowns'}
                {key === 'sticky' && 'Sticky Elements'}
                {key === 'fixed' && 'Fixed Elements'}
                {key === 'modal' && 'Modals'}
                {key === 'popover' && 'Popovers'}
                {key === 'tooltip' && 'Tooltips'}
                {key === 'auto' && 'Auto'}
                {![
                  'dropdown',
                  'sticky',
                  'fixed',
                  'modal',
                  'popover',
                  'tooltip',
                  'auto',
                ].includes(key) && 'Custom'}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  ),
};
