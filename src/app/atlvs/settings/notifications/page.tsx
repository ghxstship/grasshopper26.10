'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { useSettings } from '@/lib/hooks/atlvs/useSettings';
import { motion } from 'framer-motion';
import { Save, Bell } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Checkbox } from '@/components/atoms/Checkbox';

export default function NotificationSettingsPage() {
  const { settings: settingsData, updateSettings, isUpdating } = useSettings();
  const [notifications, setNotifications] = useState({
    email: settingsData?.notifications?.email ?? true,
    push: settingsData?.notifications?.push ?? true,
    sms: settingsData?.notifications?.sms ?? false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({ notifications });
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="NOTIFICATION SETTINGS"
        description="Manage how you receive notifications"
        breadcrumbs={[
          { label: 'Settings', href: '/atlvs/settings' },
          { label: 'Notifications' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6 flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Email Notifications
                </CardTitle>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="font-oswald">Enable Email Notifications</span>
                    <Checkbox
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      variant="atlvs"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Push Notifications</CardTitle>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="font-oswald">Enable Push Notifications</span>
                    <Checkbox
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                      variant="atlvs"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">SMS Notifications</CardTitle>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <span className="font-oswald">Enable SMS Notifications</span>
                    <Checkbox
                      checked={notifications.sms}
                      onChange={(e) => setNotifications({...notifications, sms: e.target.checked})}
                      variant="atlvs"
                    />
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="flex items-center justify-end gap-4">
              <Button type="submit" variant="atlvs" disabled={isUpdating}>
                <Save className="w-4 h-4 mr-2" />
                {isUpdating ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
