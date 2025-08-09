import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Badge } from '@/design-system/components/Badge';
import { Progress } from '@/design-system/components/Progress';
import { Alert, AlertDescription } from '@/design-system/components/Alert';
import { useAdminStore } from '@/stores/adminStore';
import { StatsSkeleton } from '@/components/ui/LoadingSkeleton';
import {
  CheckCircle,
  Cpu,
  HardDrive,
  Clock,
  Zap,
  Bell,
} from 'lucide-react';

const OverviewTab: React.FC = () => {
  const { systemStats, userActivity, systemMetrics, systemHealth } = useAdminStore();

  const formatPercentage = (value: number | null | undefined): string => {
    if (value === null || value === undefined || Number.isNaN(value)) {
      return 'N/A';
    }
    return `${value.toFixed(1)}%`;
  };

  const formatNumber = (num: number | null | undefined): string => {
    if (num === null || num === undefined || Number.isNaN(num as number)) {
      return '0';
    }
    return (num as number).toLocaleString();
  };

  const getStatusBadge = (isActive: boolean, isVerified: boolean) => {
    if (!isActive) return <Badge variant="destructive">Inactive</Badge>;
    if (!isVerified) return <Badge variant="secondary">Unverified</Badge>;
    return <Badge variant="default">Active</Badge>;
  };

  const hasAnyData =
    !!systemStats.data ||
    !!systemMetrics.data ||
    (userActivity.data && userActivity.data.length > 0);

  const isLoading =
    systemStats.loading || userActivity.loading || systemMetrics.loading;

  if (isLoading && !hasAnyData) {
    return <StatsSkeleton />;
  }

  if (!hasAnyData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Alert className="max-w-md">
          <AlertDescription>
            Admin data is currently unavailable. Please try refreshing the page or check your connection.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
                    className={`w-3 h-3 rounded-full mr-2 ${
                      systemHealth?.data?.status === 'healthy'
                        ? 'bg-green-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <span className="text-sm font-medium">Database</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {systemHealth?.data?.status
                    ? String(systemHealth.data.status).toUpperCase()
                    : 'UNKNOWN'}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      systemMetrics.data?.cpu_usage &&
                      systemMetrics.data.cpu_usage > 80
                        ? 'bg-red-500'
                        : systemMetrics.data?.cpu_usage &&
                          systemMetrics.data.cpu_usage > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <span className="text-sm font-medium">CPU</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatPercentage(systemMetrics.data?.cpu_usage ?? null)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      systemMetrics.data?.memory_usage &&
                      systemMetrics.data.memory_usage > 80
                        ? 'bg-red-500'
                        : systemMetrics.data?.memory_usage &&
                          systemMetrics.data.memory_usage > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <span className="text-sm font-medium">Memory</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatPercentage(systemMetrics.data?.memory_usage ?? null)}
                </div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      systemMetrics.data?.disk_usage &&
                      systemMetrics.data.disk_usage > 80
                        ? 'bg-red-500'
                        : systemMetrics.data?.disk_usage &&
                          systemMetrics.data.disk_usage > 60
                        ? 'bg-yellow-500'
                        : 'bg-green-500'
                    }`}
                  />
                  <span className="text-sm font-medium">Disk</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatPercentage(systemMetrics.data?.disk_usage ?? null)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Cpu className="h-4 w-4" /> CPU
              </div>
              <span className="font-medium">
                {formatPercentage(systemMetrics.data?.cpu_usage ?? null)}
              </span>
            </div>
            <Progress value={systemMetrics.data?.cpu_usage || 0} />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <HardDrive className="h-4 w-4" /> Disk
              </div>
              <span className="font-medium">
                {formatPercentage(systemMetrics.data?.disk_usage ?? null)}
              </span>
            </div>
            <Progress value={systemMetrics.data?.disk_usage || 0} />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Zap className="h-4 w-4" /> Requests/24h
              </div>
              <span className="font-medium">
                {formatNumber(systemMetrics.data?.request_count_24h)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Bell className="h-4 w-4" /> Error Rate
              </div>
              <span className="font-medium">
                {formatPercentage(systemMetrics.data?.error_rate_24h ?? null)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" /> Avg Response
              </div>
              <span className="font-medium">
                {formatNumber(systemMetrics.data?.avg_response_time)} ms
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>User Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {userActivity.data && userActivity.data.length > 0 ? (
              <div className="space-y-4">
                {userActivity.data.slice(0, 5).map(user => (
                  <div key={user.user_id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        Last login: {new Date(user.last_login).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(user.is_active, true)}
                      <p className="text-xs text-muted-foreground">
                        {user.login_count} logins
                      </p>
                    </div>
                  </div>
                ))}
                {userActivity.data.length > 5 && (
                  <Button variant="link" className="p-0 h-auto text-sm">
                    View All
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No recent user activity
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemMetrics.data?.cpu_usage && systemMetrics.data.cpu_usage > 90 && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  High CPU Usage detected. Consider scaling up resources.
                </div>
              )}
              {systemMetrics.data?.memory_usage && systemMetrics.data.memory_usage > 90 && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  High Memory Usage detected.
                </div>
              )}
              {systemMetrics.data?.disk_usage && systemMetrics.data.disk_usage > 90 && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  Disk Usage approaching limit.
                </div>
              )}
              {systemMetrics.data?.error_rate_24h && systemMetrics.data.error_rate_24h > 5 && (
                <div className="p-4 rounded-lg bg-destructive/10 text-destructive text-sm">
                  High Error Rate detected.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OverviewTab;
