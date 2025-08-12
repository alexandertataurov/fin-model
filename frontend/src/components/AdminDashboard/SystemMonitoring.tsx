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
import { applyTextStyle } from '@/design-system/utils/typography';
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
        <div className="flex items-center justify-center p-8">
          <div className="flex items-center gap-3">
            <div
              style={{
                width: '32px',
                height: '32px',
                border: `3px solid ${tokens.colors.secondary[200]}`,
                borderTop: `3px solid ${tokens.colors.primary[500]}`,
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
            <span style={applyTextStyle('body')}>Loading system monitoring data...</span>
          </div>
        </div>
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
          <h1 style={applyTextStyle('headline')} className="flex items-center">
            <Monitor className="h-6 w-6 mr-2 text-blue-500" />
            System Monitoring & Health
          </h1>
          <p style={applyTextStyle('body')}>
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
            <span style={applyTextStyle('caption')}>Auto-refresh</span>
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
                      <h4 style={applyTextStyle('subtitle')}>CPU Usage</h4>
                    </div>
                    {getTrendIconComponent(
                      getMetricTrendData(systemMetrics.cpu_usage, 'cpu_usage')?.trend || 'stable',
                      systemMetrics.cpu_usage < 70
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <h1 style={applyTextStyle('headline')}
                      className={`ml-2 ${getStatusColor(
                        systemMetrics.cpu_usage,
                        { warning: 70, critical: 90 }
                      )}`}
                    >
                      {formatPercentage(systemMetrics.cpu_usage)}
                    </h1>
                  </div>
                  <Progress
                    value={systemMetrics.cpu_usage}
                    className="h-2"
                  />
                  <span style={applyTextStyle('caption')} className="mt-2">
                    Load: {systemMetrics.load_average_1m.toFixed(2)}
                  </span>
                </CardContent>
              </Card>

              {/* Memory Usage */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <HardDrive className="h-5 w-5 mr-2 text-green-500" />
                      <h4 style={applyTextStyle('subtitle')}>Memory Usage</h4>
                    </div>
                    {getTrendIconComponent(
                      getMetricTrendData(systemMetrics.memory_usage, 'memory_usage')?.trend || 'stable',
                      systemMetrics.memory_usage < 80
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <h1 style={applyTextStyle('headline')}
                      className={`ml-2 ${getStatusColor(
                        systemMetrics.memory_usage,
                        { warning: 80, critical: 90 }
                      )}`}
                    >
                      {formatPercentage(systemMetrics.memory_usage)}
                    </h1>
                  </div>
                  <Progress
                    value={systemMetrics.memory_usage}
                    className="h-2"
                  />
                  <span style={applyTextStyle('caption')} className="mt-2">
                    Swap: {formatPercentage(systemMetrics.swap_usage)}
                  </span>
                </CardContent>
              </Card>

              {/* Disk Usage */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Database className="h-5 w-5 mr-2 text-purple-500" />
                      <h4 style={applyTextStyle('subtitle')}>Disk Usage</h4>
                    </div>
                    {getTrendIconComponent(
                      getMetricTrendData(systemMetrics.disk_usage, 'disk_usage')?.trend || 'stable',
                      systemMetrics.disk_usage < 85
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <h1 style={applyTextStyle('headline')}
                      className={`ml-2 ${getStatusColor(
                        systemMetrics.disk_usage,
                        { warning: 85, critical: 95 }
                      )}`}
                    >
                      {formatPercentage(systemMetrics.disk_usage)}
                    </h1>
                  </div>
                  <Progress
                    value={systemMetrics.disk_usage}
                    className="h-2"
                  />
                  <span style={applyTextStyle('caption')} className="mt-2">
                    Size: {formatNumber(systemMetrics.database_size_mb)} MB
                  </span>
                </CardContent>
              </Card>

              {/* Network Activity */}
              <Card>
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Wifi className="h-5 w-5 mr-2 text-orange-500" />
                      <h4 style={applyTextStyle('subtitle')}>Network</h4>
                    </div>
                    <Activity className="h-4 w-4 text-green-500" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>In</span>
                      <p style={applyTextStyle('body')}>{formatNumber(systemMetrics.network_in)} MB/s</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>Out</span>
                      <p style={applyTextStyle('body')}>{formatNumber(systemMetrics.network_out)} MB/s</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>Latency</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.network_latency_ms} ms</p>
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
                    <h4 style={applyTextStyle('subtitle')}>Performance Metrics</h4>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <h1 style={applyTextStyle('headline')}>{formatNumber(systemMetrics.request_count_24h)}</h1>
                      <span style={applyTextStyle('caption')}>Requests (24h)</span>
                    </div>
                    <div className="text-center">
                      <h1 style={applyTextStyle('headline')}>{systemMetrics.avg_response_time} ms</h1>
                      <span style={applyTextStyle('caption')}>Avg Response</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <h1 style={applyTextStyle('headline')}>{formatPercentage(systemMetrics.error_rate_24h)}</h1>
                      <span style={applyTextStyle('caption')}>Error Rate</span>
                    </div>
                    <div className="text-center">
                      <h1 style={applyTextStyle('headline')}>{systemMetrics.active_connections}</h1>
                      <span style={applyTextStyle('caption')}>Active Connections</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* System Load */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Gauge className="h-5 w-5 mr-2 text-blue-500" />
                    <h4 style={applyTextStyle('subtitle')}>System Load</h4>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>1 minute</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.load_average_1m.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>5 minutes</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.load_average_5m.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>15 minutes</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.load_average_15m.toFixed(2)}</p>
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
                    <h4 style={applyTextStyle('subtitle')}>Security Status</h4>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <h1 style={applyTextStyle('headline')}>{systemMetrics.security_events_24h}</h1>
                      <span style={applyTextStyle('caption')}>Security Events (24h)</span>
                    </div>
                    <div className="text-center">
                      <h1 style={applyTextStyle('headline')}>{systemMetrics.failed_logins_24h}</h1>
                      <span style={applyTextStyle('caption')}>Failed Logins</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>SSL Cert Expiry</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.ssl_cert_expiry_days} days</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>Firewall Rules</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.firewall_rules_count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Compliance */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-blue-500" />
                    <h4 style={applyTextStyle('subtitle')}>Compliance</h4>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>Compliance Score</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.compliance_score}%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>Security Score</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.security_score}%</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>Risk Level</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.risk_assessment_level}</p>
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
                    <h4 style={applyTextStyle('subtitle')}>Network Performance</h4>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>Latency</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.network_latency_ms} ms</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>Packet Loss</span>
                      <p style={applyTextStyle('body')}>{formatPercentage(systemMetrics.packet_loss_percentage)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>DNS Resolution</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.dns_resolution_time_ms} ms</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={applyTextStyle('caption')}>SSL Handshake</span>
                      <p style={applyTextStyle('body')}>{systemMetrics.ssl_handshake_time_ms} ms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Network Traffic */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Activity className="h-5 w-5 mr-2 text-green-500" />
                    <h4 style={applyTextStyle('subtitle')}>Network Traffic</h4>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <h1 style={applyTextStyle('headline')}>{formatNumber(systemMetrics.network_in)} MB/s</h1>
                      <span style={applyTextStyle('caption')}>Inbound</span>
                    </div>
                    <div className="text-center">
                      <h1 style={applyTextStyle('headline')}>{formatNumber(systemMetrics.network_out)} MB/s</h1>
                      <span style={applyTextStyle('caption')}>Outbound</span>
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
                  <h4 style={applyTextStyle('subtitle')}>System Logs</h4>
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
                    <p style={applyTextStyle('body')}>System monitoring service started</p>
                  </div>
                  <span style={applyTextStyle('caption')}>{formatTimestamp(new Date())}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getLogLevelBadge('WARNING')}
                    <p style={applyTextStyle('body')}>High CPU usage detected</p>
                  </div>
                  <span style={applyTextStyle('caption')}>{formatTimestamp(new Date(Date.now() - 300000))}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getLogLevelBadge('ERROR')}
                    <p style={applyTextStyle('body')}>Database connection timeout</p>
                  </div>
                  <span style={applyTextStyle('caption')}>{formatTimestamp(new Date(Date.now() - 600000))}</span>
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
                  <h4 style={applyTextStyle('subtitle')}>Active Alerts</h4>
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
                      <p style={applyTextStyle('body')}>High CPU usage detected</p>
                      <span style={applyTextStyle('caption')}>2 minutes ago</span>
                    </div>
                  </AlertDescription>
                </Alert>
                <Alert variant="default">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <p style={applyTextStyle('body')}>SSL certificate expires in 30 days</p>
                      <span style={applyTextStyle('caption')}>1 hour ago</span>
                    </div>
                  </AlertDescription>
                </Alert>
                <Alert variant="default">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <p style={applyTextStyle('body')}>System backup completed successfully</p>
                      <span style={applyTextStyle('caption')}>3 hours ago</span>
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
