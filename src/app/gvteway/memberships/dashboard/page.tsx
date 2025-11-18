/**
 * GVTEWAY Member Dashboard Page
 * Agent 2.5: Reverse Order Implementation - Module 7
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Progress } from '@/components/atoms/Progress';
import { Crown, TrendingUp, Gift, Calendar, Ticket, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { useMemberships } from '@/lib/hooks/gvteway/useMemberships';

export default function MemberDashboardPage() {
  const { data: memberships, isLoading, error, refetch } = useMemberships();
  const _membership = memberships?.memberships?.[0]; // Get first membership
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading _membership...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Membership</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Member Dashboard</h1>
            <p className="text-gray-400">Track your benefits and savings</p>
          </div>
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 text-lg px-4 py-2">
            <Crown className="w-5 h-5 mr-2" />
            Premium Member
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-600/20 to-blue-800/20 border-blue-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-info text-sm font-medium">Total Saved</p>
                  <p className="text-3xl font-bold text-white mt-2">$245</p>
                </div>
                <DollarSign className="w-10 h-10 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-600/20 to-purple-800/20 border-purple-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-atlvs-purple-500 text-sm font-medium">Events Attended</p>
                  <p className="text-3xl font-bold text-white mt-2">24</p>
                </div>
                <Calendar className="w-10 h-10 text-atlvs-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-600/20 to-green-800/20 border-green-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-400 text-sm font-medium">Tickets Purchased</p>
                  <p className="text-3xl font-bold text-white mt-2">47</p>
                </div>
                <Ticket className="w-10 h-10 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-600/20 to-orange-800/20 border-orange-500/30">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-atlvs-orange-500 text-sm font-medium">Rewards Points</p>
                  <p className="text-3xl font-bold text-white mt-2">1,250</p>
                </div>
                <Gift className="w-10 h-10 text-atlvs-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Membership Progress */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Membership Progress
            </CardTitle>
            <CardDescription>You&apos;re 3 events away from VIP status!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Events This Year</span>
                <span className="text-white font-medium">24 / 30</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-300">Spending This Year</span>
                <span className="text-white font-medium">$2,450 / $3,000</span>
              </div>
              <Progress value={82} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Active Benefits */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Active Benefits</CardTitle>
            <CardDescription>Your current _membership perks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-info/20 rounded-full flex items-center justify-center">
                    <Ticket className="w-5 h-5 text-info" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">10% Ticket Discount</h4>
                    <p className="text-sm text-gray-400">On all events</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-atlvs-purple-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Early Access</h4>
                    <p className="text-sm text-gray-400">24h before public</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">No Booking Fees</h4>
                    <p className="text-sm text-gray-400">Save on every purchase</p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                    <Gift className="w-5 h-5 text-atlvs-orange-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Exclusive Events</h4>
                    <p className="text-sm text-gray-400">Member-only access</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Prompt */}
        <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <Crown className="w-8 h-8 text-atlvs-purple-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">Upgrade to VIP</h3>
                  <p className="text-gray-300">Get 20% off, backstage access, and more!</p>
                </div>
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Upgrade Now
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
