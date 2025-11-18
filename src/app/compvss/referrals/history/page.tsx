'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { motion } from 'framer-motion';
import { History, UserPlus, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useReferrals } from '@/lib/hooks/compvss/useReferrals';

export default function ReferralHistoryPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Referrals', href: '/compvss/referrals/dashboard' },
    { label: 'History', href: '/compvss/referrals/history' },
  ];

  const { data, isLoading, error, refetch } = useReferrals();
  const referrals = data?.referrals || [];

  if (isLoading) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading referral history...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Referrals</h2>
            <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bebas compvss-text-gradient">Referral History</h1>
          <p className="text-gray-400 font-oswald mt-1">View all your referrals</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="compvss" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="w-5 h-5 text-compvss-cyan-500" />
              All Referrals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {referrals.map((referral, index) => (
                <motion.div
                  key={referral.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 flex items-center justify-center">
                        <UserPlus className="w-5 h-5 text-black" />
                      </div>
                      <div>
                        <h3 className="font-oswald text-white mb-1">{referral.name}</h3>
                        <p className="text-sm text-gray-400 font-share-tech">{referral.email}</p>
                        <p className="text-xs text-gray-500 font-share-tech mt-1">{referral.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bebas text-white mb-1">{referral.earnings}</div>
                      <Badge 
                        variant="compvss" 
                        className={referral.status === 'active' ? 'bg-success-light text-success border-green-500/30' : 'bg-warning-light text-warning border-yellow-500/30'}
                      >
                        {referral.status === 'active' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                        {referral.status}
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
