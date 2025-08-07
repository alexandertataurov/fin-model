import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../src/components/ui/card';
import { Badge } from '../src/components/ui/badge';
import { useDesignTokens } from '../src/hooks/useDesignTokens';
import {
  getSpacing,
  getFontSize,
  getBorderRadius,
  } from '../src/components/ui/utils/tokenHelpers';
import { CheckCircle, AlertTriangle, XCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '../src/components/ui/alert';

const meta: Meta = {
  title: 'Foundation/Design System',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# FinVision Design System Foundation

The foundation of the FinVision design system consists of design tokens, color system, typography, spacing, and core principles that ensure consistency across all components.

## Design Philosophy

Our design system follows these core principles:

- **Consistency**: Unified visual language across all interfaces
- **Accessibility**: WCAG 2.1 AA compliant components and colors
- **Performance**: Optimized for fast loading and smooth interactions  
- **Flexibility**: Composable components that adapt to various use cases
- **Business Focus**: Financial domain-specific patterns and workflows

## Token Categories

- **Colors**: Semantic color system with light/dark mode support
- **Spacing**: Consistent spacing scale for layouts and components  
- **Typography**: Font sizes, weights, and line heights
- **Shadows**: Elevation system for depth and hierarchy
- **Borders**: Border radius and width values
- **Transitions**: Animation timing and easing functions
- **Z-Index**: Consistent element stacking and layering

## Implementation

Tokens are implemented using Tailwind CSS custom properties and CSS variables, enabling runtime theming and easy customization with full TypeScript support.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Shared Components
const ColorCard = ({
  name,
  bgClass,
  textClass,
  contrast,
  cssVar,
  usage,
}: {
  name: string;
  bgClass: string;
  textClass: string;
  contrast: string;
  cssVar?: string;
  usage: string;
}) => (
  <Card className="overflow-hidden">
    <div className={`${bgClass} ${textClass} p-6 text-center`}>
      <div className={`text-lg font-semibold ${textClass}`}>{name}</div>
      <div className={`text-sm ${textClass}`} style={{ opacity: 0.9 }}>
        Sample Text
      </div>
    </div>
    <CardContent className="p-4 space-y-2">
      <div className="text-sm">
        <p className="font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">Contrast: {contrast}</p>
      </div>
      <div className="text-xs space-y-1">
        <p>
          <code className="bg-muted px-1 rounded">{bgClass}</code>
        </p>
        {cssVar && (
          <p>
            <code className="bg-muted px-1 rounded">{cssVar}</code>
          </p>
        )}
      </div>
      <p className="text-xs text-muted-foreground">{usage}</p>
    </CardContent>
  </Card>
);

const StatusCard = ({
  title,
  icon: Icon,
  color,
  examples,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  examples: Array<{
    type: 'badge' | 'badge-outline' | 'alert';
    text: string;
    className?: string;
  }>;
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center space-x-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <span>{title}</span>
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {examples.map((example, index) => (
        <div key={index}>
          {example.type === 'badge' && (
            <Badge className={`${color} text-white ${example.className || ''}`}>
              {example.text}
            </Badge>
          )}
          {example.type === 'badge-outline' && (
            <Badge
              variant="outline"
              className={`border-current ${color} ${example.className || ''}`}
            >
              {example.text}
            </Badge>
          )}
          {example.type === 'alert' && (
            <Alert
              className={`border-current bg-opacity-10 ${color} ${
                example.className || ''
              }`}
            >
              <Icon className={`h-4 w-4 ${color}`} />
              <AlertDescription
                className={color
                  .replace('text-', 'text-')
                  .replace('border-', 'text-')}
              >
                {example.text}
              </AlertDescription>
            </Alert>
          )}
        </div>
      ))}
    </CardContent>
  </Card>
);

const TokenDemoCard = ({
  title,
  description,
  icon,
  badge,
  children,
}: {
  title: string;
  description: string;
  icon: string;
  badge: string;
  children: React.ReactNode;
}) => (
  <Card className="h-full">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {icon} {title}
        <Badge variant="secondary">{badge}</Badge>
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent>{children}</CardContent>
  </Card>
);

// Shared Data
const colorSystem = {
  primary: [
    {
      name: 'Primary Blue',
      bgClass: 'bg-blue-700',
      textClass: 'text-white',
      contrast: '4.5:1',
      cssVar: '--primary',
      usage: 'Primary buttons, links, active states',
    },
    {
      name: 'Primary Light',
      bgClass: 'bg-blue-600',
      textClass: 'text-white',
      contrast: '3.8:1',
      cssVar: '--primary-light',
      usage: 'Hover states, secondary elements',
    },
    {
      name: 'Primary Dark',
      bgClass: 'bg-blue-800',
      textClass: 'text-white',
      contrast: '5.2:1',
      cssVar: '--primary-dark',
      usage: 'Pressed states, emphasis',
    },
  ],
  semantic: [
    {
      name: 'Success',
      bgClass: 'bg-green-700',
      textClass: 'text-white',
      contrast: '4.6:1',
      cssVar: '--success',
      usage: 'Success messages, completed states, positive indicators',
    },
    {
      name: 'Warning',
      bgClass: 'bg-amber-600',
      textClass: 'text-white',
      contrast: '4.5:1',
      cssVar: '--warning',
      usage: 'Warning messages, caution states, pending actions',
    },
    {
      name: 'Error',
      bgClass: 'bg-red-700',
      textClass: 'text-white',
      contrast: '4.8:1',
      cssVar: '--error',
      usage: 'Error messages, destructive actions, validation failures',
    },
    {
      name: 'Info',
      bgClass: 'bg-blue-700',
      textClass: 'text-white',
      contrast: '4.5:1',
      cssVar: '--info',
      usage: 'Information messages, helpful tips, neutral notifications',
    },
  ],
  neutral: [
    {
      name: 'Gray 900',
      bgClass: 'bg-gray-900',
      textClass: 'text-white',
      contrast: '15.3:1',
      cssVar: '--foreground',
      usage: 'Primary text, headings, high emphasis content',
    },
    {
      name: 'Gray 700',
      bgClass: 'bg-gray-700',
      textClass: 'text-white',
      contrast: '4.5:1',
      usage: 'Secondary text, medium emphasis content',
    },
    {
      name: 'Gray 500',
      bgClass: 'bg-gray-500',
      textClass: 'text-white',
      contrast: '2.1:1',
      usage: 'Tertiary text, low emphasis content',
    },
  ],
};

const spacingScale = [
  { name: 'xs', value: '0.5rem', class: 'w-2' },
  { name: 'sm', value: '0.75rem', class: 'w-3' },
  { name: 'md', value: '1rem', class: 'w-4' },
  { name: 'lg', value: '1.5rem', class: 'w-6' },
  { name: 'xl', value: '2rem', class: 'w-8' },
  { name: '2xl', value: '3rem', class: 'w-12' },
  { name: '3xl', value: '4rem', class: 'w-16' },
  { name: '4xl', value: '6rem', class: 'w-24' },
];

const typographyScale = [
  { name: 'text-xs', example: 'Extra small text', class: 'text-xs' },
  { name: 'text-sm', example: 'Small text', class: 'text-sm' },
  { name: 'text-base', example: 'Base text', class: 'text-base' },
  { name: 'text-lg', example: 'Large text', class: 'text-lg' },
  { name: 'text-xl', example: 'Extra large text', class: 'text-xl' },
  { name: 'text-2xl', example: 'Heading text', class: 'text-2xl' },
  { name: 'text-3xl', example: 'Large heading', class: 'text-3xl' },
  { name: 'text-4xl', example: 'Hero heading', class: 'text-4xl' },
];

const statusExamples = {
  success: {
    title: 'Success States',
    icon: CheckCircle,
    color: 'text-green-700',
    examples: [
      { type: 'badge' as const, text: 'Calculation Complete' },
      { type: 'badge-outline' as const, text: 'Valid Parameter' },
      { type: 'alert' as const, text: 'Model validation passed successfully.' },
    ],
  },
  warning: {
    title: 'Warning States',
    icon: AlertTriangle,
    color: 'text-amber-600',
    examples: [
      {
        type: 'badge' as const,
        text: 'Processing',
        className: 'hover:bg-amber-700 transition-colors',
      },
      {
        type: 'badge-outline' as const,
        text: 'Needs Review',
        className: 'hover:bg-amber-50',
      },
      { type: 'alert' as const, text: 'Some parameters may need adjustment.' },
    ],
  },
  error: {
    title: 'Error States',
    icon: XCircle,
    color: 'text-red-700',
    examples: [
      { type: 'badge' as const, text: 'Validation Failed' },
      { type: 'badge-outline' as const, text: 'Invalid Input' },
      {
        type: 'alert' as const,
        text: 'Parameter value is outside acceptable range.',
      },
    ],
  },
  info: {
    title: 'Information States',
    icon: Info,
    color: 'text-blue-700',
    examples: [
      { type: 'badge' as const, text: 'Default Value' },
      { type: 'badge-outline' as const, text: 'Information' },
      {
        type: 'alert' as const,
        text: 'This parameter affects multiple calculations.',
      },
    ],
  },
};

// Stories
export const ColorSystem: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Primary & Brand Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorSystem.primary.map(color => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Status & Semantic Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {colorSystem.semantic.map(color => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Neutral & Gray Scale</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colorSystem.neutral.map(color => (
            <ColorCard key={color.name} {...color} />
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Complete color system with semantic colors, accessibility information, and usage guidelines.',
      },
    },
  },
};

export const SpacingSystem: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Spacing Scale</h3>
      <div className="space-y-4">
        {spacingScale.map(space => (
          <div key={space.name} className="flex items-center gap-4">
            <div className={`${space.class} h-4 bg-primary rounded`} />
            <span className="font-mono text-sm">{space.name}</span>
            <span className="text-sm text-muted-foreground">{space.value}</span>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Consistent spacing scale used throughout the design system.',
      },
    },
  },
};

export const TypographySystem: Story = {
  render: () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Typography Scale</h3>
      <div className="space-y-4">
        {typographyScale.map(type => (
          <div key={type.name} className="flex items-center gap-4">
            <div className={`${type.class} font-medium min-w-32`}>
              {type.example}
            </div>
            <code className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
              {type.name}
            </code>
          </div>
        ))}
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Typography scale with consistent font sizes and line heights.',
      },
    },
  },
};

