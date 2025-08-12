import React, { memo, useMemo, useCallback } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';
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
    AdminCard,
    AdminTitle,
    AdminBody,
    AdminCaption
} from './components';

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
      <AdminCard
        title="System Health"
        variant="default"
        size="md"
      >
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
              <AdminCaption>Status</AdminCaption>
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
              <AdminCaption>Timestamp</AdminCaption>
              <span style={applyTypographyStyle('subtitle')}>
                {new Date().toLocaleString()}
              </span>
            </div>
          </div>
        ) : (
          <AdminBody>No system health data.</AdminBody>
        )}
      </AdminCard>

      <AdminCard
        title="Database Health"
        variant="default"
        size="md"
      >
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
              <AdminCaption>Status</AdminCaption>
              <span style={applyTypographyStyle('subtitle')}>
                {databaseStatus}
              </span>
            </div>
          </div>
        ) : (
          <AdminBody>No database health data.</AdminBody>
        )}
      </AdminCard>
    </div>
  );
});

HealthTab.displayName = 'HealthTab';

export default HealthTab;
