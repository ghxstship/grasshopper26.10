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

export default function ReferralLeaderboardPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Referrals', href: '/compvss/referrals/dashboard' },
    { label: 'Leaderboard', href: '/compvss/referrals/leaderboard' },
  ];

  const { data, isLoading, error, refetch } = useReferralLeaderboard();
  const leaderboard = data?.leaderboard || [];

  if (isLoading) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading leaderboard...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Leaderboard</h2>
            <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
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
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bebas compvss-text-gradient">Referral Leaderboard</h1>
          <p className="text-gray-400 font-oswald mt-1">Top referrers this month</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="compvss" className="bg-gray-900/50">
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
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bebas text-2xl ${
                        leader.rank === 1 ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-black' :
                        leader.rank === 2 ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-black' :
                        leader.rank === 3 ? 'bg-gradient-to-r from-orange-600 to-orange-700 text-black' :
                        'bg-gray-800 text-white'
                      }`}>
                        {leader.rank}
                      </div>
                      <div>
                        <h3 className="font-oswald text-white mb-1">{leader.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-400 font-share-tech">
                          <span>{leader.referrals} referrals</span>
                          {leader.badge && (
                            <Badge variant="compvss" className={`text-xs ${
                              leader.badge === 'Gold' ? 'bg-warning-light text-warning' :
                              leader.badge === 'Silver' ? 'bg-gray-400/20 text-gray-400' :
                              'bg-orange-600/20 text-atlvs-orange-500'
                            }`}>
                              <Award className="w-3 h-3 mr-1" />
                              {leader.badge}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bebas text-compvss-cyan-500">{leader.earnings}</div>
                      <div className="flex items-center gap-1 text-xs text-success font-share-tech">
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
