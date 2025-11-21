/**
 * Loyalty Points Page - UI Rebuild
 * Manage loyalty points and rewards
 */

'use client';

import * as React from 'react';
import { H1, H2, H3, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Gift, TrendingUp, Award } from 'lucide-react';

interface LoyaltyData {
  totalPoints: number;
  tier: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';
  pointsToNextTier: number;
  lifetimePoints: number;
  transactions: Array<{
    id: string;
    type: 'EARNED' | 'REDEEMED';
    points: number;
    description: string;
    date: string;
  }>;
  rewards: Array<{
    id: string;
    name: string;
    pointsCost: number;
    description: string;
    available: boolean;
  }>;
}

export default function LoyaltyPointsPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<LoyaltyData | null>(null);
  const [redeeming, setRedeeming] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchLoyaltyData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<LoyaltyData>('/api/wallet/loyalty');
        if (response.data) {
          setData(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch loyalty data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLoyaltyData();
  }, []);

  const handleRedeem = async (rewardId: string) => {
    try {
      setRedeeming(rewardId);
      await apiClient.post(`/api/wallet/loyalty/redeem/${rewardId}`);
      // Refresh data after redemption
      const response = await apiClient.get<LoyaltyData>('/api/wallet/loyalty');
      if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Failed to redeem reward:', error);
    } finally {
      setRedeeming(null);
    }
  };

  const getTierColor = (tier: LoyaltyData['tier']) => {
    switch (tier) {
      case 'PLATINUM':
        return 'bg-gradient-to-r from-gray-400 to-gray-600';
      case 'GOLD':
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 'SILVER':
        return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 'BRONZE':
        return 'bg-gradient-to-r from-orange-400 to-orange-600';
      default:
        return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">No loyalty data available</H2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Loyalty Points</H1>
          <Body className="text-gray-600">
            Earn points with every purchase and redeem them for exclusive rewards
          </Body>
        </div>

        {/* Points Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className={getTierColor(data.tier)}>
            <CardContent className="pt-6 text-center text-white">
              <Award className="w-12 h-12 mx-auto mb-4" />
              <Caption className="text-white/80 mb-2">Current Tier</Caption>
              <Display as="div" className="text-4xl">{data.tier}</Display>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Gift className="w-12 h-12 mx-auto mb-4 text-gray-900" />
              <Caption className="text-gray-500 mb-2">Available Points</Caption>
              <Display as="div" className="text-4xl">{data.totalPoints.toLocaleString()}</Display>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-900" />
              <Caption className="text-gray-500 mb-2">Lifetime Points</Caption>
              <Display as="div" className="text-4xl">{data.lifetimePoints.toLocaleString()}</Display>
            </CardContent>
          </Card>
        </div>

        {/* Progress to Next Tier */}
        {data.pointsToNextTier > 0 && (
          <Card className="mb-8">
            <CardContent className="py-6">
              <div className="flex items-center justify-between mb-2">
                <Body className="font-semibold">Progress to Next Tier</Body>
                <Caption className="text-gray-600">
                  {data.pointsToNextTier.toLocaleString()} points needed
                </Caption>
              </div>
              <div className="w-full bg-gray-200 h-3 border-2 border-black">
                <div 
                  className="bg-black h-full transition-all duration-500"
                  style={{ 
                    width: `${Math.min(100, ((data.totalPoints / (data.totalPoints + data.pointsToNextTier)) * 100))}%` 
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Rewards */}
          <div>
            <H3 className="mb-6">Available Rewards</H3>
            <div className="space-y-4">
              {data.rewards.map((reward) => (
                <Card key={reward.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle>{reward.name}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </div>
                      <Badge>{reward.pointsCost.toLocaleString()} pts</Badge>
                    </div>
                  </CardHeader>
                  <CardFooter>
                    <Button
                      fullWidth
                      onClick={() => handleRedeem(reward.id)}
                      disabled={!reward.available || data.totalPoints < reward.pointsCost || redeeming === reward.id}
                      loading={redeeming === reward.id}
                    >
                      {redeeming === reward.id ? 'Redeeming...' : 
                       data.totalPoints < reward.pointsCost ? 'Not Enough Points' : 'Redeem'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div>
            <H3 className="mb-6">Recent Activity</H3>
            <Card>
              <CardContent className="p-0">
                {data.transactions.length === 0 ? (
                  <div className="py-12 text-center">
                    <Body className="text-gray-600">No transactions yet</Body>
                  </div>
                ) : (
                  <div className="divide-y-2 divide-black">
                    {data.transactions.map((transaction) => (
                      <div key={transaction.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <Body className="font-semibold mb-1">
                              {transaction.description}
                            </Body>
                            <Caption className="text-gray-500">
                              {new Date(transaction.date).toLocaleDateString()}
                            </Caption>
                          </div>
                          <div className="text-right">
                            <Body className={`font-semibold ${
                              transaction.type === 'EARNED' ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {transaction.type === 'EARNED' ? '+' : '-'}{transaction.points.toLocaleString()}
                            </Body>
                            <Caption className="text-gray-500">
                              {transaction.type === 'EARNED' ? 'Earned' : 'Redeemed'}
                            </Caption>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* How to Earn Points */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>How to Earn Points</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold">1</div>
              <div>
                <Body className="font-semibold">Make Purchases</Body>
                <Caption className="text-gray-600">Earn 1 point for every dollar spent</Caption>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold">2</div>
              <div>
                <Body className="font-semibold">Refer Friends</Body>
                <Caption className="text-gray-600">Get 500 bonus points for each referral</Caption>
              </div>
            </div>
            <Separator />
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-bold">3</div>
              <div>
                <Body className="font-semibold">Complete Challenges</Body>
                <Caption className="text-gray-600">Participate in special events for bonus points</Caption>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
