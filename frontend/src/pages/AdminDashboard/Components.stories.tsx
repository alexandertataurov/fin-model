import React, { Suspense, lazy } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title, Stories, Description, Controls, Canvas } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    Card,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { Settings, Loader2, Database, Users, Wrench, Monitor, FileText, Palette } from 'lucide-react';

// Lazy load heavy components to prevent freezing
const DataManagement = lazy(() => import('../../components/AdminDashboard/DataManagement'));
const DashboardCustomization = lazy(() => import('../../components/AdminDashboard/DashboardCustomization').then(module => ({ default: module.DashboardCustomization })));
const MaintenanceTools = lazy(() => import('../../components/AdminDashboard/MaintenanceTools').then(module => ({ default: module.MaintenanceTools })));
const UserManagement = lazy(() => import('../../components/AdminDashboard/UserManagement'));
const SystemMonitoring = lazy(() => import('../../components/AdminDashboard/SystemMonitoring'));
const LogFilterForm = lazy(() => import('../../components/AdminDashboard/LogFilterForm'));

// Pre-computed typography styles to prevent re-computation
const subtitleStyle = applyTypographyStyle('subtitle');
const bodyStyle = applyTypographyStyle('body');

// Enhanced icon component with design system principles
const Icon = React.memo<{ icon: React.ComponentType<any>; size?: 'sm' | 'md' | 'lg'; className?: string }>(
    ({ icon: IconComponent, size = 'md', className = '' }) => {
        const sizeClasses = {
            sm: 'h-4 w-4',
            md: 'h-5 w-5',
            lg: 'h-6 w-6'
        };
        return <IconComponent className={`${sizeClasses[size]} ${className}`} />;
    }
);

// Memoized banner icon
const BannerIcon = React.memo(() => <Icon icon={Settings} size="lg" />);

// Enhanced callback functions with better logging
const noop = () => { };
const handleConfigChange = (config: any) => {
    console.log('Dashboard config changed:', config);
};

// Enhanced static props objects with realistic data
const logFilterFormProps = {
    level: "all" as const,
    limit: 50,
    from: "",
    to: "",
    search: "",
    skip: 0,
    total: 1250,
    onChange: (filters: any) => console.log('Log filters changed:', filters),
    onRefresh: () => console.log('Refreshing logs...'),
    onPrev: () => console.log('Previous page'),
    onNext: () => console.log('Next page')
};

const dashboardCustomizationProps = {
    userRole: "admin" as const,
    onConfigChange: handleConfigChange
};

// Enhanced loading fallback component
const LoadingFallback = React.memo(() => (
    <div className="flex items-center justify-center p-8">
        <div className="flex items-center gap-3">
            <Icon icon={Loader2} className="animate-spin" />
            <span
                style={bodyStyle}
                className="text-muted-foreground"
            >
                Loading component...
            </span>
        </div>
    </div>
));

