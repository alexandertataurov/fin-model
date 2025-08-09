import React, { useState, useEffect, useCallback } from 'react';
import {
  Database,
  FileText,
  // Trash2,
  RefreshCw,
  Download,
  Upload,
  Archive,
  AlertCircle,
  CheckCircle,
  BarChart3,
  HardDrive,
  // Clock,
  // Users,
  Activity,
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
import { Input } from '@/design-system/components/Input';
import { Checkbox } from '@/design-system/components/Checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/Select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/design-system/components/Dialog';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/design-system/components/Tabs';
import * as AdminApi from '@/services/admin';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';

interface TableInfo {
  name: string;
  record_count: number;
  size_mb: number;
  last_updated: string;
  integrity_status: 'healthy' | 'warning' | 'error';
}

interface CleanupPreview {
  orphaned_files: number;
  failed_files: number;
  total_size_mb: number;
  estimated_cleanup_time: string;
}

const DataManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  // const [tableInfo, setTableInfo] = useState<Record<string, any>>({});
  const [tableData, setTableData] = useState<TableInfo[]>([]);
  const [cleanupPreview, setCleanupPreview] = useState<CleanupPreview | null>(
    null
  );
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const [cleanupInProgress, setCleanupInProgress] = useState(false);
  const [databaseHealth, setDatabaseHealth] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);
  const [performanceWindow, setPerformanceWindow] = useState<
    '1h' | '24h' | '7d'
  >('24h');
  const [schedules, setSchedules] = useState<
    import('@/services/admin').MaintenanceSchedules | null
  >(null);
  const [schedulesDraft, setSchedulesDraft] = useState<
    import('@/services/admin').MaintenanceSchedules | null
  >(null);
  const [savingSchedules, setSavingSchedules] = useState(false);
  const [confirmState, setConfirmState] = useState({
    open: false,
    message: '',
    onConfirm: async () => {},
  });

  const showConfirm = (
    message: string,
    onConfirm: () => void | Promise<void>
  ) => {
    setConfirmState({
      open: true,
      message,
      onConfirm: async () => {
        await onConfirm();
      },
    });
  };

  // Load data management information
  const loadDataInfo = useCallback(async () => {
    try {
      setLoading(true);

      const [tables, health, performance, integrity, sched] = await Promise.all(
        [
          AdminApi.getTableInformation(),
          AdminApi.getDatabaseHealth(),
          AdminApi.getDatabasePerformance(10, {
            window: performanceWindow,
          }),
          AdminApi.checkDataIntegrity(),
          AdminApi.getMaintenanceSchedules(),
        ]
      );

      // setTableInfo(tables);
      setDatabaseHealth(health);
      setPerformanceData(performance);
      setSchedules(sched);
      setSchedulesDraft(sched);

      // Convert integrity data to TableInfo format
      const tableDataFromIntegrity: TableInfo[] = integrity.map(item => ({
        name: item.table_name,
        record_count: item.record_count,
        size_mb: tables[item.table_name]?.size_mb || 0,
        last_updated: item.last_updated,
        integrity_status:
          item.integrity_issues.length > 0 ? 'warning' : 'healthy',
      }));

      setTableData(tableDataFromIntegrity);
    } catch (_error) {
      console.error('Failed to load data info:', _error);
      toast.error('Failed to load data management information');
    } finally {
      setLoading(false);
    }
  }, [performanceWindow]);

  // Preview cleanup
  const previewCleanup = async () => {
    try {
      const result = await AdminApi.cleanupFiles(true);
      setCleanupPreview({
        orphaned_files: result.orphaned_files,
        failed_files: result.failed_files,
        total_size_mb: (result.orphaned_files + result.failed_files) * 2.5, // Estimated
        estimated_cleanup_time: '2-5 minutes',
      });
      setShowCleanupDialog(true);
    } catch (_error) {
      toast.error('Failed to preview cleanup');
    }
  };

  // Execute cleanup
  const executeCleanup = async () => {
    try {
      setCleanupInProgress(true);
      const result = await AdminApi.cleanupFiles(false);
      toast.success(result.message);
      setShowCleanupDialog(false);
      await loadDataInfo(); // Refresh data
    } catch (_error) {
      toast.error('Failed to execute cleanup');
    } finally {
      setCleanupInProgress(false);
    }
  };

  // Database cleanup
  const handleDatabaseCleanup = async (dryRun = true) => {
    try {
      const result = await AdminApi.cleanupDatabase(dryRun);
      if (dryRun) {
        toast.success(`Cleanup preview: ${JSON.stringify(result)}`);
      } else {
        toast.success('Database cleanup completed successfully');
        await loadDataInfo();
      }
    } catch (_error) {
      toast.error('Failed to cleanup database');
    }
  };

  // Get table status badge
  const getTableStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Healthy
          </Badge>
        );
      case 'warning':
        return <Badge variant="secondary">Warning</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  // Format file size
  const formatFileSize = (sizeInMB: number): string => {
    if (sizeInMB < 1024) {
      return `${sizeInMB.toFixed(1)} MB`;
    }
    return `${(sizeInMB / 1024).toFixed(1)} GB`;
  };

  // Format number
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  useEffect(() => {
    loadDataInfo();
  }, [loadDataInfo]);

  useEffect(() => {
    (async () => {
      try {
        const perf = await AdminApi.getDatabasePerformance(10, {
          window: performanceWindow,
        });
        setPerformanceData(perf);
      } catch (_e) {
        toast.error('Failed to load performance metrics');
      }
    })();
  }, [performanceWindow]);

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
          <h2 className="text-2xl font-bold">Data Management</h2>
          <p className="text-muted-foreground">
            Manage database tables, file cleanup, and data integrity
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline" onClick={previewCleanup}>
            <Archive className="h-4 w-4 mr-2" />
            Preview Cleanup
          </Button>
          <Button size="sm" onClick={loadDataInfo}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Database className="h-4 w-4 mr-2" />
              Total Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tableData.length}</div>
            <div className="text-xs text-muted-foreground">
              {tableData.filter(t => t.integrity_status === 'healthy').length}{' '}
              healthy
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              Total Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatNumber(
                tableData.reduce((sum, t) => sum + t.record_count, 0)
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Across all tables
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <HardDrive className="h-4 w-4 mr-2" />
              Storage Used
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatFileSize(tableData.reduce((sum, t) => sum + t.size_mb, 0))}
            </div>
            <div className="text-xs text-muted-foreground">Database size</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <Activity className="h-4 w-4 mr-2" />
              Health Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            {(() => {
              const total = tableData.length || 0;
              const healthy = tableData.filter(
                t => t.integrity_status === 'healthy'
              ).length;
              const integrityPct =
                total > 0 ? Math.round((healthy / total) * 100) : null;
              const dbHealthy = databaseHealth?.status === 'healthy';
              const score = dbHealthy ? 100 : integrityPct ?? 0;
              return (
                <>
                  <div
                    className={`text-2xl font-bold ${score >= 80
                      ? 'text-green-600'
                      : score >= 50
                        ? 'text-yellow-600'
                        : 'text-red-600'
                      }`}
                  >
                    {total === 0 && !dbHealthy ? 'N/A' : `${score}%`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Overall system health
                  </div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="tables" className="space-y-4">
        <TabsList>
          <TabsTrigger value="tables">Database Tables</TabsTrigger>
          <TabsTrigger value="cleanup">File Cleanup</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Database Tables Tab */}
        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>Database Tables Overview</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table Name</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center text-muted-foreground py-6"
                      >
                        No table information available.
                      </TableCell>
                    </TableRow>
                  ) : (
                    tableData.map(table => (
                      <TableRow key={table.name}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                            {table.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          {formatNumber(table.record_count)}
                        </TableCell>
                        <TableCell>{formatFileSize(table.size_mb)}</TableCell>
                        <TableCell className="text-sm">
                          {table.last_updated
                            ? new Date(table.last_updated).toLocaleDateString()
                            : 'N/A'}
                        </TableCell>
                        <TableCell>
                          {getTableStatusBadge(table.integrity_status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <BarChart3 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                try {
                                  const fmt = (
                                    prompt(
                                      'Export format: json or csv',
                                      'csv'
                                    ) || 'csv'
                                  ).toLowerCase();
                                  if (fmt !== 'json' && fmt !== 'csv') {
                                    toast.error('Invalid format');
                                    return;
                                  }
                                  const res =
                                    await AdminApi.exportDatabase({
                                      table: table.name,
                                      format: fmt as 'json' | 'csv',
                                    });
                                  toast.success('Table export generated');
                                  window.open(res.file_url, '_blank');
                                } catch {
                                  toast.error('Export failed');
                                }
                              }}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* File Cleanup Tab */}
        <TabsContent value="cleanup">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>File Cleanup</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Remove orphaned and failed file uploads
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {cleanupPreview?.orphaned_files || '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Orphaned files
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {cleanupPreview?.failed_files || '0'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Failed uploads
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={previewCleanup}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Preview Cleanup
                  </Button>

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Cleanup will permanently remove files that cannot be
                      recovered. Always preview before executing.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Database Maintenance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Optimize database performance and integrity
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleDatabaseCleanup(true)}
                  >
                    <Database className="h-4 w-4 mr-2" />
                    Preview Database Cleanup
                  </Button>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() => handleDatabaseCleanup(false)}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Run Database Cleanup
                  </Button>

                  <Button
                    className="w-full"
                    variant="outline"
                    onClick={() =>
                      showConfirm('Generate admin overview report (CSV)?', async () => {
                        try {
                          const data = await AdminApi.getAdminOverviewReport('csv');
                          const blob = new Blob([data], {
                            type: 'text/csv',
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'admin_overview.csv';
                          a.click();
                          URL.revokeObjectURL(url);
                        } catch (_e) {
                          toast.error('Failed to generate report');
                        }
                      })
                    }
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Generate Admin Report (CSV)
                  </Button>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Database cleanup removes stale records and optimizes
                    queries. Safe to run regularly.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Database Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-end mb-4 gap-2">
                  <span className="text-xs text-muted-foreground">Window</span>
                  <Select
                    value={performanceWindow}
                    onValueChange={val => setPerformanceWindow(val as any)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">Last 1h</SelectItem>
                      <SelectItem value="24h">Last 24h</SelectItem>
                      <SelectItem value="7d">Last 7d</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {databaseHealth?.performance_metrics?.avg_query_time_ms !=
                        null
                        ? `${databaseHealth.performance_metrics.avg_query_time_ms} ms`
                        : databaseHealth?.performance_metrics?.avg_query_time ||
                        'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Query Time
                    </div>
                    <Progress
                      value={(() => {
                        const ms =
                          databaseHealth?.performance_metrics
                            ?.avg_query_time_ms;
                        if (typeof ms !== 'number') return 0;
                        const pct = Math.min((ms / 1000) * 100, 100); // 1000ms threshold
                        return pct;
                      })()}
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {databaseHealth?.connection_pool?.active_connections ??
                        'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Active Connections
                    </div>
                    <Progress
                      value={(() => {
                        const active =
                          databaseHealth?.connection_pool?.active_connections;
                        const max =
                          databaseHealth?.connection_pool?.max_connections ||
                          100;
                        if (typeof active !== 'number') return 0;
                        return Math.min((active / max) * 100, 100);
                      })()}
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {databaseHealth?.status === 'healthy' ? '100%' : 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Database Health
                    </div>
                    <Progress
                      value={databaseHealth?.status === 'healthy' ? 100 : 0}
                      className="mt-2"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slow Query Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                {performanceData && performanceData.length > 0 ? (
                  <div className="space-y-2 text-sm">
                    {performanceData.map((item, idx) => (
                      <div key={idx} className="p-3 border rounded">
                        <div className="font-mono text-xs break-all mb-1">
                          {item.query || item.sql || 'Query'}
                        </div>
                        <div className="flex gap-4">
                          <span className="text-muted-foreground">
                            avg: {item.avg_time_ms ?? item.avg_time ?? 'N/A'}
                          </span>
                          <span className="text-muted-foreground">
                            calls: {item.calls ?? item.count ?? 'N/A'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No slow queries detected in the selected window</p>
                    <p className="text-xs">
                      Queries slower than 1000ms are flagged
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Maintenance Tab */}
        <TabsContent value="maintenance">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Automated Maintenance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {schedulesDraft ? (
                  <div className="space-y-2">
                    {schedulesDraft.items.map((it, idx) => (
                      <div
                        key={it.id}
                        className="p-3 border rounded flex items-center gap-3"
                      >
                        <Checkbox
                          checked={it.enabled}
                          onCheckedChange={checked => {
                            const next = { ...schedulesDraft };
                            next.items[idx] = {
                              ...it,
                              enabled: !!checked,
                            } as any;
                            setSchedulesDraft(next);
                          }}
                        />
                        <Input
                          className="flex-1"
                          value={it.name}
                          onChange={e => {
                            const next = { ...schedulesDraft };
                            next.items[idx] = {
                              ...it,
                              name: e.target.value,
                            } as any;
                            setSchedulesDraft(next);
                          }}
                        />
                        <Select
                          value={it.task}
                          onValueChange={val => {
                            const next = { ...schedulesDraft };
                            next.items[idx] = {
                              ...it,
                              task: val as any,
                            } as any;
                            setSchedulesDraft(next);
                          }}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              'cleanup',
                              'vacuum',
                              'archive',
                              'reindex',
                              'backup',
                            ].map(x => (
                              <SelectItem key={x} value={x}>
                                {x}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          className="w-40"
                          placeholder="schedule"
                          value={it.schedule}
                          onChange={e => {
                            const next = { ...schedulesDraft };
                            next.items[idx] = {
                              ...it,
                              schedule: e.target.value,
                            } as any;
                            setSchedulesDraft(next);
                          }}
                        />
                      </div>
                    ))}
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSchedulesDraft(schedules)}
                        disabled={savingSchedules}
                      >
                        Reset
                      </Button>
                      <Button
                        size="sm"
                        onClick={async () => {
                          try {
                            setSavingSchedules(true);
                            const saved =
                              await AdminApi.updateMaintenanceSchedules(
                                schedulesDraft!
                              );
                            setSchedules(saved);
                            setSchedulesDraft(saved);
                            toast.success('Schedules saved');
                          } catch {
                            toast.error('Failed to save schedules');
                          } finally {
                            setSavingSchedules(false);
                          }
                        }}
                        disabled={savingSchedules}
                      >
                        {savingSchedules ? 'Saving...' : 'Save Schedules'}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-muted-foreground text-sm">
                    No schedules data.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manual Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    showConfirm('Run database backup now?', async () => {
                      try {
                        const res = await AdminApi.backupDatabase();
                        toast.success(`${res.message} (job ${res.job_id})`);
                      } catch {
                        toast.error('Backup failed');
                      }
                    })
                  }
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const table =
                        prompt(
                          'Enter table name (leave empty for full export)'
                        ) || undefined;
                      const format = (
                        prompt('Enter format: json or csv', 'json') || 'json'
                      ).toLowerCase();
                      if (format !== 'json' && format !== 'csv') {
                        toast.error('Invalid format');
                        return;
                      }
                      const res = await AdminApi.exportDatabase({
                        table,
                        format: format as 'json' | 'csv',
                      });
                      toast.success('Export generated');
                      window.open(res.file_url, '_blank');
                    } catch {
                      toast.error('Export failed');
                    }
                  }}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() =>
                    showConfirm('Rebuild all database indexes now?', async () => {
                      try {
                        const res = await AdminApi.reindexDatabase();
                        toast.success(`${res.message} (job ${res.job_id})`);
                      } catch {
                        toast.error('Reindex failed');
                      }
                    })
                  }
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rebuild Indexes
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Cleanup Preview Dialog */}
      <Dialog open={showCleanupDialog} onOpenChange={setShowCleanupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>File Cleanup Preview</DialogTitle>
            <DialogDescription>
              Review the files that will be cleaned up before proceeding.
            </DialogDescription>
          </DialogHeader>

          {cleanupPreview && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {cleanupPreview.orphaned_files}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Orphaned files
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {cleanupPreview.failed_files}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Failed uploads
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Estimated space saved:</span>
                  <span className="font-medium">
                    {formatFileSize(cleanupPreview.total_size_mb)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated time:</span>
                  <span className="font-medium">
                    {cleanupPreview.estimated_cleanup_time}
                  </span>
                </div>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This operation cannot be undone. Files will be permanently
                  deleted.
                </AlertDescription>
              </Alert>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCleanupDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={executeCleanup}
              disabled={cleanupInProgress}
              className="bg-red-600 hover:bg-red-700"
            >
              {cleanupInProgress && (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              )}
              Execute Cleanup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmState.open}
        onOpenChange={open => setConfirmState(prev => ({ ...prev, open }))}
        title="Please confirm"
        description={confirmState.message}
        confirmText="Confirm"
        onConfirm={confirmState.onConfirm}
      />
    </div>
  );
};

export default DataManagement;
