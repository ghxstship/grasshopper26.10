'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Bell, Mail, MessageSquare, Calendar, ShoppingCart } from 'lucide-react';

function Switch({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-700'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  );
}

export default function NotificationsSettingsPage() {
  const queryClient = useQueryClient();
  const [emailNotifications, setEmailNotifications] = useState({
    events: true,
    orders: true,
    marketing: false,
  });

  const [pushNotifications, setPushNotifications] = useState({
    events: true,
    messages: true,
    updates: false,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: { email: typeof emailNotifications; push: typeof pushNotifications }) => {
      const response = await fetch('/api/gvteway/settings/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });

  const _handleSave = () => {
    saveSettingsMutation.mutate({ email: emailNotifications, push: pushNotifications });
  };

  return (
    <GvtewayLayout>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Notification Settings</h1>
          <p className="text-gray-400">Choose how you want to be notified</p>
        </div>

        <Card variant="gvteway" className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Email Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-info" />
                <div>
                  <p className="text-white font-medium">Event Updates</p>
                  <p className="text-sm text-gray-400">Get notified about upcoming events</p>
                </div>
              </div>
              <Switch
                checked={emailNotifications.events}
                onCheckedChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, events: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-5 h-5 text-success" />
                <div>
                  <p className="text-white font-medium">Order Updates</p>
                  <p className="text-sm text-gray-400">Notifications about your orders</p>
                </div>
              </div>
              <Switch
                checked={emailNotifications.orders}
                onCheckedChange={(checked) =>
                  setEmailNotifications({ ...emailNotifications, orders: checked })
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="gvteway" className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Push Notifications
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-info" />
                <div>
                  <p className="text-white font-medium">Event Reminders</p>
                  <p className="text-sm text-gray-400">Get reminded before events start</p>
                </div>
              </div>
              <Switch
                checked={pushNotifications.events}
                onCheckedChange={(checked) =>
                  setPushNotifications({ ...pushNotifications, events: checked })
                }
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-warning" />
                <div>
                  <p className="text-white font-medium">Messages</p>
                  <p className="text-sm text-gray-400">New message notifications</p>
                </div>
              </div>
              <Switch
                checked={pushNotifications.messages}
                onCheckedChange={(checked) =>
                  setPushNotifications({ ...pushNotifications, messages: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </GvtewayLayout>
  );
}
