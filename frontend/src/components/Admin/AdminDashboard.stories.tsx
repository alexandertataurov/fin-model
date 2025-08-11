import type { Meta, StoryObj } from '@storybook/react';
import { AdminDashboard } from './AdminDashboard';

const meta: Meta<typeof AdminDashboard> = {
    title: 'Admin/AdminDashboard',
    component: AdminDashboard,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Consolidated admin dashboard with modern design, comprehensive system monitoring, and unified functionality. Features overview, health monitoring, and system logs in a tabbed interface.',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="p-6 bg-background min-h-screen">
                <Story />
            </div>
        ),
    ],
};

export default meta;
type Story = StoryObj<typeof AdminDashboard>;

export const Default: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Default admin dashboard view showing the overview tab with system metrics, user activity, and system alerts.',
            },
        },
    },
};

export const OverviewTab: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Overview tab displaying system health indicators, performance metrics, user activity, and system alerts with modern card-based layout.',
            },
        },
    },
};

export const HealthTab: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Health monitoring tab showing system health, database health, and network services status with detailed metrics and status indicators.',
            },
        },
    },
};

export const LogsTab: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'System logs tab with advanced filtering, search capabilities, and pagination for comprehensive log management.',
            },
        },
    },
};

export const LoadingState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Shows loading skeleton when admin data is being fetched, providing visual feedback during data loading.',
            },
        },
    },
};

export const NoDataState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Displays appropriate messaging when no admin data is available, with helpful guidance for users.',
            },
        },
    },
};

export const ErrorState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Error boundary handling for admin dashboard with retry functionality and user-friendly error messages.',
            },
        },
    },
};

export const MobileResponsive: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Mobile-responsive design with adaptive layouts, touch-friendly interactions, and optimized spacing for smaller screens.',
            },
        },
    },
};

export const TabletResponsive: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
        docs: {
            description: {
                story: 'Tablet-optimized layout with balanced grid systems and touch-friendly interface elements.',
            },
        },
    },
};

export const DesktopWide: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        viewport: {
            defaultViewport: 'desktop',
        },
        docs: {
            description: {
                story: 'Desktop-wide layout with expanded grid systems, enhanced information density, and optimized for large screens.',
            },
        },
    },
};
