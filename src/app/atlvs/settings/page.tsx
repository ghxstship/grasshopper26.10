'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { Settings, User, Bell, Shield, CreditCard, Users, Key, Database,  } from 'lucide-react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Checkbox } from '@/components/atoms/Checkbox';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { FormField } from '@/components/molecules/FormField';
import { useSettings } from '@/lib/hooks/atlvs/useSettings';

export default function SettingsPage() {  
  const [activeTab, setActiveTab] = useState('general');
  const {  } = useSettings();

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'team', label: 'Team', icon: Users },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'integrations', label: 'Integrations', icon: Database }
  ];

  return (
    <AtlvsLayout>
      <ContentLayout
        title="SETTINGS"
        description="Manage your account and preferences"
        variant="atlvs"
        showToolbar={false}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <nav className="space-y-1" role="navigation" aria-label="Settings navigation">
                  {tabs.map((tab) => (
                    <Button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      variant="ghost"
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-atlvs-green-500 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                      aria-pressed={activeTab === tab.id}
                      aria-label={`${tab.label} settings`}
                    >
                      <tab.icon className="w-5 h-5" aria-hidden="true" />
                      <span className="font-oswald">{tab.label}</span>
                    </Button>
                  ))}
                </nav>
              </CardHeader>
            </Card>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                {activeTab === 'general' && (
                  <div>
                    <CardTitle className="mb-6">General Settings</CardTitle>
                    <div className="space-y-6">
                      <FormField label="Organization Name">
                        <Input
                          type="text"
                          defaultValue="ATLVS Productions"
                          variant="atlvs"
                        />
                      </FormField>
                      <FormField label="Time Zone">
                        <Select variant="atlvs">
                          <option>UTC-05:00 (Eastern Time)</option>
                          <option>UTC-08:00 (Pacific Time)</option>
                          <option>UTC+00:00 (GMT)</option>
                        </Select>
                      </FormField>
                      <FormField label="Language">
                        <Select variant="atlvs">
                          <option>English</option>
                          <option>Spanish</option>
                          <option>French</option>
                        </Select>
                      </FormField>
                      <Button variant="atlvs" aria-label="Save general settings changes">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <CardTitle className="mb-6">Profile Settings</CardTitle>
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center font-bebas text-h4">
                          JD
                        </div>
                        <Button variant="atlvs-outline" size="sm" aria-label="Change profile avatar">
                          Change Avatar
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="First Name">
                          <Input
                            type="text"
                            defaultValue="John"
                            variant="atlvs"
                          />
                        </FormField>
                        <FormField label="Last Name">
                          <Input
                            type="text"
                            defaultValue="Doe"
                            variant="atlvs"
                          />
                        </FormField>
                      </div>
                      <FormField label="Email">
                        <Input
                          type="email"
                          defaultValue="john.doe@atlvs.com"
                          variant="atlvs"
                        />
                      </FormField>
                      <Button variant="atlvs" aria-label="Update profile information">
                        Update Profile
                      </Button>
                    </div>
                  </div>
                )}

                {activeTab === 'notifications' && (
                  <div>
                    <CardTitle className="mb-6">Notification Preferences</CardTitle>
                    <div className="space-y-4">
                      {[
                        { label: 'Email Notifications', description: 'Receive email updates about your projects' },
                        { label: 'Push Notifications', description: 'Get push notifications on your devices' },
                        { label: 'Task Assignments', description: 'Notify when tasks are assigned to you' },
                        { label: 'Budget Alerts', description: 'Alert when budgets exceed thresholds' },
                        { label: 'Team Updates', description: 'Updates from your team members' }
                      ].map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg" role="group" aria-label={`${item.label} notification setting`}>
                          <div>
                            <div className="font-oswald text-white">{item.label}</div>
                            <div className="text-body-sm text-gray-400">{item.description}</div>
                          </div>
                          <Checkbox defaultChecked variant="atlvs" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'security' && (
                  <div>
                    <CardTitle className="mb-6">Security Settings</CardTitle>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-oswald text-white mb-4">Change Password</h3>
                        <div className="space-y-4">
                          <Input
                            type="password"
                            placeholder="Current Password"
                            variant="atlvs"
                          />
                          <Input
                            type="password"
                            placeholder="New Password"
                            variant="atlvs"
                          />
                          <Input
                            type="password"
                            placeholder="Confirm New Password"
                            variant="atlvs"
                          />
                          <Button variant="atlvs">
                            Update Password
                          </Button>
                        </div>
                      </div>
                      <div className="pt-6 border-t border-gray-800">
                        <h3 className="font-oswald text-white mb-4">Two-Factor Authentication</h3>
                        <p className="text-gray-400 mb-4">
                          Add an extra layer of security to your account
                        </p>
                        <Button variant="atlvs-outline">
                          Enable 2FA
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {['billing', 'team', 'api', 'integrations'].includes(activeTab) && (
                  <div>
                    <CardTitle className="mb-4">
                      {tabs.find(t => t.id === activeTab)?.label}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                      Settings for {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} coming soon...
                    </CardDescription>
                  </div>
                )}
              </CardHeader>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
