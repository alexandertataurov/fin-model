import React from 'react';
import { Button } from '@/design-system/components/Button';
import { Input } from '@/design-system/components/Input';
import type { LogsState } from '@/stores/admin/types';

interface LogFilterFormProps {
  level: LogsState['level'];
  limit: number;
  from: string;
  to: string;
  search: string;
  total: number;
  skip: number;
  onFilterChange: (
    updates: Partial<Omit<LogsState, 'items' | 'total'>>
  ) => Promise<void> | void;
  onPrev: () => Promise<void> | void;
  onNext: () => Promise<void> | void;
  onRefresh: () => Promise<void> | void;
}

const levels: LogsState['level'][] = [
  'DEBUG',
  'INFO',
  'WARNING',
  'ERROR',
  'CRITICAL',
];

const limits = [50, 100, 200, 500];

const LogFilterForm: React.FC<LogFilterFormProps> = ({
  level,
  limit,
  from,
  to,
  search,
  total,
  skip,
  onFilterChange,
  onPrev,
  onNext,
  onRefresh,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <select
        className="border rounded px-2 py-1 bg-background text-sm"
        value={level}
        onChange={e =>
          onFilterChange({ level: e.target.value as any, skip: 0 })
        }
      >
        {levels.map(l => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <select
        className="border rounded px-2 py-1 bg-background text-sm"
        value={limit}
        onChange={e =>
          onFilterChange({ limit: Number(e.target.value), skip: 0 })
        }
      >
        {limits.map(l => (
          <option key={l} value={l}>
            {l}
          </option>
        ))}
      </select>
      <Input
        type="date"
        className="w-40"
        value={from}
        onChange={e => onFilterChange({ from: e.target.value, skip: 0 })}
      />
      <Input
        type="date"
        className="w-40"
        value={to}
        onChange={e => onFilterChange({ to: e.target.value, skip: 0 })}
      />
      <Input
        type="text"
        placeholder="Search"
        className="w-40"
        value={search}
        onChange={e => onFilterChange({ search: e.target.value, skip: 0 })}
      />
      <Button size="sm" variant="outline" onClick={onRefresh}>
        Refresh Logs
      </Button>
      <div className="ml-auto flex items-center gap-2 text-xs">
        <span>
          {total > 0
            ? `${Math.min(skip + 1, total)}-${Math.min(skip + limit, total)} of ${total}`
            : '0-0 of 0'}
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onPrev}
          disabled={skip <= 0}
        >
          Prev
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onNext}
          disabled={skip + limit >= total}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default LogFilterForm;
