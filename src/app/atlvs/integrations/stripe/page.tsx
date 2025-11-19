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
import { BodyText, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/integrations/stripe

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
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-atlvs-green-500/10 border border-atlvs-green-500/20">
                    <DollarSign className="w-6 h-6 text-atlvs-green-500" />
                  </div>
                  <div>
                    <SubsectionHeader >Stripe</SubsectionHeader>
                    <BodyText className="text-body-sm text-grey-400">Payment processing platform</BodyText>
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
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <SubsectionHeader >API Configuration</SubsectionHeader>
              <BodyText className="text-body-sm text-grey-400">Configure your Stripe API credentials</BodyText>
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
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <SubsectionHeader >Enabled Features</SubsectionHeader>
              <BodyText className="text-body-sm text-grey-400">Stripe features available in ATLVS</BodyText>
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
