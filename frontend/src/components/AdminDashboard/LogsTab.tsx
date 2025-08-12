import React, { memo, useMemo, useCallback } from 'react';
import { useLogFilters } from '@/hooks/useLogFilters';
import LogFilterForm from './LogFilterForm';
import { tokens } from '@/design-system/tokens';
import { applyTypographyStyle } from '@/design-system/stories/components';
import {
    applyDesignSystemSpacing,
    applyDesignSystemRadius,
    applyDesignSystemMotion
} from './utils/designSystemHelpers';
import {
    AdminCard,
    AdminTitle,
    AdminBody,
    AdminCaption
} from './components';

interface LogEntry {
  id: string;
  timestamp: string;
  level: string;
  module: string;
  message: string;
  details?: string;
}

const LogsTab: React.FC = memo(() => {
  const {
    items,
    level,
    limit,
    from,
    to,
    search,
    skip,
    total,
    handleFilterChange,
    handleRefresh,
    handlePrev,
    handleNext
  } = useLogFilters();

  // Memoized computed values
  const hasLogs = useMemo(() => items.length > 0, [items.length]);
  const logCount = useMemo(() => items.length, [items.length]);

  return (
    <AdminCard
      title="System Logs"
      variant="default"
      size="md"
    >
      <LogFilterForm
        level={level}
        limit={limit}
        from={from}
        to={to}
        search={search}
        skip={skip}
        total={total}
        onChange={handleFilterChange}
        onRefresh={handleRefresh}
        onPrev={handlePrev}
        onNext={handleNext}
      />
      <div 
        className="border rounded"
        style={{
          border: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
          borderRadius: applyDesignSystemRadius('lg'),
          marginTop: applyDesignSystemSpacing(6)
        }}
      >
        <div 
          className="max-h-96 overflow-auto"
          style={{
            maxHeight: '24rem',
            overflow: 'auto'
          }}
        >
          {hasLogs ? (
            items.map((log: LogEntry, idx: number) => (
              <div 
                key={idx} 
                className="px-3 py-2 border-b"
                style={{
                  padding: `${applyDesignSystemSpacing(2)} ${applyDesignSystemSpacing(3)}`,
                  borderBottom: `${tokens.borderWidth.base} solid ${tokens.colors.border}`,
                  transition: `all ${applyDesignSystemMotion('duration', 'normal')} ${applyDesignSystemMotion('easing', 'smooth')}`
                }}
              >
                <div 
                  className="flex items-center justify-between"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: applyDesignSystemSpacing(1)
                  }}
                >
                  <span style={applyTypographyStyle('subtitle')}>
                    [{log.level}] {log.module}
                  </span>
                  <AdminCaption>
                    {new Date(log.timestamp).toLocaleString()}
                  </AdminCaption>
                </div>
                <AdminBody>
                  {log.message}
                </AdminBody>
              </div>
            ))
          ) : (
            <div 
              className="p-4 text-center"
              style={{
                padding: applyDesignSystemSpacing(4),
                textAlign: 'center'
              }}
            >
              <AdminBody>No logs.</AdminBody>
            </div>
          )}
        </div>
      </div>
    </AdminCard>
  );
});

LogsTab.displayName = 'LogsTab';

export default LogsTab;
