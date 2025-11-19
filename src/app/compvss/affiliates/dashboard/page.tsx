'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Link as LinkIcon, BarChart2, Copy, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAffiliates } from '@/lib/hooks/compvss/useAffiliates';
import { useMemo } from 'react';
import { BodyText, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/affiliates/dashboard

export default function AffiliateDashboardPage() {
  const { data: affiliateData, isLoading, error, refetch } = useAffiliates();
  
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
  ];
  
  const stats = useMemo(() => {
    if (!affiliateData) return [
      { label: 'Total Earnings', value: '$0', icon: <DollarSign className="w-5 h-5" />, change: '+$0' },
      { label: 'Conversions', value: '0', icon: <TrendingUp className="w-5 h-5" />, change: '+0' },
      { label: 'Click Rate', value: '0%', icon: <BarChart2 className="w-5 h-5" />, change: '+0%' },
      { label: 'Active Links', value: '0', icon: <LinkIcon className="w-5 h-5" />, change: '+0' },
    ];
    
    const totalClicks = affiliateData.links?.reduce((sum: number, link: any) => sum + (link.clicks || 0), 0) || 0;
    const totalConversions = affiliateData.links?.reduce((sum: number, link: any) => sum + (link.conversions || 0), 0) || 0;
    const clickRate = totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(1) : '0';
    
    return [
      { label: 'Total Earnings', value: `$${affiliateData.totalEarnings || 0}`, icon: <DollarSign className="w-5 h-5" />, change: `+$${affiliateData.recentEarnings || 0}` },
      { label: 'Conversions', value: totalConversions.toString(), icon: <TrendingUp className="w-5 h-5" />, change: `+${affiliateData.recentConversions || 0}` },
      { label: 'Click Rate', value: `${clickRate}%`, icon: <BarChart2 className="w-5 h-5" />, change: '+0%' },
      { label: 'Active Links', value: (affiliateData.links?.length || 0).toString(), icon: <LinkIcon className="w-5 h-5" />, change: '+0' },
    ];
  }, [affiliateData]);

  const affiliateLinks = affiliateData?.links || [];
  const recentActivity = affiliateData?.recentActivity || [];
  
  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Affiliate Dashboard"
          description="Track your affiliate performance"
          variant="compvss"
          breadcrumbs={breadcrumbs}
          showToolbar={false}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading affiliate data...</BodyText>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }
  
  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Affiliate Dashboard"
          description="Track your affiliate performance"
          variant="compvss"
          breadcrumbs={breadcrumbs}
          showToolbar={false}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Affiliate Data</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
              <Button variant="compvss" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Affiliate Dashboard"
        description="Track your affiliate performance and earnings"
        variant="compvss"
        breadcrumbs={breadcrumbs}
        showToolbar={false}
      >
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500">
                      {stat.icon}
                    </div>
                    <Badge variant="compvss-outline" className="text-caption text-success border-success/30">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-grey-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Affiliate Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-compvss-cyan-500" />
                    Your Affiliate Links
                  </CardTitle>
                  <Link href="/compvss/affiliates/links">
                    <Button variant="compvss-ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {affiliateLinks.map((link) => (
                    <div
                      key={link.id}
                      className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-white mb-1">{link.name}</h3>
                          <div className="flex items-center gap-2 text-body-sm text-grey-400 -tech">
                            <span>{link.url}</span>
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:text-compvss-cyan-500">
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:text-compvss-cyan-500">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Badge variant="compvss" className="bg-success-light text-success border-success/30">
                          {link.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-white">{link.clicks}</div>
                          <div className="text-caption text-grey-400 -tech">Clicks</div>
                        </div>
                        <div>
                          <div className="text-compvss-cyan-500">{link.conversions}</div>
                          <div className="text-caption text-grey-400 -tech">Conversions</div>
                        </div>
                        <div>
                          <div className="text-success">{link.earnings}</div>
                          <div className="text-caption text-grey-400 -tech">Earned</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-compvss-cyan-500" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                    >
                      <div className="w-2 h-2 bg-compvss-cyan-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-white text-body-sm">{activity.event}</p>
                          <span className="text-success">{activity.amount}</span>
                        </div>
                        <p className="text-body-sm text-grey-400 -tech">{activity.link}</p>
                        <p className="text-caption text-grey-500 -tech mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Commission Info */}
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm mt-6">
              <CardContent className="pt-6">
                <SubsectionHeader className="text-white mb-3">Commission Structure</SubsectionHeader>
                <div className="space-y-2 text-body-sm text-grey-400 -tech">
                  <div className="flex items-center justify-between p-2 rounded bg-black/50">
                    <span>Standard Tickets</span>
                    <span className="text-compvss-cyan-500">10%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-black/50">
                    <span>VIP Packages</span>
                    <span className="text-compvss-cyan-500">15%</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded bg-black/50">
                    <span>Memberships</span>
                    <span className="text-compvss-cyan-500">20%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