const meta: Meta = {
    title: 'Pages/Admin Dashboard/Components',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => (
                <>
                    <Title />
                    <Description>
                        Comprehensive collection of admin dashboard components designed for enterprise-level
                        financial modeling and business intelligence applications. Each component is optimized
                        for performance, accessibility, and user experience.
                    </Description>
                    <AnimatedBanner
                        title="Admin Dashboard Components"
                        subtitle="Individual components and tools for the admin dashboard system"
                        icon={<BannerIcon />}
                    />
                    <Controls />
                    <Stories includePrimary={true} />
                </>
            ),
        },
    },
    decorators: [
        (Story) => (
            <div className="min-h-screen bg-background">
                <Story />
            </div>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof meta>;

// Enhanced component wrapper with better documentation
const ComponentWrapper = React.memo<{
    title: string;
    subtitle: string;
    children: React.ReactNode;
    useCard?: boolean;
    cardTitle?: string;
    description?: string;
}>(({ title, subtitle, children, useCard = false, cardTitle, description }) => (
    <div className="space-y-8">
        <SectionHeader title={title} subtitle={subtitle} />
        {description && (
            <div className="max-w-4xl">
                <p style={bodyStyle} className="text-muted-foreground">
                    {description}
                </p>
            </div>
        )}
        <Container>
            {useCard ? (
                <Card>
                    <div className="p-6">
                        {cardTitle && (
                            <h2
                                style={subtitleStyle}
                                className="mb-6"
                            >
                                {cardTitle}
                            </h2>
                        )}
                        <Suspense fallback={<LoadingFallback />}>
                            {children}
                        </Suspense>
                    </div>
                </Card>
            ) : (
                <Suspense fallback={<LoadingFallback />}>
                    {children}
                </Suspense>
            )}
        </Container>
    </div>
));

export const DataManagementComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Data Management Component"
            subtitle="Comprehensive data management and analytics tools"
            description="Advanced data management interface providing real-time analytics, data visualization, 
            export capabilities, and comprehensive reporting tools. Features include data filtering, 
            bulk operations, and integration with external data sources."
        >
            <DataManagement />
        </ComponentWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story: 'The Data Management component provides a comprehensive interface for managing financial data, ' +
                    'including real-time analytics, data visualization, and export capabilities. It supports ' +
                    'bulk operations, advanced filtering, and integration with external data sources.',
            },
        },
    },
    argTypes: {
        onDataExport: { action: 'data exported' },
        onDataImport: { action: 'data imported' },
        onDataFilter: { action: 'data filtered' },
    },
};

export const DashboardCustomizationComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Dashboard Customization Component"
            subtitle="Customize dashboard layout and preferences"
            useCard={true}
            cardTitle="Dashboard Customization"
            description="Flexible dashboard customization interface allowing users to personalize their workspace, 
            configure widgets, set preferences, and manage dashboard layouts. Supports drag-and-drop functionality 
            and role-based customization options."
        >
            <DashboardCustomization {...dashboardCustomizationProps} />
        </ComponentWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story: 'The Dashboard Customization component enables users to personalize their dashboard experience ' +
                    'through drag-and-drop widget management, layout configuration, and role-based customization. ' +
                    'It supports multiple themes and responsive design patterns.',
            },
        },
    },
    argTypes: {
        userRole: {
            control: { type: 'select' },
            options: ['admin', 'manager', 'analyst', 'viewer'],
            description: 'User role determining available customization options',
        },
        onConfigChange: { action: 'configuration changed' },
        onLayoutSave: { action: 'layout saved' },
        onThemeChange: { action: 'theme changed' },
    },
};

export const MaintenanceToolsComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Maintenance Tools Component"
            subtitle="System maintenance and administrative tools"
            description="Comprehensive maintenance toolkit for system administrators, including database optimization, 
            cache management, backup operations, and system health monitoring. Provides detailed logs and 
            performance metrics for troubleshooting."
        >
            <MaintenanceTools />
        </ComponentWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story: 'The Maintenance Tools component provides system administrators with comprehensive tools ' +
                    'for database optimization, cache management, backup operations, and system health monitoring. ' +
                    'It includes detailed logging and performance metrics for effective troubleshooting.',
            },
        },
    },
    argTypes: {
        onMaintenanceStart: { action: 'maintenance started' },
        onBackupCreate: { action: 'backup created' },
        onCacheClear: { action: 'cache cleared' },
        onOptimizeDatabase: { action: 'database optimized' },
    },
};

export const UserManagementComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="User Management Component"
            subtitle="Complete user management interface"
            description="Full-featured user management system with role-based access control, user provisioning, 
            permission management, and audit trails. Supports bulk operations, user activity monitoring, 
            and integration with external authentication systems."
        >
            <UserManagement />
        </ComponentWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story: 'The User Management component provides comprehensive user administration capabilities ' +
                    'including role-based access control, user provisioning, permission management, and audit trails. ' +
                    'It supports bulk operations and integrates with external authentication systems.',
            },
        },
    },
    argTypes: {
        onUserCreate: { action: 'user created' },
        onUserUpdate: { action: 'user updated' },
        onUserDelete: { action: 'user deleted' },
        onRoleAssign: { action: 'role assigned' },
        onPermissionChange: { action: 'permission changed' },
    },
};

