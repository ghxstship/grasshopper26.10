'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useAffiliates } from '@/lib/hooks/compvss';

export default function AffiliateEarningsPage() {
  const { data: affiliateData, isLoading, error, refetch } = useAffiliates();
  
  const stats = [
    { label: 'Total Earnings', value: `$${affiliateData?.totalEarnings || 0}`, icon: <DollarSign className="w-5 h-5" /> },
    { label: 'This Month', value: `$${affiliateData?.recentEarnings || 0}`, icon: <Calendar className="w-5 h-5" /> },
    { label: 'Growth', value: '+15%', icon: <TrendingUp className="w-5 h-5" /> },
  ];

  const earnings = affiliateData?.earnings || [];
  
  if (isLoading) {
    return (
      <CompvssLayout breadcrumbs={[
        { label: 'Dashboard', href: '/compvss/dashboard' },
        { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
        { label: 'Earnings', href: '/compvss/affiliates/earnings' },
      ]}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading earnings...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }
  
  if (error) {
    return (
      <CompvssLayout breadcrumbs={[
        { label: 'Dashboard', href: '/compvss/dashboard' },
        { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
        { label: 'Earnings', href: '/compvss/affiliates/earnings' },
      ]}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Earnings</h2>
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
    { label: 'Earnings', href: '/compvss/affiliates/earnings' },
  ];

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bebas compvss-text-gradient">Earnings</h1>
          <p className="text-gray-400 font-oswald mt-1">Track your affiliate earnings</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card variant="compvss" className="bg-gray-900/50">
                <CardContent className="pt-6">
                  <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500 w-fit mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bebas text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-oswald">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="compvss" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {earnings.map((earning, index) => (
                <div key={index} className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-oswald text-white mb-1">{earning.month}</h3>
                      <p className="text-sm text-gray-400 font-share-tech">{earning.conversions} conversions</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bebas text-white mb-1">{earning.amount}</div>
                      <div className={`text-xs font-share-tech ${earning.status === 'paid' ? 'text-success' : 'text-warning'}`}>
                        {earning.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CompvssLayout>
  );
}
