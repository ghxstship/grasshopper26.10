/**
 * Member Dashboard Page - UI Rebuild
 * Personal membership dashboard with stats and activity
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, H3, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface MembershipData {
  tier: string;
  status: string;
  joinDate: string;
  renewalDate: string;
  pointsEarned: number;
  eventsAttended: number;
  exclusiveAccess: number;
}

export default function MemberDashboardPage() {
  const [membership, setMembership] = React.useState<MembershipData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchMembership = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<MembershipData>('/api/memberships/dashboard');
        if (response.data) {
          setMembership(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch membership data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembership();
  }, []);

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

  if (!membership) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No Active Membership</H3>
              <Body className="mb-8 text-gray-600">
                You don&apos;t have an active membership yet.
              </Body>
              <Link href="/memberships">
                <Button>Explore Memberships</Button>
              </Link>
            </CardContent>
          </Card>
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
          <H1 className="mb-2">My Membership</H1>
          <Body className="text-gray-600">
            Manage your membership and track your benefits
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardContent className="p-6">
              <Caption className="text-gray-500 mb-2">Current Tier</Caption>
              <Display as="div">{membership.tier}</Display>
              <Badge className="mt-2">{membership.status}</Badge>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Caption className="text-gray-500 mb-2">Points Earned</Caption>
              <Display as="div">{membership.pointsEarned}</Display>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Caption className="text-gray-500 mb-2">Events Attended</Caption>
              <Display as="div">{membership.eventsAttended}</Display>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Membership Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Caption className="text-gray-500">Member Since</Caption>
                <Body>{new Date(membership.joinDate).toLocaleDateString()}</Body>
              </div>
              <div>
                <Caption className="text-gray-500">Next Renewal</Caption>
                <Body>{new Date(membership.renewalDate).toLocaleDateString()}</Body>
              </div>
              <div>
                <Caption className="text-gray-500">Exclusive Access</Caption>
                <Body>{membership.exclusiveAccess} items unlocked</Body>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/memberships/benefits">
                <Button variant="secondary" fullWidth>View All Benefits</Button>
              </Link>
              <Link href="/memberships/exclusive">
                <Button variant="secondary" fullWidth>Exclusive Content</Button>
              </Link>
              <Link href="/memberships/tiers">
                <Button variant="secondary" fullWidth>Upgrade Membership</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}
