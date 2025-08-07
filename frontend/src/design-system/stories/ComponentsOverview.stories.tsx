import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DesignSystemProvider } from '../provider';
import { Button } from '../components/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../components/Card';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { Badge } from '../components/Badge';
import { Switch } from '../components/Switch';
import { Separator } from '../components/Separator';
import { Skeleton } from '../components/Skeleton';
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
  ArrowRight,
  ArrowLeft,
  Play,
  Pause,
  CreditCard,
  Users,
  Star,
  Heart,
  Share2,
  MoreHorizontal,
  ArrowRight,
  Download,
  Eye,
  Edit,
  Trash2,
  Globe,
  Phone,
  MapPin,
  Percent,
  Hash,
  AtSign,
  FileText,
  ChevronDown,
  Award,
  Building,
  Shield,
  Activity,
  Target,
  Zap,
  Moon,
  Wifi,
  Volume2,
  VolumeX,
  Smartphone,
  Monitor,
  Unlock,
  XCircle,
} from 'lucide-react';

const meta: Meta = {
  title: '🎨 Design System/Components Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Design System Components Overview

A comprehensive showcase of all available components in the FinVision design system. This overview demonstrates the consistency, flexibility, and accessibility of our component library.

## Component Categories

- **🎯 Core Components**: Button, Card, Input, Label, Badge
- **🔄 Interactive Components**: Switch, Select, Dialog
- **📊 Data Display**: Charts, Tables, Progress indicators
- **🧩 Layout Components**: Separator, Skeleton, Navigation
- **🎨 Feedback Components**: Alerts, Toasts, Notifications

## Design Principles

1. **Consistency**: All components follow unified design patterns
2. **Accessibility**: WCAG 2.1 AA compliant with full keyboard navigation
3. **Flexibility**: Customizable through props and design tokens
4. **Performance**: Optimized rendering and minimal bundle impact
5. **Responsive**: Mobile-first design with adaptive layouts
        `,
      },
    },
  },
  decorators: [
    Story => (
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

// Complete Component Showcase
export const CompleteShowcase: Story = {
  render: () => (
    <div className="max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Design System Components
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          A comprehensive showcase of all available components in the FinVision
          design system.
        </p>
      </div>

      {/* Buttons Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Buttons</h2>
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>
              Different button styles for various use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="success">Success</Button>
              <Button variant="warning">Warning</Button>
              <Button variant="info">Info</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button size="xs">Extra Small</Button>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button leftIcon={<Plus />}>With Left Icon</Button>
              <Button rightIcon={<ArrowRight />}>With Right Icon</Button>
              <Button loading>Loading</Button>
              <Button disabled>Disabled</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Cards Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
              <CardDescription>Basic card with default styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This is a default card with standard styling and content.
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
              <CardDescription>Card with enhanced shadow</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Elevated cards have more visual depth and prominence.
              </p>
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle>Outline Card</CardTitle>
              <CardDescription>Card with border styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Outline cards use transparent backgrounds with borders.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Form Components Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Form Components</h2>
        <Card>
          <CardHeader>
            <CardTitle>Input Fields</CardTitle>
            <CardDescription>Various input types and states</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="basic-input">Basic Input</Label>
                <Input id="basic-input" placeholder="Enter text here" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email-input">Email Input</Label>
                <Input
                  id="email-input"
                  type="email"
                  placeholder="Enter email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="search-input">Search Input</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-input"
                    className="pl-10"
                    placeholder="Search..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="error-input">Error Input</Label>
                <Input
                  id="error-input"
                  error
                  placeholder="This input has an error"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Badges Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Badges</h2>
        <Card>
          <CardHeader>
            <CardTitle>Badge Variants</CardTitle>
            <CardDescription>
              Different badge styles and use cases
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
              <Badge size="lg">Large</Badge>
            </div>

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
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Switches Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Switches</h2>
        <Card>
          <CardHeader>
            <CardTitle>Switch Examples</CardTitle>
            <CardDescription>
              Toggle switches for various settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <Label htmlFor="notifications">Push notifications</Label>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Moon className="h-4 w-4" />
                <Label htmlFor="dark-mode">Dark mode</Label>
              </div>
              <Switch id="dark-mode" />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <Label htmlFor="security">Two-factor authentication</Label>
              </div>
              <Switch id="security" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Wifi className="h-4 w-4" />
                <Label htmlFor="wifi-only">Wi-Fi only</Label>
              </div>
              <Switch id="wifi-only" />
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Utility Components Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Utility Components</h2>
        <Card>
          <CardHeader>
            <CardTitle>Separators & Skeletons</CardTitle>
            <CardDescription>Layout and loading components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <p>Content above separator</p>
              <Separator />
              <p>Content below separator</p>
            </div>

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Skeleton Loading States</h4>
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
              <div className="flex space-x-2">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Financial Dashboard Example */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Financial Dashboard Example</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card variant="elevated">
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
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Active Users</CardTitle>
                    <CardDescription>Current month</CardDescription>
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
                  <span className="text-2xl font-bold">2,350</span>
                  <Badge variant="info" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +12.5%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  +180 from last month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <BarChart3 className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Conversion Rate</CardTitle>
                    <CardDescription>This month</CardDescription>
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
                  <span className="text-2xl font-bold">3.24%</span>
                  <Badge variant="warning" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    +0.5%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  +0.1% from last month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Settings Panel Example */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold">Settings Panel Example</h2>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>
              Manage your account preferences and security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Profile Information</h4>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    defaultValue="John Doe"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="john@example.com"
                    className="col-span-3"
                  />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Notifications</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Bell className="h-4 w-4" />
                    <Label htmlFor="push-notifications">
                      Push notifications
                    </Label>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <Label htmlFor="email-notifications">
                      Email notifications
                    </Label>
                  </div>
                  <Switch id="email-notifications" />
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="text-sm font-medium">Security</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <Label htmlFor="two-factor">
                      Two-factor authentication
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="two-factor" defaultChecked />
                    <Badge variant="success">Enabled</Badge>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-4 w-4" />
                    <Label htmlFor="auto-lock">Auto-lock after 5 minutes</Label>
                  </div>
                  <Switch id="auto-lock" />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="text-center py-8 border-t">
        <p className="text-muted-foreground">
          FinVision Design System - Built with accessibility and performance in
          mind
        </p>
      </footer>
    </div>
  ),
};
