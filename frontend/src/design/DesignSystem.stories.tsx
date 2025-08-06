import type { Meta, StoryObj } from '@storybook/react';
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Badge,
  Alert,
  AlertDescription,
  AlertTitle,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Progress,
  Skeleton,
  Separator,
  Textarea,
  Checkbox,
  Slider,
  Switch,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  EnhancedCard,
  EnhancedButton,
  TextField,
  MultiSelect,
} from './components/ui';
import { Plus, Download, Trash2, Edit, User, Settings, Bell } from 'lucide-react';

const meta: Meta = {
  title: 'Design System/Overview',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
# FinVision Design System

A comprehensive design system built with React, TypeScript, and Tailwind CSS. This system provides consistent, accessible, and reusable components for the FinVision financial modeling platform.

## Design Principles

- **Consistency**: Unified visual language across all components
- **Accessibility**: WCAG 2.1 AA compliant components
- **Flexibility**: Customizable variants and themes
- **Performance**: Optimized for production use
- **Developer Experience**: Type-safe props and comprehensive documentation

## Component Categories

1. **Foundation**: Basic building blocks (Button, Input, Label)
2. **Layout**: Structural components (Card, Tabs, Accordion)
3. **Navigation**: Interactive navigation elements
4. **Feedback**: User feedback components (Alert, Toast, Progress)
5. **Data Display**: Data presentation components (Table, Badge, Avatar)
6. **Overlay**: Modal and popup components (Dialog, Popover, Tooltip)
7. **Enhanced**: Advanced components with additional features
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Foundation: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Foundation Components</h2>
        
        {/* Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Buttons</h3>
          <div className="flex gap-4 flex-wrap">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="success">Success</Button>
            <Button variant="warning">Warning</Button>
            <Button variant="info">Info</Button>
          </div>
          <div className="flex gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Inputs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="Enter password" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="textarea">Description</Label>
              <Textarea id="textarea" placeholder="Enter description" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="select">Category</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="operations">Operations</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Form Controls */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Form Controls</h3>
          <div className="flex gap-6 items-center">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" />
              <Label htmlFor="terms">Accept terms</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">Notifications</Label>
            </div>
            <div className="w-48">
              <Label>Volume</Label>
              <Slider defaultValue={[50]} max={100} step={1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Layout: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Layout Components</h2>
        
        {/* Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>Simple card with content</CardDescription>
              </CardHeader>
              <CardContent>
                <p>This is a basic card component with header and content.</p>
              </CardContent>
            </Card>
            
            <EnhancedCard>
              <CardHeader>
                <CardTitle>Enhanced Card</CardTitle>
                <CardDescription>Card with additional features</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Enhanced card with better styling and interactions.</p>
              </CardContent>
            </EnhancedCard>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Click to interact</CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Tabs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tabs</h3>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>This is the overview tab content.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="analytics" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Analytics data and charts would go here.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reports" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Generated reports and exports.</p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Configuration and preferences.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <Separator className="my-6" />

        {/* Accordion */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Accordion</h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What is FinVision?</AccordionTrigger>
              <AccordionContent>
                FinVision is a comprehensive financial modeling platform that helps businesses
                create, analyze, and share financial models with advanced analytics and reporting.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I get started?</AccordionTrigger>
              <AccordionContent>
                Start by uploading your financial data, then use our modeling tools to create
                scenarios and generate reports. Our platform guides you through each step.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What file formats are supported?</AccordionTrigger>
              <AccordionContent>
                We support Excel (.xlsx, .xls), CSV, and JSON formats. Our platform can handle
                complex financial data structures and automatically validate your inputs.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  ),
};

export const Feedback: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Feedback Components</h2>
        
        {/* Alerts */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Alerts</h3>
          <div className="space-y-4">
            <Alert>
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                This is an informational alert for general updates.
              </AlertDescription>
            </Alert>
            <Alert className="border-destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                This is an error alert for critical issues.
              </AlertDescription>
            </Alert>
            <Alert className="border-green-500 bg-green-50">
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                This is a success alert for completed actions.
              </AlertDescription>
            </Alert>
            <Alert className="border-yellow-500 bg-yellow-50">
              <AlertTitle>Warning</AlertTitle>
              <AlertDescription>
                This is a warning alert for important notices.
              </AlertDescription>
            </Alert>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Progress and Loading */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Progress & Loading</h3>
          <div className="space-y-4">
            <div>
              <Label>Upload Progress</Label>
              <Progress value={65} className="w-full" />
            </div>
            <div className="space-y-2">
              <Label>Loading States</Label>
              <div className="flex gap-4">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-48" />
                <Skeleton className="h-12 w-24" />
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Badges */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Badges</h3>
          <div className="flex gap-2 flex-wrap">
            <Badge>Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge className="bg-green-500">Success</Badge>
            <Badge className="bg-yellow-500">Warning</Badge>
            <Badge className="bg-blue-500">Info</Badge>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const DataDisplay: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Data Display Components</h2>
        
        {/* Avatars */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Avatars</h3>
          <div className="flex gap-4 items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <Avatar>
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Tables */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tables</h3>
          <Table>
            <TableCaption>A list of recent transactions.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>2024-01-15</TableCell>
                <TableCell>Office Supplies</TableCell>
                <TableCell>
                  <Badge variant="outline">Expenses</Badge>
                </TableCell>
                <TableCell className="text-right">-$125.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-14</TableCell>
                <TableCell>Client Payment</TableCell>
                <TableCell>
                  <Badge className="bg-green-500">Income</Badge>
                </TableCell>
                <TableCell className="text-right">+$2,500.00</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>2024-01-13</TableCell>
                <TableCell>Software License</TableCell>
                <TableCell>
                  <Badge variant="outline">Expenses</Badge>
                </TableCell>
                <TableCell className="text-right">-$89.99</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  ),
};

export const Overlays: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Overlay Components</h2>
        
        {/* Dialogs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dialogs</h3>
          <div className="flex gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Make changes to your profile here. Click save when you're done.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" defaultValue="John Doe" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" defaultValue="john@example.com" />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Tooltips and Popovers */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Tooltips & Popovers</h3>
          <div className="flex gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline">Hover for tooltip</Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>This is a helpful tooltip</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline">Click for popover</Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Popover Title</h4>
                  <p className="text-sm text-muted-foreground">
                    This is a popover with additional information and actions.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm">Action 1</Button>
                    <Button size="sm" variant="outline">Action 2</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Dropdown Menus */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Dropdown Menus</h3>
          <div className="flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <User className="mr-2 h-4 w-4" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="mr-2 h-4 w-4" />
                  Notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const Enhanced: Story = {
  render: () => (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Enhanced Components</h2>
        
        {/* Enhanced Buttons */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Enhanced Buttons</h3>
          <div className="flex gap-4 flex-wrap">
            <EnhancedButton>Enhanced Button</EnhancedButton>
            <ActionButton>Action Button</ActionButton>
            <IconButton>
              <Plus className="h-4 w-4" />
            </IconButton>
            <LoadingButton loading>Loading Button</LoadingButton>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Enhanced Cards */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Enhanced Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="Total Revenue"
              value="$45,231.89"
              description="+20.1% from last month"
              trend="up"
            />
            <FeatureCard
              title="Advanced Analytics"
              description="Get detailed insights into your financial data"
              icon={<Settings className="h-6 w-6" />}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Advanced Inputs */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Advanced Inputs</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Enhanced Text Field</Label>
              <TextField
                placeholder="Enter text with validation"
                error="This field is required"
              />
            </div>
            <div className="space-y-2">
              <Label>Multi Select</Label>
              <MultiSelect
                options={[
                  { value: 'finance', label: 'Finance' },
                  { value: 'marketing', label: 'Marketing' },
                  { value: 'operations', label: 'Operations' },
                  { value: 'hr', label: 'Human Resources' },
                ]}
                placeholder="Select multiple options"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
}; 