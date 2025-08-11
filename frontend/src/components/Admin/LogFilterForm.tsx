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
import { Filter, Search, Calendar, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';

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
        <div className="space-y-6">
            {/* Filter Controls */}
            <div className="bg-gray-50/50 rounded-lg p-4 border">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="h-4 w-4 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Filter Logs</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Log Level Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Log Level</label>
                        <Select value={level} onValueChange={v => onChange({ level: v as LogsState['level'], skip: 0 })}>
                            <SelectTrigger className="w-full">
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
                    </div>

                    {/* Results Limit */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Results per page</label>
                        <Select
                            value={String(limit)}
                            onValueChange={v => onChange({ limit: Number(v), skip: 0 })}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {[50, 100, 200, 500].map(l => (
                                    <SelectItem key={l} value={String(l)}>
                                        {l} entries
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Date Range */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">From Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <DatePicker
                                value={from}
                                onChange={e => onChange({ from: e.target.value, skip: 0 })}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">To Date</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <DatePicker
                                value={to}
                                onChange={e => onChange({ to: e.target.value, skip: 0 })}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </div>

                {/* Search and Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-4 pt-4 border-t">
                    <div className="flex-1 space-y-2">
                        <label className="text-sm font-medium text-gray-700">Search Logs</label>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search log messages..."
                                value={search}
                                onChange={e => onChange({ search: e.target.value, skip: 0 })}
                                className="pl-10"
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <Button
                            onClick={onRefresh}
                            variant="outline"
                            className="bg-white hover:bg-gray-50"
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refresh
                        </Button>
                    </div>
                </div>
            </div>

            {/* Pagination and Results Info */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-lg p-4 border shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-600">
                        <span className="font-medium">
                            {total > 0
                                ? `${Math.min(skip + 1, total)}-${Math.min(skip + limit, total)} of ${total}`
                                : '0-0 of 0'}
                        </span>
                        <span className="ml-2 text-gray-500">log entries</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onPrev}
                        disabled={skip <= 0}
                        className="flex items-center gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onNext}
                        disabled={skip + limit >= total}
                        className="flex items-center gap-1"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default LogFilterForm;
