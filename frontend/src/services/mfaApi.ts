import { apiClient } from './api';

export interface MFASetupResponse {
  qr_code: string;
  secret: string;
  backup_codes: string[];
}

export interface MFAVerifySetupRequest {
  totp_code: string;
}

export interface MFAVerifyRequest {
  totp_code?: string;
  backup_code?: string;
}

export interface MFAStatusResponse {
  enabled: boolean;
  backup_codes_remaining: number;
  setup_date?: string;
}

export interface MFABackupCodesResponse {
  backup_codes: string[];
}

export interface MFADisableRequest {
  password: string;
  totp_code?: string;
}

export const mfaApi = {
  /**
   * Initialize MFA setup - gets QR code and secret
   */
  async setupMFA(): Promise<MFASetupResponse> {
    const response = await apiClient.post('/mfa/setup');
    return response.data;
  },

  /**
   * Verify and enable MFA with TOTP code
   */
  async verifySetup(data: MFAVerifySetupRequest): Promise<{ success: boolean; backup_codes: string[] }> {
    const response = await apiClient.post('/mfa/verify-setup', data);
    return response.data;
  },

  /**
   * Verify MFA token during login
   */
  async verifyMFA(data: MFAVerifyRequest): Promise<{ success: boolean }> {
    const response = await apiClient.post('/mfa/verify', data);
    return response.data;
  },

  /**
   * Disable MFA with password verification
   */
  async disableMFA(data: MFADisableRequest): Promise<{ success: boolean }> {
    const response = await apiClient.post('/mfa/disable', data);
    return response.data;
  },

  /**
   * Get current MFA status
   */
  async getMFAStatus(): Promise<MFAStatusResponse> {
    const response = await apiClient.get('/mfa/status');
    return response.data;
  },

  /**
   * Get remaining backup codes
   */
  async getBackupCodes(): Promise<MFABackupCodesResponse> {
    const response = await apiClient.get('/mfa/backup-codes');
    return response.data;
  },

  /**
   * Regenerate new backup codes
   */
  async regenerateBackupCodes(): Promise<MFABackupCodesResponse> {
    const response = await apiClient.post('/mfa/regenerate-backup-codes');
    return response.data;
  },
};

export default mfaApi;