'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, MessageSquare, AlertCircle, ExternalLink, Bell } from 'lucide-react';
import { useIntegrations } from '@/lib/hooks/atlvs/useIntegrations';
import { BodyText, CardTitle, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/integrations/slack

export default function SlackIntegrationPage() {
  const { integrations } = useIntegrations();
  const slackIntegration = integrations?.find((i: any) => i.type === 'slack');
  const [isConnected, setIsConnected] = useState(!!slackIntegration?.connected);
  const [formData, setFormData] = useState({
    defaultChannel: '#general',
    notifyOnTaskCreate: true,
    notifyOnTaskComplete: true,
    notifyOnMention: true
  });

  return (
    <AtlvsLayout>
      <ContentLayout
        title="SLACK INTEGRATION"
        description="Connect team communication with ATLVS"
        breadcrumbs={[
          { label: 'Integrations', href: '/atlvs/integrations' },
          { label: 'Slack' }
        ]}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Connection Status */}
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-atlvs-green-500/10 border border-atlvs-green-500/20">
                    <MessageSquare className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <div>
                    <SubsectionHeader >Slack</SubsectionHeader>
                    <BodyText className="text-body-sm text-grey-400">Team communication platform</BodyText>
                  </div>
                </div>
                {isConnected ? (
                  <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50">
                    <Check className="w-4 h-4 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="atlvs-outline" className="bg-error-light text-error border-error-border">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Disconnected
                  </Badge>
                )}
              </div>
            </CardHeader>
          </Card>

          {/* Workspace Info */}
          {isConnected && (
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <SubsectionHeader >Connected Workspace</SubsectionHeader>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-body-sm">
                    <span className="text-grey-400">Workspace Name</span>
                    <span className="font-medium">ATLVS Team</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-grey-400">Team ID</span>
                    <span className="font-mono text-caption">T01234567</span>
                  </div>
                  <div className="flex justify-between text-body-sm">
                    <span className="text-grey-400">Connected By</span>
                    <span>admin@atlvs.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {isConnected && (
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-atlvs-green-500" />
                  <SubsectionHeader >Notification Settings</SubsectionHeader>
                </div>
                <BodyText className="text-body-sm text-grey-400">Configure when to send Slack notifications</BodyText>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <FormField
                    label="Default Channel"
                    required
                    hint="Channel for system notifications"
                  >
                    <Select
                      variant="atlvs"
                      value={formData.defaultChannel}
                      onChange={(e) => setFormData({ ...formData, defaultChannel: e.target.value })}
                    >
                      <option value="#general">#general</option>
                      <option value="#atlvs">#atlvs</option>
                      <option value="#notifications">#notifications</option>
                      <option value="#tasks">#tasks</option>
                    </Select>
                  </FormField>

                  <div className="space-y-3 pt-4">
                    <CardTitle className="text-body-sm">Notification Events</CardTitle>
                    {[
                      { label: 'Task created', enabled: true },
                      { label: 'Task completed', enabled: true },
                      { label: 'Task assigned', enabled: true },
                      { label: 'Mentioned in comment', enabled: true },
                      { label: 'Project milestone reached', enabled: false },
                      { label: 'Budget threshold exceeded', enabled: true }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-grey-800/50">
                        <span className="text-body-sm">{item.label}</span>
                        {item.enabled && <Check className="w-4 h-4 text-atlvs-green-500" />}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Slash Commands */}
          {isConnected && (
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <SubsectionHeader >Available Slash Commands</SubsectionHeader>
                <BodyText className="text-body-sm text-grey-400">Use these commands in Slack</BodyText>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { command: '/atlvs task create', description: 'Create a new task' },
                    { command: '/atlvs task list', description: 'List your tasks' },
                    { command: '/atlvs project status', description: 'Get project status' },
                    { command: '/atlvs help', description: 'Show help information' }
                  ].map((item) => (
                    <div key={item.command} className="p-3 rounded-lg bg-grey-800/50">
                      <code className="text-body-sm text-atlvs-green-500">{item.command}</code>
                      <p className="text-caption text-grey-400 mt-1">{item.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            {isConnected ? (
              <>
                <Button variant="atlvs">
                  Save Configuration
                </Button>
                <Button variant="outline">
                  Test Notification
                </Button>
                <Button variant="ghost">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Slack
                </Button>
              </>
            ) : (
              <Button variant="atlvs" onClick={() => setIsConnected(true)}>
                Connect Slack Workspace
              </Button>
            )}
          </div>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
