import type { Meta, StoryObj } from '@storybook/react';
import { ConfirmDialog } from './ConfirmDialog';
import { useState } from 'react';

const meta: Meta<typeof ConfirmDialog> = {
    title: 'UI/ConfirmDialog',
    component: ConfirmDialog,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Accessible confirmation dialog built on the design system AlertDialog.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        open: {
            control: 'boolean',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

// Wrapper component to handle state
const ConfirmDialogWrapper = (props: any) => {
    const [open, setOpen] = useState(props.open || false);

    return (
        <div>
            <button
                onClick={() => setOpen(true)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                Open Dialog
            </button>
            <ConfirmDialog
                {...props}
                open={open}
                onOpenChange={setOpen}
                onConfirm={() => {
                    console.log('Confirmed!');
                    setOpen(false);
                }}
            />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <ConfirmDialogWrapper {...args} />,
    args: {
        title: 'Are you sure?',
        description: 'This action cannot be undone.',
        confirmText: 'Confirm',
        cancelText: 'Cancel',
    },
};

export const DeleteConfirmation: Story = {
    render: (args) => <ConfirmDialogWrapper {...args} />,
    args: {
        title: 'Delete Item',
        description: 'Are you sure you want to delete this item? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
    },
};

export const CustomText: Story = {
    render: (args) => <ConfirmDialogWrapper {...args} />,
    args: {
        title: 'Save Changes',
        description: 'Do you want to save your changes before leaving?',
        confirmText: 'Save',
        cancelText: 'Don\'t Save',
    },
};

export const NoDescription: Story = {
    render: (args) => <ConfirmDialogWrapper {...args} />,
    args: {
        title: 'Continue?',
        confirmText: 'Yes',
        cancelText: 'No',
    },
};
