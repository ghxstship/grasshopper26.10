'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Calendar, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useAffiliates } from '@/lib/hooks/compvss';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/affiliates/earnings

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
      <CompvssLayout >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <BodyText className="text-grey-400">Loading earnings...</BodyText>
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
            <SectionHeader className="mb-2">Failed to Load Earnings</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const _breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
    { label: 'Earnings', href: '/compvss/affiliates/earnings' },
  ];

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HeroTitle className="compvss-text-gradient">Earnings</HeroTitle>
          <BodyText className="text-grey-400 mt-1">Track your affiliate earnings</BodyText>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6">
                  <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500 w-fit mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-grey-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="compvss" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="text-white">Monthly Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {earnings.map((earning, index) => (
                <div key={index} className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white mb-1">{earning.month}</h3>
                      <p className="text-body-sm text-grey-400 -tech">{earning.conversions} conversions</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white mb-1">{earning.amount}</div>
                      <div className={`text-caption -tech ${earning.status === 'paid' ? 'text-success' : 'text-warning'}`}>
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
