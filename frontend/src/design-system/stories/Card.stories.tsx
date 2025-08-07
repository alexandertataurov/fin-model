import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { Separator } from '../components/Separator';
import { 
  CreditCard, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Calendar,
  Star,
  Heart,
  Share2,
  MoreHorizontal,
  ArrowRight,
  Download,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';

const meta: Meta<typeof Card> = {
  title: '🎨 Design System/Components/Card',
  component: Card,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Card Component

A flexible card component that provides a foundation for displaying content in organized, visually appealing containers. The Card component supports multiple variants and compositions for various use cases.

## Key Features

- **🎨 Multiple Variants**: Default, elevated, outline, ghost, and interactive variants
- **📏 Flexible Padding**: None, SM, MD, LG, XL padding options
- **🧩 Composition**: Header, content, footer with independent styling
- **🎯 Interactive**: Hover and focus states for clickable cards
- **♿ Accessibility**: Proper semantic structure and keyboard navigation
- **🎭 Design System**: Consistent with design tokens and theming

## Usage

\`\`\`tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/design-system';

// Basic card
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>

// Interactive card
<Card variant="interactive" onClick={handleClick}>
  <CardContent>
    <p>Clickable card content</p>
  </CardContent>
</Card>

// Elevated card with custom padding
<Card variant="elevated" padding="lg">
  <CardContent>
    <p>Card with large padding</p>
  </CardContent>
</Card>
\`\`\`

## Design Principles

1. **Consistency**: All cards follow the same design patterns
2. **Clarity**: Clear content hierarchy and readable layout
3. **Flexibility**: Adaptable to different content types and layouts
4. **Accessibility**: Proper semantic structure and navigation
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'outline', 'ghost', 'interactive'],
      description: 'The visual variant of the card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The padding size of the card',
    },
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Card
export const Default: Story = {
  args: {
    variant: 'default',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>
          A basic card with default styling and medium padding.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          This is the default card variant with standard styling. It provides a clean,
          professional appearance suitable for most content display needs.
        </p>
      </CardContent>
    </Card>
  ),
};

// Elevated Card
export const Elevated: Story = {
  args: {
    variant: 'elevated',
    padding: 'lg',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>
          A card with enhanced shadow and hover effects.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The elevated variant adds more visual depth with enhanced shadows and
          hover effects, making it perfect for important content or interactive elements.
        </p>
      </CardContent>
    </Card>
  ),
};

// Outline Card
export const Outline: Story = {
  args: {
    variant: 'outline',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Outline Card</CardTitle>
        <CardDescription>
          A card with transparent background and border styling.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The outline variant uses a transparent background with a subtle border,
          creating a lighter visual appearance while maintaining structure.
        </p>
      </CardContent>
    </Card>
  ),
};

// Interactive Card
export const Interactive: Story = {
  args: {
    variant: 'interactive',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args} onClick={() => alert('Card clicked!')}>
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>
          Click this card to see the interactive behavior.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Interactive cards provide visual feedback on hover and focus,
          making them perfect for clickable content areas.
        </p>
      </CardContent>
    </Card>
  ),
};

// Ghost Card
export const Ghost: Story = {
  args: {
    variant: 'ghost',
    padding: 'md',
  },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Ghost Card</CardTitle>
        <CardDescription>
          A minimal card with no background or border.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The ghost variant removes all visual styling, providing maximum
          flexibility for custom styling while maintaining the card structure.
        </p>
      </CardContent>
    </Card>
  ),
};

// Padding Variants
export const PaddingVariants: Story = {
  render: () => (
    <div className="grid gap-4">
      <Card variant="outline" padding="none">
        <CardContent>
          <p className="text-sm">No padding</p>
        </CardContent>
      </Card>
      
      <Card variant="outline" padding="sm">
        <CardContent>
          <p className="text-sm">Small padding</p>
        </CardContent>
      </Card>
      
      <Card variant="outline" padding="md">
        <CardContent>
          <p className="text-sm">Medium padding (default)</p>
        </CardContent>
      </Card>
      
      <Card variant="outline" padding="lg">
        <CardContent>
          <p className="text-sm">Large padding</p>
        </CardContent>
      </Card>
      
      <Card variant="outline" padding="xl">
        <CardContent>
          <p className="text-sm">Extra large padding</p>
        </CardContent>
      </Card>
    </div>
  ),
};

// Financial Dashboard Card
export const FinancialDashboard: Story = {
  render: () => (
    <Card variant="elevated" className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <DollarSign className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Revenue</CardTitle>
              <CardDescription>Monthly performance</CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold">$45,231</span>
            <Badge variant="success" className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3" />
              +20.1%
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            +$2,350 from last month
          </p>
          <Separator />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Target</span>
            <span className="font-medium">$50,000</span>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

// User Profile Card
export const UserProfile: Story = {
  render: () => (
    <Card variant="outline" className="w-full max-w-sm">
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center mb-4">
          <Users className="h-8 w-8 text-white" />
        </div>
        <CardTitle>John Doe</CardTitle>
        <CardDescription>Senior Financial Analyst</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Department</span>
          <span>Finance</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Location</span>
          <span>New York</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Experience</span>
          <span>5 years</span>
        </div>
        <Separator />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
};

// Action Card
export const ActionCard: Story = {
  render: () => (
    <Card variant="interactive" className="w-full max-w-md cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Manage your payment options</CardDescription>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Add, remove, or update your payment methods for seamless transactions.
        </p>
      </CardContent>
    </Card>
  ),
};

// Stats Card
export const StatsCard: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card variant="elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">$45,231</p>
            </div>
            <div className="p-2 bg-green-100 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card variant="elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">2,350</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-4 w-4 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card variant="elevated">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
              <p className="text-2xl font-bold">3.24%</p>
            </div>
            <div className="p-2 bg-purple-100 rounded-lg">
              <BarChart3 className="h-4 w-4 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};

// Complex Card with Actions
export const ComplexCard: Story = {
  render: () => (
    <Card variant="elevated" className="w-full max-w-lg">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>Financial Report Q4 2023</CardTitle>
            <CardDescription>
              Comprehensive analysis of quarterly performance and projections
            </CardDescription>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon">
              <Star className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Created:</span>
            <span>Dec 15, 2023</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">Views:</span>
            <span>1,234</span>
          </div>
        </div>
        
        <p className="text-sm text-muted-foreground">
          This report provides detailed insights into our Q4 performance, including
          revenue growth, market trends, and strategic recommendations for the upcoming year.
        </p>
        
        <div className="flex items-center gap-2">
          <Badge variant="default">Finance</Badge>
          <Badge variant="secondary">Q4</Badge>
          <Badge variant="outline">Analysis</Badge>
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="text-sm">
              <p className="font-medium">Sarah Johnson</p>
              <p className="text-muted-foreground">Lead Analyst</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-3 w-3 mr-1" />
              Download
            </Button>
            <Button size="sm">
              <Eye className="h-3 w-3 mr-1" />
              View Report
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};
