import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Server,
  Database,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  // Zap,
  Globe,
  Shield,
  BarChart3,
  // PieChart,
  Monitor,
  // Thermometer,
  Gauge,
  Timer,
  // Wifi,
  // Download,
  // Upload,
  Eye,
  // Filter,
  // Calendar,
  // Search,
  Bell,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/design-system/components/Table';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/components/Tabs';


import * as AdminApi from '@/services/admin';
import type {
  SystemMetrics,
  DataIntegrityCheck,
  LogEntry,
} from '@/services/admin';
import { toast } from 'sonner';
import { formatNumber } from '@/utils/formatters';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';

interface SystemMonitoringProps {
  refreshInterval?: number; // in milliseconds
}

interface MetricTrend {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
}

const SystemMonitoring: React.FC<SystemMonitoringProps> = ({
  refreshInterval = 30000, // 30 seconds default
}) => {
  // Design system helper functions
  const applyDesignSystemSpacing = (size: keyof typeof tokens.spacing) => tokens.spacing[size];
  const applyDesignSystemRadius = (size: keyof typeof tokens.borderRadius) => tokens.borderRadius[size];
  const applyDesignSystemShadow = (size: keyof typeof tokens.shadows) => tokens.shadows[size];
  const applyDesignSystemMotion = (type: 'duration' | 'easing', value: string) => 
      type === 'duration' ? tokens.motion.duration[value] : tokens.motion.easing[value];

  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    null
  );
  const [dataIntegrity, setDataIntegrity] = useState<DataIntegrityCheck[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Enhanced state for new features
  const [metricsHistory, setMetricsHistory] = useState<SystemMetrics[]>([]);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [logFilter] = useState<
    'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  >('ERROR');
  const [_logSearch, _setLogSearch] = useState('');
  const [_systemHealth, _setSystemHealth] = useState<any>(null);

  // Load monitoring data
  const loadMonitoringData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [metrics, integrity, systemLogs, health] = await Promise.all([
        AdminApi.getSystemMetrics(),
        AdminApi.checkDataIntegrity(),
        AdminApi.getSystemLogs(logFilter, 50),
        AdminApi.getSystemHealth(),
      ]);

      setSystemMetrics(metrics);
      setDataIntegrity(integrity);
      const logsArray = Array.isArray(systemLogs)
        ? systemLogs
        : (systemLogs as any)?.items ?? [];
      setLogs(logsArray);
      _setSystemHealth(health);
      setLastRefresh(new Date());

      // Update metrics history for trends
      if (metrics) {
        setMetricsHistory(prev => [...prev.slice(-9), metrics]); // Keep last 10 entries
      }

      if (isManualRefresh) {
        toast.success('System data refreshed');
      }
    } catch (_error) {
      console.error('Failed to load monitoring data:', _error);
      toast.error('Failed to load system monitoring data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [logFilter]);

  // Manual refresh
  const handleRefresh = () => {
    loadMonitoringData(true);
  };

  // Get metric trend
  const getMetricTrend = (
    current: number | null,
    metric: keyof SystemMetrics
  ): MetricTrend | null => {
    if (!current || metricsHistory.length < 2) return null;

    const previous = metricsHistory[metricsHistory.length - 2]?.[metric] as
      | number
      | null;
    if (!previous) return null;

    const diff = current - previous;
    const trend = Math.abs(diff) < 1 ? 'stable' : diff > 0 ? 'up' : 'down';

    return { current, previous, trend };
  };

  // Get trend icon
  const getTrendIcon = (
    trend: 'up' | 'down' | 'stable',
    isGoodTrend = false
  ) => {
    const iconClass = 'h-4 w-4 ml-1';

    if (trend === 'stable') {
      return <Minus className={`${iconClass} text-muted-foreground`} />;
    }

    const colorClass = isGoodTrend
      ? trend === 'up'
        ? 'text-green-500'
        : 'text-red-500'
      : trend === 'up'
        ? 'text-red-500'
        : 'text-green-500';

    return trend === 'up' ? (
      <TrendingUp className={`${iconClass} ${colorClass}`} />
    ) : (
      <TrendingDown className={`${iconClass} ${colorClass}`} />
    );
  };

  // Get status color based on percentage
  const getStatusColor = (
    value: number | null,
    thresholds = { warning: 70, critical: 90 }
  ) => {
    if (!value) return 'text-muted-foreground';
    if (value >= thresholds.critical) return 'text-red-500';
    if (value >= thresholds.warning) return 'text-yellow-500';
    return 'text-green-500';
  };

  // Format percentage
  const formatPercentage = (value: number | null): string => {
    return value !== null ? `${value.toFixed(1)}%` : 'N/A';
  };

  // Format timestamp
  const formatTimestamp = (date: Date): string => {
    return date.toLocaleTimeString();
  };

  // Get log level badge
  const getLogLevelBadge = (level: string) => {
    const variants = {
      ERROR: 'destructive' as const,
      WARNING: 'secondary' as const,
      INFO: 'default' as const,
      DEBUG: 'outline' as const,
      CRITICAL: 'destructive' as const,
    };

    return (
      <Badge variant={variants[level as keyof typeof variants] || 'default'}>
        {level}
      </Badge>
    );
  };

  // Auto-refresh effect
  useEffect(() => {
    if (autoRefresh && refreshInterval > 0) {
      const interval = setInterval(() => {
        loadMonitoringData(false);
      }, refreshInterval);

      return () => clearInterval(interval);
    }
  }, [autoRefresh, refreshInterval, loadMonitoringData]);

  // Initial load
  useEffect(() => {
    loadMonitoringData();
  }, [loadMonitoringData]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <Monitor className="h-6 w-6 mr-2 text-blue-500" />
            System Monitoring & Health
          </h2>
          <p className="text-muted-foreground">
            Comprehensive real-time system performance, health metrics, and
            monitoring tools
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {formatTimestamp(lastRefresh)}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? 'border-green-200 text-green-600' : ''}
          >
            <Timer className="h-4 w-4 mr-1" />
            {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
          </Button>
          <Button size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Health Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-600">Operational</div>
            <div className="text-xs text-muted-foreground mt-1">
              All systems running
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Gauge className="h-4 w-4 mr-2 text-blue-500" />
              Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-blue-600">
              {systemMetrics
                ? Math.round(
                  100 -
                  ((systemMetrics.cpu_usage || 0) +
                    (systemMetrics.memory_usage || 0)) /
                  2
                )
                : 'N/A'}
              %
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Overall score
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Network className="h-4 w-4 mr-2 text-purple-500" />
              Connectivity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-purple-600">Online</div>
            <div className="text-xs text-muted-foreground mt-1">
              {systemMetrics?.active_connections || 0} connections
            </div>
          </CardContent>
        </Card>

        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center">
              <Bell className="h-4 w-4 mr-2 text-orange-500" />
              Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-orange-600">
              {
                logs.filter(
                  log => log.level === 'ERROR' || log.level === 'CRITICAL'
                ).length
              }
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Active alerts
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comprehensive System Monitoring Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <Gauge className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="flex items-center space-x-2"
          >
            <BarChart3 className="h-4 w-4" />
            <span>Performance</span>
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Logs</span>
          </TabsTrigger>
          <TabsTrigger value="health" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Health</span>
          </TabsTrigger>
          <TabsTrigger
            value="maintenance"
            className="flex items-center space-x-2"
          >
            <Server className="h-4 w-4" />
            <span>Maintenance</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {systemMetrics && (
            <>
              {/* Real-time Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2" />
                    Real-time Performance Metrics
                    <Badge variant="outline" className="ml-2">
                      Live
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* CPU Usage */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                          <span className="font-medium">CPU Usage</span>
                        </div>
                        <div className="flex items-center">
                          {(() => {
                            const trend = getMetricTrend(
                              systemMetrics.cpu_usage,
                              'cpu_usage'
                            );
                            return trend
                              ? getTrendIcon(trend.trend, false)
                              : null;
                          })()}
                          <span
                            className={`text-lg font-bold ml-2 ${getStatusColor(
                              systemMetrics.cpu_usage
                            )}`}
                          >
                            {formatPercentage(systemMetrics.cpu_usage)}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={systemMetrics.cpu_usage || 0}
                        className="h-3"
                      />
                      <div className="text-xs text-muted-foreground">
                        {systemMetrics.cpu_usage && systemMetrics.cpu_usage > 80
                          ? 'High usage - monitor processes'
                          : 'Normal operation'}
                      </div>
                    </div>

                    {/* Memory Usage */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <MemoryStick className="h-5 w-5 mr-2 text-green-500" />
                          <span className="font-medium">Memory Usage</span>
                        </div>
                        <div className="flex items-center">
                          {(() => {
                            const trend = getMetricTrend(
                              systemMetrics.memory_usage,
                              'memory_usage'
                            );
                            return trend
                              ? getTrendIcon(trend.trend, false)
                              : null;
                          })()}
                          <span
                            className={`text-lg font-bold ml-2 ${getStatusColor(
                              systemMetrics.memory_usage
                            )}`}
                          >
                            {formatPercentage(systemMetrics.memory_usage)}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={systemMetrics.memory_usage || 0}
                        className="h-3"
                      />
                      <div className="text-xs text-muted-foreground">
                        {systemMetrics.memory_usage &&
                          systemMetrics.memory_usage > 80
                          ? 'High usage - check memory leaks'
                          : 'Normal operation'}
                      </div>
                    </div>

                    {/* Disk Usage */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <HardDrive className="h-5 w-5 mr-2 text-purple-500" />
                          <span className="font-medium">Disk Usage</span>
                        </div>
                        <div className="flex items-center">
                          {(() => {
                            const trend = getMetricTrend(
                              systemMetrics.disk_usage,
                              'disk_usage'
                            );
                            return trend
                              ? getTrendIcon(trend.trend, false)
                              : null;
                          })()}
                          <span
                            className={`text-lg font-bold ml-2 ${getStatusColor(
                              systemMetrics.disk_usage
                            )}`}
                          >
                            {formatPercentage(systemMetrics.disk_usage)}
                          </span>
                        </div>
                      </div>
                      <Progress
                        value={systemMetrics.disk_usage || 0}
                        className="h-3"
                      />
                      <div className="text-xs text-muted-foreground">
                        {systemMetrics.disk_usage &&
                          systemMetrics.disk_usage > 80
                          ? 'Low space - cleanup recommended'
                          : 'Normal operation'}
                      </div>
                    </div>
                  </div>

                  {/* Additional Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {systemMetrics.active_connections}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center">
                        <Database className="h-4 w-4 mr-1" />
                        DB Connections
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {formatNumber(systemMetrics.request_count_24h || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center">
                        <Globe className="h-4 w-4 mr-1" />
                        Requests (24h)
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {systemMetrics.avg_response_time || 0}ms
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center">
                        <Timer className="h-4 w-4 mr-1" />
                        Avg Response
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {formatPercentage(systemMetrics.error_rate_24h || 0)}
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center justify-center">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Error Rate
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-4">
          {systemMetrics && (
            <>
              {/* CPU Usage */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Cpu className="h-4 w-4 mr-2" />
                    CPU Usage
                    {(() => {
                      const trend = getMetricTrend(
                        systemMetrics.cpu_usage,
                        'cpu_usage'
                      );
                      return trend ? getTrendIcon(trend.trend, false) : null;
                    })()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-2xl font-bold ${getStatusColor(
                          systemMetrics.cpu_usage
                        )}`}
                      >
                        {formatPercentage(systemMetrics.cpu_usage)}
                      </span>
                    </div>
                    <Progress value={systemMetrics.cpu_usage || 0} />
                  </div>
                </CardContent>
              </Card>

              {/* Memory Usage */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <MemoryStick className="h-4 w-4 mr-2" />
                    Memory Usage
                    {(() => {
                      const trend = getMetricTrend(
                        systemMetrics.memory_usage,
                        'memory_usage'
                      );
                      return trend ? getTrendIcon(trend.trend, false) : null;
                    })()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-2xl font-bold ${getStatusColor(
                          systemMetrics.memory_usage
                        )}`}
                      >
                        {formatPercentage(systemMetrics.memory_usage)}
                      </span>
                    </div>
                    <Progress value={systemMetrics.memory_usage || 0} />
                  </div>
                </CardContent>
              </Card>

              {/* Disk Usage */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <HardDrive className="h-4 w-4 mr-2" />
                    Disk Usage
                    {(() => {
                      const trend = getMetricTrend(
                        systemMetrics.disk_usage,
                        'disk_usage'
                      );
                      return trend ? getTrendIcon(trend.trend, false) : null;
                    })()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span
                        className={`text-2xl font-bold ${getStatusColor(
                          systemMetrics.disk_usage
                        )}`}
                      >
                        {formatPercentage(systemMetrics.disk_usage)}
                      </span>
                    </div>
                    <Progress value={systemMetrics.disk_usage || 0} />
                  </div>
                </CardContent>
              </Card>

              {/* Database Connections */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center">
                    <Database className="h-4 w-4 mr-2" />
                    DB Connections
                    {(() => {
                      const trend = getMetricTrend(
                        systemMetrics.active_connections,
                        'active_connections'
                      );
                      return trend ? getTrendIcon(trend.trend, true) : null;
                    })()}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {systemMetrics.active_connections}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Active connections
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>

      {/* Data Integrity Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="h-4 w-4 mr-2" />
            Data Integrity Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {dataIntegrity.map(check => (
              <div
                key={check.table_name}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div className="flex items-center space-x-3">
                  {check.integrity_issues.length > 0 ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}
                  <div>
                    <div className="font-medium">{check.table_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {check.record_count.toLocaleString()} records
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  {check.integrity_issues.length > 0 ? (
                    <Badge variant="secondary">
                      {check.integrity_issues.length} issues
                    </Badge>
                  ) : (
                    <Badge variant="default">Healthy</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent System Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Recent System Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Module</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log, index) => (
                <TableRow key={index}>
                  <TableCell className="font-mono text-xs">
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{getLogLevelBadge(log.level)}</TableCell>
                  <TableCell className="font-medium">{log.module}</TableCell>
                  <TableCell className="max-w-md">
                    <div className="truncate" title={log.message}>
                      {log.message}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* System Health Alerts */}
      {systemMetrics && (
        <div className="space-y-2">
          {systemMetrics.cpu_usage && systemMetrics.cpu_usage > 90 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High CPU usage detected (
                {formatPercentage(systemMetrics.cpu_usage)}). Consider
                investigating running processes.
              </AlertDescription>
            </Alert>
          )}

          {systemMetrics.memory_usage && systemMetrics.memory_usage > 90 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High memory usage detected (
                {formatPercentage(systemMetrics.memory_usage)}). System may
                become unstable.
              </AlertDescription>
            </Alert>
          )}

          {systemMetrics.disk_usage && systemMetrics.disk_usage > 90 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Low disk space available (
                {formatPercentage(100 - systemMetrics.disk_usage)} free).
                Consider cleaning up old files.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemMonitoring;
