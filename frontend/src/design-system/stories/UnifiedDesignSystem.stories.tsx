import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { DesignSystemProvider } from '../provider';
import { 
  Button, 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  Input,
  Label,
  Badge,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
  Separator,
  Skeleton,
  Alert,
  AlertDescription,
  AlertTitle,
  Checkbox,
  Textarea,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from '../index';
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
  Check,
  ChevronDown,
} from 'lucide-react';

const meta: Meta = {
  title: '🎨 Unified Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# Unified Design System

A comprehensive, unified design system that consolidates all components into one cohesive system. This system provides:

## Key Features

- **🎨 Unified Components**: All components in one place with consistent APIs
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

## Component Categories

- **Core Components**: Button, Card, Input, Label, Badge
- **Form Components**: Form, Checkbox, Textarea, Select, Switch
- **Feedback Components**: Alert, Dialog, Toast
- **Layout Components**: Separator, Skeleton
- **Navigation Components**: Tabs, Breadcrumb, Pagination
- **Data Display**: Table, Chart, Progress
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

export const Overview: Story = {
  render: () => {
    const form = useForm({
      defaultValues: {
        email: '',
        password: '',
        remember: false,
        notifications: true,
        role: '',
      },
    });

    return (
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Unified Design System</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A comprehensive design system that consolidates all components into one cohesive, 
            accessible, and performant system for building financial applications.
          </p>
        </div>

        {/* Core Components Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold">Core Components</h2>
          
          {/* Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>Primary interaction components with multiple variants</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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
                <Button size="sm">Small</Button>
                <Button size="md">Medium</Button>
                <Button size="lg">Large</Button>
                <Button size="xl">Extra Large</Button>
              </div>
              <div className="flex flex-wrap gap-4">
                <Button leftIcon={<Plus />}>With Left Icon</Button>
                <Button rightIcon={<ChevronDown />}>With Right Icon</Button>
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </CardContent>
          </Card>

          {/* Cards */}
          <Card>
            <CardHeader>
              <CardTitle>Cards</CardTitle>
              <CardDescription>Container components for organizing content</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card variant="default">
                <CardHeader>
                  <CardTitle>Default Card</CardTitle>
                  <CardDescription>Standard card with default styling</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This is the default card variant with standard padding and styling.</p>
                </CardContent>
              </Card>
              
              <Card variant="elevated">
                <CardHeader>
                  <CardTitle>Elevated Card</CardTitle>
                  <CardDescription>Card with enhanced shadow and hover effects</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card has enhanced shadows and hover effects for better visual hierarchy.</p>
                </CardContent>
              </Card>
              
              <Card variant="outline">
                <CardHeader>
                  <CardTitle>Outline Card</CardTitle>
                  <CardDescription>Card with transparent background and border</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>This card has a transparent background with a visible border.</p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>

          {/* Form Components */}
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>Input, labels, and form controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter your password" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Enter a description..."
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Settings</Label>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="remember" />
                      <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="notifications" />
                      <Label htmlFor="notifications">Enable notifications</Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feedback Components */}
          <Card>
            <CardHeader>
              <CardTitle>Feedback Components</CardTitle>
              <CardDescription>Alerts, badges, and status indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>Information</AlertTitle>
                  <AlertDescription>
                    This is an informational alert with default styling.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="success">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your changes have been saved successfully.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="warning">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Warning</AlertTitle>
                  <AlertDescription>
                    Please review your input before proceeding.
                  </AlertDescription>
                </Alert>
                
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    There was an error processing your request.
                  </AlertDescription>
                </Alert>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="info">Info</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Layout Components */}
          <Card>
            <CardHeader>
              <CardTitle>Layout Components</CardTitle>
              <CardDescription>Separators, skeletons, and layout helpers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <p>Content above separator</p>
                <Separator />
                <p>Content below separator</p>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Loading States</h4>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-4 w-[300px]" />
                </div>
                <div className="flex space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[150px]" />
                    <Skeleton className="h-4 w-[100px]" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interactive Demo */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive Demo</CardTitle>
              <CardDescription>Try out the components interactively</CardDescription>
            </CardHeader>
            <CardContent>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Design System Demo</DialogTitle>
                    <DialogDescription>
                      This dialog demonstrates the unified design system components in action.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="demo-input">Demo Input</Label>
                      <Input id="demo-input" placeholder="Try typing here..." />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="demo-switch" />
                      <Label htmlFor="demo-switch">Demo Switch</Label>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="success">Success</Badge>
                      <Badge variant="warning">Warning</Badge>
                      <Badge variant="info">Info</Badge>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </section>
      </div>
    );
  },
};
