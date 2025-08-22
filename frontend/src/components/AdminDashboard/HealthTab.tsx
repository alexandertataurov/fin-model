import React, { memo, useMemo, useCallback } from 'react';
import { useAdminStore } from '@/stores/admin';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/molecules';
import { Badge } from '@/design-system/atoms';

const HealthTab: React.FC = memo(() => {
  const { systemHealth, databaseHealth, fetchHealthData } = useAdminStore();

  const healthStatus = useMemo(() => {
    if (!systemHealth.data) return 'Unknown';
    return systemHealth.data.status === 'healthy' ? 'Healthy' : 'Unhealthy';
  }, [systemHealth.data]);

  const databaseStatus = useMemo(() => {
    if (!databaseHealth.data) return 'Unknown';
    return databaseHealth.data.status === 'healthy' ? 'Healthy' : 'Unhealthy';
  }, [databaseHealth.data]);

  const _handleRefresh = useCallback(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          {systemHealth.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={
                    healthStatus === 'Healthy' ? 'success' : 'destructive'
                  }
                >
                  {healthStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Timestamp</span>
                <span className="text-sm font-medium text-foreground">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No system health data.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Health</CardTitle>
        </CardHeader>
        <CardContent>
          {databaseHealth.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge
                  variant={
                    databaseStatus === 'Healthy' ? 'success' : 'destructive'
                  }
                >
                  {databaseStatus}
                </Badge>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground">No database health data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

HealthTab.displayName = 'HealthTab';

export default HealthTab;
