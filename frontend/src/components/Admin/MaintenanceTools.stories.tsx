import type { Meta, StoryObj } from '@storybook/react';
import { MaintenanceTools } from './MaintenanceTools';

const meta: Meta<typeof MaintenanceTools> = {
    title: 'Admin/MaintenanceTools',
    component: MaintenanceTools,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Advanced maintenance tools for database cleanup, file management, and system optimization with dry-run previews and audit tracking.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MaintenanceTools>;

export const Default: Story = {
    args: {},
};

export const WithOperationComplete: Story = {
    args: {
        onOperationComplete: (result) => {
            console.log('Operation completed:', result);
        },
    },
};

export const LoadingState: Story = {
    render: () => {
        // Mock the component in a loading state
        return (
            <div className="p-6">
                <MaintenanceTools />
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm text-yellow-800">
                        Note: This story shows the component in its default state.
                        In a real scenario, operations would trigger loading states.
                    </p>
                </div>
            </div>
        );
    },
};
