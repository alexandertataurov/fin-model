import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/design-system/components/Card';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/components/Select';
import { useAdminStore } from '@/stores/adminStore';

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
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Select
            value={level}
            onValueChange={val => handleFilterChange({ level: val, skip: 0 })}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['DEBUG', 'INFO', 'WARNING', 'ERROR', 'CRITICAL'].map(l => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(limit)}
            onValueChange={val =>
              handleFilterChange({ limit: Number(val), skip: 0 })
            }
          >
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[50, 100, 200, 500].map(l => (
                <SelectItem key={l} value={String(l)}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={from}
            onChange={e => handleFilterChange({ from: e.target.value, skip: 0 })}
            className="w-40"
          />
          <Input
            type="date"
            value={to}
            onChange={e => handleFilterChange({ to: e.target.value, skip: 0 })}
            className="w-40"
          />
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={e => handleFilterChange({ search: e.target.value, skip: 0 })}
            className="w-40"
          />
          <Button size="sm" variant="outline" onClick={handleRefresh}>
            Refresh Logs
          </Button>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span>
              {total > 0
                ? `${Math.min(skip + 1, total)}-${Math.min(skip + limit, total)} of ${total}`
                : '0-0 of 0'}
            </span>
            <Button size="sm" variant="outline" onClick={handlePrev} disabled={skip <= 0}>
              Prev
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleNext}
              disabled={skip + limit >= total}
            >
              Next
            </Button>
          </div>
        </div>
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
