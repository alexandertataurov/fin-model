/**
 * Admin Dashboard Overview Section
 * 
 * Modular component for the overview tab content
 */

import React from 'react';
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
import { useAdminStore } from '@/stores/adminStore';
import { StatsSkeleton, CardSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdminSectionErrorBoundary } from '@/components/ErrorBoundary';

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

export const OverviewSection: React.FC = () => {
    const {
        systemStats,
        userActivity,
        systemMetrics,
        securityAudit,
        fetchOverviewData,
    } = useAdminStore();

    const hasAnyData =
        !!systemStats.data ||
        !!systemMetrics.data ||
        (userActivity.data && userActivity.data.length > 0);

    const isLoading = systemStats.loading || userActivity.loading || systemMetrics.loading;

    if (isLoading && !hasAnyData) {
        return <StatsSkeleton />;
    }

    return (
        <AdminSectionErrorBoundary
            sectionName="Overview"
            onRetry={() => fetchOverviewData()}
        >
            <div className="space-y-6">
                {hasAnyData ? (
                    <>
                        {/* System Health Overview */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                            {/* Overall System Status */}
                            <Card className="lg:col-span-2">
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                                        System Status
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* System Health Indicators */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-3 h-3 rounded-full mr-2 ${(systemMetrics.data?.cpu_usage || 0) > 80
                                                        ? 'bg-red-500'
                                                        : (systemMetrics.data?.cpu_usage || 0) > 60
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                        }`}
                                                ></div>
                                                <span className="text-sm">CPU</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-3 h-3 rounded-full mr-2 ${(systemMetrics.data?.memory_usage || 0) > 80
                                                        ? 'bg-red-500'
                                                        : (systemMetrics.data?.memory_usage || 0) > 60
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                        }`}
                                                ></div>
                                                <span className="text-sm">Memory</span>
                                            </div>
                                            <div className="flex items-center">
                                                <div
                                                    className={`w-3 h-3 rounded-full mr-2 ${(systemMetrics.data?.disk_usage || 0) > 80
                                                        ? 'bg-red-500'
                                                        : (systemMetrics.data?.disk_usage || 0) > 60
                                                            ? 'bg-yellow-500'
                                                            : 'bg-green-500'
                                                        }`}
                                                ></div>
                                                <span className="text-sm">Storage</span>
                                            </div>
                                        </div>

                                        {/* Quick Stats Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
                                            {/* Users Stats */}
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <Users className="h-4 w-4 mr-2 text-blue-500" />
                                                            Total Users
                                                        </div>
                                                        <div className="flex items-center text-xs text-green-600">
                                                            <ArrowUpRight className="h-3 w-3 mr-1" />+
                                                            {systemStats.data?.users.new_24h || 0}
                                                        </div>
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold text-blue-600">
                                                        {formatNumber(systemStats.data?.users.total)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {systemStats.data?.users.active || 0} active •{' '}
                                                        {systemStats.data?.users.verified || 0} verified
                                                    </div>
                                                    <div className="flex items-center mt-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                            <div
                                                                className="bg-blue-500 h-1.5 rounded-full"
                                                                style={{
                                                                    width: `${((systemStats.data?.users.active || 0) /
                                                                        (systemStats.data?.users.total || 1)) *
                                                                        100
                                                                        }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            {Math.round(
                                                                ((systemStats.data?.users.active || 0) /
                                                                    (systemStats.data?.users.total || 1)) *
                                                                100
                                                            )}
                                                            % active
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Files Stats */}
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <FileText className="h-4 w-4 mr-2 text-green-500" />
                                                            Files Processed
                                                        </div>
                                                        {(systemStats.data?.files.failed || 0) > 0 && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {systemStats.data?.files.failed || 0} failed
                                                            </Badge>
                                                        )}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold text-green-600">
                                                        {formatNumber(systemStats.data?.files.total)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        {systemStats.data?.files.completed || 0} completed •{' '}
                                                        {systemStats.data?.files.processing || 0} processing
                                                    </div>
                                                    <div className="flex items-center mt-2">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                                            <div
                                                                className="bg-green-500 h-1.5 rounded-full"
                                                                style={{
                                                                    width: `${((systemStats.data?.files.completed || 0) /
                                                                        (systemStats.data?.files.total || 1)) *
                                                                        100
                                                                        }%`,
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-muted-foreground ml-2">
                                                            {Math.round(
                                                                ((systemStats.data?.files.completed || 0) /
                                                                    (systemStats.data?.files.total || 1)) *
                                                                100
                                                            )}
                                                            % done
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Financial Data */}
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium flex items-center">
                                                        <Database className="h-4 w-4 mr-2 text-purple-500" />
                                                        Financial Data
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold text-purple-600">
                                                        {formatNumber(
                                                            systemStats.data?.financial_data.statements
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        statements •{' '}
                                                        {formatNumber(
                                                            systemStats.data?.financial_data.parameters
                                                        )}{' '}
                                                        parameters
                                                    </div>
                                                    <div className="flex justify-between items-center mt-2">
                                                        <div className="text-xs flex items-center">
                                                            <div className="w-2 h-2 bg-purple-500 rounded mr-1"></div>
                                                            Statements
                                                        </div>
                                                        <div className="text-xs flex items-center">
                                                            <div className="w-2 h-2 bg-purple-300 rounded mr-1"></div>
                                                            Parameters
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>

                                            {/* Storage Usage */}
                                            <Card>
                                                <CardHeader className="pb-2">
                                                    <CardTitle className="text-sm font-medium flex items-center">
                                                        <HardDrive className="h-4 w-4 mr-2 text-orange-500" />
                                                        Storage Usage
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent>
                                                    <div className="text-2xl font-bold text-orange-600">
                                                        {systemStats.data?.system.database_size || 'N/A'}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground mt-1">
                                                        Avg file: {systemStats.data?.performance.avg_file_size_mb || 0}
                                                        MB
                                                    </div>
                                                    <div className="flex items-center mt-2">
                                                        <HardDrive className="h-4 w-4 text-orange-500 mr-2" />
                                                        <div className="flex-1">
                                                            <div className="text-xs text-muted-foreground">
                                                                Database storage
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* System Performance */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Activity className="h-5 w-5 mr-2" />
                                            Performance
                                        </div>
                                        {systemMetrics.loading && (
                                            <div className="animate-spin h-4 w-4 border-2 border-muted border-t-foreground rounded-full"></div>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* CPU Usage */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">CPU Usage</span>
                                                <span
                                                    className={`text-sm font-medium ${(systemMetrics.data?.cpu_usage || 0) > 80
                                                        ? 'text-red-500'
                                                        : (systemMetrics.data?.cpu_usage || 0) > 60
                                                            ? 'text-yellow-500'
                                                            : 'text-green-500'
                                                        }`}
                                                >
                                                    {formatPercentage(systemMetrics.data?.cpu_usage)}
                                                </span>
                                            </div>
                                            <Progress
                                                value={systemMetrics.data?.cpu_usage || 0}
                                                className="h-2"
                                            />
                                        </div>

                                        {/* Memory Usage */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Memory Usage</span>
                                                <span
                                                    className={`text-sm font-medium ${(systemMetrics.data?.memory_usage || 0) > 80
                                                        ? 'text-red-500'
                                                        : (systemMetrics.data?.memory_usage || 0) > 60
                                                            ? 'text-yellow-500'
                                                            : 'text-green-500'
                                                        }`}
                                                >
                                                    {formatPercentage(systemMetrics.data?.memory_usage)}
                                                </span>
                                            </div>
                                            <Progress
                                                value={systemMetrics.data?.memory_usage || 0}
                                                className="h-2"
                                            />
                                        </div>

                                        {/* Disk Usage */}
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-muted-foreground">Disk Usage</span>
                                                <span
                                                    className={`text-sm font-medium ${(systemMetrics.data?.disk_usage || 0) > 80
                                                        ? 'text-red-500'
                                                        : (systemMetrics.data?.disk_usage || 0) > 60
                                                            ? 'text-yellow-500'
                                                            : 'text-green-500'
                                                        }`}
                                                >
                                                    {formatPercentage(systemMetrics.data?.disk_usage)}
                                                </span>
                                            </div>
                                            <Progress
                                                value={systemMetrics.data?.disk_usage || 0}
                                                className="h-2"
                                            />
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t mt-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">
                                                    DB Connections:
                                                </span>
                                                <span className="font-medium">
                                                    {systemMetrics.data?.active_connections || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-muted-foreground">
                                                    Requests (24h):
                                                </span>
                                                <span className="font-medium">
                                                    {formatNumber(
                                                        systemMetrics.data?.request_count_24h || 0
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* User Activity */}
                        {userActivity.data && userActivity.data.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <Users className="h-5 w-5 mr-2" />
                                            Recent User Activity
                                        </div>
                                        <Button variant="outline" size="sm">
                                            <Eye className="h-4 w-4 mr-2" />
                                            View All
                                        </Button>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {userActivity.data.slice(0, 6).map(activity => (
                                            <div
                                                key={activity.user_id}
                                                className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                                            >
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                        <Users className="h-4 w-4 text-blue-600" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium">{activity.username}</div>
                                                        <div className="text-sm text-muted-foreground">
                                                            {activity.login_count} logins • {activity.files_uploaded} files •{' '}
                                                            {activity.models_created} models
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    {getStatusBadge(activity.is_active, true)}
                                                    <div className="text-xs text-muted-foreground">
                                                        {activity.last_login
                                                            ? new Date(activity.last_login).toLocaleDateString()
                                                            : 'Never'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Activity Summary */}
                                    <div className="mt-6 pt-4 border-t">
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div>
                                                <div className="text-lg font-bold text-blue-600">
                                                    {userActivity.data?.filter(u => u.is_active).length || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Active Users
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-green-600">
                                                    {userActivity.data?.reduce(
                                                        (sum, u) => sum + u.files_uploaded,
                                                        0
                                                    ) || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Files Uploaded
                                                </div>
                                            </div>
                                            <div>
                                                <div className="text-lg font-bold text-purple-600">
                                                    {userActivity.data?.reduce(
                                                        (sum, u) => sum + u.models_created,
                                                        0
                                                    ) || 0}
                                                </div>
                                                <div className="text-xs text-muted-foreground">
                                                    Models Created
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </>
                ) : (
                    <div className="flex items-center justify-center py-12">
                        <Alert className="max-w-md">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Admin data is currently unavailable. Please try refreshing
                                the page or check your connection.
                            </AlertDescription>
                        </Alert>
                    </div>
                )}
            </div>
        </AdminSectionErrorBoundary>
    );
};
