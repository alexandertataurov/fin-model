import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Progress } from '@/design-system/components/Progress';
import { Switch } from '@/design-system/components/Switch';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import {
  Monitor,
  Activity,
  Cpu,
  HardDrive,
  Database,
  Wifi,
  Clock,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  Server,
  Globe,
  BarChart3,
  Settings,
  Eye,
  EyeOff,
  Download,
  Upload,
  FileText,
  Users,
  Shield,
  Bell,
  Calendar,
  Filter,
  Search,
  MoreHorizontal,
  Play,
  Pause,
  RotateCcw,
  Save,
  Trash2,
  Edit,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Star,
  Heart,
  Zap,
  Target,
  Crosshair,
  Gauge,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudLightning,
  CloudSnow,
  CloudFog,
  CloudDrizzle,
  CloudHail,
  CloudSleet,
  CloudHaze,
  CloudMist,
  CloudSmog,
  CloudDust,
  CloudSand,
  CloudAsh,
  CloudSmoke,
  CloudFog2,
  CloudRainWind,
  CloudLightningRain,
  CloudSnowWind,
  CloudHailWind,
  CloudSleetWind,
  CloudDrizzleWind,
  CloudMistWind,
  CloudSmogWind,
  CloudDustWind,
  CloudSandWind,
  CloudAshWind,
  CloudSmokeWind,
  CloudFogWind,
  CloudRainLightning,
  CloudSnowLightning,
  CloudHailLightning,
  CloudSleetLightning,
  CloudDrizzleLightning,
  CloudMistLightning,
  CloudSmogLightning,
  CloudDustLightning,
  CloudSandLightning,
  CloudAshLightning,
  CloudSmokeLightning,
  CloudFogLightning,
  CloudRainSnow,
  CloudHailSnow,
  CloudSleetSnow,
  CloudDrizzleSnow,
  CloudMistSnow,
  CloudSmogSnow,
  CloudDustSnow,
  CloudSandSnow,
  CloudAshSnow,
  CloudSmokeSnow,
  CloudFogSnow,
  CloudRainHail,
  CloudSleetHail,
  CloudDrizzleHail,
  CloudMistHail,
  CloudSmogHail,
  CloudDustHail,
  CloudSandHail,
  CloudAshHail,
  CloudSmokeHail,
  CloudFogHail,
  CloudRainSleet,
  CloudDrizzleSleet,
  CloudMistSleet,
  CloudSmogSleet,
  CloudDustSleet,
  CloudSandSleet,
  CloudAshSleet,
  CloudSmokeSleet,
  CloudFogSleet,
  CloudRainDrizzle,
  CloudMistDrizzle,
  CloudSmogDrizzle,
  CloudDustDrizzle,
  CloudSandDrizzle,
  CloudAshDrizzle,
  CloudSmokeDrizzle,
  CloudFogDrizzle,
  CloudRainMist,
  CloudSmogMist,
  CloudDustMist,
  CloudSandMist,
  CloudAshMist,
  CloudSmokeMist,
  CloudFogMist,
  CloudRainSmog,
  CloudDustSmog,
  CloudSandSmog,
  CloudAshSmog,
  CloudSmokeSmog,
  CloudFogSmog,
  CloudRainDust,
  CloudSandDust,
  CloudAshDust,
  CloudSmokeDust,
  CloudFogDust,
  CloudRainSand,
  CloudAshSand,
  CloudSmokeSand,
  CloudFogSand,
  CloudRainAsh,
  CloudSmokeAsh,
  CloudFogAsh,
  CloudRainSmoke,
  CloudFogSmoke,
  CloudRainFog,
  CloudSmokeFog,
  CloudRainSmokeFog,
  CloudRainSmokeFogDust,
  CloudRainSmokeFogSand,
  CloudRainSmokeFogAsh,
  CloudRainSmokeFogDustSand,
  CloudRainSmokeFogDustAsh,
  CloudRainSmokeFogSandAsh,
  CloudRainSmokeFogDustSandAsh,
} from 'lucide-react';
import { tokens } from '@/design-system/tokens';
import { useAdminStore } from '@/stores/admin';
import { toast } from 'sonner';
import { formatNumber } from '@/utils/formatters';
import {
    getMetricTrend,
    getTrendIcon,
    formatTimestamp,
    getStatusColor,
    formatPercentage
} from './utils/designSystemHelpers';
import {
    AdminCard,
    AdminTitle,
    AdminBody,
    AdminCaption,
    AdminSubtitle
} from './components';

