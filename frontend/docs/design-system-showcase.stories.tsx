import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../src/components/ui/button';
import { Input } from '../src/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../src/components/ui/card';
import { Badge } from '../src/components/ui/badge';
import { Alert, AlertDescription } from '../src/components/ui/alert';
import { useDesignTokens } from '../src/hooks/useDesignTokens';
import { componentStyles } from '../src/components/ui/utils/designSystem';

const meta: Meta = {
  title: 'Foundation/Design System Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Design System Showcase

This showcase demonstrates all design tokens working together in a comprehensive interface example.

## Features Demonstrated

- **Typography Scale**: Complete font size hierarchy with proper line heights
- **Color System**: Semantic colors with accessible contrast ratios
- **Spacing System**: Consistent spacing using design tokens
- **Component Integration**: All UI components using standardized design tokens
- **Theme Support**: Light/dark mode with proper color switching
- **Interactive States**: Focus, hover, and active states using design tokens

## Implementation

All components use the centralized design token system for consistency and maintainability.
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

const DesignShowcaseExample = () => {
  const tokens = useDesignTokens();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b bg-card">
        <div className={componentStyles.container}>
          <div className={`${componentStyles.flexBetween} py-4`}>
            <div>
              <h1 className={componentStyles.heading.h1}>FinVision</h1>
              <p className="text-muted-foreground mt-1">Design System Showcase</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="success">v2.0.0</Badge>
              <Button variant="outline" size="sm">
                Settings
              </Button>
              <Button>Get Started</Button>
            </div>
          </div>
        </div>
      </header>

      <main className={`${componentStyles.container} py-8`}>
        {/* Typography Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Typography Scale</h2>
          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h1 className={componentStyles.heading.h1}>Heading 1</h1>
                <h2 className={componentStyles.heading.h2}>Heading 2</h2>
                <h3 className={componentStyles.heading.h3}>Heading 3</h3>
                <h4 className={componentStyles.heading.h4}>Heading 4</h4>
                <h5 className={componentStyles.heading.h5}>Heading 5</h5>
                <h6 className={componentStyles.heading.h6}>Heading 6</h6>
              </div>
              <div className="space-y-3">
                <p className="text-lg">Large text - 18px</p>
                <p className="text-base">Base text - 16px</p>
                <p className="text-sm">Small text - 14px</p>
                <p className="text-xs">Extra small text - 12px</p>
                <p className="text-muted-foreground">Muted text color</p>
              </div>
            </div>
          </div>
        </section>

        {/* Button Variants Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Button Components</h2>
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className={componentStyles.heading.h3}>Variants</h3>
              <div className="flex flex-wrap gap-4">
                <Button variant="default">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="success">Success</Button>
                <Button variant="warning">Warning</Button>
                <Button variant="info">Info</Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className={componentStyles.heading.h3}>Sizes</h3>
              <div className="flex flex-wrap items-end gap-4">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🎯</Button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={componentStyles.heading.h3}>States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Form Components Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Form Components</h2>
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>User Information</CardTitle>
                <CardDescription>
                  Form components using consistent design tokens
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Name
                      </label>
                      <Input placeholder="Enter your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Email
                      </label>
                      <Input type="email" placeholder="Enter your email" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Error State
                      </label>
                      <Input 
                        error 
                        placeholder="Invalid input" 
                        helperText="This field is required"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Disabled Input
                      </label>
                      <Input disabled placeholder="Disabled input" />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Helper Text
                      </label>
                      <Input 
                        placeholder="With helper text" 
                        helperText="This is helpful information"
                      />
                    </div>
                    <div className="pt-4">
                      <Button className="w-full">Submit Form</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Status Components Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Status Components</h2>
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className={componentStyles.heading.h3}>Badges</h3>
              <div className="flex flex-wrap gap-4">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Error</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={componentStyles.heading.h3}>Alerts</h3>
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    This is a default alert with neutral styling.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="success">
                  <AlertDescription>
                    This is a success alert indicating successful completion.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="warning">
                  <AlertDescription>
                    This is a warning alert indicating caution is needed.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="destructive">
                  <AlertDescription>
                    This is an error alert indicating something went wrong.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="info">
                  <AlertDescription>
                    This is an info alert providing helpful information.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </section>

        {/* Card Layouts Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Card Layouts</h2>
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue</CardTitle>
                  <CardDescription>Total revenue this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$45,231.89</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                  <div className="mt-4">
                    <Badge variant="success">+12.3%</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card interactive hover>
                <CardHeader>
                  <CardTitle>Interactive Card</CardTitle>
                  <CardDescription>This card has hover effects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Hover over this card to see the elevation effect using design tokens.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>Total expenses this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,234.56</div>
                  <p className="text-xs text-muted-foreground">
                    -4.3% from last month
                  </p>
                  <div className="mt-4">
                    <Badge variant="destructive">-4.3%</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Spacing & Layout Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Spacing System</h2>
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Consistent Spacing</CardTitle>
                <CardDescription>
                  All spacing follows the design token system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'].map((size) => (
                    <div key={size} className="flex items-center gap-4">
                      <div
                        className="bg-primary rounded"
                        style={{ 
                          width: tokens.getSpacing(size as any),
                          height: '1rem'
                        }}
                      />
                      <span className="font-mono text-sm">
                        {size}: {tokens.getSpacing(size as any)}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Color Chart Section */}
        <section className="mb-12">
          <h2 className={componentStyles.heading.h2}>Chart Colors</h2>
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Data Visualization Colors</CardTitle>
                <CardDescription>
                  Accessible color palette for charts and data visualization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 8 }, (_, i) => (
                    <div key={i} className="text-center">
                      <div
                        className="h-16 rounded-md border mb-2"
                        style={{ backgroundColor: `var(--chart-${i + 1})` }}
                      />
                      <span className="text-sm font-mono">chart-{i + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className={`${componentStyles.container} py-8`}>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              FinVision Design System - Built with comprehensive design tokens
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export const CompleteShowcase: Story = {
  render: () => <DesignShowcaseExample />,
  parameters: {
    docs: {
      description: {
        story: 'Complete showcase of the design system with all tokens implemented.',
      },
    },
  },
};

export const ComponentGrid: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Button showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Buttons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full">Primary</Button>
            <Button variant="secondary" className="w-full">Secondary</Button>
            <Button variant="outline" className="w-full">Outline</Button>
            <Button variant="destructive" className="w-full">Destructive</Button>
          </CardContent>
        </Card>

        {/* Input showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Normal input" />
            <Input error placeholder="Error state" />
            <Input disabled placeholder="Disabled" />
          </CardContent>
        </Card>

        {/* Badge showcase */}
        <Card>
          <CardHeader>
            <CardTitle>Badges</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="destructive">Error</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Grid layout showing component variations using design tokens.',
      },
    },
  },
};