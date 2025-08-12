/**
 * Admin Dashboard Overview Section
 * 
 * Sophisticated component for the overview tab content
 * Enhanced with modern design patterns and interactive elements
 */

import React, { memo, useMemo } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/design-system/components/Card';
import { Badge } from '@/design-system/components/Badge';
import { Button } from '@/design-system/components/Button';
import { Progress } from '@/design-system/components/Progress';
import { useAdminStore } from '@/stores/admin';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdminSectionErrorBoundary } from '@/components/ErrorBoundary';
import {
    Users,
    FileText,
    Database,
    HardDrive,
    Activity,
    ArrowUpRight,
    TrendingUp,
    TrendingDown,
    Clock,
    CheckCircle,
    XSquare,
    RefreshCw,
    Hash,
} from 'lucide-react';
import {
    formatNumber,
    formatPercentage
} from './utils/designSystemHelpers';

// Enhanced metric card component
const MetricCard: React.FC<{
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
        label: string;
    };
    status?: 'success' | 'warning' | 'error' | 'info';
}> = ({ title, value, subtitle, icon, trend, status = 'info' }) => {
    const statusClasses = {
        success: 'bg-green-100 border-green-200 text-green-600',
        warning: 'bg-yellow-100 border-yellow-200 text-yellow-600',
        error: 'bg-red-100 border-red-200 text-red-600',
        info: 'bg-blue-100 border-blue-200 text-blue-600',
    };

    return (
        <Card className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl transition-all duration-300 group-hover:scale-110 border ${statusClasses[status]}`}>
                            {icon}
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                {title}
                            </h4>
                            {subtitle && (
                                <span className="text-xs text-muted-foreground/70">
                                    {subtitle}
                                </span>
                            )}
                        </div>
                    </div>
                    {trend && (
                        <div className="flex items-center gap-1">
                            {trend.isPositive ? (
                                <TrendingUp className="h-4 w-4 text-success" />
                            ) : (
                                <TrendingDown className="h-4 w-4 text-destructive" />
                            )}
                            <span className={`text-xs font-medium ${trend.isPositive ? 'text-success' : 'text-destructive'}`}>
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                        {value}
                    </h1>
                    {trend && (
                        <span className="text-xs text-muted-foreground">
                            {trend.label}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced activity item
const ActivityItem: React.FC<{
    user: any;
    index: number;
}> = ({ user, index }) => {
    return (
        <Card className="group relative overflow-hidden transition-all duration-300 hover:bg-muted/50 hover:shadow-md">
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white bg-primary">
                            {user.username.charAt(0).toUpperCase()}
                            <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-success">
                                {user.is_active ? <CheckCircle className="h-3 w-3" /> : <XSquare className="h-3 w-3" />}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-semibold text-foreground">{user.username}</p>
                            <span className="text-xs text-muted-foreground">
                                <Clock className="inline h-3 w-3 mr-1" />
                                Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                            </span>
                        </div>
                    </div>
                    <div className="text-right space-y-1">
                        <Badge
                            variant={user.is_active ? 'success' : 'destructive'}
                            className="text-xs"
                        >
                            {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        <span className="text-xs block text-muted-foreground">
                            <Hash className="inline h-3 w-3 mr-1" />
                            {user.login_count} logins
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
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
            <Card className="py-16">
                <CardContent className="text-center space-y-8">
                    <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center bg-primary/10">
                        <Activity className="h-12 w-12 text-primary" />
                    </div>
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold text-foreground">
                            No Data Available
                        </h1>
                        <p className="text-lg text-muted-foreground max-w-md mx-auto">
                            Overview data is currently unavailable. Please try refreshing the page or check your connection.
                        </p>
                        <Button
                            variant="outline"
                            size="lg"
                            className="mt-6"
                            onClick={() => window.location.reload()}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh Page
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <AdminSectionErrorBoundary sectionName="Overview Section">
            <div className="space-y-8">
                {/* Enhanced System Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="Total Users"
                        value={formatNumber(systemStats.data?.users?.total || 0)}
                        subtitle="Registered users"
                        icon={<Users className="h-6 w-6" />}
                        trend={{
                            value: systemStats.data?.users?.new_24h || 0,
                            isPositive: true,
                            label: "new this month"
                        }}
                        status="success"
                    />

                    <MetricCard
                        title="Total Files"
                        value={formatNumber(systemStats.data?.files?.total || 0)}
                        subtitle="Uploaded files"
                        icon={<FileText className="h-6 w-6" />}
                        status="info"
                    />

                    <MetricCard
                        title="Database"
                        value={`${systemStats.data?.system?.database_size || '0 MB'}`}
                        subtitle="Storage used"
                        icon={<Database className="h-6 w-6" />}
                        status="warning"
                    />

                    <MetricCard
                        title="Performance"
                        value={`${systemStats.data?.performance?.avg_file_size_mb || 0} MB`}
                        subtitle="Avg file size"
                        icon={<HardDrive className="h-6 w-6" />}
                        status="info"
                    />
                </div>

                {/* Enhanced System Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-primary text-white">
                                    <Activity className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">
                                        System Performance
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                        Real-time metrics
                                    </span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">CPU Usage</span>
                                    <span className="text-sm font-semibold text-info">
                                        {formatPercentage(systemMetrics.data?.cpu_usage || 0)}
                                    </span>
                                </div>
                                <Progress value={systemMetrics.data?.cpu_usage || 0} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">Memory Usage</span>
                                    <span className="text-sm font-semibold text-warning">
                                        {formatPercentage(systemMetrics.data?.memory_usage || 0)}
                                    </span>
                                </div>
                                <Progress value={systemMetrics.data?.memory_usage || 0} className="h-2" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-medium text-muted-foreground">Disk Usage</span>
                                    <span className="text-sm font-semibold text-destructive">
                                        {formatPercentage(systemMetrics.data?.disk_usage || 0)}
                                    </span>
                                </div>
                                <Progress value={systemMetrics.data?.disk_usage || 0} className="h-2" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-6">
                            <CardTitle className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-success text-white">
                                    <Users className="h-6 w-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-foreground">
                                        Recent Activity
                                    </h4>
                                    <span className="text-xs text-muted-foreground">
                                        User interactions
                                    </span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pt-6">
                            {userActivity.data?.slice(0, 5).map((user, index) => (
                                <ActivityItem key={user.user_id} user={user} index={index} />
                            ))}
                            {userActivity.data && userActivity.data.length > 5 && (
                                <div className="text-center pt-4">
                                    <Button
                                        variant="ghost"
                                        className="text-primary hover:text-primary/80 transition-colors"
                                    >
                                        <span className="text-muted-foreground">
                                            View All Activity
                                        </span>
                                        <ArrowUpRight className="h-4 w-4 ml-2" />
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminSectionErrorBoundary>
    );
});

OverviewSection.displayName = 'OverviewSection';

export default OverviewSection;
