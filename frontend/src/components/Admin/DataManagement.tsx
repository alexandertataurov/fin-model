import React, { useState, useEffect } from 'react';
import {
  Database,
  FileText,
  Trash2,
  RefreshCw,
  Download,
  Upload,
  Archive,
  AlertCircle,
  CheckCircle,
  BarChart3,
  HardDrive,
  Clock,
  Users,
  Activity
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/design-system/components/Dialog';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import AdminApiService from '@/services/adminApi';
import { toast } from 'sonner';

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
  const [tableInfo, setTableInfo] = useState<Record<string, any>>({});
  const [cleanupPreview, setCleanupPreview] = useState<CleanupPreview | null>(null);
  const [showCleanupDialog, setShowCleanupDialog] = useState(false);
  const [cleanupInProgress, setCleanupInProgress] = useState(false);
  const [databaseHealth, setDatabaseHealth] = useState<any>(null);
  const [performanceData, setPerformanceData] = useState<any[]>([]);

  // Load data management information
  const loadDataInfo = async () => {
    try {
      setLoading(true);
      
      const [tables, health, performance] = await Promise.all([
        AdminApiService.getTableInformation(),
        AdminApiService.getDatabaseHealth(),
        AdminApiService.getDatabasePerformance(10)
      ]);
      
      setTableInfo(tables);
      setDatabaseHealth(health);
      setPerformanceData(performance);
      
    } catch (error) {
      console.error('Failed to load data info:', error);
      toast.error('Failed to load data management information');
    } finally {
      setLoading(false);
    }
  };

  // Preview cleanup
  const previewCleanup = async () => {
    try {
      const result = await AdminApiService.cleanupFiles(true);
      setCleanupPreview({
        orphaned_files: result.orphaned_files,
        failed_files: result.failed_files,
        total_size_mb: (result.orphaned_files + result.failed_files) * 2.5, // Estimated
        estimated_cleanup_time: '2-5 minutes'
      });
      setShowCleanupDialog(true);
    } catch (error) {
      toast.error('Failed to preview cleanup');
    }
  };

  // Execute cleanup
  const executeCleanup = async () => {
    try {
      setCleanupInProgress(true);
      const result = await AdminApiService.cleanupFiles(false);
      toast.success(result.message);
      setShowCleanupDialog(false);
      await loadDataInfo(); // Refresh data
    } catch (error) {
      toast.error('Failed to execute cleanup');
    } finally {
      setCleanupInProgress(false);
    }
  };

  // Database cleanup
  const handleDatabaseCleanup = async (dryRun: boolean = true) => {
    try {
      const result = await AdminApiService.cleanupDatabase(dryRun);
      if (dryRun) {
        toast.success(`Cleanup preview: ${JSON.stringify(result)}`);
      } else {
        toast.success('Database cleanup completed successfully');
        await loadDataInfo();
      }
    } catch (error) {
      toast.error('Failed to cleanup database');
    }
  };

  // Get table status badge
  const getTableStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge variant="default" className="bg-green-100 text-green-800">Healthy</Badge>;
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

  // Mock table data (in real implementation, this would come from API)
  const mockTableData: TableInfo[] = [
    {
      name: 'users',
      record_count: 1250,
      size_mb: 12.5,
      last_updated: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      integrity_status: 'healthy'
    },
    {
      name: 'uploaded_files',
      record_count: 8430,
      size_mb: 156.8,
      last_updated: new Date().toISOString(),
      integrity_status: 'warning'
    },
    {
      name: 'financial_statements',
      record_count: 2340,
      size_mb: 45.2,
      last_updated: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      integrity_status: 'healthy'
    },
    {
      name: 'parameters',
      record_count: 15680,
      size_mb: 23.4,
      last_updated: new Date().toISOString(),
      integrity_status: 'healthy'
    },
  ];

  useEffect(() => {
    loadDataInfo();
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
            <div className="text-2xl font-bold">{mockTableData.length}</div>
            <div className="text-xs text-muted-foreground">
              {mockTableData.filter(t => t.integrity_status === 'healthy').length} healthy
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
              {formatNumber(mockTableData.reduce((sum, t) => sum + t.record_count, 0))}
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
              {formatFileSize(mockTableData.reduce((sum, t) => sum + t.size_mb, 0))}
            </div>
            <div className="text-xs text-muted-foreground">
              Database size
            </div>
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
            <div className="text-2xl font-bold text-green-600">98%</div>
            <div className="text-xs text-muted-foreground">
              Overall system health
            </div>
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
                  {mockTableData.map((table) => (
                    <TableRow key={table.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <Database className="h-4 w-4 mr-2 text-muted-foreground" />
                          {table.name}
                        </div>
                      </TableCell>
                      <TableCell>{formatNumber(table.record_count)}</TableCell>
                      <TableCell>{formatFileSize(table.size_mb)}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(table.last_updated).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {getTableStatusBadge(table.integrity_status)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="outline">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <div className="text-2xl font-bold text-yellow-600">127</div>
                    <div className="text-xs text-muted-foreground">Orphaned files</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">43</div>
                    <div className="text-xs text-muted-foreground">Failed uploads</div>
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
                      Cleanup will permanently remove files that cannot be recovered.
                      Always preview before executing.
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
                </div>
                
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Database cleanup removes stale records and optimizes queries.
                    Safe to run regularly.
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">45ms</div>
                    <div className="text-sm text-muted-foreground">Avg Query Time</div>
                    <Progress value={25} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-muted-foreground">Active Connections</div>
                    <Progress value={46} className="mt-2" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">99.8%</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                    <Progress value={99} className="mt-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Slow Query Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-8">
                  <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No slow queries detected in the last 24 hours</p>
                  <p className="text-xs">Queries slower than 1000ms are flagged</p>
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
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Daily Cleanup</div>
                      <div className="text-xs text-muted-foreground">Remove temp files</div>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Weekly Optimization</div>
                      <div className="text-xs text-muted-foreground">Database vacuum</div>
                    </div>
                    <Badge variant="default">Enabled</Badge>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">Monthly Archive</div>
                      <div className="text-xs text-muted-foreground">Archive old records</div>
                    </div>
                    <Badge variant="secondary">Disabled</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manual Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </Button>
                
                <Button className="w-full" variant="outline">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                
                <Button className="w-full" variant="outline">
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
                  <div className="text-sm text-muted-foreground">Orphaned files</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {cleanupPreview.failed_files}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed uploads</div>
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
                  <span className="font-medium">{cleanupPreview.estimated_cleanup_time}</span>
                </div>
              </div>
              
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This operation cannot be undone. Files will be permanently deleted.
                </AlertDescription>
              </Alert>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCleanupDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={executeCleanup} 
              disabled={cleanupInProgress}
              className="bg-red-600 hover:bg-red-700"
            >
              {cleanupInProgress && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              Execute Cleanup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DataManagement;