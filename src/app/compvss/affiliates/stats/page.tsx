'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { BarChart3, Users2, MousePointerClick, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useAffiliates } from '@/lib/hooks/compvss';
import { useMemo } from 'react';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/affiliates/stats

export default function AffiliateStatsPage() {
  const { data: affiliateData, isLoading, error, refetch } = useAffiliates();
  
  const metrics = useMemo(() => {
    if (!affiliateData) return [
      { label: 'Total Clicks', value: '0', icon: <MousePointerClick className="w-5 h-5" />, color: 'from-blue-500 to-cyan-600' },
      { label: 'Conversions', value: '0', icon: <Users2 className="w-5 h-5" />, color: 'from-green-500 to-emerald-600' },
      { label: 'Conversion Rate', value: '0%', icon: <BarChart3 className="w-5 h-5" />, color: 'from-purple-500 to-pink-600' },
      { label: 'Avg Commission', value: '$0', icon: <DollarSign className="w-5 h-5" />, color: 'from-orange-500 to-amber-600' },
    ];
    
    const totalClicks = affiliateData.links?.reduce((sum, link) => sum + (link.clicks || 0), 0) || 0;
    const totalConversions = affiliateData.links?.reduce((sum, link) => sum + (link.conversions || 0), 0) || 0;
    const conversionRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : '0';
    const avgCommission = totalConversions > 0 ? (affiliateData.totalEarnings / totalConversions).toFixed(0) : '0';
    
    return [
      { label: 'Total Clicks', value: totalClicks.toString(), icon: <MousePointerClick className="w-5 h-5" />, color: 'from-blue-500 to-cyan-600' },
      { label: 'Conversions', value: totalConversions.toString(), icon: <Users2 className="w-5 h-5" />, color: 'from-green-500 to-emerald-600' },
      { label: 'Conversion Rate', value: `${conversionRate}%`, icon: <BarChart3 className="w-5 h-5" />, color: 'from-purple-500 to-pink-600' },
      { label: 'Avg Commission', value: `$${avgCommission}`, icon: <DollarSign className="w-5 h-5" />, color: 'from-orange-500 to-amber-600' },
    ];
  }, [affiliateData]);
  
  if (isLoading) {
    return (
      <CompvssLayout >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <BodyText className="text-grey-400">Loading stats...</BodyText>
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
            <SectionHeader className="mb-2">Failed to Load Stats</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message || 'An error occurred'}</p>
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
    { label: 'Stats', href: '/compvss/affiliates/stats' },
  ];

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HeroTitle className="compvss-text-gradient">Performance Stats</HeroTitle>
          <BodyText className="text-grey-400 mt-1">View detailed performance metrics</BodyText>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${metric.color} flex items-center justify-center text-white mb-4`}>
                    {metric.icon}
                  </div>
                  <div className="text-white mb-1">{metric.value}</div>
                  <div className="text-body-sm text-grey-400">{metric.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </CompvssLayout>
  );
}
