import { useAdminStore } from '@/stores/adminStore';

export const useAdminData = () => {
  const logs = useAdminStore(state => state.logs);
  const updateLogsFilters = useAdminStore(state => state.updateLogsFilters);
  const fetchLogsData = useAdminStore(state => state.fetchLogsData);
  return { logs, updateLogsFilters, fetchLogsData };
};

export type UseAdminDataReturn = ReturnType<typeof useAdminData>;
