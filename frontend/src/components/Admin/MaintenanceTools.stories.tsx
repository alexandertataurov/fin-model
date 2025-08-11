import type { Meta, StoryObj } from '@storybook/react';
import { MaintenanceTools } from './MaintenanceTools';

const meta: Meta<typeof MaintenanceTools> = {
    title: 'Admin/MaintenanceTools',
    component: MaintenanceTools,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Advanced maintenance tools for database cleanup, file management, and system optimization with dry-run previews and audit tracking. Part of the consolidated Admin Dashboard system.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MaintenanceTools>;

export const Default: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Default maintenance tools interface with database cleanup, file management, and system optimization options.',
            },
        },
    },
};

export const WithOperationComplete: Story = {
    args: {
        onOperationComplete: (result) => {
            console.log('Operation completed:', result);
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Maintenance tools with operation completion callback for integration with the main admin dashboard.',
            },
        },
    },
};

export const LoadingState: Story = {
    render: () => {
        return (
            <div className="p-6">
                <MaintenanceTools />
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        Note: This story shows the component in its default state.
                        In a real scenario, operations would trigger loading states.
                    </p>
                </div>
            </div>
        );
    },
    parameters: {
        docs: {
            description: {
                story: 'Maintenance tools with loading state indicators and user feedback during operations.',
            },
        },
    },
};