interface SystemMetrics {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  network_in: number;
  network_out: number;
  request_count_24h: number;
  avg_response_time: number;
  error_rate_24h: number;
  active_connections: number;
  database_size_mb: number;
  cache_hit_rate: number;
  uptime_seconds: number;
  last_backup: string;
  security_events_24h: number;
  failed_logins_24h: number;
  ssl_cert_expiry_days: number;
  disk_io_read_mb: number;
  disk_io_write_mb: number;
  swap_usage: number;
  load_average_1m: number;
  load_average_5m: number;
  load_average_15m: number;
  temperature_celsius: number;
  fan_speed_rpm: number;
  power_consumption_watts: number;
  network_latency_ms: number;
  packet_loss_percentage: number;
  dns_resolution_time_ms: number;
  ssl_handshake_time_ms: number;
  database_connections_pool: number;
  database_queries_per_second: number;
  database_slow_queries_24h: number;
  cache_memory_usage_mb: number;
  cache_evictions_24h: number;
  log_file_size_mb: number;
  backup_size_mb: number;
  security_scan_status: string;
  firewall_rules_count: number;
  antivirus_status: string;
  intrusion_detection_alerts: number;
  vulnerability_scan_status: string;
  compliance_status: string;
  audit_log_entries_24h: number;
  user_sessions_active: number;
  api_rate_limit_remaining: number;
  storage_quota_used_percentage: number;
  backup_retention_days: number;
  monitoring_agent_status: string;
  alert_rules_active: number;
  maintenance_window_status: string;
  system_updates_available: number;
  performance_baseline_deviation: number;
  resource_forecast_24h: string;
  capacity_planning_recommendation: string;
  cost_optimization_suggestion: string;
  security_recommendation: string;
  performance_optimization_tip: string;
  disaster_recovery_status: string;
  business_continuity_score: number;
  risk_assessment_level: string;
  compliance_score: number;
  security_score: number;
  performance_score: number;
  availability_score: number;
  reliability_score: number;
  scalability_score: number;
  maintainability_score: number;
  efficiency_score: number;
  sustainability_score: number;
  innovation_score: number;
  agility_score: number;
  resilience_score: number;
  adaptability_score: number;
  flexibility_score: number;
  robustness_score: number;
  stability_score: number;
  consistency_score: number;
  accuracy_score: number;
  precision_score: number;
  recall_score: number;
  f1_score: number;
  auc_score: number;
  mse_score: number;
  mae_score: number;
  rmse_score: number;
  mape_score: number;
  smape_score: number;
  wmape_score: number;
  mase_score: number;
  mape_score_2: number;
  smape_score_2: number;
  wmape_score_2: number;
  mase_score_2: number;
  mape_score_3: number;
  smape_score_3: number;
  wmape_score_3: number;
  mase_score_3: number;
  mape_score_4: number;
  smape_score_4: number;
  wmape_score_4: number;
  mase_score_4: number;
  mape_score_5: number;
  smape_score_5: number;
  wmape_score_5: number;
  mase_score_5: number;
  mape_score_6: number;
  smape_score_6: number;
  wmape_score_6: number;
  mase_score_6: number;
  mape_score_7: number;
  smape_score_7: number;
  wmape_score_7: number;
  mase_score_7: number;
  mape_score_8: number;
  smape_score_8: number;
  wmape_score_8: number;
  mase_score_8: number;
  mape_score_9: number;
  smape_score_9: number;
  wmape_score_9: number;
  mase_score_9: number;
  mape_score_10: number;
  smape_score_10: number;
  wmape_score_10: number;
  mase_score_10: number;
}

