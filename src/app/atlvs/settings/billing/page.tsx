'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useState as _useState } from 'react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { CreditCard, Download } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';

export default function BillingSettingsPage() {
  return (
    <AtlvsLayout>
      <ContentLayout
        title="BILLING"
        description="Manage subscription and payments"
        breadcrumbs={[
          { label: 'Settings', href: '/atlvs/settings' },
          { label: 'Billing' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Current Plan</CardTitle>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-h4 font-bebas atlvs-text-gradient mb-2">ENTERPRISE</div>
                  <div className="text-gray-400 mb-4">$299/month • Billed annually</div>
                  <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50">
                    Active
                  </Badge>
                </div>
                <Button variant="atlvs">Upgrade Plan</Button>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </CardTitle>
              <div className="p-4 bg-gray-800/50 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 rounded flex items-center justify-center font-bebas">
                    VISA
                  </div>
                  <div>
                    <div className="font-medium">•••• •••• •••• 4242</div>
                    <div className="text-body-sm text-gray-400">Expires 12/25</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Update</Button>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="mb-6">Billing History</CardTitle>
              <div className="space-y-3">
                {[
                  { date: '2024-06-01', amount: '$299.00', status: 'Paid' },
                  { date: '2024-05-01', amount: '$299.00', status: 'Paid' },
                  { date: '2024-04-01', amount: '$299.00', status: 'Paid' }
                ].map((invoice, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium mb-1">{invoice.date}</div>
                      <div className="text-body-sm text-gray-400">{invoice.amount}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="atlvs-outline" className="bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50">
                        {invoice.status}
                      </Badge>
                      <Button variant="ghost" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardHeader>
          </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
