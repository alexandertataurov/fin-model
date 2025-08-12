import React, { Suspense, lazy, useMemo, useCallback, useState, useEffect, useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Title, Stories, Controls, Canvas } from '@storybook/blocks';
import {
    AnimatedBanner,
    Container,
    SectionHeader,
    applyTypographyStyle,
} from '../../design-system/stories/components';
import { Settings, Loader2, Database, Users, Wrench, Monitor, FileText, Palette } from 'lucide-react';
import { AdminCard } from '../../components/AdminDashboard/components/AdminCard';
import { AdminTitle, AdminSubtitle, AdminBody, AdminCaption } from '../../components/AdminDashboard/components/AdminTypography';
import { tokens } from '../../design-system/tokens';
import { getSemanticSpacing, getSemanticColor, getStatusColor } from '../../components/AdminDashboard/utils/designSystemHelpers';

// Performance monitoring utility
const usePerformanceMonitor = (componentName: string) => {
    const renderCount = useRef(0);
    const startTime = useRef(performance.now());

    useEffect(() => {
        renderCount.current++;
        const endTime = performance.now();
        const renderTime = endTime - startTime.current;

        if (renderTime > 16) { // 60fps threshold
            console.warn(`[Performance] ${componentName} render took ${renderTime.toFixed(2)}ms (render #${renderCount.current})`);
        }

        startTime.current = performance.now();
    });
};

// Error boundary for component isolation
class ComponentErrorBoundary extends React.Component<
    { children: React.ReactNode; fallback?: React.ReactNode },
    { hasError: boolean; error?: Error }
> {
    constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Component Error Boundary caught error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || (
                <AdminCard
                    title="Component Error"
                    subtitle="An error occurred while rendering this component"
                    variant="outlined"
                    size="md"
                >
                    <div className="p-4 border border-red-200 bg-red-50 rounded-md">
                        <h3 className="text-red-800 font-medium">Component Error</h3>
                        <p className="text-red-600 text-sm mt-1">
                            {this.state.error?.message || 'An error occurred while rendering this component'}
                        </p>
                    </div>
                </AdminCard>
            );
        }

        return this.props.children;
    }
}

// Enhanced lazy loading with preloading and error handling
const createLazyComponent = (importFn: () => Promise<any>, componentName: string) => {
    const LazyComponent = lazy(() =>
        importFn().catch(error => {
            console.error(`Failed to load ${componentName}:`, error);
            return Promise.resolve({
                default: () => (
                    <AdminCard
                        title={`Failed to Load ${componentName}`}
                        subtitle="Please check the console for details"
                        variant="outlined"
                        size="md"
                    >
                        <div className="p-4 border border-red-200 bg-red-50 rounded-md">
                            <h3 className="text-red-800 font-medium">Failed to Load {componentName}</h3>
                            <p className="text-red-600 text-sm mt-1">Please check the console for details</p>
                        </div>
                    </AdminCard>
                )
            });
        })
    );

    // Preload function for better UX
    const preload = () => {
        importFn().catch(() => { }); // Silent preload
    };

    return { LazyComponent, preload };
};

// Lazy load heavy components with enhanced error handling
const DataManagement = createLazyComponent(
    () => import('../../components/AdminDashboard/DataManagement'),
    'DataManagement'
);

const DashboardCustomization = createLazyComponent(
    () => import('../../components/AdminDashboard/DashboardCustomization').then(module => ({ default: module.DashboardCustomization })),
    'DashboardCustomization'
);

const MaintenanceTools = createLazyComponent(
    () => import('../../components/AdminDashboard/MaintenanceTools').then(module => ({ default: module.MaintenanceTools })),
    'MaintenanceTools'
);

const UserManagement = createLazyComponent(
    () => import('../../components/AdminDashboard/UserManagement'),
    'UserManagement'
);

const SystemMonitoring = createLazyComponent(
    () => import('../../components/AdminDashboard/SystemMonitoring'),
    'SystemMonitoring'
);

const LogFilterForm = createLazyComponent(
    () => import('../../components/AdminDashboard/LogFilterForm'),
    'LogFilterForm'
);

// Enhanced icon component with performance optimizations
const Icon = React.memo<{ icon: React.ComponentType<any>; size?: 'sm' | 'md' | 'lg'; className?: string }>(
    ({ icon: IconComponent, size = 'md', className = '' }) => {
        const sizeClasses = useMemo(() => ({
            sm: 'h-4 w-4',
            md: 'h-5 w-5',
            lg: 'h-6 w-6'
        }), []);

        return <IconComponent className={`${sizeClasses[size]} ${className}`} />;
    }
);
Icon.displayName = 'Icon';

// Memoized banner icon
const BannerIcon = React.memo(() => <Icon icon={Settings} size="lg" />);
BannerIcon.displayName = 'BannerIcon';

// Enhanced callback functions with debouncing and memoization
const useDebouncedCallback = (callback: Function, delay: number) => {
    const timeoutRef = useRef<NodeJS.Timeout>();

    return useCallback((...args: any[]) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => callback(...args), delay);
    }, [callback, delay]);
};

