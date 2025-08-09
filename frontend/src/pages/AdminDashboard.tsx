import React, { useEffect, useCallback, useState } from 'react';
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
  RefreshCw,
  Download,
  Trash2,
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
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/design-system/components/Switch';
import { useAdminStore } from '@/stores/admin';
import UserManagement from '@/components/Admin/UserManagement';
import SystemMonitoring from '@/components/Admin/SystemMonitoring';
import DataManagement from '@/components/Admin/DataManagement';
import OverviewTab from '@/components/AdminDashboard/OverviewTab';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import * as AdminApi from '@/services/admin';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [cleanupDialogOpen, setCleanupDialogOpen] = useState(false);

  // Local log state for tests
  const [logs, setLogs] = useState<import('@/services/adminApi').LogEntry[]>(
    []
  );
  const [logsTotal, setLogsTotal] = useState(0);
  const [logsSkip, setLogsSkip] = useState(0);
  const [logsLimit, setLogsLimit] = useState(100);
  const [logsLevel, setLogsLevel] = useState<
    'DEBUG' | 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  >('ERROR');
  const [logsFrom, setLogsFrom] = useState('');
  const [logsTo, setLogsTo] = useState('');
  const [logsSearch, setLogsSearch] = useState('');
  const [userPermissions, _setUserPermissions] = useState<any>(null);

  // Use centralized store
  const {
    activeTab,
    setActiveTab,
    autoRefreshEnabled,
    setAutoRefresh,
    refreshing,
    systemStats,
    userActivity,
    systemMetrics: _systemMetrics,
    systemHealth: _systemHealth,
    databaseHealth: _databaseHealth,
    audit: _audit,
    fetchOverviewData,
    fetchHealthData,
    fetchLogsData,
    fetchAuditData,
    refreshAll,
    updateAuditFilters: _updateAuditFilters,
    clearErrors: _clearErrors,
  } = useAdminStore();

  // Context-aware data loading based on active tab
  const loadDataForTab = useCallback(
    async (tab: string) => {
      switch (tab) {
        case 'overview':
          await fetchOverviewData();
          break;
        case 'health':
          await fetchHealthData();
          break;
        case 'logs':
          await fetchLogsData();
          break;
        case 'audit':
          await fetchAuditData();
          break;
        default:
          await fetchOverviewData();
      }
    },
    [fetchOverviewData, fetchHealthData, fetchLogsData, fetchAuditData]
  );

  // Legacy compatibility for child components
  const loadAdminData = useCallback(async () => {
    await loadDataForTab(activeTab);
  }, [loadDataForTab, activeTab]);

  const _loadMetricsAndLogs = useCallback(async () => {
    await fetchLogsData();
  }, [fetchLogsData]);

  // Refresh data using store
  const handleRefresh = async () => {
    await refreshAll();
    toast.success('Admin dashboard refreshed');
  };

  // Format percentage for display
  const _formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'N/A';
    }
    return `${value.toFixed(1)}%`;
  };

  // Format number with commas
  const _formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || Number.isNaN(num as number)) {
      return '0';
    }
    return (num as number).toLocaleString();
  };

  // Get status badge variant
  const _getStatusBadge = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return <Badge variant="destructive">Inactive</Badge>;
    if (!isVerified) return <Badge variant="secondary">Unverified</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  // Maintenance operations
  const handleFileCleanupPreview = async () => {
    try {
      setMaintenanceLoading(true);
      const result = await AdminApi.cleanupFiles(true);
      toast.success(
        `Cleanup preview: ${result.orphaned_files} orphaned files, ${result.failed_files} failed files found`
      );
    } catch (_error) {
      toast.error('Failed to preview file cleanup');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleFileCleanup = async () => {
    try {
      setMaintenanceLoading(true);
      const result = await AdminApiService.cleanupFiles(false);
      toast.success(result.message);
      await loadAdminData(); // Refresh data
    } catch (_error) {
      toast.error('Failed to run file cleanup');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  const handleClearRateLimits = async () => {
    try {
      setMaintenanceLoading(true);
      const result = await AdminApi.clearRateLimits();
      toast.success(
        `${result.message} (${result.cleared_records} records cleared)`
      );
    } catch (_error) {
      toast.error('Failed to clear rate limits');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  // Load data on mount and tab change
  useEffect(() => {
    loadDataForTab(activeTab);
  }, [loadDataForTab, activeTab]);

  // Auto refresh based on active tab
  useEffect(() => {
    if (!autoRefreshEnabled) return;
    const id = setInterval(() => {
      refreshAll();
    }, 30000);
    return () => clearInterval(id);
  }, [autoRefreshEnabled, refreshAll]);

  // Check if user has admin permissions
  if (!user) {
    navigate('/login');
    return null;
  }

  // Show initial loading state only if no data is available
  const isInitialLoading =
    !systemStats.data &&
    !userActivity.data &&
    !logs.data &&
    systemStats.loading;

  if (isInitialLoading) {
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
                  onCheckedChange={setAutoRefresh}
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
          <TabsList className="w-full overflow-x-auto flex gap-1.5">
            <TabsTrigger
              value="overview"
              className="flex items-center space-x-2 shrink-0"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden lg:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="flex items-center space-x-2 shrink-0"
            >
              <Users className="h-4 w-4" />
              <span className="hidden lg:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="flex items-center space-x-2 shrink-0"
            >
              <Server className="h-4 w-4" />
              <span className="hidden lg:inline">System</span>
            </TabsTrigger>
            <TabsTrigger
              value="database"
              className="flex items-center space-x-2 shrink-0"
            >
              <Database className="h-4 w-4" />
              <span className="hidden lg:inline">Database</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center space-x-2 shrink-0"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="flex items-center space-x-2 shrink-0"
            >
              <Settings className="h-4 w-4" />
              <span className="hidden lg:inline">Maintenance</span>
            </TabsTrigger>
            <TabsTrigger
              value="health"
              className="flex items-center space-x-2 shrink-0"
            >
              <Activity className="h-4 w-4" />
              <span className="hidden lg:inline">Health</span>
            </TabsTrigger>
            <TabsTrigger
              value="logs"
              className="flex items-center space-x-2 shrink-0"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline">Logs</span>
            </TabsTrigger>
            <TabsTrigger
              value="permissions"
              className="flex items-center space-x-2 shrink-0"
            >
              <Shield className="h-4 w-4" />
              <span className="hidden lg:inline">Permissions</span>
            </TabsTrigger>
            <TabsTrigger
              value="audit"
              className="flex items-center space-x-2 shrink-0"
            >
              <FileText className="h-4 w-4" />
              <span className="hidden lg:inline">Audit</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <OverviewTab />
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
            <HealthTab />
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
                      const resp = await AdminApi.getSystemLogs(
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
                      const resp = await AdminApi.getSystemLogs(
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
                      const resp = await AdminApi.getSystemLogs(
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
                        const resp = await AdminApi.getSystemLogs(
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
                        const resp = await AdminApi.getSystemLogs(
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
                      const data = await AdminApi.getAuditLogs(
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
                        const resp = await AdminApi.getAuditLogs(
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
                        const resp = await AdminApi.getAuditLogs(
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
                              const data = await AdminApi.getSecurityAudit({
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
                      onClick={() => setCleanupDialogOpen(true)}
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
      <ConfirmDialog
        open={cleanupDialogOpen}
        onOpenChange={setCleanupDialogOpen}
        title="Confirm Cleanup"
        description="Run cleanup and permanently delete files?"
        confirmText="Confirm"
        onConfirm={handleFileCleanup}
      />
    </div>
  );
};

export default AdminDashboard;
