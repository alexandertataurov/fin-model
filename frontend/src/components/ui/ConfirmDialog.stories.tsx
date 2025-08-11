import type { Meta, StoryObj } from '@storybook/react';
import ConfirmDialog from './ConfirmDialog';
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
            description: 'Whether the dialog is open',
        },
        title: {
            control: { type: 'text' },
            description: 'Dialog title',
        },
        description: {
            control: { type: 'text' },
            description: 'Dialog description',
        },
        confirmText: {
            control: { type: 'text' },
            description: 'Confirm button text',
        },
        cancelText: {
            control: { type: 'text' },
            description: 'Cancel button text',
        },
        onConfirm: {
            action: 'confirmed',
            description: 'Callback when confirmed',
        },
        onCancel: {
            action: 'cancelled',
            description: 'Callback when cancelled',
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

export const FinancialModelSave: Story = {
    render: (args) => <ConfirmDialogWrapper {...args} />,
    args: {
        title: 'Save Financial Model',
        description: 'Your model has unsaved changes. Do you want to save before closing?',
        confirmText: 'Save & Close',
        cancelText: 'Close Without Saving',
    },
};

export const DeleteParameter: Story = {
    render: (args) => <ConfirmDialogWrapper {...args} />,
    args: {
        title: 'Delete Parameter',
        description: 'Are you sure you want to delete "Discount Rate"? This will affect all calculations using this parameter.',
        confirmText: 'Delete Parameter',
        cancelText: 'Keep Parameter',
    },
};

export const ExportData: Story = {
    render: (args) => <ConfirmDialogWrapper {...args} />,
    args: {
        title: 'Export Financial Data',
        description: 'This will export all your financial model data to Excel. The file may be large.',
        confirmText: 'Export Data',
        cancelText: 'Cancel Export',
    },
};
