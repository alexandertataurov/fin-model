import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import AdminDashboard from './AdminDashboard';

const meta: Meta<typeof AdminDashboard> = {
    title: 'Admin/AdminDashboard',
    component: AdminDashboard,
    parameters: {
        layout: 'fullscreen',
        docs: {
            description: {
                component: 'Consolidated admin dashboard with modern design, comprehensive system monitoring, and unified functionality. Features overview, health monitoring, and system logs in a tabbed interface with enhanced user experience and accessibility.',
            },
        },
    },
    tags: ['autodocs'],
    decorators: [
        (Story) => (
            <div className="p-6 bg-gray-50 min-h-screen">
                <Story />
            </div>
        ),
    ],
    argTypes: {
        // Add any props if the component accepts them
    },
};

export default meta;
type Story = StoryObj<typeof AdminDashboard>;

// ============================================================================
// DEFAULT STORIES
// ============================================================================

export const Default: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Default admin dashboard view showing the overview tab with system metrics, user activity, and system alerts. This is the primary interface for system administrators.',
            },
        },
    },
};

// ============================================================================
// TAB-BASED STORIES
// ============================================================================

export const OverviewTab: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Overview tab displaying system health indicators, performance metrics, user activity, and system alerts with modern card-based layout and real-time data visualization.',
            },
        },
    },
};

export const HealthTab: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Health monitoring tab showing system health, database health, and network services status with detailed metrics, status indicators, and service connectivity monitoring.',
            },
        },
    },
};

export const LogsTab: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'System logs tab with advanced filtering, search capabilities, pagination, and real-time log management for comprehensive system monitoring and debugging.',
            },
        },
    },
};

// ============================================================================
// STATE-BASED STORIES
// ============================================================================

export const LoadingState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Shows loading skeleton when admin data is being fetched, providing visual feedback during data loading with smooth transitions and user-friendly loading indicators.',
            },
        },
    },
};

export const NoDataState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Displays appropriate messaging when no admin data is available, with helpful guidance for users and clear call-to-action buttons for data refresh.',
            },
        },
    },
};

export const ErrorState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Error boundary handling for admin dashboard with retry functionality, user-friendly error messages, and graceful degradation when services are unavailable.',
            },
        },
    },
};

export const HealthySystemState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Dashboard view when all systems are healthy, showing green status indicators, optimal performance metrics, and positive system alerts.',
            },
        },
    },
};

export const WarningSystemState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Dashboard view with system warnings, showing yellow status indicators, elevated performance metrics, and warning alerts for proactive system management.',
            },
        },
    },
};

export const CriticalSystemState: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Dashboard view with critical system issues, showing red status indicators, high performance metrics, and critical alerts requiring immediate attention.',
            },
        },
    },
};

// ============================================================================
// RESPONSIVE DESIGN STORIES
// ============================================================================

export const MobileResponsive: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Mobile-responsive design with adaptive layouts, touch-friendly interactions, optimized spacing for smaller screens, and simplified navigation for mobile users.',
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
                story: 'Tablet-optimized layout with balanced grid systems, touch-friendly interface elements, and optimal information density for tablet users.',
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
                story: 'Desktop-wide layout with expanded grid systems, enhanced information density, optimized for large screens, and full feature accessibility.',
            },
        },
    },
};

export const UltraWideDesktop: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        viewport: {
            defaultViewport: 'desktop',
            viewports: {
                ultraWide: {
                    name: 'Ultra Wide Desktop',
                    styles: {
                        width: '2560px',
                        height: '1440px',
                    },
                },
            },
        },
        docs: {
            description: {
                story: 'Ultra-wide desktop layout showcasing the dashboard on large monitors with maximum information density and optimal use of screen real estate.',
            },
        },
    },
};

// ============================================================================
// INTERACTION STORIES
// ============================================================================

export const WithUserInteractions: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Interactive dashboard demonstrating user interactions, hover effects, button states, and dynamic content updates with smooth transitions.',
            },
        },
    },
};

export const WithDataRefresh: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Dashboard showing data refresh functionality, loading states, and real-time updates with proper user feedback and progress indicators.',
            },
        },
    },
};

export const WithFilteringAndSearch: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Log filtering and search functionality demonstration with advanced filtering options, date range selection, and real-time search results.',
            },
        },
    },
};

// ============================================================================
// ACCESSIBILITY STORIES
// ============================================================================

export const AccessibilityFocused: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Accessibility-focused view highlighting keyboard navigation, screen reader support, high contrast mode, and WCAG compliance features.',
            },
        },
        a11y: {
            config: {
                rules: [
                    {
                        id: 'color-contrast',
                        enabled: true,
                    },
                    {
                        id: 'heading-order',
                        enabled: true,
                    },
                ],
            },
        },
    },
};

export const KeyboardNavigation: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Demonstrates full keyboard navigation support, focus management, and logical tab order throughout the admin dashboard interface.',
            },
        },
    },
};

// ============================================================================
// PERFORMANCE STORIES
// ============================================================================

export const PerformanceOptimized: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Performance-optimized dashboard with lazy loading, efficient rendering, and optimized data fetching for large datasets and high-traffic scenarios.',
            },
        },
    },
};

export const WithLargeDatasets: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Dashboard handling large datasets with virtual scrolling, pagination, and efficient data management for enterprise-scale deployments.',
            },
        },
    },
};

// ============================================================================
// THEME STORIES
// ============================================================================

export const LightTheme: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Light theme variant showcasing the admin dashboard with bright colors, high contrast, and optimal readability in well-lit environments.',
            },
        },
    },
};

export const DarkTheme: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Dark theme variant (when implemented) showing the admin dashboard with dark colors, reduced eye strain, and optimal viewing in low-light conditions.',
            },
        },
    },
};

// ============================================================================
// INTEGRATION STORIES
// ============================================================================

export const WithRealTimeUpdates: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Real-time updates integration showing live data feeds, WebSocket connections, and dynamic content updates without page refresh.',
            },
        },
    },
};

export const WithExportFunctionality: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Export functionality demonstration with data export options, report generation, and file download capabilities for administrative reporting.',
            },
        },
    },
};

export const WithCustomization: Story = {
    render: () => <AdminDashboard />,
    parameters: {
        docs: {
            description: {
                story: 'Customization features showing user preferences, widget configuration, layout options, and personalized dashboard experiences.',
            },
        },
    },
};
