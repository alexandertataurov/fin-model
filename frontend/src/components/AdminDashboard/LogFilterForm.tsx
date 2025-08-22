import React, { memo, useCallback } from 'react';
import { Button } from '@/design-system/atoms';
import { Input } from '@/design-system/atoms';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/design-system/molecules';
import { RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

interface LogsState {
  level: 'ALL' | 'ERROR' | 'WARNING' | 'INFO' | 'DEBUG';
  limit: number;
  from: string;
  to: string;
  search: string;
  skip: number;
  total: number;
}

interface LogFilterFormProps {
  level: LogsState['level'];
  limit: number;
  from: string;
  to: string;
  search: string;
  skip: number;
  total: number;
  onChange: (
    updates: Partial<{
      level: LogsState['level'];
      limit: number;
      from: string;
      to: string;
      search: string;
      skip: number;
    }>
  ) => void | Promise<void>;
  onRefresh: () => void | Promise<void>;
  onPrev: () => void | Promise<void>;
  onNext: () => void | Promise<void>;
}

const LogFilterForm: React.FC<LogFilterFormProps> = memo(
  ({
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
    const handleSearchChange = useCallback(
      (value: string) => {
        onChange({ search: value, skip: 0 });
      },
      [onChange]
    );

    const handleLevelChange = useCallback(
      (value: string) => {
        onChange({ level: value as LogsState['level'], skip: 0 });
      },
      [onChange]
    );

    const handleLimitChange = useCallback(
      (value: string) => {
        onChange({ limit: parseInt(value), skip: 0 });
      },
      [onChange]
    );

    const handleFromChange = useCallback(
      (value: string) => {
        onChange({ from: value, skip: 0 });
      },
      [onChange]
    );

    const handleToChange = useCallback(
      (value: string) => {
        onChange({ to: value, skip: 0 });
      },
      [onChange]
    );

    const currentPage = Math.floor(skip / limit) + 1;
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = skip + limit < total;
    const hasPrevPage = skip > 0;

    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search logs..."
              value={search}
              onChange={e => handleSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={level} onValueChange={handleLevelChange}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Levels</SelectItem>
              <SelectItem value="ERROR">Error</SelectItem>
              <SelectItem value="WARNING">Warning</SelectItem>
              <SelectItem value="INFO">Info</SelectItem>
              <SelectItem value="DEBUG">Debug</SelectItem>
            </SelectContent>
          </Select>
          <Select value={limit.toString()} onValueChange={handleLimitChange}>
            <SelectTrigger className="w-full sm:w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            <span className="text-sm">Refresh</span>
          </Button>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="datetime-local"
              placeholder="From date"
              value={from}
              onChange={e => handleFromChange(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <Input
              type="datetime-local"
              placeholder="To date"
              value={to}
              onChange={e => handleToChange(e.target.value)}
              className="w-full"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Showing {skip + 1}-{Math.min(skip + limit, total)} of {total} logs
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onPrev}
              disabled={!hasPrevPage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={onNext}
              disabled={!hasNextPage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

LogFilterForm.displayName = 'LogFilterForm';

export default LogFilterForm;
