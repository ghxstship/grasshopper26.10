/**
 * Notification Settings Page - UI Rebuild
 * Manage notification preferences
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Checkbox } from '@/components/ui-rebuild/atoms/Checkbox';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface NotificationSettings {
  email: {
    orderUpdates: boolean;
    eventReminders: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  push: {
    orderUpdates: boolean;
    eventReminders: boolean;
    messages: boolean;
  };
  sms: {
    orderUpdates: boolean;
    eventReminders: boolean;
  };
}

export default function NotificationSettingsPage() {
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [settings, setSettings] = React.useState<NotificationSettings>({
    email: {
      orderUpdates: true,
      eventReminders: true,
      promotions: false,
      newsletter: false,
    },
    push: {
      orderUpdates: true,
      eventReminders: true,
      messages: true,
    },
    sms: {
      orderUpdates: false,
      eventReminders: true,
    },
  });

  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<NotificationSettings>('/api/settings/notifications');
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

  const handleSave = async () => {
    try {
      setSaving(true);
      await apiClient.put('/api/settings/notifications', settings);
    } catch (error) {
      console.error('Failed to save settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateEmailSetting = (key: keyof NotificationSettings['email'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      email: { ...prev.email, [key]: value },
    }));
  };

  const updatePushSetting = (key: keyof NotificationSettings['push'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      push: { ...prev.push, [key]: value },
    }));
  };

  const updateSmsSetting = (key: keyof NotificationSettings['sms'], value: boolean) => {
    setSettings(prev => ({
      ...prev,
      sms: { ...prev.sms, [key]: value },
    }));
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
          <H1 className="mb-4">Notification Settings</H1>
          <Body className="text-gray-600">
            Choose how you want to receive notifications
          </Body>
        </div>

        <div className="space-y-6">
          {/* Email Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
              <CardDescription>Receive notifications via email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Checkbox
                id="email-orders"
                label="Order updates"
                checked={settings.email.orderUpdates}
                onChange={(e) => updateEmailSetting('orderUpdates', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                Get notified about order confirmations, shipping updates, and delivery
              </Caption>
              <Separator />
              
              <Checkbox
                id="email-events"
                label="Event reminders"
                checked={settings.email.eventReminders}
                onChange={(e) => updateEmailSetting('eventReminders', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                Receive reminders about upcoming events you&apos;ve purchased tickets for
              </Caption>
              <Separator />
              
              <Checkbox
                id="email-promotions"
                label="Promotions and deals"
                checked={settings.email.promotions}
                onChange={(e) => updateEmailSetting('promotions', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                Get exclusive offers, discounts, and promotional content
              </Caption>
              <Separator />
              
              <Checkbox
                id="email-newsletter"
                label="Newsletter"
                checked={settings.email.newsletter}
                onChange={(e) => updateEmailSetting('newsletter', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                Stay updated with our monthly newsletter
              </Caption>
            </CardContent>
          </Card>

          {/* Push Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>Push Notifications</CardTitle>
              <CardDescription>Receive notifications on your device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Checkbox
                id="push-orders"
                label="Order updates"
                checked={settings.push.orderUpdates}
                onChange={(e) => updatePushSetting('orderUpdates', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                Real-time updates about your orders
              </Caption>
              <Separator />
              
              <Checkbox
                id="push-events"
                label="Event reminders"
                checked={settings.push.eventReminders}
                onChange={(e) => updatePushSetting('eventReminders', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                Get reminded before your events start
              </Caption>
              <Separator />
              
              <Checkbox
                id="push-messages"
                label="Messages"
                checked={settings.push.messages}
                onChange={(e) => updatePushSetting('messages', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                Notifications for new messages and replies
              </Caption>
            </CardContent>
          </Card>

          {/* SMS Notifications */}
          <Card>
            <CardHeader>
              <CardTitle>SMS Notifications</CardTitle>
              <CardDescription>Receive text message notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Checkbox
                id="sms-orders"
                label="Order updates"
                checked={settings.sms.orderUpdates}
                onChange={(e) => updateSmsSetting('orderUpdates', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                Critical order updates via SMS
              </Caption>
              <Separator />
              
              <Checkbox
                id="sms-events"
                label="Event reminders"
                checked={settings.sms.eventReminders}
                onChange={(e) => updateSmsSetting('eventReminders', e.target.checked)}
              />
              <Caption className="text-gray-600 ml-8">
                SMS reminders for your events
              </Caption>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Card>
            <CardFooter>
              <Button
                onClick={handleSave}
                loading={saving}
                disabled={saving}
                size="lg"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
