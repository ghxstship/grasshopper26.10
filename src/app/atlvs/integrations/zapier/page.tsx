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
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-atlvs-green-500/10 border border-atlvs-green-500/20">
                    <Zap className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Zapier</h3>
                    <p className="text-sm text-gray-400">Workflow automation platform</p>
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
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <h3 className="text-lg font-medium">Setup Instructions</h3>
              <p className="text-sm text-gray-400">Connect ATLVS to Zapier in 3 steps</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-atlvs-green-500/20 border border-atlvs-green-500/50 flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Copy your API Key</h4>
                    <p className="text-sm text-gray-400 mb-2">Use this key to authenticate ATLVS in Zapier</p>
                    <div className="flex gap-2">
                      <Input
                        variant="atlvs"
                        value={apiKey}
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button variant="outline" size="sm">
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-atlvs-green-500/20 border border-atlvs-green-500/50 flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Create a Zap</h4>
                    <p className="text-sm text-gray-400">Go to Zapier and search for &quot;ATLVS&quot; to create your first automation</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-atlvs-green-500/20 border border-atlvs-green-500/50 flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <h4 className="font-medium mb-1">Authenticate</h4>
                    <p className="text-sm text-gray-400">Paste your API key when prompted to connect ATLVS to Zapier</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Available Triggers */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <h3 className="text-lg font-medium">Available Triggers</h3>
              <p className="text-sm text-gray-400">Events that can start a Zap</p>
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
                  <div key={trigger} className="p-3 rounded-lg bg-gray-800/50 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-atlvs-green-500" />
                    <span className="text-sm">{trigger}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Available Actions */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <h3 className="text-lg font-medium">Available Actions</h3>
              <p className="text-sm text-gray-400">Things you can do with ATLVS</p>
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
                  <div key={action} className="p-3 rounded-lg bg-gray-800/50 flex items-center gap-2">
                    <Check className="w-4 h-4 text-atlvs-green-500" />
                    <span className="text-sm">{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Popular Zaps */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <h3 className="text-lg font-medium">Popular Zaps</h3>
              <p className="text-sm text-gray-400">Common automation workflows</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { from: 'Gmail', to: 'ATLVS', action: 'Create task from starred email' },
                  { from: 'Google Calendar', to: 'ATLVS', action: 'Create task from new event' },
                  { from: 'ATLVS', to: 'Slack', action: 'Send notification on task completion' },
                  { from: 'Typeform', to: 'ATLVS', action: 'Create project from form submission' }
                ].map((zap, index) => (
                  <div key={index} className="p-4 rounded-lg bg-gray-800/50">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium">{zap.from}</span>
                      <Zap className="w-4 h-4 text-atlvs-green-500" />
                      <span className="font-medium">{zap.to}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{zap.action}</p>
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
