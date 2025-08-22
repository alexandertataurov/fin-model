import { apiClient } from './api';

export interface OAuthAccount {
  id: string;
  provider: 'google' | 'microsoft';
  email: string;
  name: string;
  avatar_url?: string;
  linked_at: string;
  last_used?: string;
}

export interface OAuthLinkRequest {
  authorization_code: string;
  state: string;
}

export interface OAuthLoginResponse {
  login_url: string;
  state: string;
}

export const oauthApi = {
  /**
   * Initiate Google OAuth login
   */
  async initiateGoogleLogin(): Promise<OAuthLoginResponse> {
    const response = await apiClient.get('/oauth/google/login');
    return response.data;
  },

  /**
   * Handle Google OAuth callback
   * Note: This is typically handled by the backend redirect, but included for completeness
   */
  async handleGoogleCallback(
    code: string,
    state: string
  ): Promise<{ success: boolean; access_token?: string }> {
    const response = await apiClient.get('/oauth/google/callback', {
      params: { code, state },
    });
    return response.data;
  },

  /**
   * Initiate Microsoft OAuth login
   */
  async initiateMicrosoftLogin(): Promise<OAuthLoginResponse> {
    const response = await apiClient.get('/oauth/microsoft/login');
    return response.data;
  },

  /**
   * Handle Microsoft OAuth callback
   * Note: This is typically handled by the backend redirect, but included for completeness
   */
  async handleMicrosoftCallback(
    code: string,
    state: string
  ): Promise<{ success: boolean; access_token?: string }> {
    const response = await apiClient.get('/oauth/microsoft/callback', {
      params: { code, state },
    });
    return response.data;
  },

  /**
   * Link an OAuth account to current user
   */
  async linkAccount(
    provider: 'google' | 'microsoft',
    data: OAuthLinkRequest
  ): Promise<{ success: boolean }> {
    const response = await apiClient.post(`/oauth/link/${provider}`, data);
    return response.data;
  },

  /**
   * Unlink an OAuth account from current user
   */
  async unlinkAccount(
    provider: 'google' | 'microsoft'
  ): Promise<{ success: boolean }> {
    const response = await apiClient.delete(`/oauth/unlink/${provider}`);
    return response.data;
  },

  /**
   * Get all linked OAuth accounts for current user
   */
  async getLinkedAccounts(): Promise<OAuthAccount[]> {
    const response = await apiClient.get('/oauth/accounts');
    return response.data;
  },
};

/**
 * OAuth utility functions for handling OAuth flows
 */
export const oauthUtils = {
  /**
   * Generate a secure random state parameter for OAuth
   */
  generateState(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join(
      ''
    );
  },

  /**
   * Store OAuth state in session storage
   */
  storeState(state: string): void {
    sessionStorage.setItem('oauth_state', state);
  },

  /**
   * Retrieve and validate OAuth state from session storage
   */
  validateState(receivedState: string): boolean {
    const storedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('oauth_state');
    return storedState === receivedState;
  },

  /**
   * Parse OAuth callback URL parameters
   */
  parseCallbackParams(url: string): {
    code?: string;
    state?: string;
    error?: string;
  } {
    const urlObj = new URL(url);
    return {
      code: urlObj.searchParams.get('code') || undefined,
      state: urlObj.searchParams.get('state') || undefined,
      error: urlObj.searchParams.get('error') || undefined,
    };
  },

  /**
   * Redirect to OAuth provider
   */
  redirectToProvider(loginUrl: string): void {
    const url = new URL(loginUrl, window.location.origin);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error('Invalid login URL');
    }
    window.location.href = url.toString();
  },

  /**
   * Open OAuth provider in popup window
   */
  openProviderPopup(
    loginUrl: string,
    provider: string
  ): Promise<{ code: string; state: string }> {
    return new Promise((resolve, reject) => {
      const popup = window.open(
        loginUrl,
        `oauth_${provider}`,
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        reject(new Error('Failed to open popup window'));
        return;
      }

      // Listen for popup to close or receive message
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('OAuth popup was closed'));
        }
      }, 1000);

      // Listen for message from popup
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) {
          return;
        }

        if (event.data.type === 'oauth_success') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', handleMessage);
          resolve({
            code: event.data.code,
            state: event.data.state,
          });
        } else if (event.data.type === 'oauth_error') {
          clearInterval(checkClosed);
          popup.close();
          window.removeEventListener('message', handleMessage);
          reject(new Error(event.data.error || 'OAuth authentication failed'));
        }
      };

      window.addEventListener('message', handleMessage);

      // Cleanup after 10 minutes
      setTimeout(
        () => {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          if (!popup.closed) {
            popup.close();
          }
          reject(new Error('OAuth timeout'));
        },
        10 * 60 * 1000
      );
    });
  },

  /**
   * Get provider display name
   */
  getProviderDisplayName(provider: 'google' | 'microsoft'): string {
    const names = {
      google: 'Google',
      microsoft: 'Microsoft',
    };
    return names[provider] || provider;
  },

  /**
   * Get provider icon/color
   */
  getProviderInfo(provider: 'google' | 'microsoft'): {
    color: string;
    icon: string;
  } {
    const info = {
      google: { color: '#4285f4', icon: '🔵' },
      microsoft: { color: '#00a4ef', icon: '🟦' },
    };
    return info[provider] || { color: '#666', icon: '🔗' };
  },
};

export default oauthApi;
