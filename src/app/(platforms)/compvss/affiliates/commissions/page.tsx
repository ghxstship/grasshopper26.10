/**
 * Affiliate Commissions Page - UI Rebuild
 * Track affiliate commission earnings and payouts
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { apiClient } from '@/lib/api/client';

interface Commission {
  id: string;
  referralId: string;
  amount: number;
  status: string;
  earnedDate: string;
  paidDate?: string;
}

export default function CommissionsPage() {
  const [loading, setLoading] = React.useState(true);
  const [commissions, setCommissions] = React.useState<Commission[]>([]);
  const [totalEarned, setTotalEarned] = React.useState(0);
  const [totalPending, setTotalPending] = React.useState(0);

  React.useEffect(() => {
    const fetchCommissions = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ commissions: Commission[]; totalEarned: number; totalPending: number }>('/api/compvss/affiliates/commissions');
        if (response.data) {
          setCommissions(response.data.commissions || []);
          setTotalEarned(response.data.totalEarned || 0);
          setTotalPending(response.data.totalPending || 0);
        }
      } catch (error) {
        console.error('Failed to fetch commissions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, []);

  const pendingCommissions = commissions.filter((c) => c.status === 'PENDING');
  const paidCommissions = commissions.filter((c) => c.status === 'PAID');

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
          <H1 className="mb-2">Commission Earnings</H1>
          <Body className="text-gray-600">Track your affiliate commission earnings</Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card variant="compvss">
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Total Earned</Caption>
              <Display as="div">${totalEarned.toFixed(2)}</Display>
            </CardContent>
          </Card>
          <Card variant="compvss">
            <CardContent className="p-6 text-center">
              <Caption className="text-gray-500 mb-2">Pending</Caption>
              <Display as="div">${totalPending.toFixed(2)}</Display>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingCommissions.length})</TabsTrigger>
            <TabsTrigger value="paid">Paid ({paidCommissions.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <div className="space-y-4">
              {pendingCommissions.map((commission) => (
                <Card key={commission.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>${commission.amount.toFixed(2)}</CardTitle>
                        <Caption className="text-gray-500">Referral: {commission.referralId}</Caption>
                      </div>
                      <Badge>{commission.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Caption className="text-gray-500">Earned: {new Date(commission.earnedDate).toLocaleDateString()}</Caption>
                  </CardContent>
                </Card>
              ))}
              {pendingCommissions.length === 0 && (
                <Card variant="compvss">
                  <CardContent className="p-12 text-center">
                    <Body className="text-gray-500">No pending commissions</Body>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="paid">
            <div className="space-y-4">
              {paidCommissions.map((commission) => (
                <Card key={commission.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>${commission.amount.toFixed(2)}</CardTitle>
                        <Caption className="text-gray-500">Referral: {commission.referralId}</Caption>
                      </div>
                      <Badge>{commission.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Caption className="text-gray-500">Earned: {new Date(commission.earnedDate).toLocaleDateString()}</Caption>
                      {commission.paidDate && (
                        <Caption className="text-gray-500">Paid: {new Date(commission.paidDate).toLocaleDateString()}</Caption>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
              {paidCommissions.length === 0 && (
                <Card variant="compvss">
                  <CardContent className="p-12 text-center">
                    <Body className="text-gray-500">No paid commissions</Body>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
