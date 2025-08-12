import api from '../api';

export interface MaintenanceScheduleItem {
  id: string;
  name: string;
  task: 'cleanup' | 'vacuum' | 'archive' | 'reindex' | 'backup';
  schedule: string;
  enabled: boolean;
}

export interface MaintenanceSchedules {
  items: MaintenanceScheduleItem[];
}

export async function getMaintenanceSchedules(): Promise<MaintenanceSchedules> {
  const response = await api.get('/admin/maintenance/schedules');
  return response.data;
}

export async function updateMaintenanceSchedules(
  schedules: MaintenanceSchedules
): Promise<MaintenanceSchedules> {
  const response = await api.put('/admin/maintenance/schedules', schedules);
  return response.data;
}
