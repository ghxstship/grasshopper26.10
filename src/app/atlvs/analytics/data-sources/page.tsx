'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useState as _useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Plus, Check, AlertCircle, RefreshCw, Trash2 } from 'lucide-react';
import { useAnalytics } from '@/lib/hooks/atlvs/useAnalytics';
import { DataSource } from '@/types/atlvs';

export default function DataSourcesPage() {  
  const { data,  } = useAnalytics();
  const dataSources: DataSource[] = (data as { sources?: DataSource[] })?.sources || [
    {
      id: '3',
      name: 'Google Analytics',
      type: 'API',
      status: 'error',
      lastSync: '1 hour ago',
      recordCount: 0
    },
    {
      id: '4',
      name: 'QuickBooks',
      type: 'API',
      status: 'disconnected',
      lastSync: 'Never',
      recordCount: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected':
        return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'error':
        return 'bg-error-light text-error border-error-border';
      case 'disconnected':
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'connected':
        return <Check className="w-4 h-4" />;
      case 'error':
        return <AlertCircle className="w-4 h-4" />;
      case 'disconnected':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="DATA SOURCES"
        description="Manage analytics data connections"
        breadcrumbs={[
          { label: 'Analytics', href: '/atlvs/analytics' },
          { label: 'Data Sources' }
        ]}
        actions={[
          {
            label: 'Add Data Source',
            onClick: () => {},
            icon: <Plus className="w-4 h-4" />,
            variant: 'atlvs' as const
          }
        ]}
      >
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-body-sm text-gray-400 mb-1">Total Sources</div>
                <div className="text-h3 font-bebas atlvs-text-gradient">
                  {dataSources.length}
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-body-sm text-gray-400 mb-1">Connected</div>
                <div className="text-h3 font-bebas text-atlvs-green-500">
                  {dataSources.filter((ds: DataSource) => ds.status === 'connected').length}
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-body-sm text-gray-400 mb-1">Errors</div>
                <div className="text-h3 font-bebas text-error">
                  {dataSources.filter(ds => ds.status === '_error').length}
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-body-sm text-gray-400 mb-1">Total Records</div>
                <div className="text-h3 font-bebas atlvs-text-gradient">
                  {dataSources.reduce((sum: number, ds: DataSource) => sum + (ds.recordCount || 0), 0).toLocaleString()}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Data Sources List */}
          <div className="space-y-4">
            {dataSources.map((source) => (
              <Card key={source.id} variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 rounded-lg bg-atlvs-green-500/10 border border-atlvs-green-500/20">
                        <Database className="w-6 h-6 text-atlvs-green-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-h6">{source.name}</h3>
                          <Badge variant="atlvs-outline" className={getStatusColor(source.status || 'unknown')}>
                            {getStatusIcon(source.status || 'unknown')}
                            <span className="ml-1">{(source.status || 'unknown').toUpperCase()}</span>
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-body-sm">
                          <div>
                            <div className="text-gray-400 mb-1">Type</div>
                            <div>{source.type}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Last Sync</div>
                            <div>{source.lastSync}</div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Records</div>
                            <div className="font-medium text-atlvs-green-500">
                              {(source.recordCount || 0).toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>

          {/* Add New Data Source Form */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Add New Data Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField label="Data Source Name" required>
                  <Input
                    variant="atlvs"
                    placeholder="Enter data source name"
                  />
                </FormField>

                <FormField label="Source Type" required>
                  <Select variant="atlvs">
                    <option value="">Select type</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="mongodb">MongoDB</option>
                    <option value="api">REST API</option>
                    <option value="graphql">GraphQL</option>
                    <option value="csv">CSV File</option>
                  </Select>
                </FormField>

                <FormField label="Connection String" required>
                  <Input
                    variant="atlvs"
                    type="password"
                    placeholder="Enter connection string or API key"
                  />
                </FormField>

                <FormField label="Sync Frequency">
                  <Select variant="atlvs">
                    <option value="realtime">Real-time</option>
                    <option value="5min">Every 5 minutes</option>
                    <option value="15min">Every 15 minutes</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                  </Select>
                </FormField>

                <div className="flex gap-3 pt-4">
                  <Button variant="atlvs">
                    Test Connection
                  </Button>
                  <Button variant="outline">
                    Save Data Source
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
