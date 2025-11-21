/**
 * Membership Benefits Page - UI Rebuild
 * Detailed breakdown of membership benefits
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Benefit {
  id: string;
  title: string;
  description: string;
  tier: string;
  icon: string;
}

export default function BenefitsPage() {
  const [benefits, setBenefits] = React.useState<Benefit[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBenefits = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ benefits: Benefit[] }>('/api/memberships/benefits');
        if (response.data?.benefits) {
          setBenefits(response.data.benefits);
        }
      } catch (error) {
        console.error('Failed to fetch benefits:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBenefits();
  }, []);

  const groupedBenefits = benefits.reduce((acc, benefit) => {
    if (!acc[benefit.tier]) acc[benefit.tier] = [];
    acc[benefit.tier].push(benefit);
    return acc;
  }, {} as Record<string, Benefit[]>);

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

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Membership Benefits</H1>
          <Body className="text-gray-600">
            Explore all the exclusive perks and benefits available to our members.
          </Body>
        </div>

        {Object.entries(groupedBenefits).map(([tier, tierBenefits]) => (
          <div key={tier} className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <H2>{tier} Tier</H2>
              <Badge>{tierBenefits.length} Benefits</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tierBenefits.map((benefit) => (
                <Card key={benefit.id}>
                  <CardHeader>
                    <div className="text-4xl mb-4">{benefit.icon}</div>
                    <CardTitle>{benefit.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Body className="text-sm text-gray-600">{benefit.description}</Body>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        <Card className="bg-black text-white border-4 border-black">
          <CardContent className="p-8 text-center">
            <H3 className="text-white mb-4">Ready to Join?</H3>
            <Body className="text-gray-300 mb-6">
              Choose the membership tier that&apos;s right for you and start enjoying exclusive benefits today.
            </Body>
            <Link href="/memberships">
              <Button>View Membership Tiers</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
