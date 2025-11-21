/**
 * Accept Invite Page - UI Rebuild
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


export default function AcceptInvitePage() {
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

        const response = await apiClient.get('/api/auth/invite-status');
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
          <H1 className="mb-4">Accept Invite</H1>
          <Body className="text-gray-600">
            Accept Invite page content
          </Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Team Invitation</CardTitle>
            <CardDescription>{data?.invitedBy ? `Invited by ${data.invitedBy}` : 'Pending invitation'}</CardDescription>
          </CardHeader>
          <CardContent>
            {data?.status === 'pending' ? (
              <div className="space-y-4">
                <Body>You have been invited to join the team.</Body>
                <div className="flex gap-4">
                  <Button variant="compvss">Accept Invitation</Button>
                  <Button variant="secondary">Decline</Button>
                </div>
              </div>
            ) : (
              <Body className="text-green-600">Invitation {data?.status || 'accepted'}</Body>
            )}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
