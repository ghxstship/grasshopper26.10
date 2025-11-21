/**
 * Affiliates Page - UI Rebuild
 * Manage affiliate program and track referrals
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Copy, Users, DollarSign } from 'lucide-react';

interface AffiliateStats {
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  pendingEarnings: number;
  referralLink: string;
}

export default function AffiliatesPage() {
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<AffiliateStats | null>(null);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<AffiliateStats>('/api/compvss/affiliates/stats');
        if (response.data) setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const copyToClipboard = async () => {
    if (stats?.referralLink) {
      await navigator.clipboard.writeText(stats.referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="compvss" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Affiliate Program</H1>
          <Body className="text-gray-600">
            Earn rewards by referring new team members
          </Body>
        </div>

        {stats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card variant="compvss">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Body className="text-gray-600 mb-2">Total Referrals</Body>
                      <Display as="div" className="text-3xl">{stats.totalReferrals}</Display>
                    </div>
                    <Users className="w-12 h-12 text-cyan-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="compvss">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Body className="text-gray-600 mb-2">Active Referrals</Body>
                      <Display as="div" className="text-3xl text-green-600">{stats.activeReferrals}</Display>
                    </div>
                    <Users className="w-12 h-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="compvss">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Body className="text-gray-600 mb-2">Total Earnings</Body>
                      <Display as="div" className="text-3xl">${stats.totalEarnings.toFixed(2)}</Display>
                    </div>
                    <DollarSign className="w-12 h-12 text-cyan-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card variant="compvss" className="mb-6">
              <CardHeader>
                <CardTitle>Your Referral Link</CardTitle>
                <CardDescription>Share this link to earn rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <div className="flex-1 p-3 bg-gray-50 border-2 border-black rounded font-mono text-sm break-all">
                    {stats.referralLink}
                  </div>
                  <Button variant="compvss" onClick={copyToClipboard}>
                    <Copy className="w-4 h-4 mr-2" />
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card variant="compvss">
              <CardHeader>
                <CardTitle>Pending Earnings</CardTitle>
                <CardDescription>Earnings awaiting payout</CardDescription>
              </CardHeader>
              <CardContent>
                <H3>${stats.pendingEarnings.toFixed(2)}</H3>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}