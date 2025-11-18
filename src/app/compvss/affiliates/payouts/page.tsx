'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Wallet, Calendar, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useAffiliates } from '@/lib/hooks/compvss';

export default function AffiliatePayoutsPage() {
  const { data: affiliateData, isLoading, error, refetch } = useAffiliates();
  const payouts = affiliateData?.payouts || [];
  
  if (isLoading) {
    return (
      <CompvssLayout >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading payouts...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }
  
  if (error) {
    return (
      <CompvssLayout >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-h5 font-bebas mb-2">Failed to Load Payouts</h2>
            <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
    { label: 'Payouts', href: '/compvss/affiliates/payouts' },
  ];

  return (
    <CompvssLayout>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-h3 font-bebas compvss-text-gradient">Payout History</h1>
          <p className="text-gray-400 font-oswald mt-1">View your payout history</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="compvss" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Wallet className="w-5 h-5 text-compvss-cyan-500" />
              Payouts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {payouts.map((payout, index) => (
                <motion.div
                  key={payout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-success-light0/10 rounded-lg">
                        <CheckCircle2 className="w-6 h-6 text-success" />
                      </div>
                      <div>
                        <h3 className="font-oswald text-white mb-1">{payout.method}</h3>
                        <div className="flex items-center gap-2 text-body-sm text-gray-400 font-share-tech">
                          <Calendar className="w-4 h-4" />
                          <span>{payout.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-h4 font-bebas text-white mb-1">{payout.amount}</div>
                      <Badge variant="compvss" className="bg-success-light text-success border-success/30">
                        {payout.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CompvssLayout>
  );
}
