'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Check, FileText, AlertCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { useIntegrations } from '@/lib/hooks/atlvs/useIntegrations';

export default function QuickBooksIntegrationPage() {
  const { integrations, connect } = useIntegrations();
  const quickbooksIntegration = useMemo(() => 
    integrations.find(i => i.name.toLowerCase().includes('quickbooks')),
    [integrations]
  );
  const isConnected = quickbooksIntegration?.connected || false;
  const [formData, setFormData] = useState({
    companyId: '',
    syncFrequency: 'daily',
    syncInvoices: true,
    syncExpenses: true,
    syncCustomers: true
  });

  return (
    <AtlvsLayout>
      <ContentLayout
        title="QUICKBOOKS INTEGRATION"
        description="Sync financial data with QuickBooks"
        breadcrumbs={[
          { label: 'Integrations', href: '/atlvs/integrations' },
          { label: 'QuickBooks' }
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
                    <FileText className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <div>
                    <h3 className="text-h6">QuickBooks</h3>
                    <p className="text-body-sm text-gray-400">Accounting and financial management</p>
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
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-h6 mb-2">Connect to QuickBooks</h3>
                <p className="text-body-sm text-gray-400 mb-6 max-w-md mx-auto">
                  Authorize ATLVS to access your QuickBooks account to sync invoices, expenses, and customer data.
                </p>
                <Button variant="atlvs" onClick={() => connect('quickbooks')}>
                  Connect QuickBooks Account
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Sync Configuration */}
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <h3 className="text-h6">Sync Configuration</h3>
                  <p className="text-body-sm text-gray-400">Configure how data syncs with QuickBooks</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <FormField
                      label="Company ID"
                      required
                    >
                      <Input
                        variant="atlvs"
                        value={formData.companyId}
                        onChange={(e) => setFormData({ ...formData, companyId: e.target.value })}
                        placeholder="Enter QuickBooks Company ID"
                      />
                    </FormField>

                    <FormField
                      label="Sync Frequency"
                      required
                    >
                      <Select
                        variant="atlvs"
                        value={formData.syncFrequency}
                        onChange={(e) => setFormData({ ...formData, syncFrequency: e.target.value })}
                      >
                        <option value="realtime">Real-time</option>
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                      </Select>
                    </FormField>
                  </div>
                </CardContent>
              </Card>

              {/* Sync Features */}
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <h3 className="text-h6">Data Sync</h3>
                  <p className="text-body-sm text-gray-400">Choose what data to sync</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'Invoices', enabled: true },
                      { label: 'Expenses', enabled: true },
                      { label: 'Customers', enabled: true },
                      { label: 'Vendors', enabled: false },
                      { label: 'Products', enabled: false },
                      { label: 'Payments', enabled: true }
                    ].map((item) => (
                      <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50">
                        <span className="text-body-sm">{item.label}</span>
                        {item.enabled && <Check className="w-4 h-4 text-atlvs-green-500" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Last Sync */}
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-h6">Last Sync</h3>
                      <p className="text-body-sm text-gray-400">2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Sync Now
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            </>
          )}

          {/* Actions */}
          {isConnected && (
            <div className="flex gap-3">
              <Button variant="atlvs">
                Save Configuration
              </Button>
              <Button variant="outline">
                Test Connection
              </Button>
              <Button variant="ghost">
                <ExternalLink className="w-4 h-4 mr-2" />
                View in QuickBooks
              </Button>
            </div>
          )}
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
