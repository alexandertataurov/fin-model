/**
 * Admin Dashboard Overview Section
 * 
 * Modular component for the overview tab content
 * Updated to follow design system foundations guidelines
 */

import React, { memo, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Progress } from '@/design-system/components/Progress';
import { tokens } from '@/design-system/tokens';
import { useAdminStore } from '@/stores/admin';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdminSectionErrorBoundary } from '@/components/ErrorBoundary';
import { Container } from '@/design-system/stories/components';
import { applyTypographyStyle } from '@/design-system/stories/components';
import {
    Users,
    FileText,
    Database,
    HardDrive,
    Activity,
    ArrowUpRight,
} from 'lucide-react';
import {
    formatNumber,
    formatPercentage,
    getStatusBadge,
    getStatusColor
} from './utils/designSystemHelpers';
import {
    AdminCard,
    AdminTitle,
    AdminBody,
    AdminCaption,
    AdminHeadline,
    AdminSubtitle
} from './components';

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
                        <AdminTitle className="mb-2">
                            No Data Available
                        </AdminTitle>
                        <AdminBody>
                            Overview data is currently unavailable. Please try refreshing the page.
                        </AdminBody>
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
                                    <AdminSubtitle>
                                        Total Users
                                    </AdminSubtitle>
                                    <AdminCaption>
                                        Registered users
                                    </AdminCaption>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AdminHeadline className="mb-2">
                                {formatNumber(systemStats.data?.total_users)}
                            </AdminHeadline>
                            <div className="flex items-center gap-2">
                                <AdminCaption className="text-success">
                                    +{formatNumber(systemStats.data?.new_users_this_month)}
                                </AdminCaption>
                                <AdminCaption>
                                    this month
                                </AdminCaption>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center mr-3">
                                    <FileText className="h-5 w-5 text-success" />
                                </div>
                                <div>
                                    <AdminSubtitle>
                                        Total Files
                                    </AdminSubtitle>
                                    <AdminCaption>
                                        Uploaded files
                                    </AdminCaption>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AdminHeadline className="mb-2">
                                {formatNumber(systemStats.data?.total_files)}
                            </AdminHeadline>
                            <div className="flex items-center gap-2">
                                <AdminCaption>
                                    {formatNumber(systemStats.data?.total_storage_gb)} GB
                                </AdminCaption>
                                <AdminCaption>
                                    total storage
                                </AdminCaption>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center mr-3">
                                    <Database className="h-5 w-5 text-warning" />
                                </div>
                                <div>
                                    <AdminSubtitle>
                                        Database
                                    </AdminSubtitle>
                                    <AdminCaption>
                                        Connections
                                    </AdminCaption>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AdminHeadline className="mb-2">
                                {formatNumber(systemStats.data?.database_connections)} connections
                            </AdminHeadline>
                            <div className="flex items-center gap-2">
                                <AdminCaption>
                                    Active connections
                                </AdminCaption>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center mr-3">
                                    <HardDrive className="h-5 w-5 text-destructive" />
                                </div>
                                <div>
                                    <AdminSubtitle>
                                        Storage
                                    </AdminSubtitle>
                                    <AdminCaption>
                                        Usage
                                    </AdminCaption>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AdminHeadline className="mb-2">
                                {formatPercentage(systemStats.data?.storage_usage)}
                            </AdminHeadline>
                            <div className="flex items-center gap-2">
                                <AdminCaption>
                                    {formatNumber(systemStats.data?.available_storage_gb)} GB available
                                </AdminCaption>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* System Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                    <Activity className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <AdminSubtitle>
                                        System Metrics
                                    </AdminSubtitle>
                                    <AdminCaption>
                                        Real-time performance
                                    </AdminCaption>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <AdminCaption>CPU Usage</AdminCaption>
                                    <AdminBody>
                                        {formatPercentage(systemMetrics.data?.cpu_usage)}
                                    </AdminBody>
                                </div>
                                <Progress 
                                    value={systemMetrics.data?.cpu_usage || 0} 
                                    className="h-2"
                                    style={{
                                        background: getStatusColor(systemHealth?.data?.status)
                                    }}
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <AdminCaption>Memory Usage</AdminCaption>
                                    <AdminBody>
                                        {formatPercentage(systemMetrics.data?.memory_usage)}
                                    </AdminBody>
                                </div>
                                <Progress 
                                    value={systemMetrics.data?.memory_usage || 0} 
                                    className="h-2"
                                />
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <AdminCaption>Disk Usage</AdminCaption>
                                    <AdminBody>
                                        {formatPercentage(systemMetrics.data?.disk_usage)}
                                    </AdminBody>
                                </div>
                                <Progress 
                                    value={systemMetrics.data?.disk_usage || 0} 
                                    className="h-2"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <Users className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <AdminSubtitle>
                                        Recent Activity
                                    </AdminSubtitle>
                                    <AdminCaption>
                                        User interactions
                                    </AdminCaption>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {userActivity.data?.slice(0, 5).map((user, index) => (
                                    <div key={user.user_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-primary">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <AdminBody>{user.username}</AdminBody>
                                                <AdminCaption>
                                                    Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                                                </AdminCaption>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {getStatusBadge(user.is_active, true)}
                                            <AdminCaption className="mt-1">
                                                {user.login_count} logins
                                            </AdminCaption>
                                        </div>
                                    </div>
                                ))}
                                {userActivity.data && userActivity.data.length > 5 && (
                                    <div className="text-center pt-2">
                                        <button className="text-primary hover:text-primary/80 transition-colors">
                                            <AdminCaption>
                                                View All Activity
                                            </AdminCaption>
                                            <ArrowUpRight className="inline h-4 w-4 ml-1" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminSectionErrorBoundary>
    );
});

OverviewSection.displayName = 'OverviewSection';

export default OverviewSection;
