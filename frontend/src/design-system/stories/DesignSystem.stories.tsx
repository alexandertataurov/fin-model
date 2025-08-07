import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DesignSystemProvider } from '../provider';
import { Button } from '../components/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { 
  Plus, 
  Download, 
  Trash2, 
  Edit, 
  Search, 
  Mail, 
  Eye, 
  EyeOff,
  Settings,
  User,
  Bell,
  Calendar,
  DollarSign,
  TrendingUp,
  FileText,
  BarChart3,
  CheckCircle,
  AlertTriangle,
  Info,
  Lock,
  Star,
  Heart,
  Share2,
  MoreHorizontal,
  Palette
} from 'lucide-react';

const meta: Meta = {
  title: '🎨 Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# FinVision Design System

A modern, accessible, and performant design system built for financial applications. This system provides consistent components, comprehensive theming, and excellent developer experience.

## Key Features

- **🎨 Modern Design**: Clean, professional aesthetic optimized for financial data
- **♿ Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
- **📱 Responsive**: Mobile-first design with adaptive layouts
- **🎯 Type Safe**: Full TypeScript support with comprehensive prop validation
- **⚡ Performance**: Optimized for speed with minimal bundle impact
- **🎭 Theming**: Flexible theming system with light/dark mode support
- **🧪 Tested**: Comprehensive testing with accessibility and visual regression tests

## Design Principles

1. **Consistency**: Unified visual language across all components
2. **Clarity**: Clear information hierarchy and readable typography
3. **Efficiency**: Streamlined workflows and intuitive interactions
4. **Reliability**: Robust error handling and graceful degradation
5. **Accessibility**: Inclusive design for all users
        `,
      },
    },
  },
  decorators: [
    (Story) => (
      <DesignSystemProvider>
        <div className="min-h-screen bg-background p-8">
          <Story />
        </div>
      </DesignSystemProvider>
    ),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Design System Overview
export const Overview: Story = {
  render: () => (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          FinVision Design System
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive design system built for modern financial applications. 
          Consistent, accessible, and performant components that scale with your needs.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" leftIcon={<Star className="size-5" />}>
            Get Started
          </Button>
          <Button variant="outline" size="lg" leftIcon={<Download className="size-5" />}>
            Download
          </Button>
        </div>
      </div>

      {/* Component Showcase */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Component Library</h2>
          <p className="text-muted-foreground">Explore our comprehensive collection of components</p>
        </div>

        {/* Buttons Section */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="size-5" />
              Buttons
            </CardTitle>
            <CardDescription>
              Primary interaction elements with multiple variants, sizes, and states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Variants */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Variants</h4>
              <div className="flex flex-wrap gap-3">
                <Button variant="default">Default</Button>
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

            {/* Sizes */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Sizes</h4>
              <div className="flex items-center gap-3">
                <Button size="xs">Extra Small</Button>
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
            </div>

            {/* Icon Buttons */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">Icon Buttons</h4>
              <div className="flex items-center gap-3">
                <Button size="icon" variant="outline">
                  <Plus className="size-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Edit className="size-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Trash2 className="size-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Search className="size-4" />
                </Button>
                <Button size="icon" variant="outline">
                  <Settings className="size-4" />
                </Button>
              </div>
            </div>

            {/* States */}
            <div className="space-y-4">
              <h4 className="font-semibold text-lg">States</h4>
              <div className="flex items-center gap-3">
                <Button>Normal</Button>
                <Button disabled>Disabled</Button>
                <Button loading>Loading</Button>
                <Button leftIcon={<Mail className="size-4" />}>
                  With Icon
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cards Section */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="size-5" />
              Cards
            </CardTitle>
            <CardDescription>
              Flexible content containers with multiple variants and layouts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Default Card */}
              <Card variant="default">
                <CardHeader>
                  <CardTitle size="md">Default Card</CardTitle>
                  <CardDescription>
                    Standard card with subtle shadow and border
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    This is the default card variant with clean styling and good readability.
                  </p>
                </CardContent>
              </Card>

              {/* Elevated Card */}
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle size="md">Elevated Card</CardTitle>
                  <CardDescription>
                    Card with enhanced shadow and hover effects
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Enhanced visual hierarchy with deeper shadows and interactive states.
                  </p>
                </CardContent>
              </Card>

              {/* Interactive Card */}
              <Card variant="interactive">
                <CardHeader>
                  <CardTitle size="md">Interactive Card</CardTitle>
                  <CardDescription>
                    Clickable card with hover and focus states
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Interactive card that responds to user input with visual feedback.
                  </p>
                </CardContent>
              </Card>

              {/* Ghost Card */}
              <Card variant="ghost">
                <CardHeader>
                  <CardTitle size="md">Ghost Card</CardTitle>
                  <CardDescription>
                    Minimal card without borders or shadows
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Clean, minimal design perfect for subtle content presentation.
                  </p>
                </CardContent>
              </Card>

              {/* Outline Card */}
              <Card variant="outline">
                <CardHeader>
                  <CardTitle size="md">Outline Card</CardTitle>
                  <CardDescription>
                    Card with border but no background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Transparent background with visible border for subtle emphasis.
                  </p>
                </CardContent>
              </Card>

              {/* Metric Card */}
              <Card variant="elevated" className="bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle size="md" className="text-primary">Revenue</CardTitle>
                    <DollarSign className="size-5 text-primary" />
                  </div>
                  <CardDescription>Monthly revenue growth</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">$124,563</p>
                    <p className="text-sm text-success flex items-center gap-1">
                      <TrendingUp className="size-4" />
                      +12.5% from last month
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>

        {/* Design Tokens */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="size-5" />
              Design Tokens
            </CardTitle>
            <CardDescription>
              Consistent design values for colors, typography, spacing, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Colors */}
              <div className="space-y-4">
                <h4 className="font-semibold">Colors</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-primary" />
                    <span className="text-sm">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-secondary" />
                    <span className="text-sm">Secondary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-success" />
                    <span className="text-sm">Success</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-warning" />
                    <span className="text-sm">Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="size-4 rounded bg-destructive" />
                    <span className="text-sm">Destructive</span>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div className="space-y-4">
                <h4 className="font-semibold">Typography</h4>
                <div className="space-y-2">
                  <p className="text-xs">Extra Small (12px)</p>
                  <p className="text-sm">Small (14px)</p>
                  <p className="text-base">Base (16px)</p>
                  <p className="text-lg">Large (18px)</p>
                  <p className="text-xl">Extra Large (20px)</p>
                </div>
              </div>

              {/* Spacing */}
              <div className="space-y-4">
                <h4 className="font-semibold">Spacing</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-muted-foreground rounded" />
                    <span className="text-sm">XS (4px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded" />
                    <span className="text-sm">SM (8px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted-foreground rounded" />
                    <span className="text-sm">MD (16px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-muted-foreground rounded" />
                    <span className="text-sm">LG (24px)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted-foreground rounded" />
                    <span className="text-sm">XL (32px)</span>
                  </div>
                </div>
              </div>

              {/* Border Radius */}
              <div className="space-y-4">
                <h4 className="font-semibold">Border Radius</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-none" />
                    <span className="text-sm">None</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-sm" />
                    <span className="text-sm">Small</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-md" />
                    <span className="text-sm">Medium</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-lg" />
                    <span className="text-sm">Large</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-primary rounded-full" />
                    <span className="text-sm">Full</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Accessibility Showcase
export const Accessibility: Story = {
  render: () => (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">Accessibility Features</h2>
        <p className="text-muted-foreground">
          All components are built with accessibility in mind, following WCAG 2.1 AA guidelines
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="size-5 text-success" />
              Keyboard Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All interactive elements support full keyboard navigation with proper focus management.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm">Tab to focus</Button>
              <Button variant="outline" size="sm">Enter to activate</Button>
              <Button variant="outline" size="sm">Space to activate</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="size-5 text-info" />
              Screen Reader Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Proper ARIA labels, roles, and descriptions for screen reader compatibility.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" aria-label="Add new item">
                <Plus className="size-4" />
              </Button>
              <Button variant="outline" size="sm" aria-describedby="delete-description">
                <Trash2 className="size-4" />
              </Button>
              <p id="delete-description" className="text-xs text-muted-foreground">
                Permanently removes the selected item
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-warning" />
              Color Contrast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              All color combinations meet WCAG AA contrast requirements.
            </p>
            <div className="space-y-2">
              <div className="p-3 bg-primary text-primary-foreground rounded">
                Primary text on primary background
              </div>
              <div className="p-3 bg-destructive text-destructive-foreground rounded">
                Destructive text on destructive background
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="size-5 text-info" />
              Focus Indicators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Clear focus indicators for keyboard navigation and accessibility.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm">Focus me</Button>
              <Button variant="outline" size="sm">Focus me too</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Icon for the design tokens section
const Palette = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="13.5" cy="6.5" r="2.5" />
    <circle cx="17.5" cy="10.5" r="2.5" />
    <circle cx="8.5" cy="7.5" r="2.5" />
    <circle cx="6.5" cy="12.5" r="2.5" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);
