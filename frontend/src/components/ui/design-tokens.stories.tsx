import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { Badge } from './badge';

const meta: Meta = {
  title: 'Design System/Design Tokens',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Design Tokens

The foundational design elements that create consistency across the FinVision platform. These tokens define colors, typography, spacing, and other visual properties.

## Token Categories

- **Colors**: Primary, secondary, semantic, and neutral color palettes
- **Typography**: Font families, sizes, weights, and line heights
- **Spacing**: Consistent spacing scale for margins and padding
- **Shadows**: Elevation and depth through shadow tokens
- **Border Radius**: Corner radius values for components
- **Transitions**: Animation timing and easing functions

## Usage Guidelines

- Always use design tokens instead of hardcoded values
- Maintain consistency across all components
- Follow the established scale for spacing and sizing
- Use semantic color tokens for better theming support
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Colors Section
export const Colors: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Color Palette</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Semantic color tokens for consistent theming and accessibility
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Primary Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Primary Colors</CardTitle>
            <CardDescription>
              Main brand colors used for primary actions and branding
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-16 bg-primary rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Primary</p>
                  <p className="text-muted-foreground">bg-primary</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-16 bg-primary-foreground rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Primary Foreground</p>
                  <p className="text-muted-foreground">bg-primary-foreground</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Semantic Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Semantic Colors</CardTitle>
            <CardDescription>
              Colors for different states and feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="h-12 bg-destructive rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Destructive</p>
                  <p className="text-muted-foreground">bg-destructive</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-success rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Success</p>
                  <p className="text-muted-foreground">bg-success</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-warning rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Warning</p>
                  <p className="text-muted-foreground">bg-warning</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-12 bg-info rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Info</p>
                  <p className="text-muted-foreground">bg-info</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Neutral Colors */}
        <Card>
          <CardHeader>
            <CardTitle>Neutral Colors</CardTitle>
            <CardDescription>
              Background and text colors for content hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-background rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Background</p>
                  <p className="text-muted-foreground">bg-background</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-foreground rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Foreground</p>
                  <p className="text-muted-foreground">bg-foreground</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Muted</p>
                  <p className="text-muted-foreground">bg-muted</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-muted-foreground rounded-lg border"></div>
                <div className="text-sm">
                  <p className="font-semibold">Muted Foreground</p>
                  <p className="text-muted-foreground">bg-muted-foreground</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color Scale */}
        <Card>
          <CardHeader>
            <CardTitle>Color Scale</CardTitle>
            <CardDescription>
              Gray scale for borders, dividers, and subtle backgrounds
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(shade => (
                <div key={shade} className="flex items-center gap-4">
                  <div
                    className={`w-12 h-8 rounded border`}
                    style={{ backgroundColor: `hsl(var(--gray-${shade}))` }}
                  ></div>
                  <div className="text-sm">
                    <p className="font-semibold">Gray {shade}</p>
                    <p className="text-muted-foreground">--gray-{shade}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Typography Section
export const Typography: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Typography</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Font families, sizes, weights, and line heights for consistent text
          hierarchy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Font Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Font Sizes</CardTitle>
            <CardDescription>Consistent text sizing scale</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold">Heading 1 (text-4xl)</h1>
                <p className="text-sm text-muted-foreground">
                  Font size: 2.25rem (36px)
                </p>
              </div>
              <div>
                <h2 className="text-3xl font-bold">Heading 2 (text-3xl)</h2>
                <p className="text-sm text-muted-foreground">
                  Font size: 1.875rem (30px)
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Heading 3 (text-2xl)</h3>
                <p className="text-sm text-muted-foreground">
                  Font size: 1.5rem (24px)
                </p>
              </div>
              <div>
                <h4 className="text-xl font-bold">Heading 4 (text-xl)</h4>
                <p className="text-sm text-muted-foreground">
                  Font size: 1.25rem (20px)
                </p>
              </div>
              <div>
                <h5 className="text-lg font-bold">Heading 5 (text-lg)</h5>
                <p className="text-sm text-muted-foreground">
                  Font size: 1.125rem (18px)
                </p>
              </div>
              <div>
                <p className="text-base">Body Text (text-base)</p>
                <p className="text-sm text-muted-foreground">
                  Font size: 1rem (16px)
                </p>
              </div>
              <div>
                <p className="text-sm">Small Text (text-sm)</p>
                <p className="text-sm text-muted-foreground">
                  Font size: 0.875rem (14px)
                </p>
              </div>
              <div>
                <p className="text-xs">Extra Small (text-xs)</p>
                <p className="text-sm text-muted-foreground">
                  Font size: 0.75rem (12px)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Font Weights */}
        <Card>
          <CardHeader>
            <CardTitle>Font Weights</CardTitle>
            <CardDescription>
              Different font weights for emphasis and hierarchy
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <p className="font-thin text-lg">Thin (font-thin)</p>
                <p className="text-sm text-muted-foreground">Weight: 100</p>
              </div>
              <div>
                <p className="font-light text-lg">Light (font-light)</p>
                <p className="text-sm text-muted-foreground">Weight: 300</p>
              </div>
              <div>
                <p className="font-normal text-lg">Normal (font-normal)</p>
                <p className="text-sm text-muted-foreground">Weight: 400</p>
              </div>
              <div>
                <p className="font-medium text-lg">Medium (font-medium)</p>
                <p className="text-sm text-muted-foreground">Weight: 500</p>
              </div>
              <div>
                <p className="font-semibold text-lg">
                  Semibold (font-semibold)
                </p>
                <p className="text-sm text-muted-foreground">Weight: 600</p>
              </div>
              <div>
                <p className="font-bold text-lg">Bold (font-bold)</p>
                <p className="text-sm text-muted-foreground">Weight: 700</p>
              </div>
              <div>
                <p className="font-extrabold text-lg">
                  Extrabold (font-extrabold)
                </p>
                <p className="text-sm text-muted-foreground">Weight: 800</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Spacing Section
export const Spacing: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Spacing</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Consistent spacing scale for margins, padding, and layout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Spacing Scale */}
        <Card>
          <CardHeader>
            <CardTitle>Spacing Scale</CardTitle>
            <CardDescription>
              Tailwind CSS spacing scale (0.25rem = 4px base unit)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { class: 'space-y-0', value: '0px', rem: '0rem' },
                { class: 'space-y-1', value: '4px', rem: '0.25rem' },
                { class: 'space-y-2', value: '8px', rem: '0.5rem' },
                { class: 'space-y-3', value: '12px', rem: '0.75rem' },
                { class: 'space-y-4', value: '16px', rem: '1rem' },
                { class: 'space-y-5', value: '20px', rem: '1.25rem' },
                { class: 'space-y-6', value: '24px', rem: '1.5rem' },
                { class: 'space-y-8', value: '32px', rem: '2rem' },
                { class: 'space-y-10', value: '40px', rem: '2.5rem' },
                { class: 'space-y-12', value: '48px', rem: '3rem' },
                { class: 'space-y-16', value: '64px', rem: '4rem' },
                { class: 'space-y-20', value: '80px', rem: '5rem' },
              ].map(spacing => (
                <div key={spacing.class} className="flex items-center gap-4">
                  <div
                    className="bg-primary rounded"
                    style={{
                      width: spacing.value,
                      height: spacing.value,
                      minWidth: '16px',
                      minHeight: '16px',
                    }}
                  ></div>
                  <div className="text-sm">
                    <p className="font-semibold">{spacing.class}</p>
                    <p className="text-muted-foreground">
                      {spacing.value} ({spacing.rem})
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Common spacing patterns in components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Card Padding</h4>
              <div className="p-6 border rounded-lg bg-muted/50">
                <p className="text-sm">p-6 (24px padding on all sides)</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Component Spacing</h4>
              <div className="space-y-4">
                <div className="p-4 border rounded bg-background">
                  Component 1
                </div>
                <div className="p-4 border rounded bg-background">
                  Component 2
                </div>
                <div className="p-4 border rounded bg-background">
                  Component 3
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                space-y-4 (16px between components)
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Button Spacing</h4>
              <div className="flex gap-2">
                <div className="px-4 py-2 border rounded bg-background">
                  Button 1
                </div>
                <div className="px-4 py-2 border rounded bg-background">
                  Button 2
                </div>
                <div className="px-4 py-2 border rounded bg-background">
                  Button 3
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                gap-2 (8px between buttons)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Shadows Section
export const Shadows: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Shadows & Elevation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Shadow tokens for creating depth and visual hierarchy
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Shadow Scale */}
        <Card>
          <CardHeader>
            <CardTitle>Shadow Scale</CardTitle>
            <CardDescription>
              Different shadow intensities for various elevation levels
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-6 bg-background border rounded-lg shadow-sm">
                <p className="font-semibold">Shadow Small</p>
                <p className="text-sm text-muted-foreground">shadow-sm</p>
              </div>
              <div className="p-6 bg-background border rounded-lg shadow">
                <p className="font-semibold">Shadow Default</p>
                <p className="text-sm text-muted-foreground">shadow</p>
              </div>
              <div className="p-6 bg-background border rounded-lg shadow-md">
                <p className="font-semibold">Shadow Medium</p>
                <p className="text-sm text-muted-foreground">shadow-md</p>
              </div>
              <div className="p-6 bg-background border rounded-lg shadow-lg">
                <p className="font-semibold">Shadow Large</p>
                <p className="text-sm text-muted-foreground">shadow-lg</p>
              </div>
              <div className="p-6 bg-background border rounded-lg shadow-xl">
                <p className="font-semibold">Shadow Extra Large</p>
                <p className="text-sm text-muted-foreground">shadow-xl</p>
              </div>
              <div className="p-6 bg-background border rounded-lg shadow-2xl">
                <p className="font-semibold">Shadow 2XL</p>
                <p className="text-sm text-muted-foreground">shadow-2xl</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              How shadows are used in different contexts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Cards & Panels</h4>
              <div className="p-4 bg-background border rounded-lg shadow-sm">
                <p className="text-sm">Subtle elevation for cards</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Modals & Dialogs</h4>
              <div className="p-4 bg-background border rounded-lg shadow-lg">
                <p className="text-sm">Strong elevation for modals</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Floating Elements</h4>
              <div className="p-4 bg-background border rounded-lg shadow-xl">
                <p className="text-sm">
                  Maximum elevation for floating elements
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Border Radius Section
export const BorderRadius: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Border Radius</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Corner radius values for consistent component styling
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Radius Scale */}
        <Card>
          <CardHeader>
            <CardTitle>Radius Scale</CardTitle>
            <CardDescription>
              Different border radius values for various use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-none border-2 border-dashed border-muted-foreground/30"></div>
                <div className="text-sm">
                  <p className="font-semibold">None</p>
                  <p className="text-muted-foreground">rounded-none (0px)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-sm border-2 border-dashed border-muted-foreground/30"></div>
                <div className="text-sm">
                  <p className="font-semibold">Small</p>
                  <p className="text-muted-foreground">rounded-sm (2px)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded border-2 border-dashed border-muted-foreground/30"></div>
                <div className="text-sm">
                  <p className="font-semibold">Default</p>
                  <p className="text-muted-foreground">rounded (4px)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-md border-2 border-dashed border-muted-foreground/30"></div>
                <div className="text-sm">
                  <p className="font-semibold">Medium</p>
                  <p className="text-muted-foreground">rounded-md (6px)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-lg border-2 border-dashed border-muted-foreground/30"></div>
                <div className="text-sm">
                  <p className="font-semibold">Large</p>
                  <p className="text-muted-foreground">rounded-lg (8px)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-xl border-2 border-dashed border-muted-foreground/30"></div>
                <div className="text-sm">
                  <p className="font-semibold">Extra Large</p>
                  <p className="text-muted-foreground">rounded-xl (12px)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-2xl border-2 border-dashed border-muted-foreground/30"></div>
                <div className="text-sm">
                  <p className="font-semibold">2XL</p>
                  <p className="text-muted-foreground">rounded-2xl (16px)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary rounded-full border-2 border-dashed border-muted-foreground/30"></div>
                <div className="text-sm">
                  <p className="font-semibold">Full</p>
                  <p className="text-muted-foreground">rounded-full (50%)</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>Common border radius applications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Buttons</h4>
              <div className="flex gap-2">
                <div className="px-4 py-2 bg-primary text-primary-foreground rounded">
                  Default
                </div>
                <div className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                  Large
                </div>
                <div className="px-4 py-2 bg-primary text-primary-foreground rounded-full">
                  Pill
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Cards</h4>
              <div className="space-y-2">
                <div className="p-4 bg-background border rounded">
                  Default Card
                </div>
                <div className="p-4 bg-background border rounded-lg">
                  Large Card
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Avatars & Icons</h4>
              <div className="flex gap-2">
                <div className="w-10 h-10 bg-primary rounded"></div>
                <div className="w-10 h-10 bg-primary rounded-lg"></div>
                <div className="w-10 h-10 bg-primary rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
