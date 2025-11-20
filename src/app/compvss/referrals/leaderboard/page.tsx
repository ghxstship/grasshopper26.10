'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Award, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useReferralLeaderboard } from '@/lib/hooks/compvss/useReferrals';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/referrals/leaderboard

export default function ReferralLeaderboardPage() {
  const _breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Referrals', href: '/compvss/referrals/dashboard' },
    { label: 'Leaderboard', href: '/compvss/referrals/leaderboard' },
  ];

  const { data, isLoading, error, refetch } = useReferralLeaderboard();
  const leaderboard = data?.leaderboard || [];

  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <BodyText className="text-grey-400">Loading leaderboard...</BodyText>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Leaderboard</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const leaders = leaderboard;

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HeroTitle className="compvss-text-gradient">Referral Leaderboard</HeroTitle>
          <BodyText className="text-grey-400 mt-1">Top referrers this month</BodyText>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="compvss" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-warning" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaders.map((leader, index) => (
                <motion.div
                  key={leader.rank}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${ leader.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black' : leader.rank === 2 ? 'bg-gradient-to-r from-grey-400 to-grey-500 text-black' : leader.rank === 3 ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-black' : 'bg-grey-800 text-white' }`}>
                        {leader.rank}
                      </div>
                      <div>
                        <h3 className="text-white mb-1">{leader.name}</h3>
                        <div className="flex items-center gap-3 text-body-sm text-grey-400 -tech">
                          <span>{leader.referrals} referrals</span>
                          {leader.badge && (
                            <Badge variant="compvss" className={`text-caption ${ leader.badge === 'Gold' ? 'bg-warning-light text-warning' : leader.badge === 'Silver' ? 'bg-grey-400/20 text-grey-400' : 'bg-warning/20 text-atlvs-orange-500' }`}>
                              <Award className="w-3 h-3 mr-1" />
                              {leader.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-compvss-cyan-500">{leader.earnings}</div>
                      <div className="flex items-center gap-1 text-caption text-success -tech">
                        <TrendingUp className="w-3 h-3" />
                        <span>+{leader.referrals * 2}%</span>
                      </div>
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
