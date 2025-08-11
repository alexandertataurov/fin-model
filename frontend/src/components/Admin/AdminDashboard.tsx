/**
 * Consolidated Admin Dashboard Component
 * 
 * Modern admin dashboard with unified design and comprehensive functionality
 */

import React, { useState } from 'react';
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
            <div className="flex items-center justify-center py-12">
                <Alert className="max-w-md">
                    <AlertDescription>
                        Admin data is currently unavailable. Please try refreshing the page or check your connection.
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* System Health Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overall System Status */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                            System Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${getHealthIndicator(systemMetrics.data?.cpu_usage, { warning: 60, critical: 80 })}`} />
                                    <span className="text-sm font-medium">CPU</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatPercentage(systemMetrics.data?.cpu_usage)}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${getHealthIndicator(systemMetrics.data?.memory_usage, { warning: 70, critical: 85 })}`} />
                                    <span className="text-sm font-medium">Memory</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatPercentage(systemMetrics.data?.memory_usage)}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${getHealthIndicator(systemMetrics.data?.disk_usage, { warning: 75, critical: 90 })}`} />
                                    <span className="text-sm font-medium">Disk</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatPercentage(systemMetrics.data?.disk_usage)}
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="flex items-center justify-center mb-2">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${getHealthIndicator(systemMetrics.data?.error_rate_24h, { warning: 2, critical: 5 })}`} />
                                    <span className="text-sm font-medium">Errors</span>
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {formatPercentage(systemMetrics.data?.error_rate_24h)}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <BarChart3 className="h-5 w-5 mr-2" />
                            Performance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Cpu className="h-4 w-4" /> CPU Usage
                                </div>
                                <span className="font-medium">
                                    {formatPercentage(systemMetrics.data?.cpu_usage)}
                                </span>
                            </div>
                            <Progress value={systemMetrics.data?.cpu_usage || 0} />
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <HardDrive className="h-4 w-4" /> Disk Usage
                                </div>
                                <span className="font-medium">
                                    {formatPercentage(systemMetrics.data?.disk_usage)}
                                </span>
                            </div>
                            <Progress value={systemMetrics.data?.disk_usage || 0} />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Zap className="h-4 w-4" /> Requests/24h
                            </div>
                            <span className="font-medium">
                                {formatNumber(systemMetrics.data?.request_count_24h)}
                            </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <Clock className="h-4 w-4" /> Avg Response
                            </div>
                            <span className="font-medium">
                                {formatNumber(systemMetrics.data?.avg_response_time)} ms
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* User Activity and System Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            Recent User Activity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {userActivity.data && userActivity.data.length > 0 ? (
                            <div className="space-y-4">
                                {userActivity.data.slice(0, 5).map(user => (
                                    <div key={user.user_id} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors">
                                        <div>
                                            <p className="font-medium">{user.username}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Last login: {user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                                            </p>
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
                                    <Button variant="link" className="p-0 h-auto text-sm">
                                        View All Activity
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                No recent user activity
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Bell className="h-5 w-5 mr-2" />
                            System Alerts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {systemMetrics.data?.cpu_usage && systemMetrics.data.cpu_usage > 90 && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                        <span className="text-sm font-medium text-destructive">High CPU Usage</span>
                                    </div>
                                    <p className="text-xs text-destructive/80 mt-1">
                                        CPU usage at {formatPercentage(systemMetrics.data.cpu_usage)}. Consider scaling up resources.
                                    </p>
                                </div>
                            )}
                            {systemMetrics.data?.memory_usage && systemMetrics.data.memory_usage > 90 && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                        <span className="text-sm font-medium text-destructive">High Memory Usage</span>
                                    </div>
                                    <p className="text-xs text-destructive/80 mt-1">
                                        Memory usage at {formatPercentage(systemMetrics.data.memory_usage)}.
                                    </p>
                                </div>
                            )}
                            {systemMetrics.data?.disk_usage && systemMetrics.data.disk_usage > 90 && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                        <span className="text-sm font-medium text-destructive">Disk Usage Warning</span>
                                    </div>
                                    <p className="text-xs text-destructive/80 mt-1">
                                        Disk usage at {formatPercentage(systemMetrics.data.disk_usage)}.
                                    </p>
                                </div>
                            )}
                            {systemMetrics.data?.error_rate_24h && systemMetrics.data.error_rate_24h > 5 && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="h-4 w-4 text-destructive" />
                                        <span className="text-sm font-medium text-destructive">High Error Rate</span>
                                    </div>
                                    <p className="text-xs text-destructive/80 mt-1">
                                        Error rate at {formatPercentage(systemMetrics.data.error_rate_24h)}.
                                    </p>
                                </div>
                            )}
                            {/* Show healthy state if no alerts */}
                            {!(
                                (systemMetrics.data?.cpu_usage && systemMetrics.data.cpu_usage > 90) ||
                                (systemMetrics.data?.memory_usage && systemMetrics.data.memory_usage > 90) ||
                                (systemMetrics.data?.disk_usage && systemMetrics.data.disk_usage > 90) ||
                                (systemMetrics.data?.error_rate_24h && systemMetrics.data.error_rate_24h > 5)
                            ) && (
                                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-emerald-600" />
                                            <span className="text-sm font-medium text-emerald-600">All Systems Healthy</span>
                                        </div>
                                        <p className="text-xs text-emerald-600/80 mt-1">
                                            All system metrics are within normal ranges.
                                        </p>
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
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Server className="h-5 w-5 mr-2" />
                            System Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {systemHealth.data ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Status</span>
                                    <Badge variant={systemHealth.data.status === 'healthy' ? 'default' : 'destructive'}>
                                        {String(systemHealth.data.status).toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Last Check</span>
                                    <span className="text-sm text-muted-foreground">
                                        {new Date().toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Uptime</span>
                                    <span className="text-sm text-muted-foreground">
                                        {systemHealth.data.uptime || 'N/A'}
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Server className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                No system health data available
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Database className="h-5 w-5 mr-2" />
                            Database Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {databaseHealth.data ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Status</span>
                                    <Badge variant={databaseHealth.data.status === 'connected' ? 'default' : 'destructive'}>
                                        {String(databaseHealth.data.status || 'unknown').toUpperCase()}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Connection</span>
                                    <span className="text-sm text-muted-foreground">
                                        {databaseHealth.data.connection_count || 'N/A'} active
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                                    <span className="text-sm font-medium">Response Time</span>
                                    <span className="text-sm text-muted-foreground">
                                        {databaseHealth.data.response_time || 'N/A'} ms
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                No database health data available
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Network and Services Health */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Globe className="h-5 w-5 mr-2" />
                        Network & Services
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Wifi className="h-4 w-4" />
                                <span className="text-sm font-medium">API Gateway</span>
                            </div>
                            <Badge variant="default">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                <span className="text-sm font-medium">Auth Service</span>
                            </div>
                            <Badge variant="default">Online</Badge>
                        </div>
                        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4" />
                                <span className="text-sm font-medium">File Service</span>
                            </div>
                            <Badge variant="default">Online</Badge>
                        </div>
                    </div>
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
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <FileText className="h-5 w-5 mr-2" />
                        System Logs
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
                    <div className="border rounded-lg mt-4">
                        <div className="max-h-96 overflow-auto">
                            {items.length > 0 ? (
                                items.map((log: LogEntry, idx: number) => (
                                    <div key={idx} className="px-4 py-3 border-b last:border-b-0 hover:bg-muted/50 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant={log.level === 'error' ? 'destructive' : log.level === 'warning' ? 'secondary' : 'default'}>
                                                    {log.level.toUpperCase()}
                                                </Badge>
                                                <span className="font-medium text-sm">{log.module}</span>
                                            </div>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(log.timestamp).toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-sm font-mono">{log.message}</div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-muted-foreground">
                                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    No logs available
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

    return (
        <AdminSectionErrorBoundary
            sectionName="Admin Dashboard"
            onRetry={() => window.location.reload()}
        >
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
                        <p className="text-muted-foreground">
                            Monitor system health, user activity, and system performance
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Settings
                        </Button>
                        <Button size="sm">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Export Report
                        </Button>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Overview
                        </TabsTrigger>
                        <TabsTrigger value="health" className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4" />
                            Health
                        </TabsTrigger>
                        <TabsTrigger value="logs" className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Logs
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <OverviewTab />
                    </TabsContent>

                    <TabsContent value="health" className="space-y-6">
                        <HealthTab />
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
