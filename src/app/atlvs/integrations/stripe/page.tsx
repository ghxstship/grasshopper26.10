'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { FormField } from '@/components/molecules/FormField';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, DollarSign, AlertCircle, ExternalLink } from 'lucide-react';

export default function StripeIntegrationPage() {
  const [isConnected] = useState(true);
  const [formData, setFormData] = useState({
    publishableKey: 'pk_live_••••••••••••••••',
    secretKey: 'sk_live_••••••••••••••••',
    webhookSecret: 'whsec_••••••••••••••••'
  });

  return (
    <AtlvsLayout>
      <ContentLayout
        title="STRIPE INTEGRATION"
        description="Configure Stripe payment processing"
        breadcrumbs={[
          { label: 'Integrations', href: '/atlvs/integrations' },
          { label: 'Stripe' }
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
                    <DollarSign className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <div>
                    <h3 className="text-h6">Stripe</h3>
                    <p className="text-body-sm text-gray-400">Payment processing platform</p>
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

          {/* API Configuration */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <h3 className="text-h6">API Configuration</h3>
              <p className="text-body-sm text-gray-400">Configure your Stripe API credentials</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  label="Publishable Key"
                  required
                >
                  <Input
                    variant="atlvs"
                    value={formData.publishableKey}
                    onChange={(e) => setFormData({ ...formData, publishableKey: e.target.value })}
                    placeholder="pk_live_..."
                  />
                </FormField>

                <FormField
                  label="Secret Key"
                  required
                >
                  <Input
                    variant="atlvs"
                    type="password"
                    value={formData.secretKey}
                    onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                    placeholder="sk_live_..."
                  />
                </FormField>

                <FormField
                  label="Webhook Secret"
                  required
                  hint="Used to verify webhook signatures"
                >
                  <Input
                    variant="atlvs"
                    type="password"
                    value={formData.webhookSecret}
                    onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                    placeholder="whsec_..."
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <h3 className="text-h6">Enabled Features</h3>
              <p className="text-body-sm text-gray-400">Stripe features available in ATLVS</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  'Payment processing',
                  'Subscription management',
                  'Invoice generation',
                  'Customer portal',
                  'Webhook events',
                  'Refund processing'
                ].map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-body-sm">
                    <Check className="w-4 h-4 text-atlvs-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="atlvs">
              Save Configuration
            </Button>
            <Button variant="outline">
              Test Connection
            </Button>
            <Button variant="ghost">
              <ExternalLink className="w-4 h-4 mr-2" />
              View in Stripe
            </Button>
          </div>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
