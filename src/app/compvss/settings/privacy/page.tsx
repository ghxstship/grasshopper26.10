'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Eye, Download, Trash2, Save } from 'lucide-react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/atoms/Button';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { FormField } from '@/components/molecules/FormField';
import { Select } from '@/components/atoms/Select';

export default function PrivacySettingsPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Settings', href: '/compvss/settings/account' },
    { label: 'Privacy', href: '/compvss/settings/privacy' },
  ];

  const [settings, setSettings] = useState({
    profileVisibility: 'team',
    showEmail: false,
    showPhone: false,
    activityTracking: true,
    dataCollection: true,
    marketingEmails: false,
  });

  const handleToggle = (field: string) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field as keyof typeof prev] }));
  };

  const queryClient = useQueryClient();
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: typeof settings) => {
      const response = await fetch('/api/compvss/settings/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-settings'] });
    },
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  return (
    <CompvssLayout>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-h3 font-bebas compvss-text-gradient">Privacy Settings</h1>
            <p className="text-gray-400 font-oswald mt-1">Control your privacy and data</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Profile Visibility */}
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Eye className="w-5 h-5 text-compvss-cyan-500" />
                Profile Visibility
              </CardTitle>
              <CardDescription className="text-gray-400">
                Control who can see your profile information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField label="Who can see your profile?" required>
                  <Select
                    variant="compvss"
                    value={settings.profileVisibility}
                    onChange={(e) => setSettings(prev => ({ ...prev, profileVisibility: e.target.value }))}
                  >
                    <option value="public">Everyone</option>
                    <option value="team">Team Members Only</option>
                    <option value="private">Only Me</option>
                  </Select>
                </FormField>

                <PrivacyToggle
                  label="Show Email Address"
                  description="Allow team members to see your email"
                  checked={settings.showEmail}
                  onChange={() => handleToggle('showEmail')}
                />
                <PrivacyToggle
                  label="Show Phone Number"
                  description="Allow team members to see your phone number"
                  checked={settings.showPhone}
                  onChange={() => handleToggle('showPhone')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data & Privacy */}
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Data & Privacy</CardTitle>
              <CardDescription className="text-gray-400">
                Manage how your data is used
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <PrivacyToggle
                  label="Activity Tracking"
                  description="Allow tracking of your activity for analytics"
                  checked={settings.activityTracking}
                  onChange={() => handleToggle('activityTracking')}
                />
                <PrivacyToggle
                  label="Data Collection"
                  description="Allow collection of usage data to improve the platform"
                  checked={settings.dataCollection}
                  onChange={() => handleToggle('dataCollection')}
                />
                <PrivacyToggle
                  label="Marketing Emails"
                  description="Receive promotional emails and updates"
                  checked={settings.marketingEmails}
                  onChange={() => handleToggle('marketingEmails')}
                />
              </div>
            </CardContent>
          </Card>

          {/* Data Management */}
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Data Management</CardTitle>
              <CardDescription className="text-gray-400">
                Download or delete your data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                  <h3 className="font-oswald text-white mb-2">Download Your Data</h3>
                  <p className="text-body-sm text-gray-400 font-share-tech mb-3">
                    Request a copy of all your data in a portable format
                  </p>
                  <Button variant="compvss-outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Request Data Export
                  </Button>
                </div>

                <div className="p-4 rounded-lg bg-black/50 border border-destructive/30">
                  <h3 className="font-oswald text-white mb-2">Delete Account</h3>
                  <p className="text-body-sm text-gray-400 font-share-tech mb-3">
                    Permanently delete your account and all associated data
                  </p>
                  <Button variant="compvss-outline" size="sm" className="border-destructive/30 text-error hover:bg-error/10">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
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

function PrivacyToggle({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: () => void;
}) {
  return (
    <div className="flex items-start justify-between p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
      <div>
        <h3 className="font-oswald text-white mb-1">{label}</h3>
        <p className="text-body-sm text-gray-400 font-share-tech">{description}</p>
      </div>
      <Checkbox
        checked={checked}
        onChange={onChange}
        variant="compvss"
      />
    </div>
  );
}
