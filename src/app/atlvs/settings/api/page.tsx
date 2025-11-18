'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Eye, EyeOff, Trash2, Key, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useSettings } from '@/lib/hooks/atlvs/useSettings';

interface APIKey {
  id: string;
  name: string;
  key: string;
  created: string;
  lastUsed: string;
  status: string;
}

export default function APISettingsPage() {
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const { isLoading, error } = useSettings();
  const refetch = () => window.location.reload();
  const apiKeys: APIKey[] = [];

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="API SETTINGS"
          description="Loading API settings..."
          breadcrumbs={[
            { label: 'Settings', href: '/atlvs/_settings' },
            { label: 'API' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading API _settings...</p>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="API SETTINGS"
          description="Error loading _settings"
          breadcrumbs={[
            { label: 'Settings', href: '/atlvs/_settings' },
            { label: 'API' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load API Settings</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '••••••••••••••••';
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="API SETTINGS"
        description="Manage API keys and integrations"
        breadcrumbs={[
          { label: 'Settings', href: '/atlvs/_settings' },
          { label: 'API' }
        ]}
        actions={[
          {
            label: 'Create API Key',
            onClick: () => console.log('Create API Key'),
            variant: 'atlvs' as const
          }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-4">API Documentation</CardTitle>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">Base URL</div>
              <div className="flex items-center gap-2">
                <code className="flex-1 px-3 py-2 bg-gray-900 rounded font-mono text-sm">
                  https://api.atlvs.com/v1
                </code>
                <Button variant="ghost" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6 flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Keys
            </CardTitle>
            <div className="space-y-3">
              {apiKeys.map((apiKey) => (
                <div key={apiKey.id} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-lg">{apiKey.name}</span>
                        <Badge
                          variant="atlvs-outline"
                          className={apiKey.status === 'active' ? 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50' : 'bg-gray-500/20 text-gray-500 border-gray-500/50'}
                        >
                          {apiKey.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-400 mb-3">
                        Created {apiKey.created} • Last used {apiKey.lastUsed}
                      </div>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 px-3 py-2 bg-gray-900 rounded font-mono text-sm">
                          {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {showKeys[apiKey.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-error">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>

        <Card variant="atlvs" className="bg-gray-900/50 mt-6">
          <CardHeader>
            <CardTitle className="mb-6">Rate Limits</CardTitle>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Requests per minute</div>
                <div className="text-2xl font-bebas atlvs-text-gradient">1,000</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Daily limit</div>
                <div className="text-2xl font-bebas text-atlvs-green-500">100,000</div>
              </div>
              <div className="p-4 bg-gray-800/50 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Current usage</div>
                <div className="text-2xl font-bebas text-atlvs-purple-500">24,567</div>
              </div>
            </div>
          </CardHeader>
        </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
