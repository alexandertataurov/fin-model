import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await authApi.refreshToken(refreshToken);
          localStorage.setItem('auth_token', response.access_token);

          // Retry the original request
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
          return api.request(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
}

export interface RegisterRequest {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_verified: boolean;
  last_login: string | null;
  failed_login_attempts: number;
  created_at: string;
  updated_at: string;
}

export interface PasswordChangeRequest {
  current_password: string;
  new_password: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirmRequest {
  token: string;
  new_password: string;
}

export interface UserPermissions {
  user_id: number;
  roles: string[];
  permissions: string[];
  is_admin: boolean;
  is_analyst: boolean;
}

export const authApi = {
  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  async register(userData: RegisterRequest): Promise<User> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout');
  },

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const response = await api.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  // User management
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async getUserPermissions(): Promise<UserPermissions> {
    const response = await api.get('/admin/permissions');
    return response.data;
  },

  async changePassword(passwordData: PasswordChangeRequest): Promise<void> {
    await api.post('/auth/change-password', passwordData);
  },

  async requestPasswordReset(email: string): Promise<void> {
    await api.post('/auth/request-password-reset', { email });
  },

  async resetPassword(resetData: PasswordResetConfirmRequest): Promise<void> {
    await api.post('/auth/reset-password', resetData);
  },

  async verifyEmail(token: string): Promise<void> {
    await api.post('/auth/verify-email', { token });
  },

  // Admin endpoints
  async getUsers(skip = 0, limit = 100): Promise<User[]> {
    const response = await api.get('/admin/users', {
      params: { skip, limit },
    });
    return response.data;
  },

  async getUser(userId: number): Promise<User> {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data;
  },

  async updateUser(userId: number, userData: Partial<User>): Promise<User> {
    const response = await api.put(`/admin/users/${userId}`, userData);
    return response.data;
  },

  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/admin/users/${userId}`);
  },

  async assignRole(userId: number, role: string): Promise<void> {
    await api.post(`/admin/users/${userId}/roles/${role}`);
  },

  async removeRole(userId: number, role: string): Promise<void> {
    await api.delete(`/admin/users/${userId}/roles/${role}`);
  },

  async getAuditLogs(skip = 0, limit = 100, userId?: number, action?: string) {
    const params: Record<string, unknown> = { skip, limit };
    if (userId) params.user_id = userId;
    if (action) params.action = action;

    const response = await api.get('/admin/audit-logs', { params });
    return response.data;
  },

  async getSystemHealth() {
    const response = await api.get('/admin/system/health');
    return response.data;
  },
};

// Password strength checker
export const checkPasswordStrength = (password: string) => {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+=[\]{}|;:,.<>?-]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const strength = score < 3 ? 'weak' : score < 5 ? 'medium' : 'strong';

  return {
    strength,
    score,
    checks,
    isValid: score >= 4, // Require at least 4 out of 5 checks to pass
  };
};

export default api;
