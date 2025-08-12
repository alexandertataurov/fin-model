import React, { memo, useMemo } from 'react';
import { useAdminStore } from '@/stores/adminStore';
import { tokens } from '@/design-system/tokens';
import {
    applyDesignSystemSpacing
} from './utils/designSystemHelpers';
import {
    AdminCard,
    AdminTitle,
    AdminBody,
    AdminCaption
} from './components';

const HealthTab: React.FC = memo(() => {
  const { systemHealth, databaseHealth } = useAdminStore();

  // Memoized computed values
  const healthStatus = useMemo(() => {
    if (!systemHealth.data) return 'unknown';
    return String(systemHealth.data.status).toUpperCase();
  }, [systemHealth.data]);

  const databaseStatus = useMemo(() => {
    if (!databaseHealth) return 'unknown';
    return databaseHealth.status || 'unknown';
  }, [databaseHealth]);

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
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: applyDesignSystemSpacing(4),
              fontSize: tokens.typography.fontSize.sm,
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
              <span 
                className="font-medium"
                style={{
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: tokens.colors.foreground
                }}
              >
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
              <span 
                className="font-medium"
                style={{
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: tokens.colors.foreground
                }}
              >
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
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(1, 1fr)',
              gap: applyDesignSystemSpacing(4),
              fontSize: tokens.typography.fontSize.sm,
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
              <span 
                className="font-medium"
                style={{
                  fontWeight: tokens.typography.fontWeight.medium,
                  color: tokens.colors.foreground
                }}
              >
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
