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
  TrendingUp,
  TrendingDown,
  Clock,
  Users,
  Shield,
  Zap,
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
  rows: number;
  size_mb: number;
  size_pretty: string;
  last_updated: string;
  integrity_status: 'healthy' | 'warning' | 'error';
  dead_rows?: number;
  inserts?: number;
  updates?: number;
  deletes?: number;
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
  const [tables, setTables] = useState<Record<string, any>>({});
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
    onConfirm: async () => { },
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
      console.log('Database health:', health); // Debug log
      console.log('Performance data:', performance); // Debug log

      setDatabaseHealth(health);
      setPerformanceData(performance);
      setSchedules(sched);
      setSchedulesDraft(sched);

      // Convert table data to TableInfo format
      console.log('Raw tables data:', tables); // Debug log

      const tableDataFromTables: TableInfo[] = Object.entries(tables || {})
        .filter(([name]) => name !== '_total_records') // Exclude total records from table list
        .map(([name, data]) => ({
          name,
          rows: data.rows || 0,
          size_mb: data.size_mb || 0,
          size_pretty: data.size_pretty || '0 MB',
          last_updated: data.last_updated || new Date().toISOString(),
          integrity_status: data.integrity_status || 'healthy',
          dead_rows: data.dead_rows || 0,
          inserts: data.inserts || 0,
          updates: data.updates || 0,
          deletes: data.deletes || 0,
        }));

      console.log('Processed table data:', tableDataFromTables); // Debug log
      console.log('Total records:', tables._total_records); // Debug log

      setTableData(tableDataFromTables);
      setTables(tables || {}); // Store tables data for total records display
    } catch (_error) {
      console.error('Failed to load data info:', _error);
      toast.error('Failed to load data management information');
      // Set default empty data to prevent undefined errors
      setTableData([]);
      setTables({});
      setDatabaseHealth({});
      setPerformanceData([]);
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

      {/* Debug Section - Remove after fixing */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Debug Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs font-mono">
              <div>Database Health: {JSON.stringify(databaseHealth, null, 2)}</div>
              <div>Table Data Length: {tableData.length}</div>
              <div>Tables Object Keys: {Object.keys(tables).join(', ')}</div>
            </div>
          </CardContent>
        </Card>
      )}

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
                tableData.reduce((sum, t) => sum + t.rows, 0)
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
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="tables">Database Tables</TabsTrigger>
          <TabsTrigger value="cleanup">File Cleanup</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="backup">Backup & Export</TabsTrigger>
          <TabsTrigger value="analytics">Data Analytics</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        {/* Database Tables Tab */}
        <TabsContent value="tables">
          <div className="space-y-6">
            {/* Table Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Tables</p>
                      <p className="text-2xl font-bold">{tableData.length}</p>
                    </div>
                    <Database className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Records</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(tableData.reduce((sum, t) => sum + t.rows, 0))}
                      </p>
                    </div>
                    <FileText className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Size</p>
                      <p className="text-2xl font-bold">
                        {formatFileSize(tableData.reduce((sum, t) => sum + t.size_mb, 0))}
                      </p>
                    </div>
                    <HardDrive className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Healthy Tables</p>
                      <p className="text-2xl font-bold text-green-600">
                        {tableData.filter(t => t.integrity_status === 'healthy').length}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tables Table */}
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
                            {formatNumber(table.rows)}
                          </TableCell>
                          <TableCell>{table.size_pretty || formatFileSize(table.size_mb)}</TableCell>
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
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const details = [
                                    `Rows: ${formatNumber(table.rows)}`,
                                    `Dead Rows: ${formatNumber(table.dead_rows || 0)}`,
                                    `Inserts: ${formatNumber(table.inserts || 0)}`,
                                    `Updates: ${formatNumber(table.updates || 0)}`,
                                    `Deletes: ${formatNumber(table.deletes || 0)}`,
                                  ].join('\n');
                                  alert(`Table Details for ${table.name}:\n\n${details}`);
                                }}
                              >
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

                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      File cleanup checks for orphaned files in the uploads directory.
                      Zero values indicate no orphaned files were found.
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
            {/* Database Overview Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Database Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {tableData.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Tables
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatNumber(
                        typeof tables._total_records === 'object'
                          ? tables._total_records?.count || 0
                          : tables._total_records || 0
                      )}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Records
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {tableData.filter(t => t.integrity_status === 'healthy').length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Healthy Tables
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-600">
                      {tableData.filter(t => t.integrity_status === 'warning').length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Warning Tables
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">
                      {tableData.filter(t => t.integrity_status === 'error').length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Error Tables
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {(() => {
                        const avgTime = databaseHealth?.performance_metrics?.avg_query_time_ms;
                        console.log('Avg query time:', avgTime); // Debug log
                        if (avgTime != null && avgTime >= 0) {
                          return `${avgTime.toFixed(1)} ms`;
                        }
                        return 'N/A';
                      })()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Query Time
                    </div>
                    {databaseHealth?.performance_metrics?.note && (
                      <div className="text-xs text-yellow-600 mt-1">
                        {databaseHealth.performance_metrics.note}
                      </div>
                    )}
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
                      {(() => {
                        const connections = databaseHealth?.connection_pool?.active_connections;
                        console.log('Active connections:', connections); // Debug log
                        return connections ?? 'N/A';
                      })()}
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
                      {tableData.length || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Tables
                    </div>
                    <Progress
                      value={(() => {
                        const count = tableData.length;
                        if (typeof count !== 'number') return 0;
                        return Math.min((count / 50) * 100, 100); // 50 tables threshold
                      })()}
                      className="mt-2"
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">
                      {formatFileSize(tableData.reduce((sum, t) => sum + t.size_mb, 0))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Database Size
                    </div>
                    <Progress
                      value={(() => {
                        const size = tableData.reduce((sum, t) => sum + t.size_mb, 0);
                        if (typeof size !== 'number') return 0;
                        return Math.min((size / 1000) * 100, 100); // 1GB threshold
                      })()}
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
                        <div className="font-mono text-xs break-all mb-2">
                          {item.query || item.sql || 'Query'}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                          <div>
                            <span className="text-muted-foreground">Avg Time:</span>
                            <span className="ml-1 font-medium">
                              {item.avg_ms ?? item.avg_time_ms ?? item.avg_time ?? 'N/A'} ms
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Max Time:</span>
                            <span className="ml-1 font-medium">
                              {item.p95_ms ?? item.max_time_ms ?? 'N/A'} ms
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Calls:</span>
                            <span className="ml-1 font-medium">
                              {item.calls ?? item.count ?? 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Total Time:</span>
                            <span className="ml-1 font-medium">
                              {item.total_time_seconds ?? 'N/A'}s
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No slow queries detected in the selected window</p>
                    <p className="text-xs">
                      {performanceData[0]?.note || 'Queries slower than 1000ms are flagged'}
                    </p>
                    <div className="mt-4 p-3 bg-blue-50 rounded text-xs">
                      <p className="font-medium text-blue-800">Current Performance:</p>
                      <p>Avg Query Time: {databaseHealth?.performance_metrics?.avg_query_time_ms?.toFixed(1) || 'N/A'} ms</p>
                      <p>Max Query Time: {databaseHealth?.performance_metrics?.max_query_time_ms?.toFixed(1) || 'N/A'} ms</p>
                      <p>Active Queries: {databaseHealth?.performance_metrics?.active_queries || 0}</p>
                    </div>
                    {performanceData[0]?.note && (
                      <p className="text-xs text-yellow-600 mt-2">
                        Consider enabling pg_stat_statements extension for detailed query analysis
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Backup & Export Tab */}
        <TabsContent value="backup">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Database Backup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Archive className="h-5 w-5 mr-2" />
                  Database Backup
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Create full database backups and manage backup history
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-blue-900">Last Backup</span>
                    <Badge variant="outline">2 hours ago</Badge>
                  </div>
                  <p className="text-sm text-blue-700">Backup size: 2.4 GB</p>
                  <p className="text-sm text-blue-700">Status: Completed</p>
                </div>

                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={async () => {
                      try {
                        const result = await AdminApi.backupDatabase();
                        toast.success(`Backup started: ${result.message}`);
                      } catch (error) {
                        toast.error('Failed to start backup');
                      }
                    }}
                  >
                    <Archive className="h-4 w-4 mr-2" />
                    Create New Backup
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // TODO: Implement backup history
                      toast.info('Backup history feature coming soon');
                    }}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View Backup History
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Data Export */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="h-5 w-5 mr-2" />
                  Data Export
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Export specific tables or full database in various formats
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium">Select Table</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose table to export" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Tables</SelectItem>
                        {tableData.map(table => (
                          <SelectItem key={table.name} value={table.name}>
                            {table.name} ({formatNumber(table.rows)} rows)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Export Format</label>
                    <Select defaultValue="csv">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV</SelectItem>
                        <SelectItem value="json">JSON</SelectItem>
                        <SelectItem value="sql">SQL Dump</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full"
                    onClick={async () => {
                      try {
                        const result = await AdminApi.exportDatabase({
                          table: 'users',
                          format: 'csv'
                        });
                        toast.success(`Export completed: ${result.message}`);
                      } catch (error) {
                        toast.error('Failed to export data');
                      }
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Analytics Tab */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Data Growth Trends */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Data Growth Trends
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monitor database growth and usage patterns over time
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {formatNumber(tableData.reduce((sum, t) => sum + t.rows, 0))}
                      </div>
                      <div className="text-sm text-green-700">Total Records</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {formatFileSize(tableData.reduce((sum, t) => sum + t.size_mb, 0))}
                      </div>
                      <div className="text-sm text-blue-700">Total Size</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {tableData.length}
                      </div>
                      <div className="text-sm text-purple-700">Active Tables</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">Top Tables by Size</h4>
                    {tableData
                      .sort((a, b) => b.size_mb - a.size_mb)
                      .slice(0, 5)
                      .map(table => (
                        <div key={table.name} className="flex items-center justify-between p-3 border rounded">
                          <div>
                            <div className="font-medium">{table.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatNumber(table.rows)} records
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-medium">{formatFileSize(table.size_mb)}</div>
                            <div className="text-sm text-muted-foreground">
                              {((table.size_mb / tableData.reduce((sum, t) => sum + t.size_mb, 0)) * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Data Quality Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Data Quality
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monitor data integrity and quality metrics
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Healthy Tables</span>
                    <Badge variant="default">
                      {tableData.filter(t => t.integrity_status === 'healthy').length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <span className="text-sm font-medium">Warning Tables</span>
                    <Badge variant="secondary">
                      {tableData.filter(t => t.integrity_status === 'warning').length}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                    <span className="text-sm font-medium">Error Tables</span>
                    <Badge variant="destructive">
                      {tableData.filter(t => t.integrity_status === 'error').length}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-medium mb-2">Data Activity (24h)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Inserts</span>
                      <span className="font-medium">
                        {formatNumber(tableData.reduce((sum, t) => sum + (t.inserts || 0), 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Updates</span>
                      <span className="font-medium">
                        {formatNumber(tableData.reduce((sum, t) => sum + (t.updates || 0), 0))}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Deletes</span>
                      <span className="font-medium">
                        {formatNumber(tableData.reduce((sum, t) => sum + (t.deletes || 0), 0))}
                      </span>
                    </div>
                  </div>
                </div>
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
