'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Users2, TrendingUp, DollarSign, Award, Link as LinkIcon, Copy, Share2, Trophy, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { IconButton } from '@/components/atoms/IconButton';
import { useReferrals, useReferralLeaderboard, ReferralLink, LeaderboardEntry } from '@/lib/hooks/compvss/useReferrals';
import { useMemo } from 'react';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/referrals/dashboard

export default function ReferralDashboardPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Referrals', href: '/compvss/referrals/dashboard' },
  ];

  const { data: referralsData, isLoading, error, refetch } = useReferrals();
  const { data: leaderboardData, isLoading: _leaderboardLoading } = useReferralLeaderboard();
  
  const links = referralsData?.links || [];
  const apiStats = referralsData?.stats;
  const leaderboard = leaderboardData?.leaderboard || [];

  const stats = useMemo(() => {
    if (apiStats) {
      return [
        { label: 'Total Referrals', value: apiStats.totalReferrals?.toString() || '0', icon: <Users2 className="w-5 h-5" />, change: `+${apiStats.change?.referrals || 0}` },
        { label: 'Conversions', value: apiStats.conversions?.toString() || '0', icon: <TrendingUp className="w-5 h-5" />, change: `+${apiStats.change?.conversions || 0}` },
        { label: 'Total Earned', value: `$${apiStats.totalEarned || 0}`, icon: <DollarSign className="w-5 h-5" />, change: `+$${apiStats.change?.earned || 0}` },
        { label: 'Tier Level', value: apiStats.tierLevel || 'Bronze', icon: <Award className="w-5 h-5" />, change: apiStats.tierLevel || 'Tier 1' },
      ];
    }
    
    return [
      { label: 'Total Referrals', value: '0', icon: <Users2 className="w-5 h-5" />, change: '+0' },
      { label: 'Conversions', value: '0', icon: <TrendingUp className="w-5 h-5" />, change: '+0' },
      { label: 'Total Earned', value: '$0', icon: <DollarSign className="w-5 h-5" />, change: '+$0' },
      { label: 'Tier Level', value: 'Bronze', icon: <Award className="w-5 h-5" />, change: 'Tier 1' },
    ];
  }, [apiStats]);

  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <BodyText className="text-grey-400">Loading referrals...</BodyText>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Referrals</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const rewardTiers = [
    { name: 'Bronze', min: 0, max: 9, reward: '$20/referral', color: 'text-atlvs-orange-500' },
    { name: 'Silver', min: 10, max: 19, reward: '$30/referral', color: 'text-grey-400' },
    { name: 'Gold', min: 20, max: 49, reward: '$40/referral', color: 'text-warning', active: true },
    { name: 'Platinum', min: 50, max: 999, reward: '$60/referral', color: 'text-cyan-400' },
  ];

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <HeroTitle className="compvss-text-gradient">Referral Dashboard</HeroTitle>
              <BodyText className="text-grey-400 mt-1">Earn rewards by referring new users</BodyText>
            </div>
            <Link href="/compvss/referrals/generate">
              <Button variant="compvss" size="lg">
                <Share2 className="w-5 h-5 mr-2" />
                Generate Link
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
          {/* Referral Links */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <LinkIcon className="w-5 h-5 text-compvss-cyan-500" />
                    Your Referral Links
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {links.map((link: ReferralLink) => (
                    <div
                      key={link.id}
                      className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-white mb-1">{link.name}</h3>
                          <div className="flex items-center gap-2 text-body-sm text-grey-400 -tech">
                            <span className="truncate">{link.url}</span>
                            <IconButton
                              variant="ghost"
                              size="sm"
                              icon={<Copy className="w-3 h-3" />}
                              className="hover:text-compvss-cyan-500 transition-colors"
                            />
                          </div>
                        </div>
                        <Badge variant="compvss" className="bg-success-light text-success border-success/30">
                          {link.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-white">{link.clicks}</div>
                          <div className="text-caption text-grey-400 -tech">Clicks</div>
                        </div>
                        <div>
                          <div className="text-compvss-cyan-500">{link.conversions}</div>
                          <div className="text-caption text-grey-400 -tech">Conversions</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reward Tiers */}
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-compvss-cyan-500" />
                  Reward Tiers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {rewardTiers.map((tier) => (
                    <div
                      key={tier.name}
                      className={`p-4 rounded-lg ${ tier.active ? 'bg-compvss-cyan-500/10 border-2 border-compvss-cyan-500' : 'bg-black/50 border border-grey-700' }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className={`${tier.color}`}>
                            {tier.name}
                            {tier.active && ' (Current)'}
                          </h3>
                          <p className="text-body-sm text-grey-400 -tech">
                            {tier.min}-{tier.max === 999 ? '+' : tier.max} referrals
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-white">{tier.reward}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Leaderboard */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-compvss-cyan-500" />
                  Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((entry: LeaderboardEntry & { isCurrentUser?: boolean }) => (
                    <div
                      key={entry.rank}
                      className={`p-4 rounded-lg ${ entry.isCurrentUser ? 'bg-compvss-cyan-500/10 border-2 border-compvss-cyan-500' : 'bg-black/50 border border-compvss-cyan-500/20' }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-white w-12 text-center">
                          {entry.badge || `#${entry.rank}`}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-white">
                            {entry.name}
                            {entry.isCurrentUser && ' (You)'}
                          </h3>
                          <p className="text-body-sm text-grey-400 -tech">
                            {entry.referrals} referrals
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-success">${entry.rewards}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </CompvssLayout>
  );
}
