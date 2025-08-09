import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { useAdminStore } from '@/stores/adminStore';
import LogFilterForm from './LogFilterForm';

const LogsTab: React.FC = () => {
  const { logs, updateLogsFilters, fetchLogsData } = useAdminStore();
  const { items, total, skip, limit, level, from, to, search } = logs;

  const handleFilterChange = async (updates: any) => {
    updateLogsFilters(updates);
    await fetchLogsData();
  };

  const handlePrev = async () => {
    const newSkip = Math.max(0, skip - limit);
    await handleFilterChange({ skip: newSkip });
  };

  const handleNext = async () => {
    const newSkip = skip + limit;
    if (newSkip >= total) return;
    await handleFilterChange({ skip: newSkip });
  };

  const handleRefresh = async () => {
    await handleFilterChange({ skip: 0 });
  };

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
        <div className="border rounded">
          <div className="max-h-96 overflow-auto text-xs font-mono">
            {items.length > 0 ? (
              items.map((log, idx) => (
                <div key={idx} className="px-3 py-2 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">[{log.level}] {log.module}</span>
                    <span className="text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>{log.message}</div>
                </div>
              ))
            ) : (
              <div className="p-4 text-muted-foreground">No logs.</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LogsTab;
