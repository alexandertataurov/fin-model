# Enhanced Authentication Integration Guide

This guide explains how to integrate the enhanced authentication features (MFA, OAuth, WebAuthn) into the frontend application.

## Overview

The enhanced authentication system provides three additional security layers:

1. **Multi-Factor Authentication (MFA)** - TOTP-based 2FA with backup codes
2. **OAuth Social Login** - Google and Microsoft authentication
3. **WebAuthn/Biometric Authentication** - Passwordless authentication using biometrics

## API Endpoints

### Authentication Flow

#### 1. Enhanced Login
```typescript
POST /api/v1/auth/login-enhanced
```

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123",
  "remember_me": false
}
```

**Response (No 2FA):**
```json
{
  "status": "success",
  "access_token": "jwt_token_here",
  "token_type": "bearer",
  "message": "Authentication successful"
}
```

**Response (2FA Required):**
```json
{
  "status": "mfa_required",
  "challenge_id": "challenge_uuid",
  "available_methods": ["totp", "webauthn"],
  "message": "Second factor authentication required"
}
```

### MFA Endpoints

#### Setup MFA
```typescript
POST /api/v1/auth/mfa/setup
```

**Response:**
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qr_code": "base64_encoded_qr_code",
  "backup_codes": ["ABCD-EFGH", "IJKL-MNOP", ...]
}
```

#### Verify MFA Setup
```typescript
POST /api/v1/auth/mfa/verify-setup
```

**Request:**
```json
{
  "token": "123456"
}
```

#### Verify MFA During Login
```typescript
POST /api/v1/auth/mfa/verify
```

**Request:**
```json
{
  "username": "user@example.com",
  "password": "password123",
  "mfa_token": "123456",
  "use_backup": false
}
```

### OAuth Endpoints

#### Google OAuth
```typescript
GET /api/v1/auth/oauth/google/login
```
Redirects to Google OAuth consent screen.

#### Microsoft OAuth
```typescript
GET /api/v1/auth/oauth/microsoft/login
```
Redirects to Microsoft OAuth consent screen.

#### Link OAuth Account
```typescript
POST /api/v1/auth/oauth/link/{provider}
```

#### Unlink OAuth Account
```typescript
DELETE /api/v1/auth/oauth/unlink/{provider}
```

### WebAuthn Endpoints

#### Begin Registration
```typescript
POST /api/v1/auth/webauthn/register/begin
```

#### Complete Registration
```typescript
POST /api/v1/auth/webauthn/register/complete
```

#### Begin Authentication
```typescript
POST /api/v1/auth/webauthn/authenticate/begin
```

#### Complete Authentication
```typescript
POST /api/v1/auth/webauthn/authenticate/complete
```

## Frontend Implementation Examples

### 1. MFA Setup Component

