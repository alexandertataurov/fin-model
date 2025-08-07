import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/Dialog';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Label } from '../components/Label';
import { Badge } from '../components/Badge';
import { 
  Settings, 
  User, 
  CreditCard, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Download,
  Upload,
  Trash2,
  Edit,
  Eye,
  Share2,
  Star,
  Heart,
  Calendar,
  DollarSign,
  TrendingUp,
  Users,
  FileText,
  BarChart3,
} from 'lucide-react';

const meta: Meta<typeof Dialog> = {
  title: '🎨 Design System/Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component: `
# Dialog Component

A modal dialog component that provides a focused way to present content and gather user input. The Dialog component supports various use cases from simple confirmations to complex forms.

## Key Features

- **🎨 Accessible**: Built with proper ARIA attributes and keyboard navigation
- **📱 Responsive**: Adapts to different screen sizes
- **🎯 Focus Management**: Automatic focus trapping and restoration
- **♿ Screen Reader Support**: Full accessibility compliance
- **🎭 Design System**: Consistent with design tokens and theming
- **🧩 Composition**: Flexible header, content, and footer structure

## Usage

\`\`\`tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/design-system';

// Basic dialog
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    <p>Dialog content goes here</p>
  </DialogContent>
</Dialog>

// With form
<Dialog>
  <DialogTrigger asChild>
    <Button>Edit Profile</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
      <DialogDescription>
        Make changes to your profile here.
      </DialogDescription>
    </DialogHeader>
    <form>
      {/* Form fields */}
    </form>
    <DialogFooter>
      <Button variant="outline">Cancel</Button>
      <Button>Save changes</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
\`\`\`

## Design Principles

1. **Accessibility**: Full keyboard navigation and screen reader support
2. **Clarity**: Clear visual hierarchy and readable content
3. **Focus**: Proper focus management and restoration
4. **Consistency**: Unified design patterns across all dialogs
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Basic Dialog
export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Basic Dialog</DialogTitle>
          <DialogDescription>
            This is a basic dialog with title and description.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            This dialog demonstrates the basic structure with header, content, and footer.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Form Dialog
export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <User className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
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
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <Input
              id="role"
              defaultValue="Financial Analyst"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Confirmation Dialog
export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Account
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 p-4 bg-destructive/10 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <p className="text-sm text-destructive">
            This will permanently delete your account and all associated data.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Account</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Settings Dialog
export const SettingsDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account preferences and security settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Profile Information</h4>
            <div className="grid gap-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="display-name" className="text-right">
                  Display Name
                </Label>
                <Input
                  id="display-name"
                  defaultValue="John Doe"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="bio" className="text-right">
                  Bio
                </Label>
                <Input
                  id="bio"
                  defaultValue="Financial analyst with 5+ years experience"
                  className="col-span-3"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Notifications</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email notifications</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Push notifications</span>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Security</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Two-factor authentication</span>
                <Badge variant="success">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Password</span>
                <Button variant="outline" size="sm">Change</Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Financial Report Dialog
export const FinancialReportDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <BarChart3 className="h-4 w-4 mr-2" />
          View Report
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Q4 2023 Financial Report</DialogTitle>
          <DialogDescription>
            Comprehensive analysis of quarterly performance and projections
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium">Revenue</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">$2.4M</span>
                <Badge variant="success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +15.2%
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Profit Margin</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">23.5%</span>
                <Badge variant="info">
                  <DollarSign className="h-3 w-3 mr-1" />
                  +2.1%
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Key Metrics</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Active Users</p>
                <p className="text-xl font-bold">12,847</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Conversion Rate</p>
                <p className="text-xl font-bold">3.24%</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                <p className="text-xl font-bold">4.8/5</p>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Summary</h4>
            <p className="text-sm text-muted-foreground">
              Q4 2023 showed strong performance across all key metrics. Revenue growth 
              exceeded expectations by 15.2%, driven by increased user engagement and 
              improved conversion rates. The team successfully launched three new features 
              that contributed to user satisfaction scores.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
          <Button>
            <Share2 className="h-4 w-4 mr-2" />
            Share Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Alert Dialog
export const AlertDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <AlertTriangle className="h-4 w-4 mr-2" />
          Show Alert
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Important Notice</DialogTitle>
          <DialogDescription>
            Please review the following information before proceeding.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3 p-4 bg-warning/10 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">System Maintenance</p>
              <p className="text-sm text-muted-foreground">
                Scheduled maintenance will occur on Sunday, December 15th from 2:00 AM to 6:00 AM EST. 
                During this time, some features may be temporarily unavailable.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 bg-info/10 rounded-lg">
            <Info className="h-5 w-5 text-info mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">New Features Available</p>
              <p className="text-sm text-muted-foreground">
                We've added new financial modeling tools and enhanced reporting capabilities. 
                Check out the latest updates in our documentation.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Dismiss</Button>
          <Button>Learn More</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Success Dialog
export const SuccessDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <CheckCircle className="h-4 w-4 mr-2" />
          Show Success
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Operation Successful</DialogTitle>
          <DialogDescription>
            Your request has been processed successfully.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-3 p-4 bg-success/10 rounded-lg">
          <CheckCircle className="h-5 w-5 text-success" />
          <div className="space-y-1">
            <p className="text-sm font-medium">Profile Updated</p>
            <p className="text-sm text-muted-foreground">
              Your profile information has been successfully updated and saved.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Large Content Dialog
export const LargeContentDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FileText className="h-4 w-4 mr-2" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Project Details</DialogTitle>
          <DialogDescription>
            Comprehensive overview of the financial modeling project.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Project Overview</h4>
            <p className="text-sm text-muted-foreground">
              This project involves developing a comprehensive financial modeling platform 
              that enables users to create, analyze, and share financial models. The platform 
              includes advanced features such as scenario analysis, Monte Carlo simulations, 
              and real-time collaboration.
            </p>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Key Features</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Financial Modeling</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Scenario Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Monte Carlo Simulations</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Real-time Collaboration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Advanced Reporting</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span className="text-sm">Data Integration</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Timeline</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Phase 1: Planning</span>
                <Badge variant="success">Completed</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phase 2: Development</span>
                <Badge variant="warning">In Progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phase 3: Testing</span>
                <Badge variant="outline">Scheduled</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Phase 4: Launch</span>
                <Badge variant="outline">Scheduled</Badge>
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Team</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">8 Developers</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">2 Designers</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <User className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">1 PM</p>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Close</Button>
          <Button>
            <Edit className="h-4 w-4 mr-2" />
            Edit Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
