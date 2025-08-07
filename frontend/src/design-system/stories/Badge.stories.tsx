import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Badge } from '../components/Badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  Clock, 
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Calendar,
  Tag,
  Hash,
  Percent,
  Award,
  Zap,
  Shield,
  Heart,
  Eye,
  Download,
} from 'lucide-react';

const meta: Meta<typeof Badge> = {
  title: '🎨 Design System/Components/Badge',
  component: Badge,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Badge Component

A versatile badge component for displaying status, labels, and notifications. The Badge component provides consistent styling and semantic meaning across different use cases.

## Key Features

- **🎨 Multiple Variants**: Default, secondary, outline, destructive, and semantic variants
- **📏 Flexible Sizing**: Different sizes for various contexts
- **🎯 Semantic Colors**: Status-based colors for different meanings
- **♿ Accessibility**: Proper ARIA labels and screen reader support
- **🎭 Design System**: Consistent with design tokens and theming
- **🧩 Composition**: Works well with icons and other components

## Usage

\`\`\`tsx
import { Badge } from '@/design-system';

// Basic badge
<Badge>New</Badge>

// With variants
<Badge variant="destructive">Error</Badge>
<Badge variant="success">Success</Badge>

// With icons
<Badge variant="outline">
  <CheckCircle className="h-3 w-3 mr-1" />
  Completed
</Badge>

// With different sizes
<Badge size="sm">Small</Badge>
<Badge size="lg">Large</Badge>
\`\`\`

## Design Principles

1. **Consistency**: All badges follow the same design patterns
2. **Clarity**: Clear visual hierarchy and readable text
3. **Semantic**: Colors and icons convey meaning
4. **Accessibility**: Inclusive design for all users
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'destructive', 'success', 'warning', 'info'],
      description: 'The visual variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge',
    },
    children: {
      control: 'text',
      description: 'The content of the badge',
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

// Basic Badge
export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

// Badge Variants
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

// Badge Sizes
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

// Badge with Icons
export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success">
        <CheckCircle className="h-3 w-3 mr-1" />
        Completed
      </Badge>
      <Badge variant="warning">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Warning
      </Badge>
      <Badge variant="info">
        <Info className="h-3 w-3 mr-1" />
        Info
      </Badge>
      <Badge variant="destructive">
        <XCircle className="h-3 w-3 mr-1" />
        Error
      </Badge>
      <Badge variant="outline">
        <Clock className="h-3 w-3 mr-1" />
        Pending
      </Badge>
      <Badge variant="secondary">
        <Star className="h-3 w-3 mr-1" />
        Featured
      </Badge>
    </div>
  ),
};

// Status Badges
export const StatusBadges: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
        <Badge variant="warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Inactive
        </Badge>
        <Badge variant="info">
          <Info className="h-3 w-3 mr-1" />
          Draft
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Badge variant="success">
          <TrendingUp className="h-3 w-3 mr-1" />
          Growing
        </Badge>
        <Badge variant="destructive">
          <TrendingDown className="h-3 w-3 mr-1" />
          Declining
        </Badge>
        <Badge variant="outline">
          <Zap className="h-3 w-3 mr-1" />
          Trending
        </Badge>
      </div>
    </div>
  ),
};

// Financial Badges
export const FinancialBadges: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Financial Status</CardTitle>
        <CardDescription>Current financial indicators</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Revenue</span>
          <Badge variant="success">
            <TrendingUp className="h-3 w-3 mr-1" />
            +15.2%
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Profit Margin</span>
          <Badge variant="info">
            <Percent className="h-3 w-3 mr-1" />
            23.5%
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Market Cap</span>
          <Badge variant="outline">
            <DollarSign className="h-3 w-3 mr-1" />
            $2.4B
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Risk Level</span>
          <Badge variant="warning">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Medium
          </Badge>
        </div>
      </CardContent>
    </Card>
  ),
};

// User Status Badges
export const UserStatusBadges: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-muted-foreground">john@example.com</p>
          </div>
        </div>
        <Badge variant="success">
          <CheckCircle className="h-3 w-3 mr-1" />
          Active
        </Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Jane Smith</p>
            <p className="text-xs text-muted-foreground">jane@example.com</p>
          </div>
        </div>
        <Badge variant="warning">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Bob Johnson</p>
            <p className="text-xs text-muted-foreground">bob@example.com</p>
          </div>
        </div>
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          Suspended
        </Badge>
      </div>
    </div>
  ),
};

// Notification Badges
export const NotificationBadges: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button variant="outline" size="icon" className="relative">
        <Heart className="h-4 w-4" />
        <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1">
          3
        </Badge>
      </Button>
      
      <Button variant="outline" size="icon" className="relative">
        <Eye className="h-4 w-4" />
        <Badge variant="info" size="sm" className="absolute -top-1 -right-1">
          12
        </Badge>
      </Button>
      
      <Button variant="outline" size="icon" className="relative">
        <Download className="h-4 w-4" />
        <Badge variant="success" size="sm" className="absolute -top-1 -right-1">
          New
        </Badge>
      </Button>
      
      <Button variant="outline" size="icon" className="relative">
        <Award className="h-4 w-4" />
        <Badge variant="warning" size="sm" className="absolute -top-1 -right-1">
          !
        </Badge>
      </Button>
    </div>
  ),
};

// Tag Badges
export const TagBadges: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-2">Categories</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            <Tag className="h-3 w-3 mr-1" />
            Finance
          </Badge>
          <Badge variant="outline">
            <Tag className="h-3 w-3 mr-1" />
            Technology
          </Badge>
          <Badge variant="outline">
            <Tag className="h-3 w-3 mr-1" />
            Healthcare
          </Badge>
          <Badge variant="outline">
            <Tag className="h-3 w-3 mr-1" />
            Education
          </Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Priority</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="destructive">High</Badge>
          <Badge variant="warning">Medium</Badge>
          <Badge variant="success">Low</Badge>
        </div>
      </div>
      
      <div>
        <h4 className="text-sm font-medium mb-2">Type</h4>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            <Hash className="h-3 w-3 mr-1" />
            Bug
          </Badge>
          <Badge variant="secondary">
            <Hash className="h-3 w-3 mr-1" />
            Feature
          </Badge>
          <Badge variant="secondary">
            <Hash className="h-3 w-3 mr-1" />
            Enhancement
          </Badge>
        </div>
      </div>
    </div>
  ),
};

// Interactive Badges
export const InteractiveBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge 
        variant="outline" 
        className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
        onClick={() => alert('Badge clicked!')}
      >
        Clickable
      </Badge>
      
      <Badge 
        variant="secondary" 
        className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
        onClick={() => alert('Remove badge!')}
      >
        <XCircle className="h-3 w-3 mr-1" />
        Remove
      </Badge>
      
      <Badge 
        variant="outline" 
        className="cursor-pointer hover:bg-success hover:text-success-foreground transition-colors"
        onClick={() => alert('Approve!')}
      >
        <CheckCircle className="h-3 w-3 mr-1" />
        Approve
      </Badge>
    </div>
  ),
};

// Complex Badge Examples
export const ComplexExamples: Story = {
  render: () => (
    <div className="space-y-6">
      {/* Project Status */}
      <Card>
        <CardHeader>
          <CardTitle>Project Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm">Frontend Development</span>
            <Badge variant="success">
              <CheckCircle className="h-3 w-3 mr-1" />
              Complete
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Backend API</span>
            <Badge variant="warning">
              <Clock className="h-3 w-3 mr-1" />
              In Progress
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Testing</span>
            <Badge variant="info">
              <Info className="h-3 w-3 mr-1" />
              Pending
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Deployment</span>
            <Badge variant="outline">
              <Calendar className="h-3 w-3 mr-1" />
              Scheduled
            </Badge>
          </div>
        </CardContent>
      </Card>
      
      {/* Financial Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Metrics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Revenue Growth</p>
              <Badge variant="success" size="lg">
                <TrendingUp className="h-4 w-4 mr-1" />
                +23.5%
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Profit Margin</p>
              <Badge variant="info" size="lg">
                <Percent className="h-4 w-4 mr-1" />
                18.2%
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Market Share</p>
              <Badge variant="warning" size="lg">
                <Shield className="h-4 w-4 mr-1" />
                12.8%
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Customer Satisfaction</p>
              <Badge variant="success" size="lg">
                <Star className="h-4 w-4 mr-1" />
                4.8/5
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  ),
};
