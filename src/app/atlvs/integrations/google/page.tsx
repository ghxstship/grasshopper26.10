'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, AlertCircle, ExternalLink, Mail, FolderOpen } from 'lucide-react';

export default function GoogleIntegrationPage() {
  const [isConnected] = useState(true);

  return (
    <AtlvsLayout>
      <ContentLayout
        title="GOOGLE WORKSPACE INTEGRATION"
        description="Connect Google Calendar, Drive, and Gmail"
        breadcrumbs={[
          { label: 'Integrations', href: '/atlvs/integrations' },
          { label: 'Google Workspace' }
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
                    <Calendar className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">Google Workspace</h3>
                    <p className="text-sm text-gray-400">Calendar, Drive, and Gmail integration</p>
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

          {/* Account Info */}
          {isConnected && (
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <h3 className="text-lg font-medium">Connected Account</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Email</span>
                    <span className="font-medium">admin@atlvs.com</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Account Type</span>
                    <span>Google Workspace</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Connected Since</span>
                    <span>January 15, 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Google Calendar */}
          {isConnected && (
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-atlvs-green-500" />
                  <h3 className="text-lg font-medium">Google Calendar</h3>
                </div>
                <p className="text-sm text-gray-400">Sync events and meetings</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Two-way calendar sync',
                    'Automatic meeting creation',
                    'Event reminders',
                    'Attendee management',
                    'Calendar sharing'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-atlvs-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Google Drive */}
          {isConnected && (
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <FolderOpen className="w-5 h-5 text-atlvs-green-500" />
                  <h3 className="text-lg font-medium">Google Drive</h3>
                </div>
                <p className="text-sm text-gray-400">File storage and collaboration</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'File upload and download',
                    'Folder synchronization',
                    'Document collaboration',
                    'Version control',
                    'Shared drive access'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-atlvs-green-500" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Gmail */}
          {isConnected && (
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-atlvs-green-500" />
                  <h3 className="text-lg font-medium">Gmail</h3>
                </div>
                <p className="text-sm text-gray-400">Email integration and automation</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    'Send and receive emails',
                    'Email templates',
                    'Automated notifications',
                    'Attachment handling',
                    'Label management'
                  ].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-atlvs-green-500" />
                      <span>{feature}</span>
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
                  Refresh Permissions
                </Button>
                <Button variant="outline">
                  Test Connection
                </Button>
                <Button variant="ghost">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Google Account
                </Button>
              </>
            ) : (
              <Button variant="atlvs">
                Connect Google Account
              </Button>
            )}
          </div>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
