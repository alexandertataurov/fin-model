import React, { useState, useEffect } from 'react';
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
  Minus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Progress } from '@/design-system/components/Progress';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/design-system/components/Table';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import AdminApiService, { 
  SystemMetrics, 
  DataIntegrityCheck, 
  LogEntry 
} from '@/services/adminApi';
import { toast } from 'sonner';

interface SystemMonitoringProps {
  refreshInterval?: number; // in milliseconds
}

interface MetricTrend {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
}

const SystemMonitoring: React.FC<SystemMonitoringProps> = ({ 
  refreshInterval = 30000 // 30 seconds default
}) => {
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [dataIntegrity, setDataIntegrity] = useState<DataIntegrityCheck[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Historical data for trends (simplified)
  const [metricsHistory, setMetricsHistory] = useState<SystemMetrics[]>([]);

  // Load monitoring data
  const loadMonitoringData = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [metrics, integrity, systemLogs] = await Promise.all([
        AdminApiService.getSystemMetrics(),
        AdminApiService.checkDataIntegrity(),
        AdminApiService.getSystemLogs('WARNING', 20)
      ]);

      setSystemMetrics(metrics);
      setDataIntegrity(integrity);
      setLogs(systemLogs);
      setLastRefresh(new Date());

      // Update metrics history for trends
      if (metrics) {
        setMetricsHistory(prev => [...prev.slice(-9), metrics]); // Keep last 10 entries
      }

      if (isManualRefresh) {
        toast.success('System data refreshed');
      }
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
      toast.error('Failed to load system monitoring data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Manual refresh
  const handleRefresh = () => {
    loadMonitoringData(true);
  };

  // Get metric trend
  const getMetricTrend = (current: number | null, metric: keyof SystemMetrics): MetricTrend | null => {
    if (!current || metricsHistory.length < 2) return null;
    
    const previous = metricsHistory[metricsHistory.length - 2]?.[metric] as number | null;
    if (!previous) return null;

    const diff = current - previous;
    const trend = Math.abs(diff) < 1 ? 'stable' : diff > 0 ? 'up' : 'down';

    return { current, previous, trend };
  };

  // Get trend icon
  const getTrendIcon = (trend: 'up' | 'down' | 'stable', isGoodTrend = false) => {
    const iconClass = "h-4 w-4 ml-1";
    
    if (trend === 'stable') {
      return <Minus className={`${iconClass} text-muted-foreground`} />;
    }
    
    const colorClass = isGoodTrend 
      ? (trend === 'up' ? 'text-green-500' : 'text-red-500')
      : (trend === 'up' ? 'text-red-500' : 'text-green-500');
    
    return trend === 'up' 
      ? <TrendingUp className={`${iconClass} ${colorClass}`} />
      : <TrendingDown className={`${iconClass} ${colorClass}`} />;
  };

  // Get status color based on percentage
  const getStatusColor = (value: number | null, thresholds = { warning: 70, critical: 90 }) => {
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
      'ERROR': 'destructive',
      'WARNING': 'secondary',
      'INFO': 'default',
      'DEBUG': 'outline',
      'CRITICAL': 'destructive'
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
  }, [autoRefresh, refreshInterval]);

  // Initial load
  useEffect(() => {
    loadMonitoringData();
  }, []);

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Monitoring</h2>
          <p className="text-muted-foreground">
            Real-time system performance and health metrics
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="text-sm text-muted-foreground">
            Last updated: {formatTimestamp(lastRefresh)}
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? 'Disable' : 'Enable'} Auto-refresh
          </Button>
          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* System Metrics Overview */}
      {systemMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* CPU Usage */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <Cpu className="h-4 w-4 mr-2" />
                CPU Usage
                {(() => {
                  const trend = getMetricTrend(systemMetrics.cpu_usage, 'cpu_usage');
                  return trend ? getTrendIcon(trend.trend, false) : null;
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-2xl font-bold ${getStatusColor(systemMetrics.cpu_usage)}`}>
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
                  const trend = getMetricTrend(systemMetrics.memory_usage, 'memory_usage');
                  return trend ? getTrendIcon(trend.trend, false) : null;
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-2xl font-bold ${getStatusColor(systemMetrics.memory_usage)}`}>
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
                  const trend = getMetricTrend(systemMetrics.disk_usage, 'disk_usage');
                  return trend ? getTrendIcon(trend.trend, false) : null;
                })()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className={`text-2xl font-bold ${getStatusColor(systemMetrics.disk_usage)}`}>
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
                  const trend = getMetricTrend(systemMetrics.active_connections, 'active_connections');
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
        </div>
      )}

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
            {dataIntegrity.map((check) => (
              <div key={check.table_name} className="flex items-center justify-between p-3 border rounded">
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
                  <TableCell>
                    {getLogLevelBadge(log.level)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {log.module}
                  </TableCell>
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
                High CPU usage detected ({formatPercentage(systemMetrics.cpu_usage)}). Consider investigating running processes.
              </AlertDescription>
            </Alert>
          )}
          
          {systemMetrics.memory_usage && systemMetrics.memory_usage > 90 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                High memory usage detected ({formatPercentage(systemMetrics.memory_usage)}). System may become unstable.
              </AlertDescription>
            </Alert>
          )}
          
          {systemMetrics.disk_usage && systemMetrics.disk_usage > 90 && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Low disk space available ({formatPercentage(100 - systemMetrics.disk_usage)} free). Consider cleaning up old files.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
};

export default SystemMonitoring;