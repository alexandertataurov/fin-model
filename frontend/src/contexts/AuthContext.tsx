import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';
import { authApi } from '../services/authApi';

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
  roles?: string[];
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: string[];
  roles: string[];
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
    rememberMe?: boolean
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<boolean>;
  refreshToken: () => Promise<boolean>;
  updateUser: (userData: Partial<User>) => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
  isAnalyst: () => boolean;
}

export interface RegisterData {
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  permissions: string[];
  roles: string[];
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_KEY = 'user_data';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem(TOKEN_KEY),
    refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY),
    permissions: [],
    roles: [],
    isLoading: true,
  });

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      console.log('Loading user data on mount...');
      const storedUser = localStorage.getItem(USER_KEY);
      const storedToken = localStorage.getItem(TOKEN_KEY);
      console.log('Stored user:', storedUser ? 'found' : 'not found');
      console.log('Stored token:', storedToken ? 'found' : 'not found');

      if (storedUser && storedToken) {
        try {
          console.log('Parsing stored user data...');
          const user = JSON.parse(storedUser);
          console.log('Parsed user:', user);
          
          setState(prev => ({
            ...prev,
            user,
            token: storedToken,
            isLoading: false,
          }));
          console.log('Initial user state set');

          // Load permissions
          console.log('Loading permissions on mount...');
          await loadUserPermissions();
        } catch (error) {
          console.error('Error loading initial user data:', error);
          // Error loading user data - clear auth data
          clearAuthData();
        }
      } else {
        console.log('No stored auth data, setting loading to false');
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUserData();
  }, []);

  // Clear authentication data - defined before functions that use it
  const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setState({
      user: null,
      token: null,
      refreshToken: null,
      permissions: [],
      roles: [],
      isLoading: false,
    });
  };

  // Token refresh function - defined before useEffect that uses it
  const refreshTokenInternal = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.refreshToken) return false;

      const response = await authApi.refreshToken(state.refreshToken);

      localStorage.setItem(TOKEN_KEY, response.access_token);

      setState(prev => ({
        ...prev,
        token: response.access_token,
      }));

      return true;
    } catch (error) {
      // Token refresh failed - clear auth data
      clearAuthData();
      return false;
    }
  }, [state.refreshToken]);

  // Auto-refresh token
  useEffect(() => {
    if (state.token && state.refreshToken) {
      const refreshInterval = setInterval(
        async () => {
          await refreshTokenInternal();
        },
        14 * 60 * 1000
      ); // Refresh every 14 minutes

      return () => clearInterval(refreshInterval);
    }
  }, [state.token, state.refreshToken, refreshTokenInternal]);

  const loadUserPermissions = async () => {
    try {
      console.log('Loading user permissions...');
      const permissionsData = await authApi.getUserPermissions();
      console.log('Permissions data received:', permissionsData);
      setState(prev => ({
        ...prev,
        permissions: permissionsData.permissions || [],
        roles: permissionsData.roles || [],
      }));
      console.log('Permissions set successfully');
    } catch (error) {
      console.error('Error loading permissions:', error);
      // Error loading permissions - continue with empty permissions
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe = false
  ): Promise<boolean> => {
    try {
      console.log('Starting login process...');
      setState(prev => ({ ...prev, isLoading: true }));

      console.log('Calling login API...');
      const response = await authApi.login({
        email,
        password,
        remember_me: rememberMe,
      });
      console.log('Login API response:', response);

      // Store tokens
      localStorage.setItem(TOKEN_KEY, response.access_token);
      if (response.refresh_token) {
        localStorage.setItem(REFRESH_TOKEN_KEY, response.refresh_token);
      }
      console.log('Tokens stored');

      // Get user data
      console.log('Getting current user...');
      const userData = await authApi.getCurrentUser();
      console.log('User data received:', userData);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));

      setState(prev => ({
        ...prev,
        user: userData,
        token: response.access_token,
        refreshToken: response.refresh_token || null,
        isLoading: false,
      }));
      console.log('User state updated');

      // Load permissions
      console.log('Loading permissions...');
      await loadUserPermissions();
      console.log('Login process completed successfully');

      return true;
    } catch (error) {
      console.error('Login failed:', error);
      // Login failed
      setState(prev => ({ ...prev, isLoading: false }));
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (state.token) {
        await authApi.logout();
      }
    } catch (error) {
      // Logout error - proceed with local cleanup
    } finally {
      clearAuthData();
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      await authApi.register(userData);

      setState(prev => ({ ...prev, isLoading: false }));
      return true;
    } catch (error) {
      // Registration failed - re-throw for component to handle
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (state.user) {
      const updatedUser = { ...state.user, ...userData };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
      setState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const hasPermission = (permission: string): boolean => {
    return state.permissions.includes(permission);
  };

  const hasRole = (role: string): boolean => {
    return state.roles.includes(role);
  };

  const isAdmin = (): boolean => {
    return hasRole('admin');
  };

  const isAnalyst = (): boolean => {
    return hasRole('analyst') || isAdmin();
  };

  const value: AuthContextType = {
    user: state.user,
    token: state.token,
    permissions: state.permissions,
    roles: state.roles,
    isLoading: state.isLoading,
    isAuthenticated: !!state.user && !!state.token,
    login,
    logout,
    register,
    refreshToken: refreshTokenInternal,
    updateUser,
    hasPermission,
    hasRole,
    isAdmin,
    isAnalyst,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
