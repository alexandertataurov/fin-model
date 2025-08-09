import React from 'react';
import { Button } from '@/design-system/components/Button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/design-system/components/Select';
import { Input } from '@/design-system/components/Input';
import { DatePicker } from '@/design-system/components/DatePicker';
import type { LogsState } from '@/stores/admin/types';

interface LogFilterFormProps {
  level: LogsState['level'];
  limit: number;
  from: string;
  to: string;
  search: string;
  skip: number;
  total: number;
  onChange: (updates: Partial<{
    level: LogsState['level'];
    limit: number;
    from: string;
    to: string;
    search: string;
    skip: number;
  }>) => void | Promise<void>;
  onRefresh: () => void | Promise<void>;
  onPrev: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
}

const LogFilterForm: React.FC<LogFilterFormProps> = ({
  level,
  limit,
  from,
  to,
  search,
  skip,
  total,
  onChange,
  onRefresh,
  onPrev,
  onNext,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
        <Select value={level} onValueChange={v => onChange({ level: v as LogsState['level'], skip: 0 })}>
        <SelectTrigger className="w-[110px]">
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
        onValueChange={v => onChange({ limit: Number(v), skip: 0 })}
      >
        <SelectTrigger className="w-[90px]">
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

      <DatePicker value={from} onChange={e => onChange({ from: e.target.value, skip: 0 })} />
      <DatePicker value={to} onChange={e => onChange({ to: e.target.value, skip: 0 })} />
      <Input
        type="text"
        placeholder="Search"
        value={search}
        onChange={e => onChange({ search: e.target.value, skip: 0 })}
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
        <Button size="sm" variant="outline" onClick={onPrev} disabled={skip <= 0}>
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
