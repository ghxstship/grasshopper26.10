'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { TrendingUp, Gift, Star, Award, Calendar, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useLoyalty } from '@/lib/hooks/gvteway/useLoyalty';

const REWARDS = [
  { id: 1, name: '$10 Event Credit', points: 500, available: true },
  { id: 2, name: '$25 Event Credit', points: 1000, available: true },
  { id: 3, name: 'VIP Upgrade', points: 2000, available: true },
  { id: 4, name: 'Free Merchandise', points: 1500, available: false },
  { id: 5, name: 'Meet & Greet Pass', points: 5000, available: false },
];

const HISTORY = [
  { date: '2025-06-01', action: 'Ticket Purchase', points: '+250', type: 'earned' },
  { date: '2025-05-15', action: 'Redeemed $10 Credit', points: '-500', type: 'redeemed' },
  { date: '2025-05-10', action: 'Event Check-in', points: '+100', type: 'earned' },
  { date: '2025-04-20', action: 'Referral Bonus', points: '+500', type: 'earned' },
];

export default function LoyaltyPointsPage() {
  const { data: loyalty, isLoading, error, refetch } = useLoyalty();
  const currentPoints = loyalty?.totalPoints || 0;
  const nextTier = 5000;
  const progress = (currentPoints / nextTier) * 100;

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading loyalty data...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>Try Again</Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-12">
                <Link href="/gvteway/wallet">
                  <Button variant="ghost" size="sm" className="mb-4 text-gray-400 hover:text-white">
                    ← Back to Wallet
                  </Button>
                </Link>
                <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient">
                  LOYALTY REWARDS
                </h1>
                <p className="text-xl text-gray-400 font-oswald">
                  Earn points and unlock exclusive rewards
                </p>
              </div>

              {/* Points Balance Card */}
              <Card variant="gvteway" className="bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20 backdrop-blur-sm mb-8">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 rounded-full mb-4">
                      <TrendingUp className="w-10 h-10 text-white" />
                    </div>
                    <p className="text-gray-300 text-sm mb-2">Your Balance</p>
                    <p className="text-6xl font-bebas text-white mb-1">{currentPoints.toLocaleString()}</p>
                    <p className="text-gray-300">Loyalty Points</p>
                  </div>

                  {/* Progress to Next Tier */}
                  <div className="max-w-md mx-auto">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-300">Progress to Gold Tier</span>
                      <span className="text-sm text-gray-300">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-gvteway-red-500 to-gvteway-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                      />
                    </div>
                    <p className="text-center text-gray-400 text-sm mt-2">
                      {nextTier - currentPoints} points to Gold Tier
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="grid lg:grid-cols-3 gap-8">
                {/* Available Rewards */}
                <div className="lg:col-span-2">
                  <h2 className="text-3xl font-bebas text-white mb-6" id="rewards-heading">Available Rewards</h2>
                  <div className="space-y-4" role="list" aria-labelledby="rewards-heading">
                    {REWARDS.map((reward) => (
                      <Card key={reward.id} variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm" role="listitem">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-gvteway-red-500/20 rounded-full flex items-center justify-center" aria-hidden="true">
                                <Gift className="w-6 h-6 text-gvteway-red-500" aria-hidden="true" />
                              </div>
                              <div>
                                <h3 className="text-lg font-bebas text-white mb-1">{reward.name}</h3>
                                <p className="text-gray-400 text-sm">{reward.points} points</p>
                              </div>
                            </div>
                            <Button
                              variant={reward.available ? 'gvteway' : 'outline'}
                              size="sm"
                              disabled={!reward.available}
                              aria-label={reward.available ? `Redeem ${reward.name} for ${reward.points} points` : `${reward.name} locked, requires ${reward.points} points`}
                            >
                              {reward.available ? 'Redeem' : 'Locked'}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Points History */}
                  <h2 className="text-3xl font-bebas text-white mb-6 mt-12" id="history-heading">Points History</h2>
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="space-y-4" role="list" aria-labelledby="history-heading">
                        {HISTORY.map((item, index) => (
                          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0" role="listitem">
                            <div className="flex items-center gap-3">
                              <div className={`w-2 h-2 rounded-full ${
                                item.type === 'earned' ? 'bg-green-500' : 'bg-error'
                              }`} aria-hidden="true" />
                              <div>
                                <p className="text-white font-medium">{item.action}</p>
                                <p className="text-gray-400 text-sm flex items-center">
                                  <Calendar className="w-3 h-3 mr-1" aria-hidden="true" />
                                  {item.date}
                                </p>
                              </div>
                            </div>
                            <span className={`text-lg font-bebas ${
                              item.type === 'earned' ? 'text-success' : 'text-error'
                            }`}>
                              {item.points}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Membership Tier */}
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">Current Tier</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-700 rounded-full mb-3" aria-hidden="true">
                          <Star className="w-8 h-8 text-gray-400" aria-hidden="true" />
                        </div>
                        <h3 className="text-2xl font-bebas text-white mb-1">Silver</h3>
                        <Badge variant="default">Member</Badge>
                      </div>
                      <div className="space-y-2 text-sm text-gray-400">
                        <div className="flex items-center">
                          <span className="text-success mr-2">✓</span>
                          <span>5% points bonus</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-success mr-2">✓</span>
                          <span>Early access to sales</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-success mr-2">✓</span>
                          <span>Birthday rewards</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* How to Earn */}
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                    <CardHeader>
                      <CardTitle className="text-white">How to Earn Points</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-start">
                          <Award className="w-4 h-4 text-gvteway-red-500 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-white font-medium">Purchase Tickets</p>
                            <p className="text-gray-400">Earn 1 point per $1 spent</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Award className="w-4 h-4 text-gvteway-red-500 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-white font-medium">Attend Events</p>
                            <p className="text-gray-400">+100 points per check-in</p>
                          </div>
                        </div>
                        <div className="flex items-start">
                          <Award className="w-4 h-4 text-gvteway-red-500 mr-2 mt-1 flex-shrink-0" />
                          <div>
                            <p className="text-white font-medium">Refer Friends</p>
                            <p className="text-gray-400">+500 points per referral</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* CTA */}
                  <Card variant="gvteway" className="bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20 backdrop-blur-sm">
                    <CardContent className="p-6 text-center">
                      <Award className="w-12 h-12 text-gvteway-red-500 mx-auto mb-3" />
                      <h3 className="text-xl font-bebas text-white mb-2">
                        Upgrade to Premium
                      </h3>
                      <p className="text-gray-300 text-sm mb-4">
                        Get 2x points on all purchases
                      </p>
                      <Button variant="gvteway" className="w-full">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
