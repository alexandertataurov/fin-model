import type { Meta, StoryObj } from '@storybook/react';
import LogsTab from './LogsTab';

const meta: Meta<typeof LogsTab> = {
    title: 'AdminDashboard/LogsTab',
    component: LogsTab,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'System logs tab with filtering and pagination capabilities.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LogsTab>;

export const Default: Story = {
    render: () => <LogsTab />,
};

export const WithLogs: Story = {
    render: () => <LogsTab />,
    parameters: {
        docs: {
            description: {
                story: 'Shows the logs tab with system logs when available.',
            },
        },
    },
};
