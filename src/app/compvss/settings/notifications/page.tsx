'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Bell, Mail, MessageSquare, Save } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { BodyText, HeroTitle } from "@/components/atoms/Typography";

export default function NotificationSettingsPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Settings', href: '/compvss/settings/account' },
    { label: 'Notifications', href: '/compvss/settings/notifications' },
  ];

  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    advancingUpdates: true,
    issueAlerts: true,
    expenseApprovals: true,
    scheduleChanges: true,
    teamMessages: true,
    systemAnnouncements: true,
  });

  const handleToggle = (field: string) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const queryClient = useQueryClient();
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: typeof settings) => {
      const response = await fetch('/api/compvss/settings/notifications', {
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

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <HeroTitle className="compvss-text-gradient">Notification Settings</HeroTitle>
            <BodyText className="text-grey-400 mt-1">Manage how you receive notifications</BodyText>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Delivery Methods */}
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-compvss-cyan-500" />
                Delivery Methods
              </CardTitle>
              <CardDescription className="text-grey-400">
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <NotificationToggle
                  icon={<Mail className="w-5 h-5" />}
                  label="Email Notifications"
                  description="Receive notifications via email"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <NotificationToggle
                  icon={<Bell className="w-5 h-5" />}
                  label="Push Notifications"
                  description="Receive push notifications in your browser"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                />
                <NotificationToggle
                  icon={<MessageSquare className="w-5 h-5" />}
                  label="SMS Notifications"
                  description="Receive text messages for urgent updates"
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Types */}
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Notification Types</CardTitle>
              <CardDescription className="text-grey-400">
                Select which types of notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <NotificationToggle
                  label="Advancing Updates"
                  description="Get notified about advancing request status changes"
                  checked={settings.advancingUpdates}
                  onChange={() => handleToggle('advancingUpdates')}
                />
                <NotificationToggle
                  label="Issue Alerts"
                  description="Receive alerts when issues are assigned to you"
                  checked={settings.issueAlerts}
                  onChange={() => handleToggle('issueAlerts')}
                />
                <NotificationToggle
                  label="Expense Approvals"
                  description="Get notified about expense report approvals"
                  checked={settings.expenseApprovals}
                  onChange={() => handleToggle('expenseApprovals')}
                />
                <NotificationToggle
                  label="Schedule Changes"
                  description="Receive updates about schedule modifications"
                  checked={settings.scheduleChanges}
                  onChange={() => handleToggle('scheduleChanges')}
                />
                <NotificationToggle
                  label="Team Messages"
                  description="Get notified about new team messages"
                  checked={settings.teamMessages}
                  onChange={() => handleToggle('teamMessages')}
                />
                <NotificationToggle
                  label="System Announcements"
                  description="Receive important system-wide announcements"
                  checked={settings.systemAnnouncements}
                  onChange={() => handleToggle('systemAnnouncements')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              variant="compvss"
              size="lg"
              onClick={handleSave}
            >
              <Save className="w-5 h-5 mr-2" />
              Save Preferences
            </Button>
          </div>
        </motion.div>
      </div>
    </CompvssLayout>
  );
}

function NotificationToggle({ 
  icon, 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  icon?: React.ReactNode;
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
      <div className="flex items-start gap-3 flex-1">
        {icon && (
          <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500 mt-1">
            {icon}
          </div>
        )}
        <div>
          <h3 className="text-white mb-1">{label}</h3>
          <p className="text-body-sm text-grey-400 -tech">{description}</p>
        </div>
      </div>
      <Checkbox
        checked={checked}
        onChange={onChange}
        variant="compvss"
      />
    </div>
  );
}
