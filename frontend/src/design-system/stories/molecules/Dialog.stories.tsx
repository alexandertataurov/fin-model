import * as React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '../../molecules/Dialog/Dialog';
import { Button } from '../../atoms/Button';
import { SectionHeader, AnimatedBanner, GuidelinesSection, GuidelinesCard, Card } from '../components';
import { Check, AlertTriangle, MessageSquare, X } from 'lucide-react';
import { Title, Stories } from '@storybook/blocks';

const meta: Meta<typeof Dialog> = {
  title: 'Molecules / Dialog',
  component: Dialog,
  parameters: {
    layout: 'padded',
    docs: {
      autodocs: true,
      page: () => (
        <>
          <Title />
          <AnimatedBanner
            title="Molecule: Dialog"
            subtitle="A modal dialog component for displaying content that requires user interaction with comprehensive styling options."
            icon={
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
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
        title="Dialog Variants"
        subtitle="Different dialog configurations and use cases."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Default Dialog</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Default Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Default Dialog</DialogTitle>
                <DialogDescription>
                  This is a default dialog with standard content.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground py-4">
                Any content can go here.
              </p>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Confirm</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Custom Trigger</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="secondary">Custom Trigger</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Custom Trigger Dialog</DialogTitle>
                <DialogDescription>
                  This dialog uses a custom trigger element.
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm text-muted-foreground py-4">
                The `asChild` prop allows you to pass a child that will act as the trigger.
              </p>
              <DialogFooter>
                <Button>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Long Content</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Long Content</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Dialog with Long Content</DialogTitle>
                <DialogDescription>
                  This dialog demonstrates how it handles extensive content.
                </DialogDescription>
              </DialogHeader>
              <div className="text-sm text-muted-foreground py-4 max-h-64 overflow-y-auto">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                  eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <p className="mt-2">
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
                  nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <DialogFooter>
                <Button>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Confirmation</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this item? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button variant="destructive">Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Form Dialog</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New Item</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogDescription>
                  Fill out the form below to add a new item.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <input className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="Enter name" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea className="w-full mt-1 px-3 py-2 border rounded-md" placeholder="Enter description" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>

        <Card className="p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Alert Dialog</h4>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Show Alert</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Important Notice</DialogTitle>
                <DialogDescription>
                  This is an important alert that requires your attention.
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 py-4">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <p className="text-sm text-muted-foreground">
                  Please review the information before proceeding.
                </p>
              </div>
              <DialogFooter>
                <Button>I Understand</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      </div>
    </div>
  ),
};

export const Default: Story = {
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>Open Dialog</Button>
        </DialogTrigger>
        <Dialog {...args} open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Default Dialog</DialogTitle>
              <DialogDescription>
                This is a default dialog. You can customize its content.
              </DialogDescription>
            </DialogHeader>
            <p className="text-sm text-muted-foreground py-4">
              Any content can go here.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setOpen(false)}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
  args: {
    // No specific args needed here as content is rendered in render function
  },
};

export const WithCustomTrigger: Story = {
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <Dialog {...args} open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="secondary" onClick={() => setOpen(true)}>
            Open with Custom Trigger
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Custom Trigger Dialog</DialogTitle>
            <DialogDescription>
              This dialog uses a custom trigger element.
            </DialogDescription>
          </DialogHeader>
          <p className="text-sm text-muted-foreground py-4">
            The `asChild` prop allows you to pass a child that will act as the
            trigger.
          </p>
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
  args: {},
};

export const LongContent: Story = {
  render: args => {
    const [open, setOpen] = useState(false);
    return (
      <>
        <DialogTrigger>
          <Button onClick={() => setOpen(true)}>
            Open Dialog with Long Content
          </Button>
        </DialogTrigger>
        <Dialog {...args} open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog with Long Content</DialogTitle>
              <DialogDescription>
                This dialog demonstrates how it handles extensive content.
              </DialogDescription>
            </DialogHeader>
            <div className="text-sm text-muted-foreground py-4 max-h-64 overflow-y-auto">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p className="mt-2">
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem
                accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
                quae ab illo inventore veritatis et quasi architecto beatae
                vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia
                voluptas sit aspernatur aut odit aut fugit, sed quia
                consequuntur magni dolores eos qui ratione voluptatem sequi
                nesciunt.
              </p>
              <p className="mt-2">
                Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
                consectetur, adipisci velit, sed quia non numquam eius modi
                tempora incidunt ut labore et dolore magnam aliquam quaerat
                voluptatem. Ut enim ad minima veniam, quis nostrum
                exercitationem ullam corporis suscipit laboriosam, nisi ut
                aliquid ex ea commodi consequatur? Quis autem vel eum iure
                reprehenderit qui in ea voluptate velit esse quam nihil
                molestiae consequatur, vel illum qui dolorem eum fugiat quo
                voluptas nulla pariatur?
              </p>
              <p className="mt-2">
                At vero eos et accusamus et iusto odio dignissimos ducimus qui
                blanditiis praesentium voluptatum deleniti atque corrupti quos
                dolores et quas molestias excepturi sint occaecati cupiditate
                non provident, similique sunt in culpa qui officia deserunt
                mollitia animi, id est laborum et dolorum fuga. Et harum quidem
                rerum facilis est et expedita distinctio. Nam libero tempore,
                cum soluta nobis est eligendi optio cumque nihil impedit quo
                minus id quod maxime placeat facere possimus, omnis voluptas
                assumenda est, omnis dolor repellendus.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={() => setOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    );
  },
  args: {},
};

export const Guidelines: Story = {
  render: () => (
    <div className="space-y-12">
      <GuidelinesSection title="Usage Guidelines">
        <GuidelinesCard
          title="Do"
          variant="success"
          icon={<Check />}
          items={[
            'Use dialogs for <strong>important user interactions</strong> that require attention.',
            'Provide clear, descriptive <strong>titles and descriptions</strong>.',
            'Include appropriate <strong>action buttons</strong> in the footer.',
            'Use dialogs sparingly to avoid overwhelming users.',
          ]}
        />
        <GuidelinesCard
          title="Don't"
          variant="warning"
          icon={<AlertTriangle />}
          items={[
            'Don\'t use dialogs for simple information display (use alerts or notifications).',
            'Avoid nesting dialogs within dialogs.',
            'Don\'t use dialogs for navigation (use regular pages or modals).',
          ]}
        />
      </GuidelinesSection>
      <GuidelinesSection
        title="Accessibility"
        items={[
          'Ensure proper focus management and keyboard navigation.',
          'Use appropriate ARIA labels and roles for screen readers.',
          'Provide clear focus indicators and escape key functionality.',
          'Test with screen readers and keyboard-only navigation.',
        ]}
      />
    </div>
  ),
};

export const Interactive: Story = {
  args: {
    open: false,
  },
  render: args => {
    const [open, setOpen] = useState(args.open);
    
    return (
      <div className="space-y-8">
        <SectionHeader
          title="Interactive Dialog"
          subtitle="Experiment with different dialog configurations using the controls."
        />
        
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Dialog Preview</h3>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button>Open Interactive Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Interactive Dialog</DialogTitle>
                  <DialogDescription>
                    This dialog demonstrates the current configuration. Use the controls to experiment with different settings.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    This is an example of dialog content that can be customized based on your needs.
                  </p>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <p className="text-xs text-gray-600">
                      <strong>Current State:</strong> {open ? 'Open' : 'Closed'}
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setOpen(false)}>
                    Confirm
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Current Settings:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>Open State: {open ? 'Open' : 'Closed'}</li>
              </ul>
              
              <h4 className="font-medium text-gray-900 mb-2 mt-4">Use Cases:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Confirmation dialogs</li>
                <li>• Form inputs</li>
                <li>• Important alerts</li>
                <li>• User settings</li>
              </ul>
            </div>
            
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-medium text-gray-900 mb-3">Real-world Examples:</h4>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Delete Confirmation:</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Delete</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>Are you sure?</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button size="sm" variant="outline">Cancel</Button>
                        <Button size="sm" variant="destructive">Delete</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Settings Dialog:</p>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="outline">Settings</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>User Settings</DialogTitle>
                        <DialogDescription>Configure your preferences.</DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button size="sm" variant="outline">Cancel</Button>
                        <Button size="sm">Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive dialog with configurable props. Use the controls to experiment with different dialog configurations.',
      },
    },
  },
};

export const Documentation: Story = {
  render: () => (
    <div className="space-y-12">
      <SectionHeader
        title="Dialog Documentation"
        subtitle="Comprehensive guide to using the Dialog component."
      />
      <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm overflow-hidden">
        <h4 className="text-xl font-semibold text-gray-900 mb-6">
          Usage Guidelines
        </h4>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>
            Use <code>DialogTrigger</code> to define the trigger element that opens the dialog.
          </li>
          <li>
            Wrap dialog content in <code>DialogContent</code> with proper header and footer sections.
          </li>
          <li>
            Use <code>DialogHeader</code>, <code>DialogTitle</code>, and <code>DialogDescription</code> for structured content.
          </li>
          <li>
            Include appropriate action buttons in <code>DialogFooter</code> for user interactions.
          </li>
          <li>
            Ensure proper focus management and keyboard navigation for accessibility.
          </li>
        </ul>
      </div>
    </div>
  ),
};
