/**
 * Security Settings Page - UI Rebuild
 * Manage password and two-factor authentication
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  activeSessions: number;
}

export default function SecuritySettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [settings, setSettings] = React.useState<SecuritySettings | null>(null);
  
  // Password change form
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<SecuritySettings>('/api/settings/security');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters');
      return;
    }

    try {
      setSaving(true);
      await apiClient.post('/api/settings/security/password', {
        currentPassword,
        newPassword,
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      setPasswordError('Failed to change password. Please check your current password.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      setSaving(true);
      const response = await apiClient.post('/api/settings/security/2fa/toggle');
      if (response.data && settings) {
        setSettings({
          ...settings,
          twoFactorEnabled: !settings.twoFactorEnabled,
        });
      }
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoutAllSessions = async () => {
    try {
      setSaving(true);
      await apiClient.post('/api/settings/security/logout-all');
    } catch (error) {
      console.error('Failed to logout all sessions:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Security Settings</H1>
          <Body className="text-gray-600">
            Manage your account security and authentication
          </Body>
        </div>

        <div className="space-y-6">
          {/* Change Password */}
          <Card>
            <form onSubmit={handlePasswordChange}>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  {settings?.lastPasswordChange && (
                    <Caption className="text-gray-500">
                      Last changed: {new Date(settings.lastPasswordChange).toLocaleDateString()}
                    </Caption>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {passwordError && (
                  <div className="bg-gray-100 border-2 border-black p-4">
                    <Body className="text-sm text-gray-900">{passwordError}</Body>
                  </div>
                )}

                <div>
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    disabled={saving}
                  />
                </div>

                <div>
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={saving}
                    helperText="Minimum 8 characters"
                  />
                </div>

                <div>
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={saving}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" loading={saving} disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Two-Factor Authentication</CardTitle>
                  <CardDescription>
                    Add an extra layer of security to your account
                  </CardDescription>
                </div>
                {settings?.twoFactorEnabled ? (
                  <Badge>Enabled</Badge>
                ) : (
                  <Badge variant="outline">Disabled</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <Body className="text-sm text-gray-600 mb-4">
                {settings?.twoFactorEnabled
                  ? 'Your account is protected with two-factor authentication. You\'ll need to enter a code from your authenticator app when signing in.'
                  : 'Protect your account by requiring a verification code in addition to your password when signing in.'}
              </Body>
            </CardContent>
            <CardFooter>
              <Button
                variant={settings?.twoFactorEnabled ? 'ghost' : 'primary'}
                onClick={handleToggle2FA}
                disabled={saving}
              >
                {settings?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </Button>
            </CardFooter>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>
                Manage devices where you&apos;re currently signed in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Body className="text-sm text-gray-600 mb-4">
                You have {settings?.activeSessions || 0} active session(s). You can sign out of all other sessions if you suspect unauthorized access.
              </Body>
            </CardContent>
            <CardFooter>
              <Button
                variant="ghost"
                onClick={handleLogoutAllSessions}
                disabled={saving}
              >
                Sign Out All Other Sessions
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
