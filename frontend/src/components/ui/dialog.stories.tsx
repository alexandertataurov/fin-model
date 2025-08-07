import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './dialog';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { AlertTriangle, Trash2, Settings, Plus } from 'lucide-react';

const meta: Meta<typeof Dialog> = {
  title: 'Components/Dialog',
  component: Dialog,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
# Dialog Component

A modal dialog component built on Radix UI primitives with full accessibility support. Used throughout FinVision for confirmations, forms, and detailed views.

## Dialog Components

- **Dialog**: Root dialog container
- **DialogTrigger**: Button or element that opens the dialog
- **DialogContent**: Main dialog content with backdrop
- **DialogHeader**: Header section with title and description
- **DialogTitle**: Dialog title (required for accessibility)
- **DialogDescription**: Optional description text
- **DialogFooter**: Footer section for action buttons

## Key Features

- **Accessible**: Full keyboard navigation and screen reader support
- **Focus Management**: Automatic focus trapping and restoration
- **Backdrop**: Click outside to close (optional)
- **Responsive**: Adapts to different screen sizes
- **Customizable**: Flexible styling and layout options

## Usage in FinVision

- **Confirmations**: Delete confirmations, data loss warnings
- **Forms**: Parameter editing, user settings
- **Details**: Expanded views of charts or data
- **Workflows**: Multi-step processes like file upload
        `,
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Dialog Title</DialogTitle>
          <DialogDescription>
            This is a description of what this dialog does. It provides context for the user.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p>Dialog content goes here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const ConfirmationDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete Report
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <span>Confirm Deletion</span>
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "Q4 Financial Report"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm font-medium">Report Details:</p>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Created: December 15, 2023</li>
              <li>• Last modified: January 10, 2024</li>
              <li>• File size: 2.4 MB</li>
            </ul>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Delete Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Confirmation dialog for destructive actions with warning styling.',
      },
    },
  },
};

export const FormDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Parameter
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Parameter</DialogTitle>
          <DialogDescription>
            Add a new financial parameter to your model.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="param-name">Parameter Name</Label>
            <Input
              id="param-name"
              placeholder="e.g., Revenue Growth Rate"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="param-description">Description</Label>
            <Input
              id="param-description"
              placeholder="Brief description of the parameter"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="param-min">Min Value</Label>
              <Input
                id="param-min"
                type="number"
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="param-max">Max Value</Label>
              <Input
                id="param-max"
                type="number"
                placeholder="1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="param-default">Default Value</Label>
            <Input
              id="param-default"
              type="number"
              placeholder="0.15"
              step="0.01"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Create Parameter</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Form dialog for creating new financial parameters.',
      },
    },
  },
};

export const SettingsDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Profile Information</h4>
            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input
                id="display-name"
                defaultValue="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                defaultValue="john.doe@company.com"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Preferences</h4>
            <div className="flex items-center justify-between">
              <div>
                <Label>Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for reports</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Use dark theme</p>
              </div>
              <input type="checkbox" className="h-4 w-4" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Settings dialog with multiple sections and form controls.',
      },
    },
  },
};

export const LargeContentDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">View Chart Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Revenue Analysis Chart</DialogTitle>
          <DialogDescription>
            Detailed view of revenue trends and projections.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="bg-muted rounded-lg p-6 min-h-80 flex items-center justify-center">
            <p className="text-muted-foreground">Chart visualization would appear here</p>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">$1.2M</p>
              <p className="text-sm text-muted-foreground">Current Quarter</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">+15%</p>
              <p className="text-sm text-muted-foreground">Growth Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">$1.4M</p>
              <p className="text-sm text-muted-foreground">Projected</p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline">Export Data</Button>
          <Button>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Large dialog for detailed chart views and data visualization.',
      },
    },
  },
};

export const SimpleConfirm: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Simple Confirm</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Simple confirmation dialog with minimal content.',
      },
    },
  },
};