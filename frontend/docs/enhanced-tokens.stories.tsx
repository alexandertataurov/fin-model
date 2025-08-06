import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../src/components/ui/card';
import { Badge } from '../src/components/ui/badge';
import { Button } from '../src/components/ui/button';
import { designTokens } from '../src/components/ui/utils/tokens';
import { componentStyles } from '../src/components/ui/utils/tokenHelpers';

const meta: Meta = {
  title: 'Foundation/Enhanced Token System',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Enhanced Design Token System

Extended design tokens that provide comprehensive coverage for modern UI development needs.

## New Token Categories

- **Animation Curves**: Easing functions for smooth transitions
- **Z-Index Scale**: Consistent layering system for components
- **Responsive Breakpoints**: Mobile-first breakpoint system
- **Container Sizes**: Content width constraints for different layouts
- **Extended Spacing**: Additional spacing values for complex layouts

## Implementation Benefits

- **Type Safety**: Full TypeScript support with autocomplete
- **Consistency**: Systematic approach to design decisions
- **Maintainability**: Centralized token management
- **Accessibility**: Built-in accessibility considerations
- **Performance**: Optimized for CSS custom properties

## Usage

All enhanced tokens are available through the \`designTokens\` object and helper utilities.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const BorderRadiusScale: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Border Radius Scale</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Consistent border radius values for different component types and visual hierarchy.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(designTokens.borderRadius).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-4 text-center">
                <div 
                  className="w-16 h-16 bg-primary mx-auto mb-3"
                  style={{ borderRadius: value }}
                />
                <div className="text-sm font-medium">{key}</div>
                <div className="text-xs text-muted-foreground font-mono">{value}</div>
                <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
                  rounded-{key === 'default' ? 'md' : key}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Border radius tokens providing consistent rounded corner styling across components.',
      },
    },
  },
};

export const BoxShadowElevation: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Elevation System</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Box shadow tokens that create visual hierarchy and depth in the interface.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(designTokens.boxShadow).map(([key, value]) => (
            <Card key={key} className="relative">
              <CardContent className="p-6">
                <div 
                  className="w-full h-20 bg-card border rounded-md mb-4"
                  style={{ boxShadow: value }}
                />
                <div className="text-sm font-medium mb-1">{key}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  Elevation Level {key === 'sm' ? '1' : key === 'default' ? '2' : key === 'md' ? '3' : key === 'lg' ? '4' : '5'}
                </div>
                <code className="text-xs bg-muted px-2 py-1 rounded">
                  shadow-{key === 'default' ? '' : key}
                </code>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Box shadow tokens for creating visual depth and component elevation.',
      },
    },
  },
};

export const AnimationCurves: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Animation Curves</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Easing functions for smooth, natural feeling animations and transitions.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(designTokens.animationCurve).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="font-medium capitalize">{key}</div>
                    <div className="text-sm text-muted-foreground">
                      {key === 'ease' ? 'Natural, balanced transition' :
                       key === 'easeIn' ? 'Slow start, quick finish' :
                       key === 'easeOut' ? 'Quick start, slow finish' :
                       key === 'easeInOut' ? 'Slow start and finish' :
                       'Sharp, mechanical transition'}
                    </div>
                  </div>
                  <Badge variant="secondary">{key}</Badge>
                </div>
                <div className="bg-muted p-3 rounded-md mb-4">
                  <code className="text-xs">
                    transition: all 300ms {value}
                  </code>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  style={{ 
                    transition: `all 300ms ${value}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = designTokens.boxShadow.md;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = designTokens.boxShadow.sm;
                  }}
                >
                  Hover to test {key}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Animation curve tokens for creating smooth, natural feeling transitions.',
      },
    },
  },
};