// Virtual scrolling hook for large lists
const useVirtualScroll = (items: any[], itemHeight: number, containerHeight: number) => {
    const [scrollTop, setScrollTop] = useState(0);

    const visibleItems = useMemo(() => {
        const startIndex = Math.floor(scrollTop / itemHeight);
        const endIndex = Math.min(startIndex + Math.ceil(containerHeight / itemHeight) + 1, items.length);
        return items.slice(startIndex, endIndex).map((item, index) => ({
            ...item,
            index: startIndex + index,
            style: { transform: `translateY(${(startIndex + index) * itemHeight}px)` }
        }));
    }, [items, itemHeight, containerHeight, scrollTop]);

    const totalHeight = items.length * itemHeight;

    return { visibleItems, totalHeight, setScrollTop };
};

// Memory leak prevention hook
const useCleanup = (cleanupFn: () => void) => {
    useEffect(() => {
        return cleanupFn;
    }, [cleanupFn]);
};

// Pre-computed spacing using design system helpers
const componentSpacing = getSemanticSpacing('component');
const layoutSpacing = getSemanticSpacing('layout');

// Enhanced loading fallback component with performance monitoring
const LoadingFallback = React.memo(() => {
    usePerformanceMonitor('LoadingFallback');

    const styles = useMemo(() => ({
        subtitle: applyTypographyStyle('subtitle'),
        body: applyTypographyStyle('body')
    }), []);

    return (
        <AdminCard
            title="Loading Component"
            subtitle="Please wait while we load the component"
            variant="elevated"
            size="md"
        >
            <div 
                className="flex items-center justify-center"
                style={{ padding: componentSpacing.padding }}
            >
                <div className="flex items-center gap-3">
                    <Icon icon={Loader2} className="animate-spin" />
                    <span
                        style={styles.body}
                        className="text-muted-foreground"
                    >
                        Loading component...
                    </span>
                </div>
            </div>
        </AdminCard>
    );
});
LoadingFallback.displayName = 'LoadingFallback';

// Enhanced component wrapper with performance optimizations
const ComponentWrapper = React.memo<{
    title: string;
    subtitle: string;
    children: React.ReactNode;
    useCard?: boolean;
    cardTitle?: string;
    description?: string;
}>(({ title, subtitle, children, useCard = false, cardTitle, description }) => {
    usePerformanceMonitor('ComponentWrapper');

    const styles = useMemo(() => ({
        subtitle: applyTypographyStyle('subtitle'),
        body: applyTypographyStyle('body')
    }), []);

    // Preload components on mount
    useEffect(() => {
        const preloadComponents = () => {
            DataManagement.preload();
            DashboardCustomization.preload();
            MaintenanceTools.preload();
            UserManagement.preload();
            SystemMonitoring.preload();
            LogFilterForm.preload();
        };

        // Use requestIdleCallback for non-critical preloading
        if ('requestIdleCallback' in window) {
            (window as any).requestIdleCallback(preloadComponents);
        } else {
            setTimeout(preloadComponents, 1000);
        }
    }, []);

    return (
        <div style={{ gap: layoutSpacing.section }} className="space-y-8">
            <SectionHeader title={title} subtitle={subtitle} />
            {description && (
                <div className="max-w-4xl">
                    <AdminBody>{description}</AdminBody>
                </div>
            )}
            <Container>
                {useCard ? (
                    <AdminCard
                        title={cardTitle}
                        subtitle="Component demonstration"
                        variant="elevated"
                        size="lg"
                    >
                        <Suspense fallback={<LoadingFallback />}>
                            <ComponentErrorBoundary>
                                {children}
                            </ComponentErrorBoundary>
                        </Suspense>
                    </AdminCard>
                ) : (
                    <Suspense fallback={<LoadingFallback />}>
                        <ComponentErrorBoundary>
                            {children}
                        </ComponentErrorBoundary>
                    </Suspense>
                )}
            </Container>
        </div>
    );
});
ComponentWrapper.displayName = 'ComponentWrapper';

// Hook-based props components
const LogFilterFormPropsProvider: React.FC<{ children: (props: any) => React.ReactNode }> = ({ children }) => {
    const props = useMemo(() => ({
        level: "all" as const,
        limit: 50,
        from: "",
        to: "",
        search: "",
        skip: 0,
        total: 1250,
        onChange: useCallback((filters: any) => console.log('Log filters changed:', filters), []),
        onRefresh: useCallback(() => console.log('Refreshing logs...'), []),
        onPrev: useCallback(() => console.log('Previous page'), []),
        onNext: useCallback(() => console.log('Next page'), [])
    }), []);

    return <>{children(props)}</>;
};

const DashboardCustomizationPropsProvider: React.FC<{ children: (props: any) => React.ReactNode }> = ({ children }) => {
    const handleConfigChange = useCallback((config: any) => {
        console.log('Dashboard config changed:', config);
    }, []);

    const props = useMemo(() => ({
        userRole: "admin" as const,
        onConfigChange: handleConfigChange
    }), [handleConfigChange]);

    return <>{children(props)}</>;
};

