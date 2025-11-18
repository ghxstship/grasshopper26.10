'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Trash2, Archive, Users, Bell,  } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';

export default function ProjectSettingsPage({ params }: { params: { id: string } }) {
  const queryClient = useQueryClient();
  const saveSettingsMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/atlvs/projects/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project-settings'] });
    },
  });

  const [settings, setSettings] = useState({
    name: 'Summer Music Festival 2024',
    visibility: 'team',
    notifications: true,
    autoArchive: false,
    allowGuestAccess: false,
    theme: 'default'
  });

  const handleSave = () => {
    saveSettingsMutation.mutate(settings);
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PROJECT SETTINGS"
        description="Configure project preferences and permissions"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Projects', href: '/atlvs/projects' },
          { label: 'Project Details', href: `/atlvs/projects/${params.id}` },
          { label: 'Settings' }
        ]}
      >
        <div className="space-y-6">
          {/* General Settings */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6">General Settings</CardTitle>
              <div className="space-y-4">
                <FormField label="Project Name">
                  <Input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({...settings, name: e.target.value})}
                    variant="atlvs"
                  />
                </FormField>

                <FormField label="Visibility">
                  <Select
                    value={settings.visibility}
                    onChange={(e) => setSettings({...settings, visibility: e.target.value})}
                    variant="atlvs"
                  >
                    <option value="private">Private - Only me</option>
                    <option value="team">Team - Project members only</option>
                    <option value="organization">Organization - All team members</option>
                    <option value="public">Public - Anyone with link</option>
                  </Select>
                </FormField>

                <FormField label="Project Theme">
                  <div className="grid grid-cols-4 gap-2">
                    {['default', 'blue', 'purple', 'green'].map((theme) => (
                      <Button
                        key={theme}
                        onClick={() => setSettings({...settings, theme})}
                        variant={settings.theme === theme ? 'atlvs' : 'ghost'}
                        size="sm"
                        className="px-4 py-2"
                      >
                        {theme.charAt(0).toUpperCase() + theme.slice(1)}
                      </Button>
                    ))}
                  </div>
                </FormField>
              </div>
            </CardHeader>
          </Card>

          {/* Notifications */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-6">
                <Bell className="w-5 h-5" />
                Notifications
              </CardTitle>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <div>
                    <div className="font-medium">Enable Notifications</div>
                    <div className="text-body-sm text-gray-400">Receive updates about project activity</div>
                  </div>
                  <Checkbox
                    checked={settings.notifications}
                    onChange={(e) => setSettings({...settings, notifications: e.target.checked})}
                    variant="atlvs"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <div>
                    <div className="font-medium">Auto-Archive Completed Tasks</div>
                    <div className="text-body-sm text-gray-400">Automatically archive tasks after 30 days</div>
                  </div>
                  <Checkbox
                    checked={settings.autoArchive}
                    onChange={(e) => setSettings({...settings, autoArchive: e.target.checked})}
                    variant="atlvs"
                  />
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Access Control */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 mb-6">
                <Users className="w-5 h-5" />
                Access Control
              </CardTitle>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-800 transition-colors">
                  <div>
                    <div className="font-medium">Allow Guest Access</div>
                    <div className="text-body-sm text-gray-400">External collaborators can view project</div>
                  </div>
                  <Checkbox
                    checked={settings.allowGuestAccess}
                    onChange={(e) => setSettings({...settings, allowGuestAccess: e.target.checked})}
                    variant="atlvs"
                  />
                </div>

                <div className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="font-medium mb-2">Team Members</div>
                  <div className="text-body-sm text-gray-400 mb-4">Manage who has access to this project</div>
                  <Button variant="atlvs" size="sm">
                    <Users className="w-4 h-4 mr-2" />
                    Manage Team
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Danger Zone */}
          <Card variant="atlvs" className="bg-destructive/10 border-destructive/20">
            <CardHeader>
              <CardTitle className="text-error mb-6">Danger Zone</CardTitle>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="font-medium">Archive Project</div>
                    <div className="text-body-sm text-gray-400">Hide project from active view</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-warning hover:text-warning">
                    <Archive className="w-4 h-4 mr-2" />
                    Archive
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="font-medium">Delete Project</div>
                    <div className="text-body-sm text-gray-400">Permanently delete this project and all data</div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-error hover:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href={`/atlvs/projects/${params.id}`}>
              <Button variant="ghost">
                Cancel
              </Button>
            </Link>
            <Button variant="atlvs" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
