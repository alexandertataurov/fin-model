import api from '../api';

export async function getAdminOverviewReport(
  format: 'json' | 'csv' = 'json'
): Promise<any> {
  const response = await api.get('/admin/reports/overview', {
    params: { format },
    responseType: format === 'csv' ? 'blob' : 'json',
  });
  return response.data;
}
