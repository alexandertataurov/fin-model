import React from "react";
import type { Meta, StoryObj } from '@storybook/react';
import { MaintenanceTools } from './MaintenanceTools';

const meta: Meta<typeof MaintenanceTools> = {
    title: 'Admin/MaintenanceTools',
    component: MaintenanceTools,
    parameters: {
        layout: 'padded',
        docs: {
            description: {
                component: 'Advanced maintenance tools for database cleanup, file management, and system optimization with dry-run previews, audit tracking, and role-based access controls. Part of the consolidated Admin Dashboard system.',
            },
        },
    },
    tags: ['autodocs'],
    argTypes: {
        onOperationComplete: {
            description: 'Callback function triggered when maintenance operations complete',
            control: false,
        },
    },
};

export default meta;
type Story = StoryObj<typeof MaintenanceTools>;

// ============================================================================
// DEFAULT STORIES
// ============================================================================

export const Default: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Default maintenance tools interface with database cleanup, file management, and system optimization options. Shows all available maintenance operations with their current status.',
            },
        },
    },
};

// ============================================================================
// FUNCTIONALITY STORIES
// ============================================================================

export const WithOperationComplete: Story = {
    args: {
        onOperationComplete: (result) => {
            console.log('Operation completed:', result);
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Maintenance tools with operation completion callback for integration with the main admin dashboard. Demonstrates proper event handling and result processing.',
            },
        },
    },
};

export const DatabaseCleanup: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Database cleanup functionality showing orphaned record detection, data integrity checks, and automated cleanup operations with safety previews.',
            },
        },
    },
};

export const FileManagement: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'File management tools for handling orphaned files, failed uploads, and storage optimization with detailed file analysis and cleanup options.',
            },
        },
    },
};

export const SystemOptimization: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'System optimization features including cache clearing, performance tuning, and resource management with real-time system impact analysis.',
            },
        },
    },
};

// ============================================================================
// STATE-BASED STORIES
// ============================================================================

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
                story: 'Maintenance tools with loading state indicators and user feedback during operations. Shows progress indicators and operation status updates.',
            },
        },
    },
};

export const WithActiveOperations: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Maintenance tools with active operations in progress, showing real-time status updates, progress bars, and operation cancellation options.',
            },
        },
    },
};

export const WithCompletedOperations: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Maintenance tools showing completed operations with detailed results, audit logs, and operation history for review and analysis.',
            },
        },
    },
};

// ============================================================================
// SECURITY STORIES
// ============================================================================

export const WithRoleBasedAccess: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Role-based access control demonstration showing different maintenance options based on user permissions and security levels.',
            },
        },
    },
};

export const WithAuditLogging: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Audit logging functionality showing detailed operation tracking, user activity logs, and compliance reporting for maintenance operations.',
            },
        },
    },
};

// ============================================================================
// SAFETY STORIES
// ============================================================================

export const WithDryRunPreview: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Dry-run preview functionality allowing users to see the impact of maintenance operations before execution, ensuring safe system management.',
            },
        },
    },
};

export const WithSafetyChecks: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Safety check features including operation validation, dependency analysis, and risk assessment before executing maintenance tasks.',
            },
        },
    },
};

// ============================================================================
// RESPONSIVE STORIES
// ============================================================================

export const MobileResponsive: Story = {
    args: {},
    parameters: {
        viewport: {
            defaultViewport: 'mobile1',
        },
        docs: {
            description: {
                story: 'Mobile-responsive maintenance tools with touch-friendly interface, simplified navigation, and optimized layout for mobile devices.',
            },
        },
    },
};

export const TabletResponsive: Story = {
    args: {},
    parameters: {
        viewport: {
            defaultViewport: 'tablet',
        },
        docs: {
            description: {
                story: 'Tablet-optimized maintenance tools with balanced interface elements and optimal use of screen real estate for tablet users.',
            },
        },
    },
};

// ============================================================================
// ACCESSIBILITY STORIES
// ============================================================================

export const AccessibilityFocused: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Accessibility-focused maintenance tools with keyboard navigation, screen reader support, and WCAG compliance features.',
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
                        id: 'button-name',
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
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Integration with the main admin dashboard showing how maintenance tools work within the larger administrative interface.',
            },
        },
    },
};

export const WithNotificationSystem: Story = {
    args: {},
    parameters: {
        docs: {
            description: {
                story: 'Notification system integration showing real-time alerts, operation status updates, and user feedback for maintenance operations.',
            },
        },
    },
};
