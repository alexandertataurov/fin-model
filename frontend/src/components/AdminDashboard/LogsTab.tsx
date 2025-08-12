import React, { memo, useMemo, useCallback } from 'react';
import { useLogFilters } from '@/hooks/useLogFilters';
import LogFilterForm from './LogFilterForm';
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
    logs,
    handleFilterChange,
    handleRefresh,
    handlePrev,
    handleNext
  } = useLogFilters();

  // Memoized computed values
  const hasLogs = useMemo(() => logs.items?.length > 0, [logs.items?.length]);
  const logCount = useMemo(() => logs.items?.length || 0, [logs.items?.length]);

  // Wrapper function to handle type conversion
  const handleFormChange = useCallback((updates: any) => {
    handleFilterChange(updates);
  }, [handleFilterChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Logs</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <LogFilterForm
          level={logs.level as any}
          limit={logs.limit}
          from={logs.from}
          to={logs.to}
          search={logs.search}
          skip={logs.skip}
          total={logs.total}
          onChange={handleFormChange}
          onRefresh={handleRefresh}
          onPrev={handlePrev}
          onNext={handleNext}
        />
        <div className="border border-border rounded-lg mt-6">
          <div className="max-h-96 overflow-auto">
            {hasLogs ? (
              logs.items?.map((log: LogEntry, idx: number) => (
                <div
                  key={idx}
                  className="px-3 py-2 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-foreground">
                      [{log.level}] {log.module}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">
                    {log.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center">
                <p className="text-sm text-muted-foreground">No logs.</p>
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
