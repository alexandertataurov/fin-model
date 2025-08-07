import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './card';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Checkbox } from './checkbox';
import { Switch } from './switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import { Alert, AlertDescription } from './alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { Separator } from './separator';
import {
  Plus,
  Download,
  Trash2,
  Edit,
  Search,
  Mail,
  Settings,
  User,
  Bell,
  DollarSign,
  TrendingUp,
  BarChart3,
  FileText,
  Calendar,
} from 'lucide-react';

const meta: Meta = {
  title: '📚 Quick Reference',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: 'Essential patterns, best practices, and quick solutions for common UI challenges in financial applications.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Component Overview
export const ComponentOverview: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Component Quick Reference</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Essential components and their key properties for rapid development
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Elements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Form Elements
            </CardTitle>
            <CardDescription>
              Core input and interaction components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Button Variants</h4>
              <div className="flex flex-wrap gap-2">
                <Button size="sm">Default</Button>
                <Button variant="secondary" size="sm">
                  Secondary
                </Button>
                <Button variant="outline" size="sm">
                  Outline
                </Button>
                <Button variant="ghost" size="sm">
                  Ghost
                </Button>
                <Button variant="destructive" size="sm">
                  Destructive
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Props: variant, size, disabled, asChild
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Input Types</h4>
              <div className="space-y-2">
                <Input placeholder="Text input" />
                <Input type="email" placeholder="Email input" />
                <Input type="number" placeholder="Number input" />
              </div>
              <p className="text-xs text-muted-foreground">
                Props: type, placeholder, disabled, error, helperText
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Selection Controls</h4>
              <div className="flex items-center gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="checkbox" />
                  <label htmlFor="checkbox" className="text-sm">
                    Checkbox
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch id="switch" />
                  <label htmlFor="switch" className="text-sm">
                    Switch
                  </label>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Components */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Feedback & Status
            </CardTitle>
            <CardDescription>
              Status indicators and user feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Badge Variants</h4>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Alerts</h4>
              <div className="space-y-2">
                <Alert>
                  <AlertDescription>Default alert message</AlertDescription>
                </Alert>
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertDescription className="text-destructive">
                    Error alert message
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Navigation
            </CardTitle>
            <CardDescription>
              Navigation and content organization
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Tabs</h4>
              <Tabs defaultValue="tab1" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                  <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                  <TabsTrigger value="tab3">Tab 3</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1" className="mt-2">
                  <p className="text-sm">Tab content 1</p>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Select Dropdown</h4>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option 1</SelectItem>
                  <SelectItem value="option2">Option 2</SelectItem>
                  <SelectItem value="option3">Option 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Overlays */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Overlays & Modals
            </CardTitle>
            <CardDescription>
              Dialog boxes and contextual overlays
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Dialog</h4>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                      Dialog description text
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Popover</h4>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    Open Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Popover Content</h4>
                    <p className="text-sm text-muted-foreground">
                      Contextual information
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Tooltip</h4>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">
                      Hover me
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tooltip content</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Component Properties
export const ComponentProperties: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Component Properties</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Key properties and variants for each component
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Button Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Button Component</CardTitle>
            <CardDescription>Primary interaction component</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Variants</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>default</code> - Primary button style
                </p>
                <p>
                  <code>secondary</code> - Secondary button style
                </p>
                <p>
                  <code>outline</code> - Outlined button style
                </p>
                <p>
                  <code>ghost</code> - Ghost button style
                </p>
                <p>
                  <code>link</code> - Link button style
                </p>
                <p>
                  <code>destructive</code> - Destructive action style
                </p>
                <p>
                  <code>success</code> - Success action style
                </p>
                <p>
                  <code>warning</code> - Warning action style
                </p>
                <p>
                  <code>info</code> - Info action style
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Sizes</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>sm</code> - Small button
                </p>
                <p>
                  <code>default</code> - Default size
                </p>
                <p>
                  <code>lg</code> - Large button
                </p>
                <p>
                  <code>icon</code> - Icon-only button
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Common Props</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>disabled</code> - Disable button interaction
                </p>
                <p>
                  <code>asChild</code> - Render as child element
                </p>
                <p>
                  <code>onClick</code> - Click handler
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Input Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Input Component</CardTitle>
            <CardDescription>Text input fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Types</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>text</code> - Default text input
                </p>
                <p>
                  <code>email</code> - Email input
                </p>
                <p>
                  <code>password</code> - Password input
                </p>
                <p>
                  <code>number</code> - Number input
                </p>
                <p>
                  <code>search</code> - Search input
                </p>
                <p>
                  <code>tel</code> - Telephone input
                </p>
                <p>
                  <code>url</code> - URL input
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Common Props</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>placeholder</code> - Placeholder text
                </p>
                <p>
                  <code>disabled</code> - Disable input
                </p>
                <p>
                  <code>error</code> - Show error state
                </p>
                <p>
                  <code>helperText</code> - Helper text below input
                </p>
                <p>
                  <code>value</code> - Controlled value
                </p>
                <p>
                  <code>onChange</code> - Change handler
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Badge Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Badge Component</CardTitle>
            <CardDescription>Status indicators and labels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Variants</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>default</code> - Default badge style
                </p>
                <p>
                  <code>secondary</code> - Secondary badge style
                </p>
                <p>
                  <code>outline</code> - Outlined badge style
                </p>
                <p>
                  <code>destructive</code> - Destructive badge style
                </p>
                <p>
                  <code>success</code> - Success badge style
                </p>
                <p>
                  <code>warning</code> - Warning badge style
                </p>
                <p>
                  <code>info</code> - Info badge style
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Common Props</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>children</code> - Badge content
                </p>
                <p>
                  <code>className</code> - Additional CSS classes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Card Component</CardTitle>
            <CardDescription>Content containers and panels</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Subcomponents</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>CardHeader</code> - Card header section
                </p>
                <p>
                  <code>CardTitle</code> - Card title
                </p>
                <p>
                  <code>CardDescription</code> - Card description
                </p>
                <p>
                  <code>CardContent</code> - Card content area
                </p>
                <p>
                  <code>CardFooter</code> - Card footer section
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold">Common Props</h4>
              <div className="text-sm space-y-1">
                <p>
                  <code>className</code> - Additional CSS classes
                </p>
                <p>
                  <code>children</code> - Card content
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};

// Usage Patterns
export const UsagePatterns: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Common Usage Patterns</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Typical component combinations and layouts
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Pattern */}
        <Card>
          <CardHeader>
            <CardTitle>Form Pattern</CardTitle>
            <CardDescription>
              Standard form layout with validation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="Enter email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input type="password" placeholder="Enter password" />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <label htmlFor="terms" className="text-sm">
                Accept terms
              </label>
            </div>
            <Button className="w-full">Submit</Button>
          </CardContent>
        </Card>

        {/* Dashboard Widget */}
        <Card>
          <CardHeader>
            <CardTitle>Dashboard Widget</CardTitle>
            <CardDescription>Financial metrics display</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Revenue</p>
                <p className="text-2xl font-bold">$2.4M</p>
                <p className="text-sm text-green-600">+12.5%</p>
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

        {/* Settings Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Settings Panel</CardTitle>
            <CardDescription>Configuration interface</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Email notifications
                </label>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Dark mode</label>
                <Switch />
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <label className="text-sm font-medium">Language</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Data Table Header */}
        <Card>
          <CardHeader>
            <CardTitle>Data Table Header</CardTitle>
            <CardDescription>Table controls and actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Input placeholder="Search..." className="w-64" />
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex gap-2">
                <Button size="sm">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">25 items</Badge>
              <Badge variant="outline">Filtered</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  ),
};
