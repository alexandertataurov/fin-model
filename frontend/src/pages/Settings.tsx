import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  authApi,
  PasswordChangeRequest,
  checkPasswordStrength,
} from '@/services/authApi';
import { mfaApi } from '@/services/mfaApi';
import {
  webauthnApi,
  webauthnUtils,
  WebAuthnCredential,
} from '@/services/webauthnApi';
import { useNotifications } from '@/contexts/NotificationContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/design-system/components/Card';
import { Input } from '@/design-system/components/Input';
import { Button } from '@/design-system/components/Button';
import { Label } from '@/design-system/components/Label';
import { Switch } from '@/design-system/components/Switch';
import { Separator } from '@/design-system/components/Separator';
import { Textarea } from '@/design-system/components/Textarea';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { preferences, updatePreferences } = useNotifications();

  // Profile state
  const [firstName, setFirstName] = useState(user?.first_name || '');
  const [lastName, setLastName] = useState(user?.last_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileSaving, setProfileSaving] = useState(false);

  useEffect(() => {
    setFirstName(user?.first_name || '');
    setLastName(user?.last_name || '');
    setUsername(user?.username || '');
    setEmail(user?.email || '');
  }, [user]);

  const saveProfile = async () => {
    try {
      setProfileSaving(true);
      const updated = await authApi.updateCurrentUser({
        first_name: firstName,
        last_name: lastName,
        username,
        email,
      });
      updateUser(updated);
      toast.success('Profile updated');
    } catch (_e: any) {
      toast.error(_e?.response?.data?.detail || 'Failed to update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  const pwdStrength = useMemo(
    () => checkPasswordStrength(newPassword),
    [newPassword]
  );

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (!pwdStrength.isValid) {
      toast.error('Password is too weak');
      return;
    }
    try {
      setChangingPassword(true);
      const req: PasswordChangeRequest = {
        current_password: currentPassword,
        new_password: newPassword,
      };
      await authApi.changePassword(req);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Password changed');
    } catch (_e: any) {
      toast.error(_e?.response?.data?.detail || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  // MFA state
  const [mfaStatus, setMfaStatus] = useState<{
    enabled: boolean;
    backup_codes_remaining?: number;
  } | null>(null);
  const [setupQR, setSetupQR] = useState<string | null>(null);
  const [setupSecret, setSetupSecret] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  const loadMfa = async () => {
    try {
      setMfaLoading(true);
      const status = await mfaApi.getMFAStatus();
      setMfaStatus({
        enabled: status.enabled,
        backup_codes_remaining:
          (status as any).backup_codes_remaining ??
          (status as any).backup_codes_count,
      });
    } catch {
      // ignore
    } finally {
      setMfaLoading(false);
    }
  };

  useEffect(() => {
    loadMfa();
  }, []);

  const beginMfaSetup = async () => {
    try {
      setMfaLoading(true);
      const res = await mfaApi.setupMFA();
      setSetupQR(res.qr_code);
      setSetupSecret(res.secret);
      toast.info('Scan the QR code with your authenticator app');
    } catch (_e: any) {
      toast.error(_e?.response?.data?.detail || 'Failed to begin MFA setup');
    } finally {
      setMfaLoading(false);
    }
  };

  const verifyMfaSetup = async () => {
    if (!totpCode) return;
    try {
      setMfaLoading(true);
      const res = await mfaApi.verifySetup({ token: totpCode });
      setBackupCodes(res.backup_codes);
      setSetupQR(null);
      setSetupSecret(null);
      setTotpCode('');
      await loadMfa();
      toast.success('MFA enabled');
    } catch (_e: any) {
      toast.error(_e?.response?.data?.detail || 'Verification failed');
    } finally {
      setMfaLoading(false);
    }
  };

  const disableMfa = async (password: string) => {
    try {
      setMfaLoading(true);
      await mfaApi.disableMFA({ password });
      await loadMfa();
      toast.success('MFA disabled');
    } catch (_e: any) {
      toast.error(_e?.response?.data?.detail || 'Failed to disable MFA');
    } finally {
      setMfaLoading(false);
    }
  };

  const regenerateCodes = async () => {
    try {
      const res = await mfaApi.regenerateBackupCodes();
      setBackupCodes(res.backup_codes);
      toast.success('New backup codes generated');
    } catch (_e: any) {
      toast.error(_e?.response?.data?.detail || 'Failed to regenerate codes');
    }
  };

  // WebAuthn state
  const [credentials, setCredentials] = useState<WebAuthnCredential[]>([]);
  const [webauthnLoading, setWebauthnLoading] = useState(false);

  const loadCredentials = async () => {
    try {
      setWebauthnLoading(true);
      const creds = await webauthnApi.getCredentials();
      setCredentials(creds);
    } catch {
      // ignore
    } finally {
      setWebauthnLoading(false);
    }
  };

  useEffect(() => {
    loadCredentials();
  }, []);

  const registerWebAuthn = async () => {
    if (!webauthnUtils.isSupported()) {
      toast.error('WebAuthn not supported in this browser');
      return;
    }
    try {
      setWebauthnLoading(true);
      const begin = await webauthnApi.beginRegistration();
      const options = webauthnUtils.prepareCreationOptions(
        begin.options as PublicKeyCredentialCreationOptions
      );
      const credential = (await navigator.credentials.create({
        publicKey: options,
      })) as PublicKeyCredential;
      const processed = webauthnUtils.processCredentialResponse(credential);
      // include challenge_id so backend can verify
      processed.challenge_id = (begin.options as any).challenge_id;
      const created = await webauthnApi.completeRegistration({
        credential: processed,
      });
      if (created?.id) {
        toast.success('Security key registered');
        await loadCredentials();
      } else {
        toast.error('Failed to register security key');
      }
    } catch (_e: any) {
      toast.error(_e?.message || 'WebAuthn registration failed');
    } finally {
      setWebauthnLoading(false);
    }
  };

  const deleteCredential = async (id: string) => {
    try {
      await webauthnApi.deleteCredential(id);
      await loadCredentials();
      toast.success('Credential removed');
    } catch (_e: any) {
      toast.error('Failed to remove credential');
    }
  };

  // Notification preferences
  const [emailEnabled, setEmailEnabled] = useState<boolean>(
    !!preferences?.email_enabled
  );
  const [pushEnabled, setPushEnabled] = useState<boolean>(
    !!preferences?.push_enabled
  );
  const [inAppEnabled, setInAppEnabled] = useState<boolean>(
    !!preferences?.in_app_enabled
  );
  const [quietEnabled, setQuietEnabled] = useState<boolean>(
    !!preferences?.quiet_hours_enabled
  );
  const [quietStart, setQuietStart] = useState<string>(
    preferences?.quiet_start_time || '22:00'
  );
  const [quietEnd, setQuietEnd] = useState<string>(
    preferences?.quiet_end_time || '08:00'
  );

  useEffect(() => {
    if (preferences) {
      setEmailEnabled(!!preferences.email_enabled);
      setPushEnabled(!!preferences.push_enabled);
      setInAppEnabled(!!preferences.in_app_enabled);
      setQuietEnabled(!!preferences.quiet_hours_enabled);
      setQuietStart(preferences.quiet_start_time || '22:00');
      setQuietEnd(preferences.quiet_end_time || '08:00');
    }
  }, [preferences]);

  const savePreferences = async () => {
    const ok = await updatePreferences({
      email_enabled: emailEnabled,
      push_enabled: pushEnabled,
      in_app_enabled: inAppEnabled,
      quiet_hours_enabled: quietEnabled,
      quiet_start_time: quietStart,
      quiet_end_time: quietEnd,
    });
    if (ok) toast.success('Preferences saved');
  };

  return (
    <div className="space-y-6 p-4">
      <h2 className="text-2xl font-semibold">Settings</h2>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={saveProfile} disabled={profileSaving}>
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="current">Current password</Label>
                <Input
                  id="current"
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="new">New password</Label>
                <Input
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Strength: {pwdStrength.strength}
                </p>
              </div>
              <div>
                <Label htmlFor="confirm">Confirm</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={changePassword} disabled={changingPassword}>
                Change password
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>MFA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">
                  Status: {mfaStatus?.enabled ? 'Enabled' : 'Disabled'}
                </p>
                {typeof mfaStatus?.backup_codes_remaining === 'number' && (
                  <p className="text-sm text-muted-foreground">
                    Backup codes remaining: {mfaStatus.backup_codes_remaining}
                  </p>
                )}
              </div>
              {!mfaStatus?.enabled ? (
                <Button onClick={beginMfaSetup} disabled={mfaLoading}>
                  Setup MFA
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={() => {
                    const pwd = prompt('Enter your password to disable MFA');
                    if (pwd) disableMfa(pwd);
                  }}
                  disabled={mfaLoading}
                >
                  Disable
                </Button>
              )}
            </div>
            {setupQR && (
              <div className="space-y-3">
                <Separator />
                <p className="text-sm text-muted-foreground">
                  Scan this QR in your authenticator app, then enter the 6-digit
                  code.
                </p>
                <img src={setupQR} alt="MFA QR" className="w-40 h-40" />
                {setupSecret && <Textarea readOnly value={setupSecret} />}
                <div className="flex items-end gap-2">
                  <div className="flex-1">
                    <Label htmlFor="totp">TOTP code</Label>
                    <Input
                      id="totp"
                      value={totpCode}
                      onChange={e => setTotpCode(e.target.value)}
                    />
                  </div>
                  <Button
                    onClick={verifyMfaSetup}
                    disabled={mfaLoading || !totpCode}
                  >
                    Verify
                  </Button>
                </div>
              </div>
            )}
            {backupCodes && backupCodes.length > 0 && (
              <div className="space-y-2">
                <Separator />
                <p className="font-medium">Backup codes</p>
                <Textarea readOnly value={backupCodes.join('\n')} />
                <div className="flex justify-end">
                  <Button variant="secondary" onClick={regenerateCodes}>
                    Regenerate
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Keys (WebAuthn)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-muted-foreground">
                Register a hardware key or platform authenticator
              </p>
              <Button onClick={registerWebAuthn} disabled={webauthnLoading}>
                Register Key
              </Button>
            </div>
            <Separator />
            <div className="space-y-2">
              {credentials.length === 0 ? (
                <p className="text-sm text-muted-foreground">No credentials</p>
              ) : (
                credentials.map(c => (
                  <div
                    key={c.id}
                    className="flex justify-between items-center border rounded-md p-3"
                  >
                    <div>
                      <p className="font-medium">{(c as any).name || 'Security Key'}</p>
                      <p className="text-xs text-muted-foreground">
                        Added {new Date(c.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteCredential(c.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center justify-between border rounded-md p-3">
                <Label className="mr-2">Email notifications</Label>
                <Switch
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                />
              </div>
              <div className="flex items-center justify-between border rounded-md p-3">
                <Label className="mr-2">Push notifications</Label>
                <Switch
                  checked={pushEnabled}
                  onCheckedChange={setPushEnabled}
                />
              </div>
              <div className="flex items-center justify-between border rounded-md p-3">
                <Label className="mr-2">In-app notifications</Label>
                <Switch
                  checked={inAppEnabled}
                  onCheckedChange={setInAppEnabled}
                />
              </div>
              <div className="flex items-center justify-between border rounded-md p-3">
                <Label className="mr-2">Quiet hours</Label>
                <Switch
                  checked={quietEnabled}
                  onCheckedChange={setQuietEnabled}
                />
              </div>
            </div>
            {quietEnabled && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quietStart">Quiet start</Label>
                  <Input
                    id="quietStart"
                    type="time"
                    value={quietStart}
                    onChange={e => setQuietStart(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="quietEnd">Quiet end</Label>
                  <Input
                    id="quietEnd"
                    type="time"
                    value={quietEnd}
                    onChange={e => setQuietEnd(e.target.value)}
                  />
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={savePreferences}>Save preferences</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
