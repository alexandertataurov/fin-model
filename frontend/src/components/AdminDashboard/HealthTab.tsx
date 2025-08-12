import React, { memo, useMemo, useCallback } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/utils/typography';
import {
    applyDesignSystemSpacing
} from './utils/designSystemHelpers';
import {
    Heart,
    Activity,
    Cpu,
    HardDrive,
    Database,
    Wifi,
    AlertCircle,
    CheckCircle,
    Clock,
    RefreshCw
} from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/design-system/components/Card';

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

  const handleRefresh = useCallback(() => {
    fetchHealthData();
  }, [fetchHealthData]);

  return (
    <div 
      className="space-y-4"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: applyDesignSystemSpacing(4)
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          {systemHealth.data ? (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: applyDesignSystemSpacing(4),
                '@media (min-width: 768px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)'
                }
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={applyTypographyStyle('caption')}>Status</span>
                <span style={applyTypographyStyle('subtitle')}>
                  {healthStatus}
                </span>
              </div>
              <div 
                className="flex items-center justify-between"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={applyTypographyStyle('caption')}>Timestamp</span>
                <span style={applyTypographyStyle('subtitle')}>
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          ) : (
            <p style={applyTypographyStyle('body')}>No system health data.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Database Health</CardTitle>
        </CardHeader>
        <CardContent>
          {databaseHealth.data ? (
            <div 
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(1, 1fr)',
                gap: applyDesignSystemSpacing(4),
                '@media (min-width: 768px)': {
                  gridTemplateColumns: 'repeat(2, 1fr)'
                }
              }}
            >
              <div 
                className="flex items-center justify-between"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={applyTypographyStyle('caption')}>Status</span>
                <span style={applyTypographyStyle('subtitle')}>
                  {databaseStatus}
                </span>
              </div>
            </div>
          ) : (
            <p style={applyTypographyStyle('body')}>No database health data.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
});

HealthTab.displayName = 'HealthTab';

export default HealthTab;
