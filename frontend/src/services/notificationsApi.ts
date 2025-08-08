import { makeApiCall } from '@/utils/apiUtils';

// Types aligned with backend schemas (snake_case keys)
export interface NotificationItem {
  id: string;
  user_id: number;
  notification_type: string;
  title: string;
  message: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | string;
  data: Record<string, any>;
  is_read: boolean;
  is_dismissed: boolean;
  created_at: string;
  read_at?: string | null;
  dismissed_at?: string | null;
  expires_at?: string | null;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  pagination: { page: number; limit: number; total: number; pages: number };
  unread_count: number;
}

export interface NotificationPreferences {
  id: string;
  user_id: number;
  email_enabled: boolean;
  push_enabled: boolean;
  in_app_enabled: boolean;
  quiet_hours_enabled: boolean;
  quiet_start_time?: string | null;
  quiet_end_time?: string | null;
  quiet_timezone: string;
  type_preferences: Record<string, boolean>;
  min_priority_email: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | string;
  min_priority_push: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | string;
  min_priority_in_app: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT' | string;
  created_at: string;
  updated_at: string;
}

export type NotificationPreferencesUpdate = Partial<
  Pick<
    NotificationPreferences,
    | 'email_enabled'
    | 'push_enabled'
    | 'in_app_enabled'
    | 'quiet_hours_enabled'
    | 'quiet_start_time'
    | 'quiet_end_time'
    | 'quiet_timezone'
    | 'type_preferences'
    | 'min_priority_email'
    | 'min_priority_push'
    | 'min_priority_in_app'
  >
>;

export interface NotificationStats {
  total_notifications: number;
  unread_notifications: number;
  recent_notifications: number;
  type_distribution: Record<string, number>;
  priority_distribution: Record<string, number>;
}

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
  unread_only?: boolean;
  notification_type?: string;
}

export const notificationsApi = {
  async getNotifications(
    params: GetNotificationsParams = {}
  ): Promise<NotificationListResponse> {
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.unread_only) query.set('unread_only', 'true');
    if (params.notification_type)
      query.set('notification_type', params.notification_type);

    const suffix = query.toString() ? `/?${query.toString()}` : '/';
    return makeApiCall(`/notifications${suffix}`);
  },

  async markAsRead(id: string): Promise<{ message: string }> {
    return makeApiCall(`/notifications/${id}/read`, { method: 'POST' });
  },

  async markAllAsRead(): Promise<{ message: string; count?: number }> {
    return makeApiCall(`/notifications/mark-all-read`, { method: 'POST' });
  },

  async dismiss(id: string): Promise<{ message: string }> {
    return makeApiCall(`/notifications/${id}/dismiss`, { method: 'POST' });
  },

  async getPreferences(): Promise<NotificationPreferences> {
    return makeApiCall(`/notifications/preferences`);
  },

  async updatePreferences(
    updates: NotificationPreferencesUpdate
  ): Promise<NotificationPreferences> {
    return makeApiCall(`/notifications/preferences`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async getStats(): Promise<NotificationStats> {
    return makeApiCall(`/notifications/stats`);
  },

  async getTypes(): Promise<{ types: string[] }> {
    return makeApiCall(`/notifications/types`);
  },
};

export default notificationsApi;
