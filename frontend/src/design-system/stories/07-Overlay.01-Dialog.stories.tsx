import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '../components/Dialog';
import { Button } from '../components/Button';

const meta: Meta<typeof Dialog> = {
  title: 'Design System/7 - Overlay/Dialog',
  component: Dialog,
  parameters: {
    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } }, layout: 'centered' },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Action</DialogTitle>
          <DialogDescription>
            This action cannot be undone. Are you sure you want to proceed?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="destructive">Confirm</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const LongContent: Story = {
  render: () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open long dialog</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Review Terms</DialogTitle>
          <DialogDescription>
            Please review the terms and conditions before continuing.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-[50vh] overflow-y-auto text-sm">
          {Array.from({ length: 20 }).map((_, i) => (
            <p key={i}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer
              efficitur, sapien quis fermentum facilisis, lectus augue tincidunt
              nisl, sed efficitur nisl nisi at nunc.
            </p>
          ))}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Decline</Button>
          <Button>Accept</Button>
        </div>
      </DialogContent>
    </Dialog>
  ),
};

export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } } as const;
export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } } as const;
export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } } as const;
