import * as React from 'react';
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog } from '../../molecules/ConfirmDialog/ConfirmDialog';
import { Button } from '../../atoms/Button';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, Trash2, Save, AlertCircle } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof ConfirmDialog> = {
  title: 'Molecules / ConfirmDialog',
  component: ConfirmDialog,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: ConfirmDialog"
            subtitle="A modal dialog for confirming user actions with customizable content and styling."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
          <Stories includePrimary={false} />
        </>
      ),
    },
  },
  argTypes: {
    open: {
      control: 'boolean',
      description: 'Controls the open state of the dialog.',
    },
    onOpenChange: {
      action: 'open state changed',
      description: 'Callback when the open state changes.',
    },
    title: {
      control: 'text',
      description: 'The title of the dialog.',
    },
    description: {
      control: 'text',
      description: 'The description or message of the dialog.',
    },
    confirmText: {
      control: 'text',
      description: 'Text for the confirm button.',
    },
    cancelText: {
      control: 'text',
      description: 'Text for the cancel button.',
    },
    onConfirm: {
      action: 'confirmed',
      description: 'Callback when the confirm button is clicked.',
    },
    onCancel: {
      action: 'cancelled',
      description:
        'Callback when the cancel button is clicked or dialog is closed.',
    },
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: 'Variant for the confirm button.',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

// ============================================================================ // STORIES // ============================================================================

export const Variants: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="ConfirmDialog Variants"
        subtitle="Different confirmation dialog configurations and use cases."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Confirmation</h4>
          <ConfirmDialogExample
            title="Confirm Action"
            description="Are you sure you want to proceed with this action? This cannot be undone."
            confirmText="Proceed"
            cancelText="Cancel"
          />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Destructive Action</h4>
          <ConfirmDialogExample
            title="Delete Item"
            description="This action will permanently delete the selected item. Are you absolutely sure?"
            confirmText="Delete"
            cancelText="Keep"
            variant="destructive"
          />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Save Changes</h4>
          <ConfirmDialogExample
            title="Save Changes?"
            description="You have unsaved changes. Do you want to save them before closing?"
            confirmText="Save"
            cancelText="Discard"
          />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Styling</h4>
          <ConfirmDialogExample
            title="Custom Dialog"
            description="This is a custom styled confirmation dialog with different button text."
            confirmText="Yes, Continue"
            cancelText="No, Stop"
          />
        </Card>
      </div>
    </div>
  ),
};

// Helper component for interactive examples
const ConfirmDialogExample = ({
  title,
  description,
  confirmText,
  cancelText,
  variant = 'default'
}: {
  title: string;
  description: string;
  confirmText: string;
  cancelText: string;
  variant?: 'default' | 'destructive';
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant === 'destructive' ? 'destructive' : 'default'}
        onClick={() => setOpen(true)}
      >
        {variant === 'destructive' ? 'Delete Item' : 'Open Dialog'}
      </Button>
      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title={title}
        description={description}
        confirmText={confirmText}
        cancelText={cancelText}
        variant={variant}
        onConfirm={() => {
          console.log('Confirmed:', title);
          setOpen(false);
        }}
        onCancel={() => {
          console.log('Cancelled:', title);
          setOpen(false);
        }}
      />
    </>
  );
};

export const Default: Story = {
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Confirm Dialog</Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
  args: {
    title: 'Confirm Action',
    description:
      'Are you sure you want to proceed with this action? This cannot be undone.',
    confirmText: 'Proceed',
    cancelText: 'Cancel',
  },
};

export const DestructiveAction: Story = {
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="destructive" onClick={() => setOpen(true)}>
          Delete Item
        </Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
  args: {
    title: 'Delete Item',
    description:
      'This action will permanently delete the selected item. Are you absolutely sure?',
    confirmText: 'Delete',
    cancelText: 'Keep',
    variant: 'destructive',
  },
};

export const CustomText: Story = {
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Show Custom Dialog</Button>
        <ConfirmDialog {...args} open={open} onOpenChange={setOpen} />
      </>
    );
  },
  args: {
    title: 'Save Changes?',
    description:
      'You have unsaved changes. Do you want to save them before closing?',
    confirmText: 'Save',
    cancelText: 'Discard',
  },
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="ConfirmDialog Guidelines"
        subtitle="Best practices and design principles for confirmation dialogs."
      />

      <GuidelinesSection>
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Clear Messaging"
          description="Use clear, concise language that explains the action and its consequences."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Action Hierarchy"
          description="Make the primary action clear and use appropriate button styling for destructive actions."
        />
        <GuidelinesCard
          icon={<Check className="w-5 h-5 text-green-500" />}
          title="Accessibility"
          description="Ensure proper focus management, keyboard navigation, and screen reader support."
        />
        <GuidelinesCard
          icon={<AlertTriangle className="w-5 h-5 text-amber-500" />}
          title="Overuse Prevention"
          description="Don't overuse confirmation dialogs for routine actions that users expect to work immediately."
        />
      </GuidelinesSection>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="Interactive ConfirmDialog Examples"
        subtitle="Interactive confirmation dialog patterns and real-world usage scenarios."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Delete Confirmation
          </h4>
          <ConfirmDialogExample
            title="Delete Item"
            description="This action will permanently delete the selected item. Are you absolutely sure?"
            confirmText="Delete"
            cancelText="Keep"
            variant="destructive"
          />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Save className="w-5 h-5" />
            Save Changes
          </h4>
          <ConfirmDialogExample
            title="Save Changes?"
            description="You have unsaved changes. Do you want to save them before closing?"
            confirmText="Save"
            cancelText="Discard"
          />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Warning Action
          </h4>
          <ConfirmDialogExample
            title="Proceed with Caution"
            description="This action may have unexpected consequences. Are you sure you want to continue?"
            confirmText="Continue"
            cancelText="Cancel"
          />
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Styling</h4>
          <ConfirmDialogExample
            title="Custom Confirmation"
            description="This is a custom styled confirmation dialog with different button text."
            confirmText="Yes, Continue"
            cancelText="No, Stop"
          />
        </Card>
      </div>
    </div>
  ),
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-16">
      <SectionHeader
        title="ConfirmDialog Documentation"
        subtitle="Comprehensive documentation and usage examples for the ConfirmDialog component."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Component Structure</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Modal dialog with backdrop and focus trap</p>
            <p>• Title, description, and action buttons</p>
            <p>• Support for different button variants</p>
            <p>• Proper accessibility attributes</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Props & Configuration</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• open: boolean for dialog visibility</p>
            <p>• title: string for dialog title</p>
            <p>• description: string for dialog message</p>
            <p>• confirmText/cancelText: button labels</p>
            <p>• variant: 'default' | 'destructive'</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Use Cases</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Confirming destructive actions</p>
            <p>• Saving unsaved changes</p>
            <p>• Confirming important decisions</p>
            <p>• Warning about consequences</p>
          </div>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Best Practices</h4>
          <div className="space-y-3 text-sm text-gray-600">
            <p>• Use clear, actionable language</p>
            <p>• Make consequences explicit</p>
            <p>• Provide clear action options</p>
            <p>• Test keyboard and screen reader access</p>
          </div>
        </Card>
      </div>
    </div>
  ),
};
