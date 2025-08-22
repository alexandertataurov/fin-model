export interface UserWithRoles {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  status: 'active' | 'inactive' | 'suspended';
  createdAt: string;
  lastLogin: string | null;
  avatar?: string;
  department?: string;
  permissions: string[];
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  newUsers: number;
  userGrowth: number;
  averageSessionDuration?: number;
  retentionRate?: number;
}

export interface UserActivity {
  id: string;
  userId: string;
  type:
    | 'login'
    | 'logout'
    | 'profile_update'
    | 'password_change'
    | 'role_change'
    | 'data_access'
    | 'system_action';
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface UserTableProps {
  users: UserWithRoles[];
  onUserUpdate: (userId: string, updates: Partial<UserWithRoles>) => void;
  onUserDelete: (userId: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export interface UserTableRowProps {
  user: UserWithRoles;
  onUpdate: (userId: string, updates: Partial<UserWithRoles>) => void;
  onDelete: (userId: string) => void;
  isLoading?: boolean;
}

export interface UserAnalyticsCardProps {
  analytics: UserAnalytics;
  isLoading?: boolean;
  error?: string | null;
}

export interface UserAnalyticsGridProps {
  analytics: UserAnalytics;
  isLoading?: boolean;
  error?: string | null;
}

export interface UserActivityCardProps {
  activities: UserActivity[];
  isLoading?: boolean;
  error?: string | null;
  maxItems?: number;
}
