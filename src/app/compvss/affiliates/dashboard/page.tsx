'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { TrendingUp, DollarSign, Link as LinkIcon, BarChart2, Copy, ExternalLink, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAffiliates } from '@/lib/hooks/compvss/useAffiliates';
import { useMemo } from 'react';

export default function AffiliateDashboardPage() {
  const { data: affiliateData, isLoading, error, refetch } = useAffiliates();
  
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
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading affiliate data...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }
  
  if (error) {
    return (
      <CompvssLayout>
        <div className="min-h-screen bg-black text-white flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Affiliate Data</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
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
  ];

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bebas compvss-text-gradient">Affiliate Dashboard</h1>
              <p className="text-gray-400 font-oswald mt-1">Track your affiliate performance and earnings</p>
            </div>
            <Link href="/compvss/affiliates/links/new">
              <Button variant="compvss" size="lg">
                <LinkIcon className="w-5 h-5 mr-2" />
                Create Link
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500">
                      {stat.icon}
                    </div>
                    <Badge variant="compvss-outline" className="text-xs text-success border-green-500/30">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-3xl font-bebas text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-oswald">{stat.label}</div>
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
            <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
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
                          <h3 className="font-oswald text-white mb-1">{link.name}</h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400 font-share-tech">
                            <span>{link.url}</span>
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:text-compvss-cyan-500">
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="p-0 h-auto hover:text-compvss-cyan-500">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                        <Badge variant="compvss" className="bg-success-light text-success border-green-500/30">
                          {link.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bebas text-white">{link.clicks}</div>
                          <div className="text-xs text-gray-400 font-share-tech">Clicks</div>
                        </div>
                        <div>
                          <div className="text-lg font-bebas text-compvss-cyan-500">{link.conversions}</div>
                          <div className="text-xs text-gray-400 font-share-tech">Conversions</div>
                        </div>
                        <div>
                          <div className="text-lg font-bebas text-success">{link.earnings}</div>
                          <div className="text-xs text-gray-400 font-share-tech">Earned</div>
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
            <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
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
                          <p className="text-white font-oswald text-sm">{activity.event}</p>
                          <span className="text-success font-bebas text-lg">{activity.amount}</span>
                        </div>
                        <p className="text-sm text-gray-400 font-share-tech">{activity.link}</p>
                        <p className="text-xs text-gray-500 font-share-tech mt-1">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Commission Info */}
            <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm mt-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bebas text-white mb-3">Commission Structure</h3>
                <div className="space-y-2 text-sm text-gray-400 font-share-tech">
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
      </div>
    </CompvssLayout>
  );
}
