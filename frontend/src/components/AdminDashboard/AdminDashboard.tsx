/**
 * Consolidated Admin Dashboard Component
 * 
 * Modern admin dashboard with unified design and comprehensive functionality
 * Updated to follow design system foundations guidelines
 * PERFORMANCE OPTIMIZED: Memoized components, lazy loading, virtualization, and freezing prevention
 */

import React, { useState, useEffect, memo, useMemo, useCallback, Suspense, lazy } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Progress } from '@/design-system/components/Progress';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import { tokens } from '@/design-system/tokens';
import { useAdminStore } from '@/stores/admin';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdminSectionErrorBoundary } from '@/components/ErrorBoundary';
import DashboardCustomization from './DashboardCustomization';
import { AdminHeader } from './components/AdminHeader';

// Import updated design system helpers
import {
    applyDesignSystemSpacing,
    applyDesignSystemRadius,
    getSemanticShadow,
    applyDesignSystemMotion,
    getSemanticColor,
    getSemanticSpacing,
    formatPercentage,
    formatNumber,
    getStatusBadge,
    applyTypographyStyle
} from './utils/designSystemHelpers';

// Import updated AdminDashboard components
import {
    AdminTitle,
    AdminBody,
    AdminLoadingSpinner
} from './components';
import {
    Users,
    FileText,
    Database,
    HardDrive,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    Activity,
    Cpu,
    Clock,
    Zap,
    Bell,
    Settings,
    Shield,
    BarChart3,
    TrendingUp,
    Server,
    RefreshCw,
    MoreHorizontal,
} from 'lucide-react';

// Lazy load heavy components to prevent initial bundle size issues
const LazyDataManagement = lazy(() => import('./DataManagement'));
const LazyMaintenanceTools = lazy(() => import('./MaintenanceTools').then(module => ({ default: module.MaintenanceTools })));
const LazyUserManagement = lazy(() => import('./UserManagement'));
const LazySystemMonitoring = lazy(() => import('./SystemMonitoring'));
const LazyLogFilterForm = lazy(() => import('./LogFilterForm'));

// Pre-computed styles using updated design system helpers
const STYLES = {
    // Typography styles following design system guidelines
    subtitle: applyTypographyStyle('subtitle'),
    body: applyTypographyStyle('body'),
    caption: applyTypographyStyle('caption'),
    title: applyTypographyStyle('title'),
    headline: applyTypographyStyle('headline'),
    subheadline: applyTypographyStyle('subheadline'),

    // Spacing following 8px base unit
    spacing: {
        sm: applyDesignSystemSpacing(2), // 8px
        md: applyDesignSystemSpacing(4), // 16px
        lg: applyDesignSystemSpacing(6), // 24px
        xl: applyDesignSystemSpacing(8), // 32px
        component: getSemanticSpacing('component'),
        layout: getSemanticSpacing('layout'),
    },

    // Semantic colors following design system guidelines
    colors: {
        success: getSemanticColor('success'),
        warning: getSemanticColor('warning'),
        destructive: getSemanticColor('danger'), // Alias for destructive
        danger: getSemanticColor('danger'),
        info: getSemanticColor('info'),
        primary: tokens.colors.primary[500],
        secondary: tokens.colors.secondary[500],
        muted: tokens.colors.secondary[400],
    },

    // Motion following design system guidelines
    motion: {
        duration: applyDesignSystemMotion('duration', 'normal'),
        easing: applyDesignSystemMotion('easing', 'smooth'),
    },

    // Border radius following design system guidelines
    borderRadius: {
        lg: applyDesignSystemRadius('lg'),
        xl: applyDesignSystemRadius('xl'),
    },

    // Shadows following elevation hierarchy
    shadows: {
        sm: getSemanticShadow('card'),
        md: getSemanticShadow('hover'),
        lg: getSemanticShadow('modal'),
    },
} as const;

// Memoized helper functions
const getStatusBadgeComponent = (isActive: boolean, isVerified: boolean) => {
    const variant = getStatusBadge(isActive, isVerified);
    const label = !isActive ? 'Inactive' : !isVerified ? 'Unverified' : 'Active';
    return <Badge variant={variant}>{label}</Badge>;
};

