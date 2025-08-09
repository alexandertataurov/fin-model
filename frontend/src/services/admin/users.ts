import api from '../api';
import { AdminDataTransformer, NormalizedUserActivity } from '@/types/admin';

export interface UserActivity {
  user_id: number;
  username: string;
  last_login: string | null;
  login_count: number;
  files_uploaded: number;
  models_created: number;
  is_active: boolean;
}

export interface UserWithRoles {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  roles: string[];
}

export interface UserPermissions {
  user_id: number;
  roles: string[];
  permissions: string[];
  is_admin: boolean;
  is_analyst: boolean;
}

export interface BulkActionResult {
  message: string;
  results: {
    success: number;
    failed: number;
    errors: string[];
  };
  total_users: number;
}

export async function getUserActivity(
  limit = 50,
  activeOnly = false
): Promise<UserActivity[]> {
  const params: Record<string, unknown> = { limit };
  if (activeOnly) params.active_only = true;
  const response = await api.get('/admin/users/activity-list', { params });
  return response.data;
}

export async function getNormalizedUserActivity(
  limit = 50,
  activeOnly = false
): Promise<NormalizedUserActivity[]> {
  const params: Record<string, unknown> = { limit };
  if (activeOnly) params.active_only = true;
  const response = await api.get('/admin/users/activity-list', { params });
  return AdminDataTransformer.normalizeUserActivity(response.data);
}

export async function listUsers(
  skip = 0,
  limit = 100,
  envelope = false
): Promise<
  | UserWithRoles[]
  | { items: UserWithRoles[]; skip: number; limit: number; total: number }
> {
  const response = await api.get('/admin/users', {
    params: { skip, limit, envelope },
  });
  return response.data;
}

export async function getUser(userId: number): Promise<UserWithRoles> {
  const response = await api.get(`/admin/users/${userId}`);
  return response.data;
}

export async function updateUser(
  userId: number,
  updates: Partial<{
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    is_active: boolean;
  }>
): Promise<UserWithRoles | any> {
  const response = await api.put(`/admin/users/${userId}`, updates);
  return response.data;
}

export async function createUser(payload: {
  email: string;
  username: string;
  first_name?: string;
  last_name?: string;
  password: string;
  role?: 'admin' | 'analyst' | 'viewer' | 'editor';
}): Promise<UserWithRoles | any> {
  const response = await api.post('/admin/users', payload);
  return response.data;
}

export async function deleteUser(userId: number): Promise<{ message: string }> {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
}

export async function assignRole(
  userId: number,
  role: string
): Promise<{ message: string }> {
  const response = await api.post(`/admin/users/${userId}/roles/${role}`);
  return response.data;
}

export async function removeRole(
  userId: number,
  role: string
): Promise<{ message: string }> {
  const response = await api.delete(`/admin/users/${userId}/roles/${role}`);
  return response.data;
}

export async function getUserPermissions(): Promise<UserPermissions> {
  const response = await api.get('/admin/permissions');
  return response.data;
}

export async function bulkUserAction(
  userIds: number[],
  action: 'activate' | 'deactivate' | 'verify' | 'send_reminder'
): Promise<BulkActionResult> {
  const response = await api.post('/admin/users/bulk-action', {
    user_ids: userIds,
    action,
  });
  return response.data;
}