export const SystemMonitoringComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="System Monitoring Component"
            subtitle="Real-time system monitoring and metrics"
            description="Real-time system monitoring dashboard displaying key performance indicators, resource usage, 
            application health, and alert management. Features interactive charts, historical data analysis, 
            and configurable alert thresholds."
        >
            <SystemMonitoring refreshInterval={30000} />
        </ComponentWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story: 'The System Monitoring component provides real-time visibility into system performance ' +
                    'through interactive charts, resource usage metrics, and health indicators. It includes ' +
                    'historical data analysis and configurable alert thresholds for proactive monitoring.',
            },
        },
    },
    argTypes: {
        refreshInterval: {
            control: { type: 'number', min: 5000, max: 60000, step: 5000 },
            description: 'Refresh interval in milliseconds',
        },
        onAlertAcknowledge: { action: 'alert acknowledged' },
        onMetricClick: { action: 'metric clicked' },
        onThresholdChange: { action: 'threshold changed' },
    },
};

export const LogFilterFormComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Log Filter Form Component"
            subtitle="Advanced log filtering and search capabilities"
            useCard={true}
            cardTitle="Log Filter Form"
            description="Advanced log filtering interface with comprehensive search capabilities, date range selection, 
            log level filtering, and export functionality. Supports complex queries, saved filters, and 
            real-time log streaming."
        >
            <LogFilterForm {...logFilterFormProps} />
        </ComponentWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story: 'The Log Filter Form component provides advanced log filtering and search capabilities ' +
                    'with support for complex queries, date ranges, log levels, and export functionality. ' +
                    'It includes saved filters and real-time log streaming for efficient debugging.',
            },
        },
    },
    argTypes: {
        level: {
            control: { type: 'select' },
            options: ['all', 'error', 'warn', 'info', 'debug'],
            description: 'Log level filter',
        },
        limit: {
            control: { type: 'number', min: 10, max: 1000, step: 10 },
            description: 'Number of log entries to display',
        },
        search: {
            control: { type: 'text' },
            description: 'Search query for log content',
        },
        onChange: { action: 'filters changed' },
        onRefresh: { action: 'logs refreshed' },
        onExport: { action: 'logs exported' },
    },
};

// Additional story showcasing component interactions
export const ComponentInteractions: Story = {
    render: () => (
        <ComponentWrapper
            title="Component Interactions"
            subtitle="Demonstrating component communication and state management"
            description="This example showcases how different admin dashboard components can interact with each other, 
            sharing state and communicating through events. Demonstrates best practices for component composition 
            and data flow in complex admin interfaces."
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <div className="p-6">
                        <h3 style={subtitleStyle} className="mb-4 flex items-center gap-2">
                            <Icon icon={Monitor} size="sm" />
                            System Status
                        </h3>
                        <p style={bodyStyle} className="text-muted-foreground mb-4">
                            Real-time system monitoring with alert integration
                        </p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span>CPU Usage</span>
                                <span className="text-green-600">45%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Memory Usage</span>
                                <span className="text-yellow-600">78%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span>Active Users</span>
                                <span className="text-blue-600">127</span>
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="p-6">
                        <h3 style={subtitleStyle} className="mb-4 flex items-center gap-2">
                            <Icon icon={Users} size="sm" />
                            User Activity
                        </h3>
                        <p style={bodyStyle} className="text-muted-foreground mb-4">
                            Recent user actions and system events
                        </p>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm">
                                <span>Data export completed</span>
                                <span className="text-muted-foreground">2 min ago</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>New user registered</span>
                                <span className="text-muted-foreground">5 min ago</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span>Backup process started</span>
                                <span className="text-muted-foreground">10 min ago</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </ComponentWrapper>
    ),
    parameters: {
        docs: {
            description: {
                story: 'This example demonstrates how different admin dashboard components can work together, ' +
                    'sharing state and communicating through events. It showcases best practices for ' +
                    'component composition and data flow in complex admin interfaces.',
            },
        },
    },
};
