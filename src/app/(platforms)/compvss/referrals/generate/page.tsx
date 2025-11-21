/**
 * Generate Referral Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


export default function GenerateReferralPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get('/api/compvss/referrals/link-data');
        setData(response.data);
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
          <H1 className="mb-4">Generate Referral</H1>
          <Body className="text-gray-600">
            Generate Referral page content
          </Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Generate Referral Link</CardTitle>
            <CardDescription>Share and earn rewards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.referralLink && (
                <div className="p-4 bg-gray-50 rounded">
                  <Body className="text-sm font-medium mb-2">Your Referral Link</Body>
                  <Body className="text-sm break-all">{data.referralLink}</Body>
                  <Button variant="compvss" className="w-full mt-2">Copy Link</Button>
                </div>
              )}
              <div><Body className="font-medium">Total Referrals:</Body><Body className="text-2xl">{data?.totalReferrals || 0}</Body></div>
              <div><Body className="font-medium">Rewards Earned:</Body><Body className="text-2xl">${data?.rewardsEarned || 0}</Body></div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
