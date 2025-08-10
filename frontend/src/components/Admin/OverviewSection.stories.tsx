import type { Meta, StoryObj } from '@storybook/react';
import { OverviewSection } from './OverviewSection';

const meta: Meta<typeof OverviewSection> = {
    title: 'Admin/OverviewSection',
    component: OverviewSection,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Admin dashboard overview section displaying system health, user activity, and system metrics.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof OverviewSection>;

export const Default: Story = {
    render: () => <OverviewSection />,
};

export const LoadingState: Story = {
    render: () => {
        // This will show the loading skeleton when no data is available
        return <OverviewSection />;
    },
    parameters: {
        docs: {
            description: {
                story: 'Shows the loading skeleton when data is being fetched.',
            },
        },
    },
};
