'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { BodyText, CardTitle, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/integrations/zapier

export default function ZapierIntegrationPage() {
  const [isConnected] = useState(false);
  const [apiKey] = useState('zap_live_••••••••••••••••••••••••');

  return (
    <AtlvsLayout>
      <ContentLayout
        title="ZAPIER INTEGRATION"
        description="Connect to 5000+ apps with automation"
        breadcrumbs={[
          { label: 'Integrations', href: '/atlvs/integrations' },
          { label: 'Zapier' }
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
                    <Zap className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <div>
                    <SubsectionHeader >Zapier</SubsectionHeader>
                    <BodyText className="text-body-sm text-grey-400">Workflow automation platform</BodyText>
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

          {/* Setup Instructions */}
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <SubsectionHeader >Setup Instructions</SubsectionHeader>
              <BodyText className="text-body-sm text-grey-400">Connect ATLVS to Zapier in 3 steps</BodyText>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-atlvs-green-500/20 border border-atlvs-green-500/50 flex items-center justify-center text-body-sm">
                    1
                  </div>
                  <div>
                    <CardTitle className="font-medium mb-1">Copy your API Key</CardTitle>
                    <BodyText className="text-body-sm text-grey-400 mb-2">Use this key to authenticate ATLVS in Zapier</BodyText>
                    <div className="flex gap-2">
                      <Input
                        variant="atlvs"
                        value={apiKey}
                        readOnly
                        className="font-mono text-body-sm"
                      />
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-atlvs-green-500/20 border border-atlvs-green-500/50 flex items-center justify-center text-body-sm">
                    2
                  </div>
                  <div>
                    <CardTitle className="font-medium mb-1">Create a Zap</CardTitle>
                    <BodyText className="text-body-sm text-grey-400">Go to Zapier and search for &quot;ATLVS&quot; to create your first automation</BodyText>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-atlvs-green-500/20 border border-atlvs-green-500/50 flex items-center justify-center text-body-sm">
                    3
                  </div>
                  <div>
                    <CardTitle className="font-medium mb-1">Authenticate</CardTitle>
                    <BodyText className="text-body-sm text-grey-400">Paste your API key when prompted to connect ATLVS to Zapier</BodyText>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Triggers */}
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <SubsectionHeader >Available Triggers</SubsectionHeader>
              <BodyText className="text-body-sm text-grey-400">Events that can start a Zap</BodyText>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'New Task Created',
                  'Task Completed',
                  'Task Assigned',
                  'Project Created',
                  'Budget Updated',
                  'Invoice Generated',
                  'Payment Received',
                  'Team Member Added'
                ].map((trigger) => (
                  <div key={trigger} className="p-3 rounded-lg bg-grey-800/50 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-atlvs-green-500" />
                    <span className="text-body-sm">{trigger}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Actions */}
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <SubsectionHeader >Available Actions</SubsectionHeader>
              <BodyText className="text-body-sm text-grey-400">Things you can do with ATLVS</BodyText>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  'Create Task',
                  'Update Task',
                  'Create Project',
                  'Add Team Member',
                  'Send Notification',
                  'Create Invoice',
                  'Update Budget',
                  'Add Comment'
                ].map((action) => (
                  <div key={action} className="p-3 rounded-lg bg-grey-800/50 flex items-center gap-2">
                    <Check className="w-4 h-4 text-atlvs-green-500" />
                    <span className="text-body-sm">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Zaps */}
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <SubsectionHeader >Popular Zaps</SubsectionHeader>
              <BodyText className="text-body-sm text-grey-400">Common automation workflows</BodyText>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { from: 'Gmail', to: 'ATLVS', action: 'Create task from starred email' },
                  { from: 'Google Calendar', to: 'ATLVS', action: 'Create task from new event' },
                  { from: 'ATLVS', to: 'Slack', action: 'Send notification on task completion' },
                  { from: 'Typeform', to: 'ATLVS', action: 'Create project from form submission' }
                ].map((zap, index) => (
                  <div key={index} className="p-4 rounded-lg bg-grey-800/50">
                    <div className="flex items-center gap-3 text-body-sm">
                      <span className="font-medium">{zap.from}</span>
                      <Zap className="w-4 h-4 text-atlvs-green-500" />
                      <span className="font-medium">{zap.to}</span>
                    </div>
                    <p className="text-caption text-grey-400 mt-1">{zap.action}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="atlvs">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Zapier
            </Button>
            <Button variant="outline">
              Regenerate API Key
            </Button>
            <Button variant="ghost">
              View Documentation
            </Button>
          </div>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
