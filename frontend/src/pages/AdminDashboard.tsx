import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Database,
  Activity,
  Shield,
  Settings,
  FileText,
  AlertCircle,
  Server,
  HardDrive,
  Cpu,
  RefreshCw,
  Download,
  Trash2,
  CheckCircle,
  Clock,
  BarChart3,
  Zap,
  Bell,
  ArrowUpRight,
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/components/Tabs';
import { Progress } from '@/design-system/components/Progress';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/design-system/components/Switch';
import AdminApiService, {
  SystemStats,
  UserActivity,
  SystemMetrics,
  DataIntegrityCheck,
  SecurityAudit,
  LogEntry,
  UserPermissions,
} from '@/services/adminApi';
import UserManagement from '@/components/Admin/UserManagement';
import SystemMonitoring from '@/components/Admin/SystemMonitoring';
import DataManagement from '@/components/Admin/DataManagement';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State management
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [loading, setLoading] = useState(true);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [userActivity, setUserActivity] = useState<UserActivity[]>([]);
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(
    null
  );
  const [dataIntegrity, setDataIntegrity] = useState<DataIntegrityCheck[]>([]);
  const [securityAudit, setSecurityAudit] = useState<SecurityAudit | null>(
    null
  );
  const [refreshing, setRefreshing] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [logsLevel, setLogsLevel] = useState<
    'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  >('ERROR');
  const [logsLimit, setLogsLimit] = useState<number>(100);
  const [logsSearch, setLogsSearch] = useState<string>('');
  const [logsFrom, setLogsFrom] = useState<string>('');
  const [logsTo, setLogsTo] = useState<string>('');
  const [logsSkip, setLogsSkip] = useState<number>(0);
  const [logsTotal, setLogsTotal] = useState<number>(0);
  const [systemHealth, setSystemHealth] = useState<any | null>(null);
  const [databaseHealth, setDatabaseHealth] = useState<any | null>(null);
  const [userPermissions, setUserPermissions] =
    useState<UserPermissions | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[] | null>(null);
  const [auditFilters, setAuditFilters] = useState<{
    skip: number;
    limit: number;
    userId?: number;
    action?: string;
  }>({ skip: 0, limit: 100 });
  const [auditSkip, setAuditSkip] = useState<number>(0);
  const [auditTotal, setAuditTotal] = useState<number>(0);
  const [securityFrom, setSecurityFrom] = useState<string>('');
  const [securityTo, setSecurityTo] = useState<string>('');
  const [auditFrom, setAuditFrom] = useState<string>('');
  const [auditTo, setAuditTo] = useState<string>('');

  // Load admin data
  const loadAdminData = useCallback(async () => {
    setLoading(true);
    const results = await Promise.allSettled([
      AdminApiService.getSystemStats(),
      AdminApiService.getUserActivity(20),
      AdminApiService.getSystemMetrics(),
      AdminApiService.checkDataIntegrity(),
      AdminApiService.getSecurityAudit({
        from: securityFrom || undefined,
        to: securityTo || undefined,
      }),
      AdminApiService.getSystemHealth(),
      AdminApiService.getDatabaseHealth(),
      AdminApiService.getSystemLogs('ERROR', 100),
      AdminApiService.getUserPermissions(),
      AdminApiService.getAuditLogs(0, 100, undefined, undefined, {
        from: auditFrom || undefined,
        to: auditTo || undefined,
        envelope: true,
      }),
    ]);

    const [
      statsRes,
      activityRes,
      metricsRes,
      integrityRes,
      auditRes,
      sysHealthRes,
      dbHealthRes,
      logsRes,
      permsRes,
      auditListRes,
    ] = results;

    if (statsRes.status === 'fulfilled') setSystemStats(statsRes.value);
    else setSystemStats(null);

    if (activityRes.status === 'fulfilled') setUserActivity(activityRes.value);
    else setUserActivity([]);

    if (metricsRes.status === 'fulfilled') setSystemMetrics(metricsRes.value);
    else setSystemMetrics(null);

    if (integrityRes.status === 'fulfilled')
      setDataIntegrity(integrityRes.value);
    else setDataIntegrity([]);

    if (auditRes.status === 'fulfilled') setSecurityAudit(auditRes.value);
    else setSecurityAudit(null);

    if (sysHealthRes.status === 'fulfilled')
      setSystemHealth(sysHealthRes.value);
    else setSystemHealth(null);

    if (dbHealthRes.status === 'fulfilled')
      setDatabaseHealth(dbHealthRes.value);
    else setDatabaseHealth(null);

    if (logsRes.status === 'fulfilled') {
      const v: any = logsRes.value;
      setLogs((v?.items as LogEntry[]) || (v as LogEntry[]) || []);
      if (v && typeof v.total === 'number') setLogsTotal(v.total);
    } else setLogs([]);

    if (permsRes.status === 'fulfilled') setUserPermissions(permsRes.value);
    else setUserPermissions(null);

    if (auditListRes.status === 'fulfilled') {
      const env = (auditListRes as any).value as any;
      setAuditLogs((env?.items as any[]) || env?.logs || []);
      if (typeof env?.total === 'number') setAuditTotal(env.total);
      setAuditSkip(0);
    } else setAuditLogs(null);

    const anyFulfilled = results.some(r => r.status === 'fulfilled');
    if (!anyFulfilled) {
      toast.error(
        'Admin data is unavailable. Please check your connection or permissions.'
      );
    } else if (results.some(r => r.status === 'rejected')) {
      toast.warning(
        'Some admin sections failed to load. Showing partial data.'
      );
    }

    setLoading(false);
  }, [securityFrom, securityTo, auditFrom, auditTo]);

  const loadMetricsAndLogs = useCallback(async () => {
    const results = await Promise.allSettled([
      AdminApiService.getSystemMetrics(),
      AdminApiService.getSystemLogs(logsLevel, logsLimit, {
        from: logsFrom || undefined,
        to: logsTo || undefined,
        search: logsSearch || undefined,
        skip: logsSkip,
        envelope: true,
      }),
    ]);
    const [metricsRes, logsRes] = results;
    if (metricsRes.status === 'fulfilled') setSystemMetrics(metricsRes.value);
    if (logsRes.status === 'fulfilled') {
      const env = logsRes.value as any;
      setLogs((env.items as LogEntry[]) || env || []);
      if (env && typeof env.total === 'number') setLogsTotal(env.total);
    }
  }, [logsLevel, logsLimit, logsFrom, logsTo, logsSearch, logsSkip]);

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
    toast.success('Admin dashboard refreshed');
  };

  // Format percentage for display
  const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'N/A';
    }
    return `${value.toFixed(1)}%`;
  };

  // Format number with commas
  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || Number.isNaN(num as number)) {
      return '0';
    }
    return (num as number).toLocaleString();
  };

  // Get status badge variant
  const getStatusBadge = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return <Badge variant="destructive">Inactive</Badge>;
    if (!isVerified) return <Badge variant="secondary">Unverified</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  // Maintenance operations
  const handleFileCleanupPreview = async () => {
    try {
      setMaintenanceLoading(true);
      const result = await AdminApiService.cleanupFiles(true);
      toast.success(
        `Cleanup preview: ${result.orphaned_files} orphaned files, ${result.failed_files} failed files found`
      );
    } catch (error) {
      toast.error('Failed to preview file cleanup');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleFileCleanup = async () => {
    try {
      setMaintenanceLoading(true);
      if (!confirm('Run cleanup and permanently delete files?')) {
        setMaintenanceLoading(false);
        return;
      }
      const result = await AdminApiService.cleanupFiles(false);
      toast.success(result.message);
      await loadAdminData(); // Refresh data
    } catch (error) {
      toast.error('Failed to run file cleanup');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleClearRateLimits = async () => {
    try {
      setMaintenanceLoading(true);
      const result = await AdminApiService.clearRateLimits();
      toast.success(
        `${result.message} (${result.cleared_records} records cleared)`
      );
    } catch (error) {
      toast.error('Failed to clear rate limits');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadAdminData();
  }, [loadAdminData]);

  // Auto refresh metrics and logs
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const id = setInterval(() => {
      loadMetricsAndLogs();
    }, 30000);
    return () => clearInterval(id);
  }, [autoRefreshEnabled, loadMetricsAndLogs]);

  // Check if user has admin permissions
  if (!user) {
    navigate('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                System administration and monitoring
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`}
                />
                Refresh
              </Button>
              <div className="flex items-center space-x-2 pl-2">
                <span className="text-xs text-muted-foreground">
                  Auto Refresh
                </span>
                <Switch
                  checked={autoRefreshEnabled}
                  onCheckedChange={setAutoRefreshEnabled}
                />
              </div>
              <Button variant="outline" size="sm" onClick={() => navigate('/')}>
                Back to App
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-9">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2"
            >
              <Activity className="h-4 w-4" />
              <span>Overview</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Users</span>
            </TabsTrigger>
            <TabsTrigger value="system" className="flex items-center space-x-2">
              <Server className="h-4 w-4" />
              <span>System</span>
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="flex items-center space-x-2"
            >
              <Database className="h-4 w-4" />
              <span>Database</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="flex items-center space-x-2"
            >
              <Settings className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
            <TabsTrigger value="health" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Health</span>
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Logs</span>
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="flex items-center space-x-2"
            >
              <Shield className="h-4 w-4" />
              <span>Permissions</span>
            </TabsTrigger>
            <TabsTrigger value="audit" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Audit</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {(() => {
              const hasAnyData =
                !!systemStats ||
                !!systemMetrics ||
                userActivity.length > 0 ||
                dataIntegrity.length > 0 ||
                !!securityAudit;
              return hasAnyData ? (
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
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${systemHealth?.status === 'healthy'
                                  ? 'bg-green-500'
                                  : 'bg-yellow-500'
                                  }`}
                              ></div>
                              <span className="text-sm font-medium">
                                Database
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {systemHealth?.status
                                ? String(systemHealth.status).toUpperCase()
                                : 'UNKNOWN'}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${systemMetrics?.cpu_usage &&
                                  systemMetrics.cpu_usage > 80
                                  ? 'bg-red-500'
                                  : systemMetrics?.cpu_usage &&
                                    systemMetrics.cpu_usage > 60
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  }`}
                              ></div>
                              <span className="text-sm font-medium">CPU</span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatPercentage(
                                systemMetrics?.cpu_usage ?? null
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${systemMetrics?.memory_usage &&
                                  systemMetrics.memory_usage > 80
                                  ? 'bg-red-500'
                                  : systemMetrics?.memory_usage &&
                                    systemMetrics.memory_usage > 60
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  }`}
                              ></div>
                              <span className="text-sm font-medium">
                                Memory
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatPercentage(
                                systemMetrics?.memory_usage ?? null
                              )}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="flex items-center justify-center mb-2">
                              <div
                                className={`w-3 h-3 rounded-full mr-2 ${systemMetrics?.disk_usage &&
                                  systemMetrics.disk_usage > 80
                                  ? 'bg-red-500'
                                  : systemMetrics?.disk_usage &&
                                    systemMetrics.disk_usage > 60
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  }`}
                              ></div>
                              <span className="text-sm font-medium">
                                Storage
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatPercentage(
                                systemMetrics?.disk_usage ?? null
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Zap className="h-5 w-5 mr-2" />
                          Quick Actions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setActiveTab('users')}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Manage Users
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={handleFileCleanupPreview}
                          disabled={maintenanceLoading}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Cleanup Files
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setActiveTab('system')}
                        >
                          <Activity className="h-4 w-4 mr-2" />
                          System Monitor
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setActiveTab('security')}
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Security Audit
                        </Button>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Key Statistics (only when available) */}
                  {systemStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 mr-2 text-blue-500" />
                              Total Users
                            </div>
                            <div className="flex items-center text-xs text-green-600">
                              <ArrowUpRight className="h-3 w-3 mr-1" />+
                              {systemStats.users.new_24h}
                            </div>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">
                            {formatNumber(systemStats.users.total)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {systemStats.users.active} active •{' '}
                            {systemStats.users.verified} verified
                          </div>
                          <div className="flex items-center mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-blue-500 h-1.5 rounded-full"
                                style={{
                                  width: `${(systemStats.users.active /
                                    systemStats.users.total) *
                                    100
                                    }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">
                              {Math.round(
                                (systemStats.users.active /
                                  systemStats.users.total) *
                                100
                              )}
                              % active
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center justify-between">
                            <div className="flex items-center">
                              <FileText className="h-4 w-4 mr-2 text-green-500" />
                              Files Processed
                            </div>
                            {systemStats.files.failed > 0 && (
                              <Badge variant="secondary" className="text-xs">
                                {systemStats.files.failed} failed
                              </Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">
                            {formatNumber(systemStats.files.total)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {systemStats.files.completed} completed •{' '}
                            {systemStats.files.processing} processing
                          </div>
                          <div className="flex items-center mt-2">
                            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-green-500 h-1.5 rounded-full"
                                style={{
                                  width: `${(systemStats.files.completed /
                                    systemStats.files.total) *
                                    100
                                    }%`,
                                }}
                              ></div>
                            </div>
                            <span className="text-xs text-muted-foreground ml-2">
                              {Math.round(
                                (systemStats.files.completed /
                                  systemStats.files.total) *
                                100
                              )}
                              % done
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <BarChart3 className="h-4 w-4 mr-2 text-purple-500" />
                            Financial Data
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-purple-600">
                            {formatNumber(
                              systemStats.financial_data.statements
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            statements •{' '}
                            {formatNumber(
                              systemStats.financial_data.parameters
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

                      <Card className="hover:shadow-md transition-shadow">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-medium flex items-center">
                            <HardDrive className="h-4 w-4 mr-2 text-orange-500" />
                            Storage Usage
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-600">
                            {systemStats.system.database_size}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            Avg file: {systemStats.performance.avg_file_size_mb}
                            MB
                          </div>
                          <div className="flex items-center mt-2">
                            <HardDrive className="h-4 w-4 text-orange-500 mr-2" />
                            <div className="flex-1">
                              <div className="text-xs text-muted-foreground">
                                Database size
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Enhanced System Metrics & Alerts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* System Performance */}
                    {systemMetrics && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center">
                              <Server className="h-5 w-5 mr-2" />
                              System Performance
                            </div>
                            <Badge variant="outline" className="text-xs">
                              Live
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-6">
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Cpu className="h-4 w-4 mr-2 text-blue-500" />
                                  <span className="text-sm font-medium">
                                    CPU Usage
                                  </span>
                                </div>
                                <span
                                  className={`text-sm font-medium ${systemMetrics.cpu_usage &&
                                    systemMetrics.cpu_usage > 80
                                    ? 'text-red-500'
                                    : systemMetrics.cpu_usage &&
                                      systemMetrics.cpu_usage > 60
                                      ? 'text-yellow-500'
                                      : 'text-green-500'
                                    }`}
                                >
                                  {formatPercentage(systemMetrics.cpu_usage)}
                                </span>
                              </div>
                              <Progress
                                value={systemMetrics.cpu_usage || 0}
                                className="h-2"
                              />
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Activity className="h-4 w-4 mr-2 text-green-500" />
                                  <span className="text-sm font-medium">
                                    Memory Usage
                                  </span>
                                </div>
                                <span
                                  className={`text-sm font-medium ${systemMetrics.memory_usage &&
                                    systemMetrics.memory_usage > 80
                                    ? 'text-red-500'
                                    : systemMetrics.memory_usage &&
                                      systemMetrics.memory_usage > 60
                                      ? 'text-yellow-500'
                                      : 'text-green-500'
                                    }`}
                                >
                                  {formatPercentage(systemMetrics.memory_usage)}
                                </span>
                              </div>
                              <Progress
                                value={systemMetrics.memory_usage || 0}
                                className="h-2"
                              />
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <HardDrive className="h-4 w-4 mr-2 text-purple-500" />
                                  <span className="text-sm font-medium">
                                    Disk Usage
                                  </span>
                                </div>
                                <span
                                  className={`text-sm font-medium ${systemMetrics.disk_usage &&
                                    systemMetrics.disk_usage > 80
                                    ? 'text-red-500'
                                    : systemMetrics.disk_usage &&
                                      systemMetrics.disk_usage > 60
                                      ? 'text-yellow-500'
                                      : 'text-green-500'
                                    }`}
                                >
                                  {formatPercentage(systemMetrics.disk_usage)}
                                </span>
                              </div>
                              <Progress
                                value={systemMetrics.disk_usage || 0}
                                className="h-2"
                              />
                            </div>
                          </div>

                          <div className="mt-6 pt-4 border-t">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  DB Connections:
                                </span>
                                <span className="font-medium">
                                  {systemMetrics.active_connections}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-muted-foreground">
                                  Requests (24h):
                                </span>
                                <span className="font-medium">
                                  {formatNumber(
                                    systemMetrics.request_count_24h || 0
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* System Alerts & Security */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Bell className="h-5 w-5 mr-2" />
                          System Alerts
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Performance Alerts */}
                          {systemMetrics && (
                            <>
                              {systemMetrics.cpu_usage &&
                                systemMetrics.cpu_usage > 90 && (
                                  <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-sm">
                                      <div className="font-medium text-red-600">
                                        High CPU Usage
                                      </div>
                                      <div className="text-muted-foreground">
                                        CPU usage is at{' '}
                                        {formatPercentage(
                                          systemMetrics.cpu_usage
                                        )}
                                        . Consider investigating running
                                        processes.
                                      </div>
                                    </AlertDescription>
                                  </Alert>
                                )}

                              {systemMetrics.memory_usage &&
                                systemMetrics.memory_usage > 90 && (
                                  <Alert>
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription className="text-sm">
                                      <div className="font-medium text-red-600">
                                        High Memory Usage
                                      </div>
                                      <div className="text-muted-foreground">
                                        Memory usage is at{' '}
                                        {formatPercentage(
                                          systemMetrics.memory_usage
                                        )}
                                        . System may become unstable.
                                      </div>
                                    </AlertDescription>
                                  </Alert>
                                )}
                            </>
                          )}

                          {/* Security Alerts */}
                          {securityAudit &&
                            securityAudit.failed_logins_24h > 10 && (
                              <Alert>
                                <Shield className="h-4 w-4" />
                                <AlertDescription className="text-sm">
                                  <div className="font-medium text-yellow-600">
                                    Multiple Failed Logins
                                  </div>
                                  <div className="text-muted-foreground">
                                    {securityAudit.failed_logins_24h} failed
                                    login attempts in the last 24 hours.
                                  </div>
                                </AlertDescription>
                              </Alert>
                            )}

                          {/* System Health Alert */}
                          {(!systemMetrics || !systemStats) && (
                            <Alert>
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                <div className="font-medium">
                                  System Monitoring Limited
                                </div>
                                <div className="text-muted-foreground">
                                  Some monitoring data is unavailable. Check
                                  system health.
                                </div>
                              </AlertDescription>
                            </Alert>
                          )}

                          {/* Default message when no alerts */}
                          {systemMetrics &&
                            systemStats &&
                            (!systemMetrics.cpu_usage ||
                              systemMetrics.cpu_usage <= 90) &&
                            (!systemMetrics.memory_usage ||
                              systemMetrics.memory_usage <= 90) &&
                            (!securityAudit ||
                              securityAudit.failed_logins_24h <= 10) && (
                              <div className="flex items-center justify-center py-6 text-center">
                                <div>
                                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                  <div className="text-sm font-medium text-green-600">
                                    All Systems Healthy
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    No alerts or issues detected
                                  </div>
                                </div>
                              </div>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent User Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          Recent User Activity
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab('users')}
                          className="text-xs"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View All
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {userActivity.length > 0 ? (
                          userActivity.slice(0, 6).map(activity => (
                            <div
                              key={activity.user_id}
                              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent/50 transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  <span className="text-xs font-medium text-primary">
                                    {activity.username[0]?.toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <div className="font-medium text-sm">
                                    {activity.username}
                                  </div>
                                  <div className="text-xs text-muted-foreground flex items-center space-x-3">
                                    <span className="flex items-center">
                                      <FileText className="h-3 w-3 mr-1" />
                                      {activity.files_uploaded} files
                                    </span>
                                    <span className="flex items-center">
                                      <BarChart3 className="h-3 w-3 mr-1" />
                                      {activity.models_created} models
                                    </span>
                                    <span className="flex items-center">
                                      <Clock className="h-3 w-3 mr-1" />
                                      {activity.login_count} logins
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getStatusBadge(activity.is_active, true)}
                                <div className="text-xs text-muted-foreground">
                                  {activity.last_login
                                    ? new Date(
                                      activity.last_login
                                    ).toLocaleDateString()
                                    : 'Never'}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-6 text-muted-foreground">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <div className="text-sm">
                              No recent user activity
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Activity Summary */}
                      <div className="mt-6 pt-4 border-t">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              {userActivity.filter(u => u.is_active).length}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Active Users
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              {userActivity.reduce(
                                (sum, u) => sum + u.files_uploaded,
                                0
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Files Uploaded
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-purple-600">
                              {userActivity.reduce(
                                (sum, u) => sum + u.models_created,
                                0
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Models Created
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
              );
            })()}
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <UserManagement onUserUpdated={loadAdminData} />
          </TabsContent>

          {/* System Tab */}
          <TabsContent value="system">
            <SystemMonitoring />
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database">
            <DataManagement />
          </TabsContent>

          {/* Health Tab */}
          <TabsContent value="health" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                {systemHealth ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">
                        {String(systemHealth.status).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Timestamp</span>
                      <span className="font-medium">
                        {new Date().toLocaleString()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    No system health data.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Health</CardTitle>
              </CardHeader>
              <CardContent>
                {databaseHealth ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className="font-medium">
                        {String(
                          databaseHealth.status || 'unknown'
                        ).toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    No database health data.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <select
                    className="border rounded px-2 py-1 bg-background text-sm"
                    value={logsLevel}
                    onChange={async e => {
                      const lvl = e.target.value as typeof logsLevel;
                      setLogsLevel(lvl);
                      const resp = await AdminApiService.getSystemLogs(
                        lvl,
                        logsLimit,
                        {
                          from: logsFrom || undefined,
                          to: logsTo || undefined,
                          search: logsSearch || undefined,
                          skip: logsSkip,
                          envelope: true,
                        }
                      );
                      const env = resp as any;
                      setLogs((env.items as LogEntry[]) || []);
                      setLogsTotal(env.total || 0);
                    }}
                  >
                    {['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(
                      l => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      )
                    )}
                  </select>
                  <select
                    className="border rounded px-2 py-1 bg-background text-sm"
                    value={logsLimit}
                    onChange={async e => {
                      const lim = Number(e.target.value);
                      setLogsLimit(lim);
                      const resp = await AdminApiService.getSystemLogs(
                        logsLevel,
                        lim,
                        {
                          from: logsFrom || undefined,
                          to: logsTo || undefined,
                          search: logsSearch || undefined,
                          skip: logsSkip,
                          envelope: true,
                        }
                      );
                      const env = resp as any;
                      setLogs((env.items as LogEntry[]) || []);
                      setLogsTotal(env.total || 0);
                    }}
                  >
                    {[50, 100, 200, 500].map(l => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 bg-background text-sm"
                    value={logsFrom}
                    onChange={e => setLogsFrom(e.target.value)}
                  />
                  <input
                    type="date"
                    className="border rounded px-2 py-1 bg-background text-sm"
                    value={logsTo}
                    onChange={e => setLogsTo(e.target.value)}
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1 bg-background text-sm"
                    placeholder="Search"
                    value={logsSearch}
                    onChange={e => setLogsSearch(e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const resp = await AdminApiService.getSystemLogs(
                        logsLevel,
                        logsLimit,
                        {
                          from: logsFrom || undefined,
                          to: logsTo || undefined,
                          search: logsSearch || undefined,
                          skip: 0,
                          envelope: true,
                        }
                      );
                      const env = resp as any;
                      setLogs((env.items as LogEntry[]) || []);
                      setLogsTotal(env.total || 0);
                      setLogsSkip(0);
                    }}
                  >
                    Refresh Logs
                  </Button>
                  <div className="ml-auto flex items-center gap-2 text-xs">
                    <span>
                      {logsTotal > 0
                        ? `${Math.min(logsSkip + 1, logsTotal)}-${Math.min(
                          logsSkip + logsLimit,
                          logsTotal
                        )} of ${logsTotal}`
                        : '0-0 of 0'}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const newSkip = Math.max(0, logsSkip - logsLimit);
                        setLogsSkip(newSkip);
                        const resp = await AdminApiService.getSystemLogs(
                          logsLevel,
                          logsLimit,
                          {
                            from: logsFrom || undefined,
                            to: logsTo || undefined,
                            search: logsSearch || undefined,
                            skip: newSkip,
                            envelope: true,
                          }
                        );
                        const env = resp as any;
                        setLogs((env.items as LogEntry[]) || []);
                        setLogsTotal(env.total || 0);
                      }}
                      disabled={logsSkip <= 0}
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const newSkip = logsSkip + logsLimit;
                        if (newSkip >= logsTotal) return;
                        setLogsSkip(newSkip);
                        const resp = await AdminApiService.getSystemLogs(
                          logsLevel,
                          logsLimit,
                          {
                            from: logsFrom || undefined,
                            to: logsTo || undefined,
                            search: logsSearch || undefined,
                            skip: newSkip,
                            envelope: true,
                          }
                        );
                        const env = resp as any;
                        setLogs((env.items as LogEntry[]) || []);
                        setLogsTotal(env.total || 0);
                      }}
                      disabled={logsSkip + logsLimit >= logsTotal}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <div className="border rounded">
                  <div className="max-h-96 overflow-auto text-xs font-mono">
                    {logs.length > 0 ? (
                      logs.map((log, idx) => (
                        <div key={idx} className="px-3 py-2 border-b">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              [{log.level}] {log.module}
                            </span>
                            <span className="text-muted-foreground">
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                          </div>
                          <div>{log.message}</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-muted-foreground">No logs.</div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Permissions Tab */}
          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Permissions</CardTitle>
              </CardHeader>
              <CardContent>
                {userPermissions ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">User ID</div>
                      <div className="font-medium">
                        {userPermissions.user_id}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Roles</div>
                      <div className="font-medium">
                        {userPermissions.roles.join(', ') || 'None'}
                      </div>
                    </div>
                    <div className="md:col-span-2">
                      <div className="text-muted-foreground">Permissions</div>
                      <div className="font-medium break-words">
                        {userPermissions.permissions.join(', ') || 'None'}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Admin</div>
                      <div className="font-medium">
                        {userPermissions.is_admin ? 'Yes' : 'No'}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Analyst</div>
                      <div className="font-medium">
                        {userPermissions.is_analyst ? 'Yes' : 'No'}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground">
                    No permissions data.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audit Tab */}
          <TabsContent value="audit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Audit Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <input
                    type="number"
                    className="border rounded px-2 py-1 bg-background text-sm w-24"
                    placeholder="Skip"
                    value={auditFilters.skip}
                    onChange={e =>
                      setAuditFilters({
                        ...auditFilters,
                        skip: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1 bg-background text-sm w-24"
                    placeholder="Limit"
                    value={auditFilters.limit}
                    onChange={e =>
                      setAuditFilters({
                        ...auditFilters,
                        limit: Number(e.target.value) || 50,
                      })
                    }
                  />
                  <input
                    type="number"
                    className="border rounded px-2 py-1 bg-background text-sm w-32"
                    placeholder="User ID"
                    value={auditFilters.userId || ''}
                    onChange={e =>
                      setAuditFilters({
                        ...auditFilters,
                        userId: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1 bg-background text-sm w-40"
                    placeholder="Action"
                    value={auditFilters.action || ''}
                    onChange={e =>
                      setAuditFilters({
                        ...auditFilters,
                        action: e.target.value || undefined,
                      })
                    }
                  />
                  <input
                    type="date"
                    className="border rounded px-2 py-1 bg-background text-sm"
                    value={auditFrom}
                    onChange={e => setAuditFrom(e.target.value)}
                  />
                  <input
                    type="date"
                    className="border rounded px-2 py-1 bg-background text-sm"
                    value={auditTo}
                    onChange={e => setAuditTo(e.target.value)}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      const data = await AdminApiService.getAuditLogs(
                        auditFilters.skip,
                        auditFilters.limit,
                        auditFilters.userId,
                        auditFilters.action,
                        {
                          from: auditFrom || undefined,
                          to: auditTo || undefined,
                          envelope: true,
                        }
                      );
                      const env = data as any;
                      setAuditLogs((env?.items as any[]) || env?.logs || []);
                      setAuditTotal(env?.total || 0);
                      setAuditSkip(env?.skip || 0);
                    }}
                  >
                    Refresh
                  </Button>
                  <div className="ml-auto flex items-center gap-2 text-xs">
                    <span>
                      {auditTotal > 0
                        ? `${Math.min(auditSkip + 1, auditTotal)}-${Math.min(
                          auditSkip + auditFilters.limit,
                          auditTotal
                        )} of ${auditTotal}`
                        : '0-0 of 0'}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const newSkip = Math.max(
                          0,
                          auditSkip - auditFilters.limit
                        );
                        setAuditSkip(newSkip);
                        const resp = await AdminApiService.getAuditLogs(
                          newSkip,
                          auditFilters.limit,
                          auditFilters.userId,
                          auditFilters.action,
                          {
                            from: auditFrom || undefined,
                            to: auditTo || undefined,
                            envelope: true,
                          }
                        );
                        const env = resp as any;
                        setAuditLogs((env?.items as any[]) || env?.logs || []);
                        setAuditTotal(env?.total || 0);
                      }}
                      disabled={auditSkip <= 0}
                    >
                      Prev
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async () => {
                        const newSkip = auditSkip + auditFilters.limit;
                        if (newSkip >= auditTotal) return;
                        setAuditSkip(newSkip);
                        const resp = await AdminApiService.getAuditLogs(
                          newSkip,
                          auditFilters.limit,
                          auditFilters.userId,
                          auditFilters.action,
                          {
                            from: auditFrom || undefined,
                            to: auditTo || undefined,
                            envelope: true,
                          }
                        );
                        const env = resp as any;
                        setAuditLogs((env?.items as any[]) || env?.logs || []);
                        setAuditTotal(env?.total || 0);
                      }}
                      disabled={auditSkip + auditFilters.limit >= auditTotal}
                    >
                      Next
                    </Button>
                  </div>
                </div>
                <div className="border rounded">
                  <div className="max-h-96 overflow-auto text-xs font-mono">
                    {auditLogs && (auditLogs as any[]).length > 0 ? (
                      (auditLogs as any[]).map((entry: any, idx: number) => (
                        <div key={idx} className="px-3 py-2 border-b">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold">
                              [{entry.level || 'INFO'}]{' '}
                              {entry.module || entry.action || 'audit'}
                            </span>
                            <span className="text-muted-foreground">
                              {entry.timestamp
                                ? new Date(entry.timestamp).toLocaleString()
                                : ''}
                            </span>
                          </div>
                          <div>
                            {entry.message ||
                              entry.details ||
                              JSON.stringify(entry)}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-muted-foreground">
                        No audit logs.
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            {securityAudit ? (
              <>
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Security Overview</CardTitle>
                      <div className="space-x-2 flex items-center">
                        <input
                          type="date"
                          className="border rounded px-2 py-1 bg-background text-sm"
                          value={securityFrom}
                          onChange={e => setSecurityFrom(e.target.value)}
                        />
                        <input
                          type="date"
                          className="border rounded px-2 py-1 bg-background text-sm"
                          value={securityTo}
                          onChange={e => setSecurityTo(e.target.value)}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            try {
                              setRefreshing(true);
                              const data =
                                await AdminApiService.getSecurityAudit({
                                  from: securityFrom || undefined,
                                  to: securityTo || undefined,
                                });
                              setSecurityAudit(data);
                              toast.success('Security audit refreshed');
                            } catch {
                              toast.error('Failed to refresh security audit');
                            } finally {
                              setRefreshing(false);
                            }
                          }}
                        >
                          Refresh
                        </Button>
                        <Button
                          size="sm"
                          onClick={handleClearRateLimits}
                          disabled={maintenanceLoading}
                        >
                          Clear Rate Limits
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {securityAudit.failed_logins_24h}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Failed logins (24h)
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {securityAudit.rate_limit_violations}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Rate limit violations
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {securityAudit.password_policy_violations}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Policy violations
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {securityAudit.suspicious_activities.length}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Suspicious activities
                        </div>
                      </div>
                    </div>

                    {securityAudit.recommendations.length > 0 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          <div className="space-y-1">
                            {securityAudit.recommendations.map((rec, idx) => (
                              <div key={idx}>{rec}</div>
                            ))}
                          </div>
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Suspicious Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {securityAudit.suspicious_activities.length > 0 ? (
                      <div className="space-y-2 text-sm">
                        {securityAudit.suspicious_activities.map(
                          (act: any, idx: number) => (
                            <div key={idx} className="p-3 border rounded">
                              <div className="flex items-center justify-between">
                                <span className="font-medium">
                                  {act.type || 'Event'}
                                </span>
                                <span className="text-muted-foreground">
                                  {act.timestamp
                                    ? new Date(act.timestamp).toLocaleString()
                                    : ''}
                                </span>
                              </div>
                              <div className="text-muted-foreground">
                                {act.details || act.message || ''}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="text-muted-foreground">
                        No suspicious activities detected.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="text-muted-foreground">
                No security data available.
              </div>
            )}
          </TabsContent>

          {/* Maintenance Tab */}
          <TabsContent value="maintenance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>File Cleanup</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Clean up orphaned and failed files to free up storage space.
                  </p>
                  <div className="space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleFileCleanupPreview}
                      disabled={maintenanceLoading}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Preview Cleanup
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleFileCleanup}
                      disabled={maintenanceLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Run Cleanup
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Rate Limiting</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Clear rate limiting records to restore access for blocked
                    users.
                  </p>
                  <Button
                    size="sm"
                    onClick={handleClearRateLimits}
                    disabled={maintenanceLoading}
                  >
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Clear Rate Limits
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