export const ZIndexLayers: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Z-Index Layering System</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Consistent z-index values for proper element stacking and layering.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Object.entries(designTokens.zIndex).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="text-center">
                  <div className="text-sm font-medium mb-1 capitalize">{key}</div>
                  <div className="text-2xl font-bold text-primary mb-2">{value}</div>
                  <div className="text-xs text-muted-foreground mb-3">
                    z-index: {value}
                  </div>
                  <Badge 
                    variant={
                      parseInt(value) >= 1050 ? 'destructive' :
                      parseInt(value) >= 1030 ? 'warning' :
                      parseInt(value) >= 1000 ? 'default' :
                      'secondary'
                    }
                    className="text-xs"
                  >
                    {parseInt(value) >= 1050 ? 'Overlay' :
                     parseInt(value) >= 1030 ? 'Fixed' :
                     parseInt(value) >= 1000 ? 'Float' :
                     'Base'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-3">Layer Guidelines</h4>
        <div className="grid gap-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
            <Badge variant="secondary">Base (0-10)</Badge>
            <span className="text-sm">Normal document flow and sticky elements</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
            <Badge variant="default">Float (1000-1029)</Badge>
            <span className="text-sm">Dropdowns, popovers, floating elements</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
            <Badge variant="warning">Fixed (1030-1049)</Badge>
            <span className="text-sm">Fixed navigation, banners, sticky headers</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-md">
            <Badge variant="destructive">Overlay (1050+)</Badge>
            <span className="text-sm">Modals, toasts, tooltips, critical overlays</span>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Z-index tokens for consistent element layering and stacking order.',
      },
    },
  },
};

export const ResponsiveSystem: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Responsive Breakpoints</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Mobile-first breakpoint system for responsive design implementation.
        </p>
        <div className="grid gap-4">
          {Object.entries(designTokens.breakpoints).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium capitalize text-lg">{key}</div>
                      <div className="text-sm text-muted-foreground">
                        Min-width: {value}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {key === 'sm' ? '≥ Small devices (phones)' :
                       key === 'md' ? '≥ Medium devices (tablets)' :
                       key === 'lg' ? '≥ Large devices (laptops)' :
                       key === 'xl' ? '≥ Extra large (desktops)' :
                       '≥ 2X large (wide screens)'}
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">{value}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Container Sizes</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Maximum content widths for different layout requirements.
        </p>
        <div className="grid gap-4">
          {Object.entries(designTokens.containers).map(([key, value]) => (
            <Card key={key}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="font-medium capitalize text-lg">{key}</div>
                      <div className="text-sm text-muted-foreground">
                        Max-width: {value}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {key === 'sm' ? 'Narrow content, forms' :
                       key === 'md' ? 'Standard articles, cards' :
                       key === 'lg' ? 'Wide content, dashboards' :
                       key === 'xl' ? 'Full-width layouts' :
                       key === '2xl' ? 'Ultra-wide displays' :
                       'No maximum width'}
                    </div>
                  </div>
                  <Badge variant="secondary" className="font-mono">{value}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Responsive design tokens for breakpoints and container sizing.',
      },
    },
  },
};

export const TokenUsageDemo: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Token Usage Examples</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Practical examples showing how enhanced tokens work together.
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Layered Interface Example</CardTitle>
            <CardDescription>Demonstrating z-index, shadows, and spacing tokens</CardDescription>
          </CardHeader>
          <CardContent className="relative min-h-[200px]">
            {/* Base layer */}
            <div className="absolute inset-0 bg-muted rounded-md p-4">
              <div className="text-sm text-muted-foreground">Base Layer (z-index: 0)</div>
            </div>
            
            {/* Floating element */}
            <div 
              className="absolute top-8 left-8 bg-card border rounded-md p-4"
              style={{ 
                zIndex: designTokens.zIndex.dropdown,
                boxShadow: designTokens.boxShadow.md 
              }}
            >
              <div className="text-sm">Dropdown (z-index: {designTokens.zIndex.dropdown})</div>
            </div>
            
            {/* Modal backdrop */}
            <div 
              className="absolute inset-0 bg-black/20 rounded-md flex items-center justify-center"
              style={{ zIndex: designTokens.zIndex.modal }}
            >
              <div 
                className="bg-background border rounded-lg p-6 max-w-sm"
                style={{ boxShadow: designTokens.boxShadow.xl }}
              >
                <div className="text-sm font-medium mb-2">Modal (z-index: {designTokens.zIndex.modal})</div>
                <div className="text-xs text-muted-foreground">Highest layer element</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Animation & Transition Example</CardTitle>
            <CardDescription>Hover effects using animation curve tokens</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(designTokens.animationCurve).slice(0, 3).map(([key, curve]) => (
                <Button
                  key={key}
                  variant="outline"
                  className="h-20 flex flex-col justify-center"
                  style={{
                    transition: `all 300ms ${curve}`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = designTokens.boxShadow.lg;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = designTokens.boxShadow.sm;
                  }}
                >
                  <span className="font-medium">{key}</span>
                  <span className="text-xs text-muted-foreground">Hover me</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Real-world examples demonstrating enhanced token usage in complex interfaces.',
      },
    },
  },
};