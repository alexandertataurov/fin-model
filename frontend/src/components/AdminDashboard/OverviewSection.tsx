/**
 * Admin Dashboard Overview Section
 * 
 * Modular component for the overview tab content
 * Updated to follow design system foundations guidelines
 */

import React, { memo, useMemo } from 'react';
import {
    Users,
    FileText,
    Database,
    HardDrive,
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    Activity,
    Eye,
} from 'lucide-react';
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
import { useAdminStore } from '@/stores/admin';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdminSectionErrorBoundary } from '@/components/ErrorBoundary';
import { tokens } from '@/design-system/tokens';

// Import design system components
import {
    applyTypographyStyle,
    Container,
    SectionHeader,
    MetricCard,
    DashboardHeader
} from '@/design-system/stories/components';

// Helper functions
const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) {
        return 'N/A';
    }
    return `${value.toFixed(1)}%`;
};

const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || Number.isNaN(num as number)) {
        return '0';
    }
    return (num as number).toLocaleString();
};

const getStatusBadge = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return <Badge variant="destructive">Inactive</Badge>;
    if (!isVerified) return <Badge variant="secondary">Unverified</Badge>;
    return <Badge variant="default">Active</Badge>;
};

// Design system helper functions
const applyDesignSystemSpacing = (size: keyof typeof tokens.spacing) => tokens.spacing[size];
const applyDesignSystemRadius = (size: keyof typeof tokens.borderRadius) => tokens.borderRadius[size];
const applyDesignSystemShadow = (size: keyof typeof tokens.shadows) => tokens.shadows[size];
const applyDesignSystemMotion = (type: 'duration' | 'easing', value: string) =>
    type === 'duration' ? tokens.motion.duration[value] : tokens.motion.easing[value];

const getStatusColor = (status: string) => {
    switch (status) {
        case 'healthy': return tokens.colors.success;
        case 'warning': return tokens.colors.warning;
        case 'critical': return tokens.colors.destructive[500];
        default: return tokens.colors.muted[400];
    }
};

const OverviewSection: React.FC = memo(() => {
    const { systemStats, userActivity, systemMetrics, systemHealth } = useAdminStore();

    // Memoized computed values
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
            <Container className="py-16">
                <div className="text-center space-y-6">
                    <div className="w-20 h-20 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <Activity className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 style={applyTypographyStyle('title')} className="text-foreground mb-2">
                            No Data Available
                        </h3>
                        <p style={applyTypographyStyle('body')} className="text-muted-foreground">
                            Overview data is currently unavailable. Please try refreshing the page.
                        </p>
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <AdminSectionErrorBoundary sectionName="Overview Section">
            <div className="space-y-8">
                {/* System Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mr-3">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <h4 style={applyTypographyStyle('subtitle')} className="text-foreground">
                                        Total Users
                                    </h4>
                                    <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        Registered users
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={applyTypographyStyle('headline')} className="text-foreground mb-2">
                                {formatNumber(systemStats.data?.total_users)}
                            </div>
                            <div className="flex items-center gap-2">
                                <span style={applyTypographyStyle('caption')} className="text-success">
                                    +{formatNumber(systemStats.data?.new_users_this_month)}
                                </span>
                                <span style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                    this month
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mr-3">
                                    <FileText className="h-5 w-5 text-accent" />
                                </div>
                                <div>
                                    <h4 style={applyTypographyStyle('subtitle')} className="text-foreground">
                                        Total Files
                                    </h4>
                                    <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        Stored files
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={applyTypographyStyle('headline')} className="text-foreground mb-2">
                                {formatNumber(systemStats.data?.total_files)}
                            </div>
                            <div className="flex items-center gap-2">
                                <span style={applyTypographyStyle('caption')} className="text-accent">
                                    {formatNumber(systemStats.data?.total_storage_gb)} GB
                                </span>
                                <span style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                    used
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                                    <Database className="h-5 w-5 text-success" />
                                </div>
                                <div>
                                    <h4 style={applyTypographyStyle('subtitle')} className="text-foreground">
                                        Database
                                    </h4>
                                    <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        Health status
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-3 h-3 rounded-full bg-success"></div>
                                <span style={applyTypographyStyle('subtitle')} className="text-foreground">
                                    Healthy
                                </span>
                            </div>
                            <div style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                {formatNumber(systemStats.data?.database_connections)} connections
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
                                    <HardDrive className="h-5 w-5 text-warning" />
                                </div>
                                <div>
                                    <h4 style={applyTypographyStyle('subtitle')} className="text-foreground">
                                        Storage
                                    </h4>
                                    <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        Usage status
                                    </p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div style={applyTypographyStyle('headline')} className="text-foreground mb-3">
                                {formatPercentage(systemStats.data?.storage_usage)}
                            </div>
                            <Progress value={systemStats.data?.storage_usage || 0} className="h-2" />
                            <div style={applyTypographyStyle('caption')} className="text-muted-foreground mt-2">
                                {formatNumber(systemStats.data?.available_storage_gb)} GB available
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Health Overview */}
                <Card>
                    <CardHeader className="pb-6">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-success/10 rounded-xl flex items-center justify-center mr-4">
                                    <CheckCircle className="h-6 w-6 text-success" />
                                </div>
                                <div>
                                    <h3 style={applyTypographyStyle('title')} className="text-foreground">
                                        System Health
                                    </h3>
                                    <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        Real-time monitoring
                                    </p>
                                </div>
                            </div>
                            <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                <span style={applyTypographyStyle('caption')}>View Details</span>
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        CPU Usage
                                    </span>
                                    <span style={applyTypographyStyle('subtitle')} className="text-foreground">
                                        {formatPercentage(systemMetrics.data?.cpu_usage)}
                                    </span>
                                </div>
                                <Progress value={systemMetrics.data?.cpu_usage || 0} className="h-2" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        Memory Usage
                                    </span>
                                    <span style={applyTypographyStyle('subtitle')} className="text-foreground">
                                        {formatPercentage(systemMetrics.data?.memory_usage)}
                                    </span>
                                </div>
                                <Progress value={systemMetrics.data?.memory_usage || 0} className="h-2" />
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        Disk Usage
                                    </span>
                                    <span style={applyTypographyStyle('subtitle')} className="text-foreground">
                                        {formatPercentage(systemMetrics.data?.disk_usage)}
                                    </span>
                                </div>
                                <Progress value={systemMetrics.data?.disk_usage || 0} className="h-2" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader className="pb-6">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                                    <Activity className="h-6 w-6 text-primary" />
                                </div>
                                <div>
                                    <h3 style={applyTypographyStyle('title')} className="text-foreground">
                                        Recent Activity
                                    </h3>
                                    <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                        User interactions
                                    </p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <ArrowUpRight className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userActivity.data && userActivity.data.length > 0 ? (
                            <div className="space-y-4">
                                {userActivity.data.slice(0, 5).map(user => (
                                    <div key={user.user_id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span style={applyTypographyStyle('caption')} className="text-primary font-medium">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p style={applyTypographyStyle('subtitle')} className="text-foreground">
                                                    {user.username}
                                                </p>
                                                <p style={applyTypographyStyle('caption')} className="text-muted-foreground">
                                                    Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {getStatusBadge(user.is_active, true)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Activity className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 style={applyTypographyStyle('title')} className="text-foreground mb-2">
                                    No Recent Activity
                                </h3>
                                <p style={applyTypographyStyle('body')} className="text-muted-foreground">
                                    No user activity has been recorded recently.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminSectionErrorBoundary>
    );
};

OverviewSection.displayName = 'OverviewSection';

export default OverviewSection;