const getHealthIndicator = (value: number | null | undefined, thresholds: { warning: number; critical: number }) => {
    if (value === null || value === undefined) return STYLES.colors.muted;
    if (value > thresholds.critical) return STYLES.colors.destructive;
    if (value > thresholds.warning) return STYLES.colors.warning;
    return STYLES.colors.success;
};

// Memoized loading fallback component
const LoadingFallback = memo(() => (
    <div
        style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: STYLES.spacing.xl
        }}
    >
        <AdminLoadingSpinner message="Loading component..." size="md" />
    </div>
));

// Memoized icon component

// Memoized metric card component
const SystemMetricCard = memo<{
    title: string;
    value: string;
    subtitle: string;
    icon: React.ComponentType<any>;
    color: string;
    healthValue?: number;
    healthThresholds?: { warning: number; critical: number };
}>(({ title, value, subtitle, color, healthValue, healthThresholds }) => {
    const healthColor = useMemo(() =>
        healthValue && healthThresholds ? getHealthIndicator(healthValue, healthThresholds) : color,
        [healthValue, healthThresholds, color]
    );

    return (
        <div className="text-center group">
            <div className="flex items-center justify-center mb-4">
                <div
                    className="w-4 h-4 rounded-full mr-3 transition-all duration-200"
                    style={{ backgroundColor: healthColor }}
                />
                <span style={STYLES.caption} className="font-medium">{title}</span>
            </div>
            <div style={STYLES.headline} className="text-foreground">
                {value}
            </div>
            <div style={STYLES.caption} className="text-muted-foreground mt-2">{subtitle}</div>
        </div>
    );
});

