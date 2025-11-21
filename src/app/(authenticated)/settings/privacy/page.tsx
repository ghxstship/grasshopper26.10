/**
 * Privacy Settings Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Checkbox } from '@/components/ui-rebuild/atoms/Checkbox';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { apiClient } from '@/lib/api/client';

export default function PrivacySettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [settings, setSettings] = React.useState({
    profileVisible: true,
    showActivity: true,
    allowMessages: true,
    dataSharing: false,
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<typeof settings>('/api/settings/privacy');
        if (response.data) {
          setSettings(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch privacy settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient.put('/api/settings/privacy', settings);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-2">Privacy Settings</H1>
          <Body className="text-gray-600">Control your privacy preferences</Body>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Privacy Preferences</CardTitle>
            <CardDescription>Manage how your information is shared</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Checkbox
              id="profileVisible"
              label="Make my profile visible to others"
              checked={settings.profileVisible}
              onChange={(e) => setSettings({ ...settings, profileVisible: e.target.checked })}
            />
            <Checkbox
              id="showActivity"
              label="Show my activity on social feed"
              checked={settings.showActivity}
              onChange={(e) => setSettings({ ...settings, showActivity: e.target.checked })}
            />
            <Checkbox
              id="allowMessages"
              label="Allow direct messages from other users"
              checked={settings.allowMessages}
              onChange={(e) => setSettings({ ...settings, allowMessages: e.target.checked })}
            />
            <Checkbox
              id="dataSharing"
              label="Share analytics data with partners"
              checked={settings.dataSharing}
              onChange={(e) => setSettings({ ...settings, dataSharing: e.target.checked })}
            />
          </CardContent>
          <CardContent>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
