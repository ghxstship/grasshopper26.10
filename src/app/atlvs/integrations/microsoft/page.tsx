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
import { Check, Mail, AlertCircle, ExternalLink, FolderOpen, Users } from 'lucide-react';

export default function MicrosoftIntegrationPage() {
  const [isConnected] = useState(false);

  return (
    <AtlvsLayout>
      <ContentLayout
        title="MICROSOFT 365 INTEGRATION"
        description="Connect Outlook, Teams, and OneDrive"
        breadcrumbs={[
          { label: 'Integrations', href: '/atlvs/integrations' },
          { label: 'Microsoft 365' }
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
                    <Mail className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <div>
                    <h3 className="text-h6">Microsoft 365</h3>
                    <p className="text-body-sm text-gray-400">Outlook, Teams, and OneDrive integration</p>
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

          {!isConnected ? (
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardContent className="text-center py-12">
                <Mail className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-h6 mb-2">Connect to Microsoft 365</h3>
                <p className="text-body-sm text-gray-400 mb-6 max-w-md mx-auto">
                  Authorize ATLVS to access your Microsoft 365 account to sync emails, calendar events, and files.
                </p>
                <Button variant="atlvs">
                  Connect Microsoft Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Outlook */}
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-atlvs-green-500" />
                    <h3 className="text-h6">Outlook</h3>
                  </div>
                  <p className="text-body-sm text-gray-400">Email and calendar integration</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Send and receive emails',
                      'Calendar synchronization',
                      'Contact management',
                      'Email templates',
                      'Meeting scheduling'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-body-sm">
                        <Check className="w-4 h-4 text-atlvs-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Teams */}
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-atlvs-green-500" />
                    <h3 className="text-h6">Microsoft Teams</h3>
                  </div>
                  <p className="text-body-sm text-gray-400">Team collaboration and chat</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'Team notifications',
                      'Channel messages',
                      'File sharing',
                      'Video meetings',
                      'Bot integration'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-body-sm">
                        <Check className="w-4 h-4 text-atlvs-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* OneDrive */}
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-5 h-5 text-atlvs-green-500" />
                    <h3 className="text-h6">OneDrive</h3>
                  </div>
                  <p className="text-body-sm text-gray-400">Cloud storage and file sync</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      'File upload and download',
                      'Folder synchronization',
                      'Document collaboration',
                      'Version history',
                      'Shared folders'
                    ].map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-body-sm">
                        <Check className="w-4 h-4 text-atlvs-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Actions */}
          {isConnected && (
            <div className="flex gap-3">
              <Button variant="atlvs">
                Refresh Permissions
              </Button>
              <Button variant="outline">
                Test Connection
              </Button>
              <Button variant="ghost">
                <ExternalLink className="w-4 h-4 mr-2" />
                Microsoft Account
              </Button>
            </div>
          )}
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
