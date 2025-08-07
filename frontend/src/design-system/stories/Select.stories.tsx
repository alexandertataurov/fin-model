import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/Select';
import { Label } from '../components/Label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { 
  ChevronDown,
  Globe,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
  Star,
  Award,
  Building,
  User,
  CreditCard,
  Settings,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Activity,
  Target,
  Zap,
  Shield,
  Eye,
} from 'lucide-react';

const meta: Meta<typeof Select> = {
  title: '🎨 Design System/Components/Select',
  component: Select,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Select Component

A flexible select component that provides a clean interface for choosing from a list of options. The Select component supports various use cases from simple dropdowns to complex multi-select scenarios.

## Key Features

- **🎨 Accessible**: Built with proper ARIA attributes and keyboard navigation
- **📱 Responsive**: Adapts to different screen sizes
- **🎯 Customizable**: Flexible styling and content options
- **♿ Screen Reader Support**: Full accessibility compliance
- **🎭 Design System**: Consistent with design tokens and theming
- **🧩 Composition**: Works well with other form components

## Usage

\`\`\`tsx
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/design-system';

// Basic select
<Select>
  <SelectTrigger>
    <SelectValue placeholder="Select an option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
    <SelectItem value="option3">Option 3</SelectItem>
  </SelectContent>
</Select>

// With label
<div className="space-y-2">
  <Label htmlFor="framework">Framework</Label>
  <Select>
    <SelectTrigger id="framework">
      <SelectValue placeholder="Select a framework" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="react">React</SelectItem>
      <SelectItem value="vue">Vue</SelectItem>
      <SelectItem value="angular">Angular</SelectItem>
    </SelectContent>
  </Select>
</div>
\`\`\`

## Design Principles

1. **Accessibility**: Full keyboard navigation and screen reader support
2. **Clarity**: Clear visual hierarchy and readable options
3. **Consistency**: Unified design patterns across all selects
4. **Flexibility**: Adaptable to different content types
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Select
export const Basic: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
        <SelectItem value="option4">Option 4</SelectItem>
      </SelectContent>
    </Select>
  ),
};

// Select with Label
export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="framework">Framework</Label>
      <Select>
        <SelectTrigger id="framework">
          <SelectValue placeholder="Select a framework" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="react">React</SelectItem>
          <SelectItem value="vue">Vue</SelectItem>
          <SelectItem value="angular">Angular</SelectItem>
          <SelectItem value="svelte">Svelte</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

// Select with Icons
export const WithIcons: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="space-y-2">
        <Label>Country</Label>
        <Select>
          <SelectTrigger>
            <Globe className="h-4 w-4 mr-2" />
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
      
      <div className="space-y-2">
        <Label>Currency</Label>
        <Select>
          <SelectTrigger>
            <DollarSign className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD - US Dollar</SelectItem>
            <SelectItem value="eur">EUR - Euro</SelectItem>
            <SelectItem value="gbp">GBP - British Pound</SelectItem>
            <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

// Financial Metrics Select
export const FinancialMetrics: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Financial Dashboard</CardTitle>
        <CardDescription>Select metrics to display</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Primary Metric</Label>
          <Select>
            <SelectTrigger>
              <TrendingUp className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select primary metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenue</SelectItem>
              <SelectItem value="profit">Profit</SelectItem>
              <SelectItem value="growth">Growth Rate</SelectItem>
              <SelectItem value="margin">Profit Margin</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Time Period</Label>
          <Select>
            <SelectTrigger>
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Chart Type</Label>
          <Select>
            <SelectTrigger>
              <BarChart3 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select chart type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Line Chart</SelectItem>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="pie">Pie Chart</SelectItem>
              <SelectItem value="area">Area Chart</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  ),
};

// User Role Select
export const UserRoleSelect: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>User Role</Label>
        <Select>
          <SelectTrigger>
            <User className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select user role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span>Administrator</span>
              </div>
            </SelectItem>
            <SelectItem value="manager">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4" />
                <span>Manager</span>
              </div>
            </SelectItem>
            <SelectItem value="analyst">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span>Financial Analyst</span>
              </div>
            </SelectItem>
            <SelectItem value="viewer">
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Viewer</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Department</Label>
        <Select>
          <SelectTrigger>
            <Building className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="finance">Finance</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
            <SelectItem value="hr">Human Resources</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

// Status Select with Badges
export const StatusSelect: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Project Status</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select project status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">
              <div className="flex items-center gap-2">
                <Badge variant="success" className="h-2 w-2 p-0" />
                <span>Active</span>
              </div>
            </SelectItem>
            <SelectItem value="pending">
              <div className="flex items-center gap-2">
                <Badge variant="warning" className="h-2 w-2 p-0" />
                <span>Pending</span>
              </div>
            </SelectItem>
            <SelectItem value="completed">
              <div className="flex items-center gap-2">
                <Badge variant="default" className="h-2 w-2 p-0" />
                <span>Completed</span>
              </div>
            </SelectItem>
            <SelectItem value="cancelled">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="h-2 w-2 p-0" />
                <span>Cancelled</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Priority Level</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select priority level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              <div className="flex items-center gap-2">
                <Badge variant="success">Low</Badge>
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-2">
                <Badge variant="warning">Medium</Badge>
              </div>
            </SelectItem>
            <SelectItem value="high">
              <div className="flex items-center gap-2">
                <Badge variant="destructive">High</Badge>
              </div>
            </SelectItem>
            <SelectItem value="urgent">
              <div className="flex items-center gap-2">
                <Badge variant="destructive" className="animate-pulse">Urgent</Badge>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};

// Form Example
export const FormExample: Story = {
  render: () => (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Update your account preferences</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select>
            <SelectTrigger id="language">
              <Globe className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
              <SelectItem value="ja">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select>
            <SelectTrigger id="timezone">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="utc">UTC</SelectItem>
              <SelectItem value="est">Eastern Time</SelectItem>
              <SelectItem value="pst">Pacific Time</SelectItem>
              <SelectItem value="gmt">GMT</SelectItem>
              <SelectItem value="cet">Central European Time</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="currency">Default Currency</Label>
          <Select>
            <SelectTrigger id="currency">
              <DollarSign className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="usd">USD - US Dollar</SelectItem>
              <SelectItem value="eur">EUR - Euro</SelectItem>
              <SelectItem value="gbp">GBP - British Pound</SelectItem>
              <SelectItem value="jpy">JPY - Japanese Yen</SelectItem>
              <SelectItem value="cad">CAD - Canadian Dollar</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="theme">Theme</Label>
          <Select>
            <SelectTrigger id="theme">
              <Settings className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full">Save Settings</Button>
      </CardContent>
    </Card>
  ),
};

// Analytics Dashboard Select
export const AnalyticsDashboard: Story = {
  render: () => (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Analytics Dashboard</CardTitle>
        <CardDescription>Configure your dashboard view</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Metric Type</Label>
            <Select>
              <SelectTrigger>
                <Activity className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="users">Active Users</SelectItem>
                <SelectItem value="conversion">Conversion Rate</SelectItem>
                <SelectItem value="satisfaction">Customer Satisfaction</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Chart Type</Label>
            <Select>
              <SelectTrigger>
                <BarChart3 className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select chart" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="line">Line Chart</SelectItem>
                <SelectItem value="bar">Bar Chart</SelectItem>
                <SelectItem value="pie">Pie Chart</SelectItem>
                <SelectItem value="area">Area Chart</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Time Range</Label>
            <Select>
              <SelectTrigger>
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Group By</Label>
            <Select>
              <SelectTrigger>
                <Users className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Select grouping" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day</SelectItem>
                <SelectItem value="week">Week</SelectItem>
                <SelectItem value="month">Month</SelectItem>
                <SelectItem value="quarter">Quarter</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label>Target Goal</Label>
          <Select>
            <SelectTrigger>
              <Target className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select target" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue-1m">$1M Revenue</SelectItem>
              <SelectItem value="users-10k">10K Active Users</SelectItem>
              <SelectItem value="conversion-5">5% Conversion Rate</SelectItem>
              <SelectItem value="satisfaction-4.5">4.5/5 Satisfaction</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex-1">Reset</Button>
          <Button className="flex-1">Apply Changes</Button>
        </div>
      </CardContent>
    </Card>
  ),
};

// Disabled Select
export const DisabledSelect: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Enabled Select</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label>Disabled Select</Label>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="This select is disabled" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  ),
};
