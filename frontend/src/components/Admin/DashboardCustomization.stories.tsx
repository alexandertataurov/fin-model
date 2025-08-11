import type { Meta, StoryObj } from '@storybook/react';
import DashboardCustomization from './DashboardCustomization';
import { useState } from 'react';

const meta: Meta<typeof DashboardCustomization> = {
    title: 'Admin/DashboardCustomization',
    component: DashboardCustomization,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Dashboard customization component for role-based widget management, layout configuration, and personalized user experiences. Integrates with the consolidated Admin Dashboard for personalized user experiences with drag-and-drop functionality and persistent settings.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        userRole: {
            control: 'select',
            options: ['admin', 'analyst', 'viewer', 'editor'],
            description: 'User role for role-based customization options',
        },
        currentConfig: {
            description: 'Current dashboard configuration with widgets and layout',
            control: false,
        },
        onConfigChange: {
            description: 'Callback function when configuration changes',
            control: false,
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

// ============================================================================
// ROLE-BASED STORIES
// ============================================================================

export const AdminRole: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Admin role customization with full access to all dashboard widgets and configuration options. Shows complete administrative interface with all available customization features.',
            },
        },
    },
};

export const AnalystRole: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'analyst',
    },
    parameters: {
        docs: {
            description: {
                story: 'Analyst role customization with access to data analysis widgets and limited administrative features. Focuses on analytical tools and reporting capabilities.',
            },
        },
    },
};

export const EditorRole: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'editor',
    },
    parameters: {
        docs: {
            description: {
                story: 'Editor role customization with content management widgets and basic monitoring features. Emphasizes content editing and publishing capabilities.',
            },
        },
    },
};

export const ViewerRole: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'viewer',
    },
    parameters: {
        docs: {
            description: {
                story: 'Viewer role customization with read-only access to dashboard widgets and reports. Shows limited interface focused on data consumption.',
            },
        },
    },
};

// ============================================================================
// CONFIGURATION STORIES
// ============================================================================

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
    parameters: {
        docs: {
            description: {
                story: 'Dashboard customization with pre-configured widgets showing system statistics and user activity monitoring. Demonstrates widget configuration and layout management.',
            },
        },
    },
};

export const WithEmptyConfig: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
        currentConfig: [],
    },
    parameters: {
        docs: {
            description: {
                story: 'Empty dashboard configuration showing the initial state with available widgets and setup options for new users.',
            },
        },
    },
};

export const WithComplexLayout: Story = {
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
            {
                id: 'performance-metrics',
                type: 'performance-metrics',
                title: 'Performance Metrics',
                description: 'Detailed performance analysis',
                icon: '⚡',
                visible: true,
                position: 2,
                size: 'small',
                requiredRole: ['admin'],
            },
            {
                id: 'security-alerts',
                type: 'security-alerts',
                title: 'Security Alerts',
                description: 'Security monitoring and alerts',
                icon: '🔒',
                visible: true,
                position: 3,
                size: 'medium',
                requiredRole: ['admin'],
            },
        ],
    },
    parameters: {
        docs: {
            description: {
                story: 'Complex dashboard layout with multiple widgets of different sizes and types, demonstrating advanced customization capabilities and layout management.',
            },
        },
    },
};

// ============================================================================
// FUNCTIONALITY STORIES
// ============================================================================

export const WithDragAndDrop: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Drag-and-drop functionality for widget positioning and layout customization. Shows interactive widget management with visual feedback.',
            },
        },
    },
};

export const WithWidgetResizing: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Widget resizing functionality allowing users to adjust widget sizes and optimize dashboard layout for their specific needs.',
            },
        },
    },
};

export const WithWidgetVisibility: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Widget visibility controls allowing users to show/hide specific widgets based on their preferences and requirements.',
            },
        },
    },
};

// ============================================================================
// PERSISTENCE STORIES
// ============================================================================

export const WithPersistentSettings: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Persistent settings functionality showing how user preferences and dashboard configurations are saved and restored across sessions.',
            },
        },
    },
};

export const WithSettingsSync: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Settings synchronization across devices and sessions, demonstrating how user preferences are maintained consistently.',
            },
        },
    },
};

// ============================================================================
// RESPONSIVE STORIES
// ============================================================================

export const MobileResponsive: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Mobile-responsive customization interface with touch-friendly controls, simplified layout options, and optimized mobile experience.',
            },
        },
    },
};

export const TabletResponsive: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
        docs: {
            description: {
                story: 'Tablet-optimized customization interface with balanced controls and optimal use of screen real estate for tablet users.',
            },
        },
    },
};

// ============================================================================
// ACCESSIBILITY STORIES
// ============================================================================

export const AccessibilityFocused: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Accessibility-focused customization interface with keyboard navigation, screen reader support, and WCAG compliance features.',
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
                        id: 'drag-and-drop',
                        enabled: true,
                    },
                ],
            },
        },
    },
};

// ============================================================================
// INTEGRATION STORIES
// ============================================================================

export const WithDashboardIntegration: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Integration with the main admin dashboard showing how customization features work within the larger administrative interface.',
            },
        },
    },
};

export const WithThemeIntegration: Story = {
    render: (args) => <DashboardCustomizationWrapper {...args} />,
    args: {
        userRole: 'admin',
    },
    parameters: {
        docs: {
            description: {
                story: 'Theme integration showing how customization options work with different themes and color schemes.',
            },
        },
    },
};
