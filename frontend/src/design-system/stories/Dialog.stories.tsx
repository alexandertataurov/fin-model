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

A modal dialog component that provides a way to present content in an overlay. The Dialog component is built on top of Radix UI primitives and provides a fully accessible modal experience.

## Key Features

- **🎨 Accessible**: Built with ARIA attributes and keyboard navigation
- **📱 Responsive**: Adapts to different screen sizes
- **♿ Focus Management**: Automatically manages focus and traps it within the dialog
- **🎭 Backdrop**: Click outside to close with backdrop blur
- **⚡ Performance**: Optimized rendering with proper cleanup
- **🎯 Composition**: Flexible composition with header, content, and footer

## Usage

\`\`\`tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/design-system';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Edit Profile</DialogTitle>
    </DialogHeader>
    <div className="space-y-4">
      <p>Dialog content goes here...</p>
    </div>
  </DialogContent>
</Dialog>
\`\`\`

## Design Principles

1. **Accessibility**: Full keyboard navigation and screen reader support
2. **Clarity**: Clear visual hierarchy and readable content
3. **Efficiency**: Streamlined interactions and intuitive behavior
4. **Reliability**: Robust error handling and graceful degradation
5. **Performance**: Optimized rendering and minimal bundle impact
        `,
      },
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Whether the dialog is open',
    },
    modal: {
      control: 'boolean',
      description: 'Whether the dialog is modal',
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
            This is a basic dialog with a title and description.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p>This is the dialog content. You can put any content here.</p>
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
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
        <Button>Edit Profile</Button>
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
            <Label htmlFor="username" className="text-right">
              Username
            </Label>
            <Input
              id="username"
              defaultValue="@johndoe"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
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
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <span className="text-sm text-destructive">
            This action is irreversible.
          </span>
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
          <Settings className="mr-2 h-4 w-4" />
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
        <div className="space-y-6">
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
          
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Security</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CreditCard className="h-4 w-4" />
                <span>Two-factor authentication</span>
              </div>
              <Badge variant="success">Enabled</Badge>
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
};

// Success Dialog
export const SuccessDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Show Success</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <DialogTitle>Success!</DialogTitle>
          </div>
          <DialogDescription>
            Your changes have been saved successfully.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            All your data has been updated and is now available across all your devices.
          </p>
        </div>
        <DialogFooter>
          <Button>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

// Info Dialog
export const InfoDialog: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Info className="mr-2 h-4 w-4" />
          Information
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center space-x-2">
            <Info className="h-5 w-5 text-info" />
            <DialogTitle>Information</DialogTitle>
          </div>
          <DialogDescription>
            Important information about your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-lg bg-info/10 p-4">
            <p className="text-sm text-info-foreground">
              Your account has been upgraded to the premium plan. You now have access to all features.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button>Got it</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
