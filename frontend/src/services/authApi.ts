import axios from 'axios';

// Temporarily use direct Railway URL to isolate proxy issues
const API_BASE_URL = 'https://fin-model-production.up.railway.app';

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
    const token = localStorage.getItem('access_token');
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
          localStorage.setItem('access_token', response.access_token);

          // Retry the original request
          const originalRequest = error.config;
          originalRequest.headers.Authorization = `Bearer ${response.access_token}`;
          return api.request(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_data');
          window.location.href = '/login';
        }
      } else {
        // No refresh token, redirect to login
        localStorage.removeItem('access_token');
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
  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      console.log('🏥 Checking backend health...');
      const response = await fetch(`${API_BASE_URL}/health`);
      console.log(
        '✅ Backend health check successful:',
        response.status,
        response.ok
      );
      if (response.ok) {
        const data = await response.json();
        console.log('🏥 Health data:', data);
      }
      return response.ok;
    } catch (error) {
      console.error('❌ Backend health check failed:', error);
      return false;
    }
  },

  // Authentication
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    console.log('🔐 Attempting login with credentials:', {
      email: credentials.email,
      remember_me: credentials.remember_me,
    });
    console.log('🌐 API Base URL:', API_BASE_URL);
    console.log('📡 Making request to:', `${API_BASE_URL}/api/v1/auth/login`);

    // Test backend connection first
    await this.testBackendConnection();

    // First check if backend is reachable
    const isHealthy = await this.healthCheck();
    if (!isHealthy) {
      throw new Error(
        'Backend is not reachable. Please check your connection.'
      );
    }

    try {
      const response = await api.post('/auth/login', credentials);
      console.log('✅ Login successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Login failed:', error);
      console.error('❌ Error response:', error.response?.data);
      console.error('❌ Error status:', error.response?.status);
      throw error;
    }
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

  // Test backend connection
  async testBackendConnection(): Promise<void> {
    try {
      console.log('🧪 Testing backend connection...');

      // Test 1: Direct fetch to health endpoint
      const healthResponse = await fetch(`${API_BASE_URL}/health`);
      console.log(
        '🏥 Health endpoint response:',
        healthResponse.status,
        healthResponse.ok
      );

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log('🏥 Health data:', healthData);
      } else {
        console.log('🏥 Health endpoint error:', await healthResponse.text());
      }

      // Test 2: Register a test user
      console.log('📝 Registering test user...');
      const registerResponse = await fetch(
        `${API_BASE_URL}/api/v1/auth/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: 'test@example.com',
            username: 'testuser',
            first_name: 'Test',
            last_name: 'User',
            password: 'TestPassword123!',
          }),
        }
      );
      console.log(
        '📝 Register response:',
        registerResponse.status,
        registerResponse.ok
      );

      if (registerResponse.ok) {
        const registerData = await registerResponse.json();
        console.log('📝 Register data:', registerData);

        // Test 3: Verify the user
        console.log('✅ Verifying test user...');
        const verifyResponse = await fetch(
          `${API_BASE_URL}/api/v1/auth/dev-verify-user`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: 'test@example.com',
            }),
          }
        );
        console.log(
          '✅ Verify response:',
          verifyResponse.status,
          verifyResponse.ok
        );

        if (verifyResponse.ok) {
          const verifyData = await verifyResponse.json();
          console.log('✅ Verify data:', verifyData);

          // Test 4: Login with verified user
          console.log('🔐 Testing login with verified user...');
          const loginResponse = await fetch(
            `${API_BASE_URL}/api/v1/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: 'test@example.com',
                password: 'TestPassword123!',
              }),
            }
          );
          console.log(
            '🔐 Login response:',
            loginResponse.status,
            loginResponse.ok
          );

          const loginText = await loginResponse.text();
          console.log('🔐 Login response body:', loginText);

          if (loginResponse.ok) {
            console.log('🎉 SUCCESS: Login worked with verified user!');
          } else {
            console.log('❌ Login failed even with verified user:', {
              status: loginResponse.status,
              statusText: loginResponse.statusText,
              body: loginText,
            });
          }
        } else {
          const verifyText = await verifyResponse.text();
          console.log('❌ Verify failed:', verifyText);
        }
      } else {
        const registerText = await registerResponse.text();
        console.log('❌ Register failed:', registerText);
      }
    } catch (error) {
      console.error('❌ Backend connection test failed:', error);
    }
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
