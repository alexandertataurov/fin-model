import { useAdminStore } from '@/stores/adminStore';

export const useAdminData = () => {
  // Access full store state to play nicely with test mocks
  const store = useAdminStore();
  const { logs, updateLogsFilters, fetchLogsData } = store as any;
  return { logs, updateLogsFilters, fetchLogsData };
};

export type UseAdminDataReturn = ReturnType<typeof useAdminData>;
