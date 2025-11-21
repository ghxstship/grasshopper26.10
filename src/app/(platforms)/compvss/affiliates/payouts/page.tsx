/**
 * Payouts Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Payout {
  id: string;
  amount: number;
  status: string;
  method: string;
  processedDate?: string;
  scheduledDate: string;
}

export default function PayoutsPage() {
  const [loading, setLoading] = React.useState(true);
  const [payouts, setPayouts] = React.useState<Payout[]>([]);

  React.useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ payouts: Payout[] }>('/api/compvss/affiliates/payouts');
        if (response.data?.payouts) {
          setPayouts(response.data.payouts);
        }
      } catch (error) {
        console.error('Failed to fetch payouts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayouts();
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
        <div className="mb-8">
          <H1 className="mb-2">Payouts</H1>
          <Body className="text-gray-600">Track your affiliate payout history</Body>
        </div>

        <div className="space-y-4">
          {payouts.map((payout) => (
            <Card key={payout.id} variant="compvss">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>${payout.amount.toFixed(2)}</CardTitle>
                  <Badge>{payout.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Caption className="text-gray-500">Method</Caption>
                    <Body className="capitalize">{payout.method}</Body>
                  </div>
                  <div>
                    <Caption className="text-gray-500">{payout.processedDate ? 'Processed' : 'Scheduled'}</Caption>
                    <Body>{new Date(payout.processedDate || payout.scheduledDate).toLocaleDateString()}</Body>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {payouts.length === 0 && (
            <Card variant="compvss">
              <CardContent className="p-12 text-center">
                <Body className="text-gray-500">No payouts yet</Body>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
