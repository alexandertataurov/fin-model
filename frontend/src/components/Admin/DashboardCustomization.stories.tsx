import type { Meta, StoryObj } from '@storybook/react';
import { DashboardCustomization } from './DashboardCustomization';
import { useState } from 'react';

const meta: Meta<typeof DashboardCustomization> = {
    title: 'Admin/DashboardCustomization',
    component: DashboardCustomization,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Dashboard customization component for role-based widget management and layout configuration.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        userRole: {
            control: 'select',
            options: ['admin', 'analyst', 'viewer', 'editor'],
        },
    },
};

export default meta;
type Story = StoryObj<typeof DashboardCustomization>;

// Wrapper component to handle state
const DashboardCustomizationWrapper = (props: any) => {
    const [config, setConfig] = useState(props.currentConfig || []);

    return (
        <DashboardCustomization
            {...props}
            currentConfig={config}
            onConfigChange={setConfig}
        />
    );
};

export const AdminRole: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
};

export const AnalystRole: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'analyst',
    },
};

export const EditorRole: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'editor',
    },
};

export const ViewerRole: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'viewer',
    },
};

export const WithCustomConfig: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
        currentConfig: [
            {
                id: 'system-stats',
                type: 'system-stats',
                title: 'System Statistics',
                description: 'Overview of system performance metrics',
                icon: '📊',
                visible: true,
                position: 0,
                size: 'medium',
                requiredRole: ['admin', 'analyst'],
            },
            {
                id: 'user-activity',
                type: 'user-activity',
                title: 'User Activity',
                description: 'Real-time user activity monitoring',
                icon: '👥',
                visible: true,
                position: 1,
                size: 'large',
                requiredRole: ['admin', 'analyst', 'editor'],
            },
        ],
    },
};