export const DesignTokensDemo: Story = {
  render: () => {
    const tokens = useDesignTokens();

    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">Enhanced Design Tokens</h2>
          <p className="text-lg text-muted-foreground">
            Complete token system with 200+ design tokens for consistent styling
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TokenDemoCard
            title="Spacing System"
            description="Consistent spacing using design tokens"
            icon="📏"
            badge="10 tokens"
          >
            <div className="space-y-3">
              {['xs', 'sm', 'md', 'lg', 'xl'].map(size => (
                <div key={size} className="flex items-center gap-3">
                  <div
                    className="bg-primary rounded h-4"
                    style={{
                      width: getSpacing(size as any),
                    }}
                  />
                  <span className="font-mono text-sm">{size}</span>
                  <span className="text-xs text-muted-foreground">
                    {getSpacing(size as any)}
                  </span>
                </div>
              ))}
            </div>
          </TokenDemoCard>

          <TokenDemoCard
            title="Typography System"
            description="Font sizes and line heights"
            icon="📝"
            badge="8 tokens"
          >
            <div className="space-y-3">
              {['xs', 'sm', 'base', 'lg', 'xl'].map(size => (
                <div key={size} className="flex items-center gap-3">
                  <div
                    className="bg-primary rounded w-4 h-4"
                    style={{
                      fontSize: getFontSize(size as any),
                    }}
                  />
                  <span className="font-mono text-sm">{size}</span>
                  <span className="text-xs text-muted-foreground">
                    {getFontSize(size as any)}
                  </span>
                </div>
              ))}
            </div>
          </TokenDemoCard>

          <TokenDemoCard
            title="Border Radius"
            description="Consistent border radius values"
            icon="🔲"
            badge="6 tokens"
          >
            <div className="space-y-3">
              {['sm', 'md', 'lg', 'xl', 'full'].map(size => (
                <div key={size} className="flex items-center gap-3">
                  <div
                    className="bg-primary w-8 h-8"
                    style={{
                      borderRadius: getBorderRadius(size as any),
                    }}
                  />
                  <span className="font-mono text-sm">{size}</span>
                  <span className="text-xs text-muted-foreground">
                    {getBorderRadius(size as any)}
                  </span>
                </div>
              ))}
            </div>
          </TokenDemoCard>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Complete demonstration of the design system foundation with all tokens and utilities.',
      },
    },
  },
};