// Memoized system status card
const SystemStatusCard = memo(() => {
    const { systemMetrics, fetchOverviewData } = useAdminStore();

    const handleRefresh = useCallback(() => {
        fetchOverviewData();
    }, [fetchOverviewData]);

    const metrics = useMemo(() => [
        {
            title: 'CPU',
            value: formatPercentage(systemMetrics.data?.cpu_usage),
            subtitle: 'Usage',
            icon: Cpu,
            color: STYLES.colors.success,
            healthValue: systemMetrics.data?.cpu_usage,
            healthThresholds: { warning: 60, critical: 80 }
        },
        {
            title: 'Memory',
            value: formatPercentage(systemMetrics.data?.memory_usage),
            subtitle: 'Usage',
            icon: HardDrive,
            color: STYLES.colors.success,
            healthValue: systemMetrics.data?.memory_usage,
            healthThresholds: { warning: 70, critical: 85 }
        },
        {
            title: 'Disk',
            value: formatPercentage(systemMetrics.data?.disk_usage),
            subtitle: 'Usage',
            icon: Database,
            color: STYLES.colors.success,
            healthValue: systemMetrics.data?.disk_usage,
            healthThresholds: { warning: 75, critical: 90 }
        },
        {
            title: 'Errors',
            value: formatPercentage(systemMetrics.data?.error_rate_24h),
            subtitle: 'Rate (24h)',
            icon: AlertCircle,
            color: STYLES.colors.success,
            healthValue: systemMetrics.data?.error_rate_24h,
            healthThresholds: { warning: 2, critical: 5 }
        }
    ], [systemMetrics.data]);

    return (
        <Card className="lg:col-span-2">
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mr-4 bg-green-100">
                            <CheckCircle className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 style={STYLES.title} className="text-foreground">System Status</h3>
                            <p style={STYLES.caption} className="text-muted-foreground">Real-time health monitoring</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleRefresh}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {metrics.map((metric, index) => (
                        <SystemMetricCard
                            key={index}
                            {...metric}
                            healthValue={metric.healthValue ?? undefined}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
});

// Memoized performance metrics card
const PerformanceMetricsCard = memo(() => {
    const { systemMetrics } = useAdminStore();

    const performanceData = useMemo(() => [
        {
            label: 'CPU Usage',
            value: systemMetrics.data?.cpu_usage || 0,
            icon: Cpu
        },
        {
            label: 'Disk Usage',
            value: systemMetrics.data?.disk_usage || 0,
            icon: HardDrive
        }
    ], [systemMetrics.data]);

    const statsData = useMemo(() => [
        {
            label: 'Requests/24h',
            value: formatNumber(systemMetrics.data?.request_count_24h),
            icon: Zap
        },
        {
            label: 'Avg Response',
            value: `${formatNumber(systemMetrics.data?.avg_response_time)} ms`,
            icon: Clock
        }
    ], [systemMetrics.data]);

    return (
        <Card>
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                        <BarChart3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h3 style={STYLES.title} className="text-foreground">Performance</h3>
                        <p style={STYLES.caption} className="text-muted-foreground">Key metrics</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
                {performanceData.map((item, index) => (
                    <div key={index} className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-muted-foreground">
                                <item.icon className="h-4 w-4" />
                                <span style={STYLES.caption}>{item.label}</span>
                            </div>
                            <span style={STYLES.subtitle} className="text-foreground">
                                {formatPercentage(item.value)}
                            </span>
                        </div>
                        <Progress value={item.value} className="h-2" />
                    </div>
                ))}
                <div className="pt-6 border-t border-border">
                    <div className="grid grid-cols-2 gap-6">
                        {statsData.map((item, index) => (
                            <div key={index}>
                                <div className="flex items-center gap-3 text-muted-foreground mb-2">
                                    <item.icon className="h-4 w-4" />
                                    <span style={STYLES.caption}>{item.label}</span>
                                </div>
                                <div style={STYLES.subtitle} className="text-foreground">
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

// Memoized user activity card with virtualization
const UserActivityCard = memo(() => {
    const { userActivity } = useAdminStore();

    const visibleUsers = useMemo(() =>
        userActivity.data?.slice(0, 5) || [],
        [userActivity.data]
    );

    const hasMoreUsers = useMemo(() =>
        (userActivity.data?.length || 0) > 5,
        [userActivity.data]
    );

    if (!userActivity.data || userActivity.data.length === 0) {
        return (
            <Card>
                <CardHeader className="pb-6">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4">
                                <Users className="h-6 w-6 text-accent" />
                            </div>
                            <div>
                                <h3 style={STYLES.title} className="text-foreground">User Activity</h3>
                                <p style={STYLES.caption} className="text-muted-foreground">Recent interactions</p>
                            </div>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-16">
                        <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center mb-6">
                            <Users className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h3 style={STYLES.title} className="text-foreground mb-3">No Recent Activity</h3>
                        <p style={STYLES.body} className="text-muted-foreground">
                            No user activity has been recorded recently.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mr-4">
                            <Users className="h-6 w-6 text-accent" />
                        </div>
                        <div>
                            <h3 style={STYLES.title} className="text-foreground">User Activity</h3>
                            <p style={STYLES.caption} className="text-muted-foreground">Recent interactions</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {visibleUsers.map(user => (
                        <div key={user.user_id} className="flex items-center justify-between p-6 rounded-xl hover:bg-muted/50 transition-all duration-200 group">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-accent/20 to-accent/30 rounded-full flex items-center justify-center">
                                    <span style={STYLES.subtitle} className="text-accent">
                                        {user.username.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p style={STYLES.subtitle} className="text-foreground">{user.username}</p>
                                    <p style={STYLES.caption} className="text-muted-foreground">
                                        Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                {getStatusBadgeComponent(user.is_active, true)}
                                <p style={STYLES.caption} className="text-muted-foreground mt-2">
                                    {user.login_count} logins
                                </p>
                            </div>
                        </div>
                    ))}
                    {hasMoreUsers && (
                        <Button variant="link" className="p-0 h-auto w-full justify-center">
                            <span style={STYLES.caption}>View All Activity</span>
                            <ArrowUpRight className="h-4 w-4 ml-2" />
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    );
});

// Memoized system alerts card
const SystemAlertsCard = memo(() => {
    const { systemMetrics } = useAdminStore();

    const alerts = useMemo(() => {
        const alertsList = [];

        if (systemMetrics.data?.cpu_usage && systemMetrics.data.cpu_usage > 90) {
            alertsList.push({
                type: 'destructive',
                title: 'High CPU Usage',
                message: `CPU usage at ${formatPercentage(systemMetrics.data.cpu_usage)}. Consider scaling up resources.`,
                icon: AlertCircle
            });
        }

        if (systemMetrics.data?.memory_usage && systemMetrics.data.memory_usage > 90) {
            alertsList.push({
                type: 'destructive',
                title: 'High Memory Usage',
                message: `Memory usage at ${formatPercentage(systemMetrics.data.memory_usage)}.`,
                icon: AlertCircle
            });
        }

        if (systemMetrics.data?.disk_usage && systemMetrics.data.disk_usage > 90) {
            alertsList.push({
                type: 'default',
                title: 'Disk Usage Warning',
                message: `Disk usage at ${formatPercentage(systemMetrics.data.disk_usage)}.`,
                icon: AlertCircle
            });
        }

        if (systemMetrics.data?.error_rate_24h && systemMetrics.data.error_rate_24h > 5) {
            alertsList.push({
                type: 'destructive',
                title: 'High Error Rate',
                message: `Error rate at ${formatPercentage(systemMetrics.data.error_rate_24h)}.`,
                icon: AlertCircle
            });
        }

        // Show healthy state if no alerts
        if (alertsList.length === 0) {
            alertsList.push({
                type: 'default',
                title: 'All Systems Healthy',
                message: 'All system metrics are within normal ranges.',
                icon: CheckCircle
            });
        }

        return alertsList;
    }, [systemMetrics.data]);

    return (
        <Card>
            <CardHeader className="pb-6">
                <CardTitle className="flex items-center">
                    <div className="w-12 h-12 bg-warning/10 rounded-xl flex items-center justify-center mr-4">
                        <Bell className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                        <h3 style={STYLES.title} className="text-foreground">System Alerts</h3>
                        <p style={STYLES.caption} className="text-muted-foreground">Active alerts</p>
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {alerts.map((alert, index) => (
                        <Alert
                            key={index}
                            variant={alert.type === 'destructive' ? 'destructive' : 'default'}
                            className={alert.type === 'destructive' ? 'border-destructive/20 bg-destructive/5' : 'border-success/20 bg-success/5'}
                        >
                            <alert.icon className={`h-5 w-5 ${alert.type === 'destructive' ? '' : 'text-success'}`} />
                            <AlertDescription>
                                <div style={STYLES.subtitle} className={`${alert.type === 'destructive' ? 'text-destructive' : 'text-success'} mb-2`}>
                                    {alert.title}
                                </div>
                                <p style={STYLES.body} className={`${alert.type === 'destructive' ? 'text-destructive/80' : 'text-success/80'}`}>
                                    {alert.message}
                                </p>
                            </AlertDescription>
                        </Alert>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
});

// Memoized overview tab component
const OverviewTab = memo(() => {
    const { systemStats, userActivity, systemMetrics, fetchOverviewData } = useAdminStore();

    const hasAnyData = useMemo(() =>
        !!systemStats.data ||
        !!systemMetrics.data ||
        (userActivity.data && userActivity.data.length > 0),
        [systemStats.data, systemMetrics.data, userActivity.data]
    );

    const isLoading = useMemo(() =>
        systemStats.loading || userActivity.loading || systemMetrics.loading,
        [systemStats.loading, userActivity.loading, systemMetrics.loading]
    );

    if (isLoading && !hasAnyData) {
        return <StatsSkeleton />;
    }

    if (!hasAnyData) {
        return (
            <div
                className="py-16"
                style={{
                    padding: STYLES.spacing.layout.container,
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}
            >
                <div
                    className="text-center"
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: STYLES.spacing.lg
                    }}
                >
                    <div
                        style={{
                            width: '80px',
                            height: '80px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: tokens.colors.secondary[100]
                        }}
                    >
                        <BarChart3
                            style={{
                                width: '40px',
                                height: '40px',
                                color: tokens.colors.secondary[400]
                            }}
                        />
                    </div>
                    <div>
                        <AdminTitle>No Data Available</AdminTitle>
                        <AdminBody>
                            Admin data is currently unavailable. Please try refreshing the page.
                        </AdminBody>
                    </div>
                    <Button onClick={() => fetchOverviewData()} variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Data
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <SystemStatusCard />
                <PerformanceMetricsCard />
            </div>

            {/* User Activity and System Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <UserActivityCard />
                <SystemAlertsCard />
            </div>
        </div>
    );
});

// Memoized tab trigger component
const TabTrigger = memo<{
    value: string;
    icon: React.ComponentType<any>;
    label: string;
}>(({ value, icon: IconComponent, label }) => (
    <TabsTrigger
        value={value}
        className="flex items-center gap-3 rounded-lg"
    >
        <IconComponent className="h-4 w-4" />
        <span style={STYLES.caption}>{label}</span>
    </TabsTrigger>
));

// Main Admin Dashboard Component with performance optimizations
export const AdminDashboard: React.FC = memo(() => {
    const [activeTab, setActiveTab] = useState('overview');
    const { fetchOverviewData, fetchSystemData, fetchAuditData, fetchHealthData } = useAdminStore();

    // Memoized tab change handler
    const handleTabChange = useCallback((tab: string) => {
        setActiveTab(tab);
    }, []);

    // Memoized data fetching effect
    useEffect(() => {
        const fetchData = async () => {
            switch (activeTab) {
                case 'overview':
                    await fetchOverviewData();
                    break;
                case 'system':
                    await fetchSystemData();
                    break;
                case 'audit':
                    await fetchAuditData();
                    break;
                case 'health':
                    await fetchHealthData();
                    break;
                case 'data':
                case 'logs':
                    // These components handle their own data fetching
                    break;
                default:
                    await fetchOverviewData();
            }
        };

        fetchData();
    }, [activeTab, fetchOverviewData, fetchSystemData, fetchAuditData, fetchHealthData]);

    // Memoized tab configuration
    const tabsConfig = useMemo(() => [
        { value: 'overview', icon: Activity, label: 'Overview' },
        { value: 'system', icon: Server, label: 'System' },
        { value: 'audit', icon: Shield, label: 'Audit' },
        { value: 'health', icon: CheckCircle, label: 'Health' },
        { value: 'data', icon: Database, label: 'Data' },
        { value: 'logs', icon: FileText, label: 'Logs' },
    ], []);

    // Memoized action bar content
    const actionBarContent = useMemo(() => (
        <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" className="relative">
                <Bell className="h-4 w-4 mr-2" />
                <span style={STYLES.caption}>Notifications</span>
                <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full text-xs flex items-center justify-center bg-destructive text-background">
                    3
                </span>
            </Button>
            <Suspense fallback={<LoadingFallback />}>
                <DashboardCustomization
                    userRole="admin"
                    onConfigChange={() => {

                    }}
                />
            </Suspense>
            <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                <span style={STYLES.caption}>Settings</span>
            </Button>
            <Button size="sm">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span style={STYLES.caption}>Export Report</span>
            </Button>
        </div>
    ), []);

    return (
        <AdminSectionErrorBoundary
            sectionName="Admin Dashboard"
            onRetry={() => window.location.reload()}
        >
            <div className="space-y-8">
                {/* Action Bar */}
                <div className="flex items-center justify-between">
                    <AdminHeader
                        title="Admin Dashboard"
                        description="Monitor and manage system performance, user activity, and system health"
                        showBreadcrumb={false}
                        showAdminBadge={false}
                    />
                    {actionBarContent}
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-8">
                    <TabsList className="grid w-full grid-cols-6 h-14 p-1 rounded-xl">
                        {tabsConfig.map((tab) => (
                            <TabTrigger key={tab.value} {...tab} />
                        ))}
                    </TabsList>

                    <TabsContent value="overview" className="space-y-8">
                        <OverviewTab />
                    </TabsContent>

                    <TabsContent value="system" className="space-y-8">
                        <Suspense fallback={<LoadingFallback />}>
                            <LazyMaintenanceTools />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="audit" className="space-y-8">
                        <Suspense fallback={<LoadingFallback />}>
                            <LazyUserManagement />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="health" className="space-y-8">
                        <Suspense fallback={<LoadingFallback />}>
                            <LazySystemMonitoring refreshInterval={30000} />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="data" className="space-y-8">
                        <Suspense fallback={<LoadingFallback />}>
                            <LazyDataManagement />
                        </Suspense>
                    </TabsContent>

                    <TabsContent value="logs" className="space-y-8">
                        <Suspense fallback={<LoadingFallback />}>
                            <LazyLogFilterForm
                                level="INFO"
                                limit={50}
                                from=""
                                to=""
                                search=""
                                skip={0}
                                total={0}
                                onChange={() => { }}
                                onRefresh={() => { }}
                                onPrev={() => { }}
                                onNext={() => { }}
                            />
                        </Suspense>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminSectionErrorBoundary>
    );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;
