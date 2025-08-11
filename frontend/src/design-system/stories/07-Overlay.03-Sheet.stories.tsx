import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '../components/Sheet';
import { Button } from '../components/Button';

const meta: Meta<typeof Sheet> = {
  title: 'Design System/Sheet',
  component: Sheet,
  parameters: { layout: 'padded' },
  tags: ['autodocs'],
  argTypes: {
    open: {
      control: { type: 'boolean' },
      description: 'Whether the sheet is open',
    },
    onOpenChange: {
      action: 'open changed',
      description: 'Callback when sheet open state changes',
    },
  },
};
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Default Sheet</SheetTitle>
          <SheetDescription>This is a default sheet component.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const Basic: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Open Sheet</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Adjust your preferences.</SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Left Sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Quick navigation menu.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Menu Items</h4>
            <div className="space-y-1">
              <div className="px-2 py-1 text-sm hover:bg-accent rounded">Dashboard</div>
              <div className="px-2 py-1 text-sm hover:bg-accent rounded">Profile</div>
              <div className="px-2 py-1 text-sm hover:bg-accent rounded">Settings</div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="secondary">Edit Profile</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>Update your profile information.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">Name</label>
            <input id="name" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your name" />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">Email</label>
            <input id="email" className="w-full px-3 py-2 border rounded-md" placeholder="Enter your email" />
          </div>
          <div className="flex gap-2 pt-4">
            <Button className="flex-1">Save</Button>
            <Button variant="outline" className="flex-1">Cancel</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};
