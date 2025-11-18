'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Shield, Key, Smartphone, Loader2, AlertCircle } from 'lucide-react';
import { useSettings } from '@/lib/hooks/atlvs/useSettings';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';

export default function SecuritySettingsPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const { settings, isLoading, error } = useSettings();
  const sessions = (settings as any)?.sessions || [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="SECURITY SETTINGS"
          description="Loading..."
          breadcrumbs={[
            { label: 'Settings', href: '/atlvs/settings' },
            { label: 'Security' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="SECURITY SETTINGS"
          description="Error loading settings"
          breadcrumbs={[
            { label: 'Settings', href: '/atlvs/settings' },
            { label: 'Security' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-error" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="SECURITY SETTINGS"
        description="Manage your account security"
        breadcrumbs={[
          { label: 'Settings', href: '/atlvs/settings' },
          { label: 'Security' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Change Password</CardTitle>
              <div className="space-y-4">
                <FormField label="Current Password">
                  <Input
                    type="password"
                    variant="atlvs"
                  />
                </FormField>
                <FormField label="New Password">
                  <Input
                    type="password"
                    variant="atlvs"
                  />
                </FormField>
                <FormField label="Confirm New Password">
                  <Input
                    type="password"
                    variant="atlvs"
                  />
                </FormField>
                <Button variant="atlvs" size="sm">
                  <Key className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6 flex items-center gap-2">
                <Smartphone className="w-5 h-5" />
                Two-Factor Authentication
              </CardTitle>
              <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg mb-4">
                <div>
                  <div className="font-medium mb-1">2FA Status</div>
                  <div className="text-body-sm text-gray-400">
                    {twoFactorEnabled ? 'Enabled - Your account is protected' : 'Disabled - Enable for extra security'}
                  </div>
                </div>
                <Button
                  variant={twoFactorEnabled ? 'ghost' : 'atlvs'}
                  onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                >
                  {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
                </Button>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Active Sessions
              </CardTitle>
              <div className="space-y-3">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{session.device}</span>
                        {session.current && (
                          <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50">
                            Current
                          </Badge>
                        )}
                      </div>
                      <div className="text-body-sm text-gray-400">{session.location} • {session.lastActive}</div>
                    </div>
                    {!session.current && (
                      <Button variant="ghost" size="sm" className="text-error">
                        Revoke
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>

          <div className="flex items-center justify-end">
            <Button variant="atlvs">
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
          </div>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