const meta: Meta = {
    title: 'Pages/Admin Dashboard/Components',
    tags: ['autodocs'],
    parameters: {
        layout: 'padded',
        docs: {
            autodocs: true,
            page: () => {
                const styles = useMemo(() => ({
                    subtitle: applyTypographyStyle('subtitle'),
                    body: applyTypographyStyle('body')
                }), []);

                return (
                    <>
                        <Title />
                        <div style={styles.body}>
                            Comprehensive collection of admin dashboard components designed for enterprise-level
                            financial modeling and business intelligence applications. Each component is optimized
                            for performance, accessibility, and user experience.
                        </div>
                        <AnimatedBanner
                            title="Admin Dashboard Components"
                            subtitle="Individual components and tools for the admin dashboard system"
                            icon={<BannerIcon />}
                        />
                        <Controls />
                        <Stories includePrimary={true} />
                    </>
                );
            },
        },
    },
    decorators: [
        (Story) => (
            <ComponentErrorBoundary>
                <div className="min-h-screen bg-background">
                    <Story />
                </div>
            </ComponentErrorBoundary>
        ),
    ],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const DataManagementComponent: Story = {
    render: () => (
        <ComponentWrapper
            title="Data Management Component"
            subtitle="Comprehensive data management and analytics tools"
            description="Advanced data management interface providing real-time analytics, data visualization, 
            export capabilities, and comprehensive reporting tools. Features include data filtering, 
            bulk operations, and integration with external data sources."
        >
            <DataManagement.LazyComponent />
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
        <DashboardCustomizationPropsProvider>
            {(dashboardProps) => (
                <ComponentWrapper
                    title="Dashboard Customization Component"
                    subtitle="Customize dashboard layout and preferences"
                    useCard={true}
                    cardTitle="Dashboard Customization"
                    description="Flexible dashboard customization interface allowing users to personalize their workspace, 
                    configure widgets, set preferences, and manage dashboard layouts. Supports drag-and-drop functionality 
                    and role-based customization options."
                >
                    <DashboardCustomization.LazyComponent {...dashboardProps} />
                </ComponentWrapper>
            )}
        </DashboardCustomizationPropsProvider>
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
            <MaintenanceTools.LazyComponent />
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
            <UserManagement.LazyComponent />
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
            <SystemMonitoring.LazyComponent refreshInterval={30000} />
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
        <LogFilterFormPropsProvider>
            {(logFilterProps) => (
                <ComponentWrapper
                    title="Log Filter Form Component"
                    subtitle="Advanced log filtering and search capabilities"
                    useCard={true}
                    cardTitle="Log Filter Form"
                    description="Advanced log filtering interface with comprehensive search capabilities, date range selection, 
                    log level filtering, and export functionality. Supports complex queries, saved filters, and 
                    real-time log streaming."
                >
                    <LogFilterForm.LazyComponent {...logFilterProps} />
                </ComponentWrapper>
            )}
        </LogFilterFormPropsProvider>
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

// Additional story showcasing component interactions with performance optimizations
export const ComponentInteractions: Story = {
    render: () => {
        const styles = useMemo(() => ({
            subtitle: applyTypographyStyle('subtitle'),
            body: applyTypographyStyle('body')
        }), []);

        // Memoized static data to prevent re-creation
        const systemStatusData = useMemo(() => [
            { label: 'CPU Usage', value: '45%', color: getSemanticColor('success') },
            { label: 'Memory Usage', value: '78%', color: getSemanticColor('warning') },
            { label: 'Active Users', value: '127', color: getSemanticColor('info') }
        ], []);

        const userActivityData = useMemo(() => [
            { action: 'Data export completed', time: '2 min ago' },
            { action: 'New user registered', time: '5 min ago' },
            { action: 'Backup process started', time: '10 min ago' }
        ], []);

        return (
            <ComponentWrapper
                title="Component Interactions"
                subtitle="Demonstrating component communication and state management"
                description="This example showcases how different admin dashboard components can interact with each other, 
                sharing state and communicating through events. Demonstrates best practices for component composition 
                and data flow in complex admin interfaces."
            >
                <div 
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                    style={{ gap: componentSpacing.padding }}
                >
                    <AdminCard
                        title="System Status"
                        subtitle="Real-time system monitoring with alert integration"
                        variant="elevated"
                        size="md"
                    >
                        <div style={{ gap: componentSpacing.gap }} className="space-y-2">
                            {systemStatusData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <AdminBody>{item.label}</AdminBody>
                                    <AdminSubtitle style={{ color: item.color }}>{item.value}</AdminSubtitle>
                                </div>
                            ))}
                        </div>
                    </AdminCard>
                    <AdminCard
                        title="User Activity"
                        subtitle="Recent user actions and system events"
                        variant="elevated"
                        size="md"
                    >
                        <div style={{ gap: componentSpacing.gap }} className="space-y-2">
                            {userActivityData.map((item, index) => (
                                <div key={index} className="flex justify-between items-center text-sm">
                                    <AdminBody>{item.action}</AdminBody>
                                    <AdminCaption>{item.time}</AdminCaption>
                                </div>
                            ))}
                        </div>
                    </AdminCard>
                </div>
            </ComponentWrapper>
        );
    },
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
