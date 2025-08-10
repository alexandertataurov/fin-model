import type { Meta, StoryObj } from '@storybook/react';
import OverviewTab from './OverviewTab';

const meta: Meta<typeof OverviewTab> = {
    title: 'AdminDashboard/OverviewTab',
    component: OverviewTab,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Admin dashboard overview tab displaying system status, metrics, and user activity.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OverviewTab>;

export const Default: Story = {
    render: () => <OverviewTab />,
};

export const LoadingState: Story = {
    render: () => <OverviewTab />,
    parameters: {
        docs: {
            description: {
                story: 'Shows the loading skeleton when data is being fetched.',
            },
        },
    },
};

export const NoDataState: Story = {
    render: () => <OverviewTab />,
    parameters: {
        docs: {
            description: {
                story: 'Shows the no data state when no admin data is available.',
            },
        },
    },
};
