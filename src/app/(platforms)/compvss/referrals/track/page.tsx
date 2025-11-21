/**
 * Track Referrals Page - UI Rebuild
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


export default function TrackReferralsPage() {
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

        const response = await apiClient.get('/api/compvss/referrals/tracking');
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
          <H1 className="mb-4">Track Referrals</H1>
          <Body className="text-gray-600">
            Track Referrals page content
          </Body>
        </div>

        <div className="space-y-4">
          {data?.referrals && data.referrals.map((ref: any) => (
            <Card key={ref.id} variant="compvss">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Body className="font-medium">{ref.name || 'Anonymous'}</Body>
                    <Body className="text-sm text-gray-500">Joined {new Date(ref.joinedDate).toLocaleDateString()}</Body>
                  </div>
                  <Body className="text-sm capitalize">{ref.status}</Body>
                </div>
              </CardContent>
            </Card>
          ))}
          {(!data?.referrals || data.referrals.length === 0) && (
            <Card variant="compvss"><CardContent className="p-12 text-center"><Body className="text-gray-500">No referrals tracked</Body></CardContent></Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
