import { apiClient } from './api';

export interface WebAuthnCredential {
  id: string;
  credential_id: string;
  device_name?: string;
  device_type?: string;
  created_at: string;
  last_used?: string;
}

export interface WebAuthnRegisterBeginResponse {
  options: any; // Server-provided options JSON with challenge_id included
}

export interface WebAuthnRegisterCompleteRequest {
  credential: any; // Processed PublicKeyCredential plus challenge_id
  device_name?: string;
}

export interface WebAuthnAuthenticateBeginResponse {
  options: PublicKeyCredentialRequestOptions;
}

export interface WebAuthnAuthenticateCompleteRequest {
  credential_id: string;
  client_data_json: string;
  authenticator_data: string;
  signature: string;
  user_handle?: string;
}

export interface WebAuthnUpdateCredentialRequest {
  name: string;
}

export const webauthnApi = {
  /**
   * Begin WebAuthn credential registration
   */
  async beginRegistration(): Promise<WebAuthnRegisterBeginResponse> {
    const response = await apiClient.post('/webauthn/register/begin');
    return response.data;
  },

  /**
   * Complete WebAuthn credential registration
   */
  async completeRegistration(
    data: WebAuthnRegisterCompleteRequest
  ): Promise<WebAuthnCredential> {
    const response = await apiClient.post('/webauthn/register/complete', data);
    return response.data;
  },

  /**
   * Begin WebAuthn authentication
   */
  async beginAuthentication(): Promise<WebAuthnAuthenticateBeginResponse> {
    const response = await apiClient.post('/webauthn/authenticate/begin');
    return response.data;
  },

  /**
   * Complete WebAuthn authentication
   */
  async completeAuthentication(
    data: WebAuthnAuthenticateCompleteRequest
  ): Promise<{ success: boolean; access_token?: string }> {
    const response = await apiClient.post(
      '/webauthn/authenticate/complete',
      data
    );
    return response.data;
  },

  /**
   * Get user's registered credentials
   */
  async getCredentials(): Promise<WebAuthnCredential[]> {
    const response = await apiClient.get('/webauthn/credentials');
    return response.data;
  },

  /**
   * Delete a specific credential
   */
  async deleteCredential(credentialId: string): Promise<{ success: boolean }> {
    const response = await apiClient.delete(
      `/webauthn/credentials/${credentialId}`
    );
    return response.data;
  },

  /**
   * Update credential name
   */
  async updateCredentialName(
    credentialId: string,
    data: WebAuthnUpdateCredentialRequest
  ): Promise<{ success: boolean }> {
    const response = await apiClient.put(
      `/webauthn/credentials/${credentialId}/name`,
      null,
      { params: { new_name: data.name } }
    );
    return response.data;
  },
};

/**
 * WebAuthn utility functions for handling browser APIs
 */
export const webauthnUtils = {
  /**
   * Check if WebAuthn is supported in the current browser
   */
  isSupported(): boolean {
    return !!(navigator.credentials && navigator.credentials.create);
  },

  /**
   * Convert base64url string to ArrayBuffer
   */
  base64urlToArrayBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '='
    );
    const binary = atob(padded);
    const buffer = new ArrayBuffer(binary.length);
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return buffer;
  },

  /**
   * Convert ArrayBuffer to base64url string
   */
  arrayBufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    const binary = Array.from(bytes, byte => String.fromCharCode(byte)).join(
      ''
    );
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  },

  /**
   * Prepare credential creation options for browser API
   */
  prepareCreationOptions(
    options: PublicKeyCredentialCreationOptions
  ): PublicKeyCredentialCreationOptions {
    return {
      ...options,
      challenge: this.base64urlToArrayBuffer(
        options.challenge as unknown as string
      ),
      user: {
        ...options.user,
        id: this.base64urlToArrayBuffer(options.user.id as unknown as string),
      },
      excludeCredentials: options.excludeCredentials?.map(cred => ({
        ...cred,
        id: this.base64urlToArrayBuffer(cred.id as unknown as string),
      })),
    };
  },

  /**
   * Prepare credential request options for browser API
   */
  prepareRequestOptions(
    options: PublicKeyCredentialRequestOptions
  ): PublicKeyCredentialRequestOptions {
    return {
      ...options,
      challenge: this.base64urlToArrayBuffer(
        options.challenge as unknown as string
      ),
      allowCredentials: options.allowCredentials?.map(cred => ({
        ...cred,
        id: this.base64urlToArrayBuffer(cred.id as unknown as string),
      })),
    };
  },

  /**
   * Process credential response from browser API
   */
  processCredentialResponse(credential: PublicKeyCredential): any {
    const response = credential.response as
      | AuthenticatorAttestationResponse
      | AuthenticatorAssertionResponse;

    const result: any = {
      id: credential.id,
      rawId: this.arrayBufferToBase64url(credential.rawId),
      type: credential.type,
      response: {
        clientDataJSON: this.arrayBufferToBase64url(response.clientDataJSON),
      },
    };

    if (response instanceof AuthenticatorAttestationResponse) {
      result.response.attestationObject = this.arrayBufferToBase64url(
        response.attestationObject
      );
    } else if (response instanceof AuthenticatorAssertionResponse) {
      result.response.authenticatorData = this.arrayBufferToBase64url(
        response.authenticatorData
      );
      result.response.signature = this.arrayBufferToBase64url(
        response.signature
      );
      if (response.userHandle) {
        result.response.userHandle = this.arrayBufferToBase64url(
          response.userHandle
        );
      }
    }

    return result;
  },
};

export default webauthnApi;
