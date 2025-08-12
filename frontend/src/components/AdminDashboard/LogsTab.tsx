import React, { memo, useMemo, useCallback } from 'react';
import { useLogFilters } from '@/hooks/useLogFilters';
import LogFilterForm from './LogFilterForm';
import { tokens } from '@/design-system/tokens';
import { applyTextStyle } from '@/design-system/utils/typography';
import {
  applyDesignSystemSpacing,
  applyDesignSystemRadius,
  applyDesignSystemMotion
} from './utils/designSystemHelpers';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';

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
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
      </CardHeader>
      <CardContent>
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
                    <span style={applyTextStyle('subtitle')}>
                      [{log.level}] {log.module}
                    </span>
                    <span style={applyTextStyle('caption')}>
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p style={applyTextStyle('body')}>
                    {log.message}
                  </p>
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
                <p style={applyTextStyle('body')}>No logs.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

LogsTab.displayName = 'LogsTab';

export default LogsTab;
