'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Settings, Save } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';

import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/automation/settings

export default function AutomationSettingsPage() {
  return (
    <AtlvsLayout>
      <ContentLayout
        title="AUTOMATION SETTINGS"
        description="Configure workflow automation preferences"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Automation', href: '/atlvs/automation' },
          { label: 'Settings' }
        ]}
        actions={[
          {
            label: 'Save Settings',
            onClick: () => {},
            icon: <Save className="w-4 h-4" />,
            variant: 'atlvs' as const
          }
        ]}
      >
        <div className="space-y-6">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle className="mb-6 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                General Settings
              </CardTitle>
              <div className="space-y-4">
                <FormField label="Default Execution Timeout" required>
                  <Input
                    type="number"
                    placeholder="300"
                    defaultValue="300"
                  />
                </FormField>

                <FormField label="Max Concurrent Executions" required>
                  <Input
                    type="number"
                    placeholder="10"
                    defaultValue="10"
                  />
                </FormField>

                <FormField label="Retry Policy" required>
                  <Select defaultValue="exponential">
                    <option value="none">None</option>
                    <option value="linear">Linear</option>
                    <option value="exponential">Exponential</option>
                  </Select>
                </FormField>

                <FormField label="Max Retry Attempts" required>
                  <Input
                    type="number"
                    placeholder="3"
                    defaultValue="3"
                  />
                </FormField>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Notification Settings</CardTitle>
              <div className="space-y-4">
                <FormField label="Notification Email" required>
                  <Input
                    type="email"
                    placeholder="admin@example.com"
                  />
                </FormField>

                <FormField label="Notify On" required>
                  <Select defaultValue="failures">
                    <option value="all">All Executions</option>
                    <option value="failures">Failures Only</option>
                    <option value="none">None</option>
                  </Select>
                </FormField>

                <FormField label="Slack Webhook URL">
                  <Input
                    type="url"
                    placeholder="https://hooks.slack.com/services/..."
                  />
                </FormField>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Advanced Settings</CardTitle>
              <div className="space-y-4">
                <FormField label="Execution History Retention (days)" required>
                  <Input
                    type="number"
                    placeholder="30"
                    defaultValue="30"
                  />
                </FormField>

                <FormField label="Log Level" required>
                  <Select defaultValue="info">
                    <option value="debug">Debug</option>
                    <option value="info">Info</option>
                    <option value="warn">Warning</option>
                    <option value="error">Error</option>
                  </Select>
                </FormField>

                <FormField label="Custom Environment Variables">
                  <Textarea
                    placeholder="KEY=value&#10;ANOTHER_KEY=another_value"
                    rows={4}
                  />
                </FormField>
              </div>
            </CardHeader>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="ghost">
              Reset to Defaults
            </Button>
            <Button variant="atlvs">
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </Button>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
