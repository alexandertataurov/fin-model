import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { useAdminStore } from '@/stores/adminStore';

const HealthTab: React.FC = () => {
  const { systemHealth, databaseHealth } = useAdminStore();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          {systemHealth.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">
                  {String(systemHealth.data.status).toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Timestamp</span>
                <span className="font-medium">{new Date().toLocaleString()}</span>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">No system health data.</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Health</CardTitle>
        </CardHeader>
        <CardContent>
          {databaseHealth.data ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium">
                  {String(databaseHealth.data.status || 'unknown').toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground">No database health data.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HealthTab;
