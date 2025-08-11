/**
 * Consolidated Admin Dashboard Component
 * 
 * Modern admin dashboard with unified design and comprehensive functionality
 */

import React, { useState, useEffect } from 'react';
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
import { useAdminStore } from '@/stores/admin';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import { AdminSectionErrorBoundary } from '@/components/ErrorBoundary';
import { useLogFilters } from '@/hooks/useLogFilters';
import LogFilterForm from './LogFilterForm';
import DashboardCustomization from './DashboardCustomization';
import DataManagement from './DataManagement';
import type { LogEntry } from '@/services/adminApi';
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
    Cpu,
    Clock,
    Zap,
    Bell,
    Settings,
    Shield,
    BarChart3,
    TrendingUp,
    Server,
    Globe,
    Wifi,
    RefreshCw,
    Download,
    Filter,
    Search,
    Calendar,
    MoreHorizontal,
    Notifications,
} from 'lucide-react';

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

const getHealthIndicator = (value: number | null | undefined, thresholds: { warning: number; critical: number }) => {
    if (value === null || value === undefined) return 'bg-gray-400';
    if (value > thresholds.critical) return 'bg-red-500';
    if (value > thresholds.warning) return 'bg-yellow-500';
    return 'bg-green-500';
};

// Overview Tab Component
const OverviewTab: React.FC = () => {
    const {
        systemStats,
        userActivity,
        systemMetrics,
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

    if (!hasAnyData) {
        return (
            <div className="flex items-center justify-center py-16">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
                        <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">No Data Available</h3>
                        <p className="text-muted-foreground mt-1">
                            Admin data is currently unavailable. Please try refreshing the page.
                        </p>
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
        <div className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overall System Status */}
                <Card className="lg:col-span-2">
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">System Status</h3>
                                    <p className="text-sm text-muted-foreground">Real-time health monitoring</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => fetchOverviewData()}>
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            <div className="text-center group">
                                <div className="flex items-center justify-center mb-3">
                                    <div className={`w-4 h-4 rounded-full mr-2 transition-all duration-200 ${getHealthIndicator(systemMetrics.data?.cpu_usage, { warning: 60, critical: 80 })}`} />
                                    <span className="text-sm font-medium">CPU</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatPercentage(systemMetrics.data?.cpu_usage)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Usage</div>
                            </div>
                            <div className="text-center group">
                                <div className="flex items-center justify-center mb-3">
                                    <div className={`w-4 h-4 rounded-full mr-2 transition-all duration-200 ${getHealthIndicator(systemMetrics.data?.memory_usage, { warning: 70, critical: 85 })}`} />
                                    <span className="text-sm font-medium">Memory</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatPercentage(systemMetrics.data?.memory_usage)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Usage</div>
                            </div>
                            <div className="text-center group">
                                <div className="flex items-center justify-center mb-3">
                                    <div className={`w-4 h-4 rounded-full mr-2 transition-all duration-200 ${getHealthIndicator(systemMetrics.data?.disk_usage, { warning: 75, critical: 90 })}`} />
                                    <span className="text-sm font-medium">Disk</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatPercentage(systemMetrics.data?.disk_usage)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Usage</div>
                            </div>
                            <div className="text-center group">
                                <div className="flex items-center justify-center mb-3">
                                    <div className={`w-4 h-4 rounded-full mr-2 transition-all duration-200 ${getHealthIndicator(systemMetrics.data?.error_rate_24h, { warning: 2, critical: 5 })}`} />
                                    <span className="text-sm font-medium">Errors</span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {formatPercentage(systemMetrics.data?.error_rate_24h)}
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Rate (24h)</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <BarChart3 className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Performance</h3>
                                <p className="text-sm text-muted-foreground">Key metrics</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Cpu className="h-4 w-4" /> CPU Usage
                                </div>
                                <span className="font-semibold text-gray-900">
                                    {formatPercentage(systemMetrics.data?.cpu_usage)}
                                </span>
                            </div>
                            <Progress value={systemMetrics.data?.cpu_usage || 0} className="h-2" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <HardDrive className="h-4 w-4" /> Disk Usage
                                </div>
                                <span className="font-semibold text-gray-900">
                                    {formatPercentage(systemMetrics.data?.disk_usage)}
                                </span>
                            </div>
                            <Progress value={systemMetrics.data?.disk_usage || 0} className="h-2" />
                        </div>
                        <div className="pt-4 border-t">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Zap className="h-4 w-4" /> Requests/24h
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {formatNumber(systemMetrics.data?.request_count_24h)}
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                        <Clock className="h-4 w-4" /> Avg Response
                                    </div>
                                    <div className="font-semibold text-gray-900">
                                        {formatNumber(systemMetrics.data?.avg_response_time)} ms
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Activity and System Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                                    <Users className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold">User Activity</h3>
                                    <p className="text-sm text-muted-foreground">Recent interactions</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userActivity.data && userActivity.data.length > 0 ? (
                            <div className="space-y-4">
                                {userActivity.data.slice(0, 5).map(user => (
                                    <div key={user.user_id} className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-all duration-200 group">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                                <span className="text-sm font-medium text-purple-700">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{user.username}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            {getStatusBadge(user.is_active, true)}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {user.login_count} logins
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {userActivity.data.length > 5 && (
                                    <Button variant="link" className="p-0 h-auto text-sm w-full justify-center">
                                        View All Activity
                                        <ArrowUpRight className="h-4 w-4 ml-1" />
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Users className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                                <p className="text-muted-foreground">No user activity has been recorded recently.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                                <Bell className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">System Alerts</h3>
                                <p className="text-sm text-muted-foreground">Active alerts</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {systemMetrics.data?.cpu_usage && systemMetrics.data.cpu_usage > 90 && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 transition-all duration-200 hover:bg-red-100/50">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-red-900">High CPU Usage</div>
                                            <p className="text-sm text-red-700 mt-1">
                                                CPU usage at {formatPercentage(systemMetrics.data.cpu_usage)}. Consider scaling up resources.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {systemMetrics.data?.memory_usage && systemMetrics.data.memory_usage > 90 && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 transition-all duration-200 hover:bg-red-100/50">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-red-900">High Memory Usage</div>
                                            <p className="text-sm text-red-700 mt-1">
                                                Memory usage at {formatPercentage(systemMetrics.data.memory_usage)}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {systemMetrics.data?.disk_usage && systemMetrics.data.disk_usage > 90 && (
                                <div className="p-4 rounded-lg bg-orange-50 border border-orange-200 transition-all duration-200 hover:bg-orange-100/50">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-orange-900">Disk Usage Warning</div>
                                            <p className="text-sm text-orange-700 mt-1">
                                                Disk usage at {formatPercentage(systemMetrics.data.disk_usage)}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {systemMetrics.data?.error_rate_24h && systemMetrics.data.error_rate_24h > 5 && (
                                <div className="p-4 rounded-lg bg-red-50 border border-red-200 transition-all duration-200 hover:bg-red-100/50">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <div className="font-medium text-red-900">High Error Rate</div>
                                            <p className="text-sm text-red-700 mt-1">
                                                Error rate at {formatPercentage(systemMetrics.data.error_rate_24h)}.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {/* Show healthy state if no alerts */}
                            {!(
                                (systemMetrics.data?.cpu_usage && systemMetrics.data.cpu_usage > 90) ||
                                (systemMetrics.data?.memory_usage && systemMetrics.data.memory_usage > 90) ||
                                (systemMetrics.data?.disk_usage && systemMetrics.data.disk_usage > 90) ||
                                (systemMetrics.data?.error_rate_24h && systemMetrics.data.error_rate_24h > 5)
                            ) && (
                                    <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                                        <div className="flex items-start gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <div className="font-medium text-green-900">All Systems Healthy</div>
                                                <p className="text-sm text-green-700 mt-1">
                                                    All system metrics are within normal ranges.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Health Tab Component
const HealthTab: React.FC = () => {
    const { systemHealth, databaseHealth } = useAdminStore();

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center">
                            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                                <Server className="h-5 w-5 text-emerald-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">System Health</h3>
                                <p className="text-sm text-muted-foreground">Core status</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {systemHealth.data ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Status</span>
                                    <Badge variant={systemHealth.data.status === 'healthy' ? 'default' : 'destructive'} className="font-medium">
                                        {String(systemHealth.data.status).toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Last Check</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Uptime</span>
                                    <span className="text-sm text-muted-foreground">
                                        {systemHealth.data.uptime || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Server className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No System Data</h3>
                                <p className="text-muted-foreground">System health data is currently unavailable.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Database className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Database Health</h3>
                                <p className="text-sm text-muted-foreground">Connection status</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {databaseHealth.data ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Status</span>
                                    <Badge variant={databaseHealth.data.status === 'connected' ? 'default' : 'destructive'} className="font-medium">
                                        {String(databaseHealth.data.status || 'unknown').toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Connection</span>
                                    <span className="text-sm text-muted-foreground">
                                        {databaseHealth.data.connection_count || 'N/A'} active
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Response Time</span>
                                    <span className="text-sm text-muted-foreground">
                                        {databaseHealth.data.response_time || 'N/A'} ms
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                    <Database className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No Database Data</h3>
                                <p className="text-muted-foreground">Database health data is currently unavailable.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Network and Services Health */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center">
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3">
                            <Globe className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Network & Services</h3>
                            <p className="text-sm text-muted-foreground">Connectivity status</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Wifi className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium">API Gateway</span>
                            </div>
                            <Badge variant="default" className="font-medium">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Shield className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium">Auth Service</span>
                            </div>
                            <Badge variant="default" className="font-medium">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                                    <FileText className="h-4 w-4 text-green-600" />
                                </div>
                                <span className="text-sm font-medium">File Service</span>
                            </div>
                            <Badge variant="default" className="font-medium">Online</Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// System Tab Component
const SystemTab: React.FC = () => {
    const { systemMetrics, dataIntegrity, fetchSystemData } = useAdminStore();

    return (
        <div className="space-y-6">
            {/* System Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                <Cpu className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Performance</h3>
                                <p className="text-sm text-muted-foreground">Real-time metrics</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">CPU Usage</span>
                                <span className="text-sm font-semibold">
                                    {formatPercentage(systemMetrics.data?.cpu_usage)}
                                </span>
                            </div>
                            <Progress value={systemMetrics.data?.cpu_usage || 0} className="h-2" />

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Memory Usage</span>
                                <span className="text-sm font-semibold">
                                    {formatPercentage(systemMetrics.data?.memory_usage)}
                                </span>
                            </div>
                            <Progress value={systemMetrics.data?.memory_usage || 0} className="h-2" />

                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Disk Usage</span>
                                <span className="text-sm font-semibold">
                                    {formatPercentage(systemMetrics.data?.disk_usage)}
                                </span>
                            </div>
                            <Progress value={systemMetrics.data?.disk_usage || 0} className="h-2" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                                <Database className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">Data Integrity</h3>
                                <p className="text-sm text-muted-foreground">Database health checks</p>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {dataIntegrity.data && dataIntegrity.data.length > 0 ? (
                            <div className="space-y-3">
                                {dataIntegrity.data.slice(0, 5).map((check, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${check.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`} />
                                            <span className="text-sm font-medium">{check.table_name}</span>
                                        </div>
                                        <Badge variant={check.status === 'healthy' ? 'default' : 'destructive'}>
                                            {check.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <div className="w-12 h-12 mx-auto bg-muted rounded-full flex items-center justify-center mb-3">
                                    <Database className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">No integrity data available</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* System Information */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                            <Server className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">System Info</h3>
                            <p className="text-sm text-muted-foreground">Configuration details</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Uptime</span>
                                <span className="text-sm text-muted-foreground">
                                    {systemMetrics.data?.uptime || 'N/A'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Version</span>
                                <span className="text-sm text-muted-foreground">v1.0.0</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Environment</span>
                                <span className="text-sm text-muted-foreground">Production</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Last Restart</span>
                                <span className="text-sm text-muted-foreground">
                                    {new Date().toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Active Users</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatNumber(systemMetrics.data?.active_users)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                <span className="text-sm font-medium">Total Requests</span>
                                <span className="text-sm text-muted-foreground">
                                    {formatNumber(systemMetrics.data?.request_count_24h)}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Audit Tab Component
const AuditTab: React.FC = () => {
    const { audit, securityAudit, fetchAuditData } = useAdminStore();

    return (
        <div className="space-y-6">
            {/* Security Audit */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                            <Shield className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Security Audit</h3>
                            <p className="text-sm text-muted-foreground">Security events monitoring</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {securityAudit.data && securityAudit.data.length > 0 ? (
                        <div className="space-y-4">
                            {securityAudit.data.slice(0, 10).map((event, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${event.severity === 'high' ? 'bg-red-500' : event.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                                        <div>
                                            <p className="font-medium text-gray-900">{event.event_type}</p>
                                            <p className="text-sm text-muted-foreground">{event.description}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={event.severity === 'high' ? 'destructive' : event.severity === 'medium' ? 'secondary' : 'default'}>
                                            {event.severity}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(event.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Security Events</h3>
                            <p className="text-muted-foreground">No security events have been detected recently.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Audit Logs */}
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                            <FileText className="h-5 w-5 text-orange-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Audit Logs</h3>
                            <p className="text-sm text-muted-foreground">User actions & changes</p>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {audit.data && audit.data.length > 0 ? (
                        <div className="space-y-4">
                            {audit.data.slice(0, 10).map((log, index) => (
                                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-700">
                                                {log.user_name?.charAt(0).toUpperCase() || 'U'}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{log.action}</p>
                                            <p className="text-sm text-muted-foreground">{log.resource}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <Badge variant={log.success ? 'default' : 'destructive'}>
                                            {log.success ? 'Success' : 'Failed'}
                                        </Badge>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {new Date(log.timestamp).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                <FileText className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">No Audit Logs</h3>
                            <p className="text-muted-foreground">No audit logs are available at the moment.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

// Logs Tab Component
const LogsTab: React.FC = () => {
    const { logs, handleFilterChange, handlePrev, handleNext, handleRefresh } = useLogFilters();
    const { items, total, skip, limit, level, from, to, search } = logs;

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                                <FileText className="h-5 w-5 text-slate-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold">System Logs</h3>
                                <p className="text-sm text-muted-foreground">Application logs</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={handleRefresh}>
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Refresh
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <LogFilterForm
                        level={level}
                        limit={limit}
                        from={from}
                        to={to}
                        search={search}
                        skip={skip}
                        total={total}
                        onChange={handleFilterChange}
                        onRefresh={handleRefresh}
                        onPrev={handlePrev}
                        onNext={handleNext}
                    />
                    <div className="border rounded-lg mt-6 overflow-hidden">
                        <div className="max-h-96 overflow-auto">
                            {items.length > 0 ? (
                                items.map((log: LogEntry, idx: number) => (
                                    <div key={idx} className="px-6 py-4 border-b last:border-b-0 hover:bg-muted/30 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <Badge variant={log.level === 'error' ? 'destructive' : log.level === 'warning' ? 'secondary' : 'default'} className="font-medium">
                                                    {log.level.toUpperCase()}
                                                </Badge>
                                                <span className="font-medium text-sm text-gray-900">{log.module}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-sm font-mono text-gray-700 bg-gray-50 p-3 rounded border-l-4 border-gray-200">
                                            {log.message}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center">
                                    <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
                                        <FileText className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-lg font-semibold mb-2">No Logs Available</h3>
                                    <p className="text-muted-foreground">No log entries match the current filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

// Main Admin Dashboard Component
export const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { fetchOverviewData, fetchSystemData, fetchAuditData, fetchHealthData } = useAdminStore();

    // Fetch data when tab changes
    useEffect(() => {
        switch (activeTab) {
            case 'overview':
                fetchOverviewData();
                break;
            case 'system':
                fetchSystemData();
                break;
            case 'audit':
                fetchAuditData();
                break;
            case 'health':
                fetchHealthData();
                break;
            case 'data':
                // DataManagement component handles its own data fetching
                break;
            case 'logs':
                // LogsTab component handles its own data fetching
                break;
            default:
                fetchOverviewData();
        }
    }, [activeTab, fetchOverviewData, fetchSystemData, fetchAuditData, fetchHealthData]);

    return (
        <AdminSectionErrorBoundary
            sectionName="Admin Dashboard"
            onRetry={() => window.location.reload()}
        >
            <div className="space-y-6">
                {/* Action Bar */}
                <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" size="sm" className="relative">
                        <Notifications className="h-4 w-4 mr-2" />
                        Notifications
                        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                            3
                        </span>
                    </Button>
                    <DashboardCustomization
                        userRole="admin"
                        onConfigChange={(config) => {
                            console.log('Dashboard config changed:', config);
                            // TODO: Save configuration to backend
                        }}
                    />
                    <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                    </Button>
                    <Button size="sm">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Export Report
                    </Button>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-6 h-12 bg-muted/50 p-1 rounded-lg">
                        <TabsTrigger
                            value="overview"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                        >
                            <Activity className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger
                            value="system"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                        >
                            <Server className="h-4 w-4" />
                            System
                        </TabsTrigger>
                        <TabsTrigger
                            value="audit"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                        >
                            <Shield className="h-4 w-4" />
                            Audit
                        </TabsTrigger>
                        <TabsTrigger
                            value="health"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                        >
                            <CheckCircle className="h-4 w-4" />
                            Health
                        </TabsTrigger>
                        <TabsTrigger
                            value="data"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                        >
                            <Database className="h-4 w-4" />
                            Data
                        </TabsTrigger>
                        <TabsTrigger
                            value="logs"
                            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900"
                        >
                            <FileText className="h-4 w-4" />
                            Logs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <OverviewTab />
                    </TabsContent>

                    <TabsContent value="system" className="space-y-6">
                        <SystemTab />
                    </TabsContent>

                    <TabsContent value="audit" className="space-y-6">
                        <AuditTab />
                    </TabsContent>

                    <TabsContent value="health" className="space-y-6">
                        <HealthTab />
                    </TabsContent>

                    <TabsContent value="data" className="space-y-6">
                        <DataManagement />
                    </TabsContent>

                    <TabsContent value="logs" className="space-y-6">
                        <LogsTab />
                    </TabsContent>
                </Tabs>
            </div>
        </AdminSectionErrorBoundary>
    );
};

export default AdminDashboard;
