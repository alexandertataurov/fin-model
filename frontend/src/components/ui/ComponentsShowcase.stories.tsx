import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Badge } from './badge';
import { Checkbox } from './checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { Textarea } from './textarea';
import { Slider } from './slider';
import { Progress } from './progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Alert, AlertDescription } from './alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { Separator } from './separator';
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
  BarChart3
} from 'lucide-react';

const meta: Meta = {
  title: 'Design System/Components Showcase',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# FinVision Design System - Components Showcase

A comprehensive overview of all UI components available in the FinVision platform. This showcase demonstrates the design system's consistency, accessibility, and flexibility.

## Design Principles

- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG 2.1 AA compliance with keyboard navigation
- **Responsive**: Mobile-first design that scales to all devices
- **Performance**: Optimized for fast loading and smooth interactions
- **Flexibility**: Customizable variants for different use cases

## Component Categories

- **Form Elements**: Inputs, buttons, selects, and form controls
- **Feedback**: Alerts, badges, and progress indicators
- **Navigation**: Tabs, breadcrumbs, and navigation menus
- **Overlays**: Dialogs, popovers, and tooltips
- **Data Display**: Cards, tables, and data visualization components

## Usage Guidelines

Each component includes:
- Interactive examples with all variants
- Accessibility considerations
- Best practices for implementation
- Integration examples with FinVision features
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Form Elements Section
export const FormElements: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Form Elements</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Core form components for data input and user interaction
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Buttons
            </CardTitle>
            <CardDescription>
              Primary interaction elements with multiple variants and states
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Variants</h4>
              <div className="flex flex-wrap gap-2">
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

            <div className="space-y-4">
              <h4 className="font-semibold">Sizes</h4>
              <div className="flex items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">With Icons</h4>
              <div className="flex flex-wrap gap-2">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">States</h4>
              <div className="flex flex-wrap gap-2">
                <Button disabled>Disabled</Button>
                <Button>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Loading
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Inputs
            </CardTitle>
            <CardDescription>
              Text input fields with validation states and helper text
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Basic Inputs</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="text-input">Text Input</Label>
                  <Input id="text-input" placeholder="Enter text..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-input">Email Input</Label>
                  <Input id="email-input" type="email" placeholder="Enter email..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number-input">Number Input</Label>
                  <Input id="number-input" type="number" placeholder="0.00" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">With Icons</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Search</Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input type="email" placeholder="Enter email..." className="pl-10" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">States</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Error State</Label>
                  <Input placeholder="Invalid input" className="border-destructive" />
                  <p className="text-sm text-destructive">This field has an error</p>
                </div>
                <div className="space-y-2">
                  <Label>Disabled State</Label>
                  <Input placeholder="Disabled input" disabled />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Select & Checkbox */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Selection Controls
            </CardTitle>
            <CardDescription>
              Dropdown selects, checkboxes, and switches for user choices
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Select Dropdown</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Checkboxes</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms">Accept terms and conditions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="newsletter" />
                  <Label htmlFor="newsletter">Subscribe to newsletter</Label>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Switches</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Email notifications</Label>
                  <Switch id="notifications" />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode">Dark mode</Label>
                  <Switch id="dark-mode" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Textarea & Slider */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Advanced Inputs
            </CardTitle>
            <CardDescription>
              Multi-line text areas and range sliders for complex input
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Textarea</h4>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Enter a detailed description..."
                  rows={3}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Slider</h4>
              <div className="space-y-2">
                <Label>Volume: 50%</Label>
                <Slider defaultValue={[50]} max={100} step={1} />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Progress</h4>
              <div className="space-y-2">
                <Label>Upload Progress</Label>
                <Progress value={65} className="w-full" />
                <p className="text-sm text-muted-foreground">65% complete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Feedback & Navigation Section
export const FeedbackAndNavigation: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Feedback & Navigation</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Components for user feedback and navigation patterns
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Alerts & Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alerts & Badges
            </CardTitle>
            <CardDescription>
              Status indicators and notification components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Alerts</h4>
              <div className="space-y-3">
                <Alert>
                  <AlertDescription>
                    This is a default alert message for general information.
                  </AlertDescription>
                </Alert>
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    This is an error alert for important warnings.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Badges</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Tabs
            </CardTitle>
            <CardDescription>
              Tabbed navigation for organizing content sections
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-semibold mb-2">Financial Overview</h4>
                  <p className="text-sm text-muted-foreground">
                    Summary of key financial metrics and performance indicators.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="analytics" className="mt-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-semibold mb-2">Analytics Dashboard</h4>
                  <p className="text-sm text-muted-foreground">
                    Detailed analytics and trend analysis for financial data.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="reports" className="mt-4">
                <div className="p-4 border rounded-md">
                  <h4 className="font-semibold mb-2">Report Generation</h4>
                  <p className="text-sm text-muted-foreground">
                    Create and manage financial reports and documentation.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Overlays Section
export const Overlays: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Overlays & Modals</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Dialog boxes, popovers, and tooltips for enhanced user interaction
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Dialogs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Dialogs
            </CardTitle>
            <CardDescription>
              Modal dialogs for important actions and confirmations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Action</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to perform this action? This cannot be undone.
                  </DialogDescription>
                </DialogHeader>
                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button variant="destructive">Confirm</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>

        {/* Popovers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Popovers
            </CardTitle>
            <CardDescription>
              Contextual information overlays
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">User Profile</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold">John Doe</p>
                      <p className="text-sm text-muted-foreground">john.doe@company.com</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Button variant="ghost" className="w-full justify-start">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Button>
                    <Button variant="ghost" className="w-full justify-start">
                      <Bell className="mr-2 h-4 w-4" />
                      Notifications
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </CardContent>
        </Card>

        {/* Tooltips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Tooltips
            </CardTitle>
            <CardDescription>
              Hover-triggered information hints
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TooltipProvider>
              <div className="flex gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a helpful tooltip</p>
                  </TooltipContent>
                </Tooltip>
                
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">
                      <DollarSign className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Financial metrics</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Financial Components Section
export const FinancialComponents: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Financial Components</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Specialized components for financial modeling and data visualization
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Financial Cards */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Metrics
            </CardTitle>
            <CardDescription>
              Cards for displaying key financial indicators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Revenue</span>
                </div>
                <p className="text-2xl font-bold">$2.4M</p>
                <p className="text-sm text-green-600">+12.5%</p>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Profit</span>
                </div>
                <p className="text-2xl font-bold">$450K</p>
                <p className="text-sm text-green-600">+8.2%</p>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Parameter Inputs</h4>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label>Discount Rate (%)</Label>
                  <Input type="number" placeholder="10.0" step="0.1" />
                </div>
                <div className="space-y-2">
                  <Label>Growth Rate (%)</Label>
                  <Input type="number" placeholder="5.0" step="0.1" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Interactive Controls
            </CardTitle>
            <CardDescription>
              Controls for financial modeling scenarios
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Scenario Controls</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Conservative</Label>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Moderate</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Aggressive</Label>
                  <Switch />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Time Period</h4>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1y">1 Year</SelectItem>
                  <SelectItem value="3y">3 Years</SelectItem>
                  <SelectItem value="5y">5 Years</SelectItem>
                  <SelectItem value="10y">10 Years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Confidence Level</h4>
              <Slider defaultValue={[80]} max={100} step={5} />
              <p className="text-sm text-muted-foreground">80% confidence interval</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Usage Examples Section
export const UsageExamples: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Usage Examples</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Real-world examples of how components work together in FinVision
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Login Form Example */}
        <Card>
          <CardHeader>
            <CardTitle>Login Form</CardTitle>
            <CardDescription>
              Complete authentication form using multiple components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="login-email" type="email" placeholder="Enter email" className="pl-10" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <div className="relative">
                <Input id="login-password" type="password" placeholder="Enter password" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember" className="text-sm">Remember me</Label>
              </div>
              <Button variant="link" className="text-sm p-0 h-auto">
                Forgot password?
              </Button>
            </div>
            <Button className="w-full">Sign In</Button>
          </CardContent>
        </Card>

        {/* Dashboard Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Widget</CardTitle>
            <CardDescription>
              Financial metrics widget with interactive elements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Portfolio Value</p>
                <p className="text-2xl font-bold">$1,234,567</p>
                <p className="text-sm text-green-600">+2.3% today</p>
              </div>
              <Badge variant="success">Active</Badge>
            </div>
            <Separator />
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <BarChart3 className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
