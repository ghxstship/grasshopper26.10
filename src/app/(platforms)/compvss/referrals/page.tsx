/**
 * COMPVSS Referrals Dashboard - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';

export default function CompvssReferralsPage() {
  const [data, setData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<any>('/api/compvss/referrals');
        if (response.data) {
          setData(response.data.referrals || response.data);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  const [referralLink] = React.useState('https://compvss.com/ref/ABC123');

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Referral Program</H1>
          <Body className="text-gray-600">Earn rewards by referring new team members</Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Total Referrals</Caption>
              <Display as="div">12</Display>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Active</Caption>
              <Display as="div">8</Display>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Rewards Earned</Caption>
              <Display as="div">$240</Display>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Rank</Caption>
              <Display as="div">#15</Display>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Your Referral Link</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Input value={referralLink} readOnly className="flex-1" />
            <Button onClick={copyLink}>Copy</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <Body className="text-gray-600 text-center py-12">Leaderboard coming soon</Body>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
