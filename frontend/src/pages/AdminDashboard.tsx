import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Database,
  Activity,
  Shield,
  Settings,
  FileText,
  AlertCircle,
  TrendingUp,
  Server,
  HardDrive,
  Cpu,
  RefreshCw,
  Download,
  Trash2,
  UserCheck,
  UserX,
  Mail,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/design-system/components/Tabs';
import { Progress } from '@/design-system/components/Progress';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { useAuth } from '@/contexts/AuthContext';
import AdminApiService, { 
  SystemStats, 
  UserActivity, 
  SystemMetrics, 
  DataIntegrityCheck,
  SecurityAudit,
  UserWithRoles
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
  const [systemMetrics, setSystemMetrics] = useState<SystemMetrics | null>(null);
  const [dataIntegrity, setDataIntegrity] = useState<DataIntegrityCheck[]>([]);
  const [securityAudit, setSecurityAudit] = useState<SecurityAudit | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);

  // Load admin data
  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load all admin data in parallel
      const [stats, activity, metrics, integrity, audit] = await Promise.all([
        AdminApiService.getSystemStats(),
        AdminApiService.getUserActivity(20),
        AdminApiService.getSystemMetrics(),
        AdminApiService.checkDataIntegrity(),
        AdminApiService.getSecurityAudit()
      ]);
      
      setSystemStats(stats);
      setUserActivity(activity);
      setSystemMetrics(metrics);
      setDataIntegrity(integrity);
      setSecurityAudit(audit);
      
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast.error('Failed to load admin dashboard data. Some data may not be available.');
      
      // Set default/empty values to prevent crashes
      setSystemStats(null);
      setUserActivity([]);
      setSystemMetrics(null);
      setDataIntegrity([]);
      setSecurityAudit(null);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAdminData();
    setRefreshing(false);
    toast.success('Admin dashboard refreshed');
  };

  // Format percentage for display
  const formatPercentage = (value: number | null): string => {
    return value !== null ? `${value.toFixed(1)}%` : 'N/A';
  };

  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
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
      toast.success(`Cleanup preview: ${result.orphaned_files} orphaned files, ${result.failed_files} failed files found`);
    } catch (error) {
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
      toast.success(`${result.message} (${result.cleared_records} records cleared)`);
    } catch (error) {
      toast.error('Failed to clear rate limits');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadAdminData();
  }, []);

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
              <p className="text-muted-foreground">System administration and monitoring</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
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
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
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
            <TabsTrigger value="database" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>Database</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" className="flex items-center space-x-2">
              <Settings className="h-4 w-4" />
              <span>Maintenance</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {systemStats ? (
              <>
                {/* Key Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Total Users
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(systemStats.users.total)}</div>
                      <div className="text-xs text-muted-foreground">
                        {systemStats.users.active} active, {systemStats.users.verified} verified
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <FileText className="h-4 w-4 mr-2" />
                        Files Processed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(systemStats.files.total)}</div>
                      <div className="text-xs text-muted-foreground">
                        {systemStats.files.completed} completed, {systemStats.files.failed} failed
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        Financial Data
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{formatNumber(systemStats.financial_data.statements)}</div>
                      <div className="text-xs text-muted-foreground">
                        statements, {systemStats.financial_data.parameters} parameters
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium flex items-center">
                        <HardDrive className="h-4 w-4 mr-2" />
                        Database Size
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{systemStats.system.database_size}</div>
                      <div className="text-xs text-muted-foreground">
                        Avg file: {systemStats.performance.avg_file_size_mb}MB
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* System Metrics */}
                {systemMetrics && (
                  <Card>
                    <CardHeader>
                      <CardTitle>System Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>CPU Usage</span>
                            <span>{formatPercentage(systemMetrics.cpu_usage)}</span>
                          </div>
                          <Progress value={systemMetrics.cpu_usage || 0} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Memory Usage</span>
                            <span>{formatPercentage(systemMetrics.memory_usage)}</span>
                          </div>
                          <Progress value={systemMetrics.memory_usage || 0} />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Disk Usage</span>
                            <span>{formatPercentage(systemMetrics.disk_usage)}</span>
                          </div>
                          <Progress value={systemMetrics.disk_usage || 0} />
                        </div>
                      </div>
                      <div className="mt-4 text-sm text-muted-foreground">
                        Active DB connections: {systemMetrics.active_connections}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recent User Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent User Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {userActivity.slice(0, 5).map((activity) => (
                        <div key={activity.user_id} className="flex items-center justify-between p-2 rounded border">
                          <div>
                            <span className="font-medium">{activity.username}</span>
                            <div className="text-xs text-muted-foreground">
                              {activity.files_uploaded} files, {activity.models_created} models
                            </div>
                          </div>
                          {getStatusBadge(activity.is_active, true)}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            ) : (
              <div className="flex items-center justify-center py-12">
                <Alert className="max-w-md">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Admin data is currently unavailable. Please try refreshing the page or check your connection.
                  </AlertDescription>
                </Alert>
              </div>
            )}
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

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-4">
            {securityAudit && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Audit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{securityAudit.failed_logins_24h}</div>
                      <div className="text-sm text-muted-foreground">Failed logins (24h)</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{securityAudit.rate_limit_violations}</div>
                      <div className="text-sm text-muted-foreground">Rate limit violations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{securityAudit.password_policy_violations}</div>
                      <div className="text-sm text-muted-foreground">Policy violations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{securityAudit.suspicious_activities.length}</div>
                      <div className="text-sm text-muted-foreground">Suspicious activities</div>
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
                    Clear rate limiting records to restore access for blocked users.
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