export const UsageGuidelines: Story = {
  render: () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Design System Usage Guidelines</CardTitle>
          <CardDescription>
            Best practices for implementing the FinVision design system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-medium mb-3">✅ Do</h4>
            <ul className="space-y-2 text-sm">
              {[
                'Use design tokens instead of hardcoded values',
                'Test color combinations with accessibility tools',
                'Use semantic colors consistently (green for success, red for errors)',
                'Follow the spacing scale for consistent layouts',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="border-green-700 text-green-700 mt-0.5"
                  >
                    ✓
                  </Badge>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-3">❌ Don't</h4>
            <ul className="space-y-2 text-sm">
              {[
                'Use hardcoded pixel values for spacing or typography',
                'Rely solely on color to convey important information',
                'Use custom colors without testing contrast ratios',
                'Ignore accessibility guidelines for color combinations',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <Badge
                    variant="outline"
                    className="border-red-700 text-red-700 mt-0.5"
                  >
                    ✗
                  </Badge>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Guidelines for implementing the design system consistently across applications.',
      },
    },
  },
};

export const AccessibilityGuidelines: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">
          WCAG 2.1 AA Compliant Colors
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              name: 'Primary',
              class: 'bg-blue-700',
              text: 'text-white',
              contrast: '4.5:1',
            },
            {
              name: 'Success',
              class: 'bg-green-700',
              text: 'text-white',
              contrast: '4.6:1',
            },
            {
              name: 'Warning',
              class: 'bg-amber-600',
              text: 'text-white',
              contrast: '4.5:1',
            },
            {
              name: 'Danger',
              class: 'bg-red-700',
              text: 'text-white',
              contrast: '4.8:1',
            },
          ].map(color => (
            <div key={color.name} className="space-y-2">
              <div
                className={`${color.class} ${color.text} p-4 rounded-md text-center font-medium`}
              >
                <span className={color.text}>{color.name}</span>
              </div>
              <div className="text-xs">
                <p className="font-medium">{color.class}</p>
                <p className="text-muted-foreground">
                  Contrast: {color.contrast}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Status Indicators</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(statusExamples).map(([key, config]) => (
            <StatusCard key={key} {...config} />
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Accessible color combinations and interactive elements that meet WCAG 2.1 AA standards.',
      },
    },
  },
};
