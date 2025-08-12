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
import { tokens } from '@/design-system/tokens';
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
import { applyTextStyle } from '@/design-system/utils/typography';

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
    variant?: 'default' | 'elevated' | 'gradient';
}> = ({ title, value, subtitle, icon, trend, status = 'info', variant = 'default' }) => {
    const statusColors = {
        success: { bg: tokens.colors.success[500], text: 'white', border: tokens.colors.success[500] },
        warning: { bg: tokens.colors.warning[500], text: 'white', border: tokens.colors.warning[500] },
        error: { bg: tokens.colors.destructive[500], text: 'white', border: tokens.colors.destructive[500] },
        info: { bg: tokens.colors.info[500], text: 'white', border: tokens.colors.info[500] },
    };

    const variantStyles = {
        default: {
            background: tokens.colors.surface,
            border: `1px solid ${tokens.colors.border}`,
            boxShadow: tokens.shadows.sm,
        },
        elevated: {
            background: tokens.colors.surface,
            border: `1px solid ${tokens.colors.border}`,
            boxShadow: tokens.shadows.lg,
        },
        gradient: {
            background: `linear-gradient(135deg, ${tokens.colors.primary[50]} 0%, ${tokens.colors.primary[100]} 100%)`,
            border: `1px solid ${tokens.colors.primary[200]}`,
            boxShadow: tokens.shadows.md,
        },
    };

    return (
        <Card
            className="group cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
            style={variantStyles[variant]}
        >
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110"
                            style={{
                                background: `linear-gradient(135deg, ${statusColors[status].bg}20 0%, ${statusColors[status].bg}10 100%)`,
                                border: `1px solid ${statusColors[status].border}30`,
                            }}
                        >
                            <div style={{ color: statusColors[status].bg }}>
                                {icon}
                            </div>
                        </div>
                        <div>
                            <h4 style={applyTextStyle('subtitle')} className="text-muted-foreground mb-1">
                                {title}
                            </h4>
                            {subtitle && (
                                <span style={applyTextStyle('caption')} className="text-muted-foreground/70">
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
                            <span
                                className={trend.isPositive ? 'text-success' : 'text-destructive'}
                                style={{
                                    fontWeight: tokens.typography.fontWeight.medium,
                                    ...applyTextStyle('caption')
                                }}
                            >
                                {trend.isPositive ? '+' : ''}{trend.value}%
                            </span>
                        </div>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <h1
                        className="text-3xl font-bold"
                        style={{
                            background: `linear-gradient(135deg, ${tokens.colors.primary[600]} 0%, ${tokens.colors.primary[700]} 100%)`,
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            ...applyTextStyle('headline')
                        }}
                    >
                        {value}
                    </h1>
                    {trend && (
                        <span style={applyTextStyle('caption')} className="text-muted-foreground">
                            {trend.label}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

// Enhanced progress indicator
const ProgressIndicator: React.FC<{
    label: string;
    value: number;
    max?: number;
    color?: string;
    showValue?: boolean;
    size?: 'sm' | 'md' | 'lg';
}> = ({ label, value, max = 100, color, showValue = true, size = 'md' }) => {
    const percentage = Math.min((value / max) * 100, 100);
    const progressColor = color || (percentage > 80 ? tokens.colors.destructive[500] :
        percentage > 60 ? tokens.colors.warning[500] :
            tokens.colors.success[500]);

    const sizeStyles = {
        sm: { height: '6px', fontSize: tokens.typography.fontSize.sm },
        md: { height: '8px', fontSize: tokens.typography.fontSize.base },
        lg: { height: '12px', fontSize: tokens.typography.fontSize.lg },
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span style={applyTextStyle('caption')} className="font-medium">{label}</span>
                {showValue && (
                    <p style={{ ...applyTextStyle('body'), color: progressColor }} className="font-semibold">
                        {formatPercentage(percentage)}
                    </p>
                )}
            </div>
            <div
                className="relative overflow-hidden rounded-full transition-all duration-300"
                style={{
                    background: tokens.colors.muted[200],
                    height: sizeStyles[size].height,
                }}
            >
                <div
                    className="h-full rounded-full transition-all duration-500 ease-out"
                    style={{
                        background: `linear-gradient(90deg, ${progressColor} 0%, ${progressColor}80 100%)`,
                        width: `${percentage}%`,
                        boxShadow: `0 0 10px ${progressColor}40`,
                    }}
                />
            </div>
        </div>
    );
};

// Enhanced activity item
const ActivityItem: React.FC<{
    user: any;
    index: number;
}> = ({ user, index }) => {
    const statusColor = user.is_active ? tokens.colors.success[500] : tokens.colors.destructive[500];
    const statusIcon = user.is_active ? <CheckCircle className="h-4 w-4" /> : <XSquare className="h-4 w-4" />;

    return (
        <div
            className="group relative overflow-hidden rounded-xl p-4 transition-all duration-300 hover:bg-muted/50 hover:shadow-md"
            style={{
                border: `1px solid ${tokens.colors.border}`,
                background: tokens.colors.surface,
            }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div
                        className="relative flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold text-white transition-all duration-300 group-hover:scale-110"
                        style={{
                            background: `linear-gradient(135deg, ${tokens.colors.primary[500]} 0%, ${tokens.colors.primary[600]} 100%)`,
                            boxShadow: tokens.shadows.md,
                        }}
                    >
                        {user.username.charAt(0).toUpperCase()}
                        <div
                            className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white"
                            style={{ background: statusColor }}
                        >
                            {statusIcon}
                        </div>
                    </div>
                    <div className="space-y-1">
                        <p style={applyTextStyle('body')} className="font-semibold">{user.username}</p>
                        <span style={applyTextStyle('caption')} className="text-muted-foreground">
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
                    <span style={applyTextStyle('caption')} className="block text-muted-foreground">
                        <Hash className="inline h-3 w-3 mr-1" />
                        {user.login_count} logins
                    </span>
                </div>
            </div>
        </div>
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
            <div className="py-16">
                <div className="text-center space-y-8">
                    <div
                        className="w-24 h-24 mx-auto rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                        style={{
                            background: `linear-gradient(135deg, ${tokens.colors.primary[100]} 0%, ${tokens.colors.primary[200]} 100%)`,
                            boxShadow: tokens.shadows.lg,
                        }}
                    >
                        <Activity className="h-12 w-12" style={{ color: tokens.colors.primary[600] }} />
                    </div>
                    <div className="space-y-4">
                        <h1
                            className="text-4xl font-bold"
                            style={{
                                background: `linear-gradient(135deg, ${tokens.colors.primary[600]} 0%, ${tokens.colors.primary[700]} 100%)`,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                ...applyTextStyle('headline')
                            }}
                        >
                            No Data Available
                        </h1>
                        <p style={applyTextStyle('body')} className="text-lg text-muted-foreground max-w-md mx-auto">
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
                </div>
            </div>
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
                        variant="gradient"
                    />

                    <MetricCard
                        title="Total Files"
                        value={formatNumber(systemStats.data?.files?.total || 0)}
                        subtitle="Uploaded files"
                        icon={<FileText className="h-6 w-6" />}
                        status="info"
                        variant="elevated"
                    />

                    <MetricCard
                        title="Database"
                        value={`${systemStats.data?.system?.database_size || '0 MB'}`}
                        subtitle="Storage used"
                        icon={<Database className="h-6 w-6" />}
                        status="warning"
                        variant="default"
                    />

                    <MetricCard
                        title="Performance"
                        value={`${systemStats.data?.performance?.avg_file_size_mb || 0} MB`}
                        subtitle="Avg file size"
                        icon={<HardDrive className="h-6 w-6" />}
                        status="info"
                        variant="elevated"
                    />
                </div>

                {/* Enhanced System Metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card className="overflow-hidden" style={{ boxShadow: tokens.shadows.lg }}>
                        <CardHeader
                            className="pb-6"
                            style={{
                                background: `linear-gradient(135deg, ${tokens.colors.primary[50]} 0%, ${tokens.colors.primary[100]} 100%)`,
                                borderBottom: `1px solid ${tokens.colors.primary[200]}`,
                            }}
                        >
                            <CardTitle className="flex items-center gap-3">
                                <div
                                    className="p-3 rounded-xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${tokens.colors.primary[500]} 0%, ${tokens.colors.primary[600]} 100%)`,
                                        boxShadow: tokens.shadows.md,
                                    }}
                                >
                                    <Activity className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 style={applyTextStyle('subtitle')} className="text-primary-foreground font-semibold">
                                        System Performance
                                    </h4>
                                    <span style={applyTextStyle('caption')} className="text-primary-foreground/70">
                                        Real-time metrics
                                    </span>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6">
                            <ProgressIndicator
                                label="CPU Usage"
                                value={systemMetrics.data?.cpu_usage || 0}
                                color={tokens.colors.info[500]}
                                size="lg"
                            />
                            <ProgressIndicator
                                label="Memory Usage"
                                value={systemMetrics.data?.memory_usage || 0}
                                color={tokens.colors.warning[500]}
                                size="lg"
                            />
                            <ProgressIndicator
                                label="Disk Usage"
                                value={systemMetrics.data?.disk_usage || 0}
                                color={tokens.colors.destructive[500]}
                                size="lg"
                            />
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden" style={{ boxShadow: tokens.shadows.lg }}>
                        <CardHeader
                            className="pb-6"
                            style={{
                                background: `linear-gradient(135deg, ${tokens.colors.success[50]} 0%, ${tokens.colors.success[100]} 100%)`,
                                borderBottom: `1px solid ${tokens.colors.success[200]}`,
                            }}
                        >
                            <CardTitle className="flex items-center gap-3">
                                <div
                                    className="p-3 rounded-xl"
                                    style={{
                                        background: `linear-gradient(135deg, ${tokens.colors.success[500]} 0%, ${tokens.colors.success[600]} 100%)`,
                                        boxShadow: tokens.shadows.md,
                                    }}
                                >
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                                <div>
                                    <h4 style={applyTextStyle('subtitle')} className="text-success-foreground font-semibold">
                                        Recent Activity
                                    </h4>
                                    <span style={applyTextStyle('caption')} className="text-success-foreground/70">
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
                                        <span style={applyTextStyle('caption')}>
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
