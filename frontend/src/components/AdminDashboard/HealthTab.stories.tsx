import type { Meta, StoryObj } from '@storybook/react';
import HealthTab from './HealthTab';

const meta: Meta<typeof HealthTab> = {
    title: 'AdminDashboard/HealthTab',
    component: HealthTab,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Health monitoring tab for system and database health status.',
            },
        },
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HealthTab>;

export const Default: Story = {
    render: () => <HealthTab />,
};

export const WithData: Story = {
    render: () => <HealthTab />,
    parameters: {
        docs: {
            description: {
                story: 'Shows the health tab with system and database health data when available.',
            },
        },
    },
};