```typescript
// components/auth/MFASetup.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const MFASetup: React.FC = () => {
  const [step, setStep] = useState<'intro' | 'qr' | 'verify' | 'backup'>('intro');
  const [setupData, setSetupData] = useState<any>(null);
  const [verificationToken, setVerificationToken] = useState('');

  const handleSetupMFA = async () => {
    try {
      const response = await fetch('/api/v1/auth/mfa/setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSetupData(data);
        setStep('qr');
      }
    } catch (error) {
      console.error('MFA setup failed:', error);
    }
  };

  const handleVerifySetup = async () => {
    try {
      const response = await fetch('/api/v1/auth/mfa/verify-setup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: verificationToken })
      });
      
      if (response.ok) {
        setStep('backup');
      }
    } catch (error) {
      console.error('MFA verification failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Two-Factor Authentication Setup</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'intro' && (
          <div>
            <p>Secure your account with two-factor authentication.</p>
            <Button onClick={handleSetupMFA}>Set Up 2FA</Button>
          </div>
        )}
        
        {step === 'qr' && setupData && (
          <div>
            <p>Scan this QR code with your authenticator app:</p>
            <img src={`data:image/png;base64,${setupData.qr_code}`} alt="QR Code" />
            <p>Or enter this code manually: {setupData.secret}</p>
            <Input
              type="text"
              placeholder="Enter 6-digit code"
              value={verificationToken}
              onChange={(e) => setVerificationToken(e.target.value)}
            />
            <Button onClick={handleVerifySetup}>Verify</Button>
          </div>
        )}
        
        {step === 'backup' && setupData && (
          <div>
            <p>Save these backup codes in a safe place:</p>
            <ul>
              {setupData.backup_codes.map((code: string, index: number) => (
                <li key={index}>{code}</li>
              ))}
            </ul>
            <Button onClick={() => setStep('intro')}>Complete Setup</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

### 2. Enhanced Login Component

```typescript
// components/auth/EnhancedLogin.tsx
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const EnhancedLogin: React.FC = () => {
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [mfaToken, setMfaToken] = useState('');
  const [challengeId, setChallengeId] = useState('');
  const [availableMethods, setAvailableMethods] = useState<string[]>([]);

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/v1/auth/login-enhanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        // Store token and redirect to dashboard
        localStorage.setItem('access_token', data.access_token);
        window.location.href = '/dashboard';
      } else if (data.status === 'mfa_required') {
        setChallengeId(data.challenge_id);
        setAvailableMethods(data.available_methods);
        setStep('mfa');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  const handleMFAVerification = async () => {
    try {
      const response = await fetch('/api/v1/auth/mfa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password,
          mfa_token: mfaToken,
          use_backup: false
        })
      });
      
      const data = await response.json();
      
      if (data.status === 'success') {
        localStorage.setItem('access_token', data.access_token);
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('MFA verification failed:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 'credentials' && (
          <div>
            <Input
              type="email"
              placeholder="Email or username"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            />
            <Input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            />
            <Button onClick={handleLogin}>Sign In</Button>
          </div>
        )}
        
        {step === 'mfa' && (
          <div>
            <p>Enter your authentication code:</p>
            <Input
              type="text"
              placeholder="6-digit code"
              value={mfaToken}
              onChange={(e) => setMfaToken(e.target.value)}
            />
            <Button onClick={handleMFAVerification}>Verify</Button>
            
            {availableMethods.includes('webauthn') && (
              <Button variant="outline">Use Biometric Authentication</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
```

### 3. WebAuthn Integration

```typescript
// services/webauthn.ts
export class WebAuthnService {
  static async registerCredential(): Promise<void> {
    // Get registration options from server
    const optionsResponse = await fetch('/api/v1/auth/webauthn/register/begin', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    const options = await optionsResponse.json();

    // Create credential using WebAuthn API
    const credential = await navigator.credentials.create({
      publicKey: {
        challenge: this.base64ToArrayBuffer(options.challenge),
        rp: options.rp,
        user: {
          id: this.base64ToArrayBuffer(options.user.id),
          name: options.user.name,
          displayName: options.user.displayName
        },
        pubKeyCredParams: options.pubKeyCredParams,
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required'
        },
        timeout: options.timeout
      }
    });

    // Send credential to server
    await fetch('/api/v1/auth/webauthn/register/complete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`
      },
      body: JSON.stringify({
        credential: this.credentialToJSON(credential),
        device_name: 'My Device'
      })
    });
  }

  static async authenticate(username: string): Promise<string> {
    // Get authentication options
    const optionsResponse = await fetch('/api/v1/auth/webauthn/authenticate/begin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });
    const options = await optionsResponse.json();

    // Get assertion
    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: this.base64ToArrayBuffer(options.challenge),
        allowCredentials: options.allowCredentials.map((cred: any) => ({
          id: this.base64ToArrayBuffer(cred.id),
          type: cred.type
        })),
        timeout: options.timeout,
        userVerification: options.userVerification
      }
    });

    // Send assertion to server
    const response = await fetch('/api/v1/auth/webauthn/authenticate/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username,
        credential: this.credentialToJSON(assertion)
      })
    });

    const data = await response.json();
    return data.access_token;
  }

  private static base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binaryString = window.atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  private static credentialToJSON(credential: any): any {
    // Convert ArrayBuffers to base64 strings for JSON serialization
    // Implementation depends on the credential structure
    return credential;
  }
}
```

### 4. OAuth Social Login

```typescript
// components/auth/SocialLogin.tsx
import React from 'react';
import { Button } from '@/components/ui/button';

export const SocialLogin: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/api/v1/auth/oauth/google/login';
  };

  const handleMicrosoftLogin = () => {
    window.location.href = '/api/v1/auth/oauth/microsoft/login';
  };

  return (
    <div className="space-y-3">
      <Button
        variant="outline"
        onClick={handleGoogleLogin}
        className="w-full"
      >
        Continue with Google
      </Button>
      <Button
        variant="outline"
        onClick={handleMicrosoftLogin}
        className="w-full"
      >
        Continue with Microsoft
      </Button>
    </div>
  );
};
```

## Security Considerations

1. **Rate Limiting**: All authentication endpoints have rate limiting implemented
2. **Token Expiration**: MFA challenges and WebAuthn challenges expire after 2-5 minutes
3. **Secure Storage**: Store JWT tokens securely (preferably in httpOnly cookies)
4. **HTTPS Required**: All authentication flows require HTTPS in production
5. **CSRF Protection**: Use state parameters for OAuth flows

## Browser Support

- **WebAuthn**: Modern browsers (Chrome 67+, Firefox 60+, Safari 14+)
- **OAuth**: All modern browsers
- **MFA/TOTP**: All browsers (server-side generation)

## Error Handling

Always implement proper error handling for authentication flows:

```typescript
try {
  // Authentication logic
} catch (error) {
  if (error.status === 401) {
    // Invalid credentials
  } else if (error.status === 429) {
    // Rate limited
  } else if (error.status === 400) {
    // Invalid request format
  }
}
```