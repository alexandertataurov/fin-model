import type { LogsState } from '@/stores/admin/types';
import { useAdminData } from './useAdminData';

export const useLogFilters = () => {
  const { logs, updateLogsFilters, fetchLogsData } = useAdminData();
  const { skip, limit, total } = logs;

  const handleFilterChange = async (
    updates: Partial<Omit<LogsState, 'items' | 'total'>>
  ) => {
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

  return {
    logs,
    handleFilterChange,
    handlePrev,
    handleNext,
    handleRefresh,
  };
};

export type UseLogFiltersReturn = ReturnType<typeof useLogFilters>;