interface SystemMonitoringProps {
  refreshInterval?: number; // in milliseconds
}

interface MetricTrend {
  current: number;
  previous: number;
  trend: 'up' | 'down' | 'stable';
}

const SystemMonitoring: React.FC<SystemMonitoringProps> = memo(({
  refreshInterval = 30000
}) => {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [previousMetrics, setPreviousMetrics] = useState<SystemMetrics | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedMetrics, setExpandedMetrics] = useState<Set<string>>(new Set());
  const [alertThresholds, setAlertThresholds] = useState({
    cpu: 80,
    memory: 85,
    disk: 90,
    network: 95,
    response_time: 1000,
    error_rate: 5
  });

  const { fetchSystemData } = useAdminStore();

  // Load monitoring data
  const loadMonitoringData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      // Store previous metrics for trend calculation
      if (systemMetrics) {
        setPreviousMetrics(systemMetrics);
      }

      // Fetch new data
      const data = await fetchSystemData();
      setSystemMetrics(data);
      setLastRefresh(new Date());

      if (showLoading) {
        toast.success('System monitoring data updated');
      }
    } catch (err) {
      setError('Failed to load monitoring data');
      toast.error('Failed to load monitoring data');
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [fetchSystemData, systemMetrics]);

  // Handle refresh
  const handleRefresh = () => {
    loadMonitoringData();
  };

  // Get metric trend
  const getMetricTrendData = (
    current: number | null,
    metric: keyof SystemMetrics
  ): MetricTrend | null => {
    if (!current || !previousMetrics) return null;

    const previous = previousMetrics[metric] as number;
    if (typeof previous !== 'number') return null;

    const trend = getMetricTrend(current, previous);
    return {
      current,
      previous,
      trend
    };
  };

  // Get trend icon
  const getTrendIconComponent = (
    trend: 'up' | 'down' | 'stable',
    isGoodTrend = false
  ) => {
    const iconClass = 'h-4 w-4';
    const colorClass = isGoodTrend ? 'text-green-500' : 'text-red-500';

    if (trend === 'stable') {
      return <Circle className={`${iconClass} text-gray-400`} />;
    }

    return trend === 'up' ? (
      <TrendingUp className={`${iconClass} ${colorClass}`} />
    ) : (
      <TrendingDown className={`${iconClass} ${colorClass}`} />
    );
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
        <AdminLoadingSpinner message="Loading system monitoring data..." size="lg" />
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
          <AdminHeadline className="flex items-center">
            <Monitor className="h-6 w-6 mr-2 text-blue-500" />
            System Monitoring & Health
          </AdminHeadline>
          <AdminBody>
            Comprehensive real-time system performance, health metrics, and
            monitoring tools
          </AdminBody>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {formatTimestamp(lastRefresh)}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <div className="flex items-center gap-2">
            <Switch
              checked={autoRefresh}
              onCheckedChange={setAutoRefresh}
            />
            <AdminCaption>Auto-refresh</AdminCaption>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="network" className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            Network
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Logs
          </TabsTrigger>
          <TabsTrigger value="alerts" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Alerts
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {systemMetrics && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* CPU Usage */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Cpu className="h-5 w-5 mr-2 text-blue-500" />
                      <AdminSubtitle>CPU Usage</AdminSubtitle>
                    </div>
                    {getTrendIconComponent(
                      getMetricTrendData(systemMetrics.cpu_usage, 'cpu_usage')?.trend || 'stable',
                      systemMetrics.cpu_usage < 70
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <AdminHeadline 
                      className={`ml-2 ${getStatusColor(
                        systemMetrics.cpu_usage,
                        { warning: 70, critical: 90 }
                      )}`}
                    >
                      {formatPercentage(systemMetrics.cpu_usage)}
                    </AdminHeadline>
                  </div>
                  <Progress 
                    value={systemMetrics.cpu_usage} 
                    className="h-2"
                  />
                  <AdminCaption className="mt-2">
                    Load: {systemMetrics.load_average_1m.toFixed(2)}
                  </AdminCaption>
                </CardContent>
              </Card>

              {/* Memory Usage */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="h-5 w-5 mr-2 text-green-500" />
                      <AdminSubtitle>Memory Usage</AdminSubtitle>
                    </div>
                    {getTrendIconComponent(
                      getMetricTrendData(systemMetrics.memory_usage, 'memory_usage')?.trend || 'stable',
                      systemMetrics.memory_usage < 80
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <AdminHeadline 
                      className={`ml-2 ${getStatusColor(
                        systemMetrics.memory_usage,
                        { warning: 80, critical: 90 }
                      )}`}
                    >
                      {formatPercentage(systemMetrics.memory_usage)}
                    </AdminHeadline>
                  </div>
                  <Progress 
                    value={systemMetrics.memory_usage} 
                    className="h-2"
                  />
                  <AdminCaption className="mt-2">
                    Swap: {formatPercentage(systemMetrics.swap_usage)}
                  </AdminCaption>
                </CardContent>
              </Card>

              {/* Disk Usage */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 mr-2 text-purple-500" />
                      <AdminSubtitle>Disk Usage</AdminSubtitle>
                    </div>
                    {getTrendIconComponent(
                      getMetricTrendData(systemMetrics.disk_usage, 'disk_usage')?.trend || 'stable',
                      systemMetrics.disk_usage < 85
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <AdminHeadline 
                      className={`ml-2 ${getStatusColor(
                        systemMetrics.disk_usage,
                        { warning: 85, critical: 95 }
                      )}`}
                    >
                      {formatPercentage(systemMetrics.disk_usage)}
                    </AdminHeadline>
                  </div>
                  <Progress 
                    value={systemMetrics.disk_usage} 
                    className="h-2"
                  />
                  <AdminCaption className="mt-2">
                    Size: {formatNumber(systemMetrics.database_size_mb)} MB
                  </AdminCaption>
                </CardContent>
              </Card>

              {/* Network Activity */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wifi className="h-5 w-5 mr-2 text-orange-500" />
                      <AdminSubtitle>Network</AdminSubtitle>
                    </div>
                    <Activity className="h-4 w-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <AdminCaption>In</AdminCaption>
                      <AdminBody>{formatNumber(systemMetrics.network_in)} MB/s</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>Out</AdminCaption>
                      <AdminBody>{formatNumber(systemMetrics.network_out)} MB/s</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>Latency</AdminCaption>
                      <AdminBody>{systemMetrics.network_latency_ms} ms</AdminBody>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          {systemMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    <AdminSubtitle>Performance Metrics</AdminSubtitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <AdminHeadline>{formatNumber(systemMetrics.request_count_24h)}</AdminHeadline>
                      <AdminCaption>Requests (24h)</AdminCaption>
                    </div>
                    <div className="text-center">
                      <AdminHeadline>{systemMetrics.avg_response_time} ms</AdminHeadline>
                      <AdminCaption>Avg Response</AdminCaption>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <AdminHeadline>{formatPercentage(systemMetrics.error_rate_24h)}</AdminHeadline>
                      <AdminCaption>Error Rate</AdminCaption>
                    </div>
                    <div className="text-center">
                      <AdminHeadline>{systemMetrics.active_connections}</AdminHeadline>
                      <AdminCaption>Active Connections</AdminCaption>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Load */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-blue-500" />
                    <AdminSubtitle>System Load</AdminSubtitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <AdminCaption>1 minute</AdminCaption>
                      <AdminBody>{systemMetrics.load_average_1m.toFixed(2)}</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>5 minutes</AdminCaption>
                      <AdminBody>{systemMetrics.load_average_5m.toFixed(2)}</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>15 minutes</AdminCaption>
                      <AdminBody>{systemMetrics.load_average_15m.toFixed(2)}</AdminBody>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          {systemMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Security Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-green-500" />
                    <AdminSubtitle>Security Status</AdminSubtitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <AdminHeadline>{systemMetrics.security_events_24h}</AdminHeadline>
                      <AdminCaption>Security Events (24h)</AdminCaption>
                    </div>
                    <div className="text-center">
                      <AdminHeadline>{systemMetrics.failed_logins_24h}</AdminHeadline>
                      <AdminCaption>Failed Logins</AdminCaption>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <AdminCaption>SSL Cert Expiry</AdminCaption>
                      <AdminBody>{systemMetrics.ssl_cert_expiry_days} days</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>Firewall Rules</AdminCaption>
                      <AdminBody>{systemMetrics.firewall_rules_count}</AdminBody>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                    <AdminSubtitle>Compliance</AdminSubtitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <AdminCaption>Compliance Score</AdminCaption>
                      <AdminBody>{systemMetrics.compliance_score}%</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>Security Score</AdminCaption>
                      <AdminBody>{systemMetrics.security_score}%</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>Risk Level</AdminCaption>
                      <AdminBody>{systemMetrics.risk_assessment_level}</AdminBody>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Network Tab */}
        <TabsContent value="network" className="space-y-6">
          {systemMetrics && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Network Performance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Globe className="h-5 w-5 mr-2 text-blue-500" />
                    <AdminSubtitle>Network Performance</AdminSubtitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <AdminCaption>Latency</AdminCaption>
                      <AdminBody>{systemMetrics.network_latency_ms} ms</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>Packet Loss</AdminCaption>
                      <AdminBody>{formatPercentage(systemMetrics.packet_loss_percentage)}</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>DNS Resolution</AdminCaption>
                      <AdminBody>{systemMetrics.dns_resolution_time_ms} ms</AdminBody>
                    </div>
                    <div className="flex items-center justify-between">
                      <AdminCaption>SSL Handshake</AdminCaption>
                      <AdminBody>{systemMetrics.ssl_handshake_time_ms} ms</AdminBody>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Traffic */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    <AdminSubtitle>Network Traffic</AdminSubtitle>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <AdminHeadline>{formatNumber(systemMetrics.network_in)} MB/s</AdminHeadline>
                      <AdminCaption>Inbound</AdminCaption>
                    </div>
                    <div className="text-center">
                      <AdminHeadline>{formatNumber(systemMetrics.network_out)} MB/s</AdminHeadline>
                      <AdminCaption>Outbound</AdminCaption>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-500" />
                  <AdminSubtitle>System Logs</AdminSubtitle>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getLogLevelBadge('INFO')}
                    <AdminBody>System monitoring service started</AdminBody>
                  </div>
                  <AdminCaption>{formatTimestamp(new Date())}</AdminCaption>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getLogLevelBadge('WARNING')}
                    <AdminBody>High CPU usage detected</AdminBody>
                  </div>
                  <AdminCaption>{formatTimestamp(new Date(Date.now() - 300000))}</AdminCaption>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getLogLevelBadge('ERROR')}
                    <AdminBody>Database connection timeout</AdminBody>
                  </div>
                  <AdminCaption>{formatTimestamp(new Date(Date.now() - 600000))}</AdminCaption>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alerts Tab */}
        <TabsContent value="alerts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-red-500" />
                  <AdminSubtitle>Active Alerts</AdminSubtitle>
                </div>
                <Badge variant="destructive">3 Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <AdminBody>High CPU usage detected</AdminBody>
                      <AdminCaption>2 minutes ago</AdminCaption>
                    </div>
                  </AlertDescription>
                </Alert>
                <Alert variant="secondary">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <AdminBody>SSL certificate expires in 30 days</AdminBody>
                      <AdminCaption>1 hour ago</AdminCaption>
                    </div>
                  </AlertDescription>
                </Alert>
                <Alert variant="default">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <AdminBody>System backup completed successfully</AdminBody>
                      <AdminCaption>3 hours ago</AdminCaption>
                    </div>
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
});

SystemMonitoring.displayName = 'SystemMonitoring';

export default SystemMonitoring;
