/**
 * Membership Tiers Page - UI Rebuild
 * Comparison view of all membership tiers
 */

'use client';

import * as React from 'react';
import { Hero, H2, H3, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Separator } from '@/components/ui-rebuild/atoms/Separator';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: string;
  benefits: string[];
  featured: boolean;
}

export default function TiersPage() {
  const [tiers, setTiers] = React.useState<MembershipTier[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchTiers = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<{ tiers: MembershipTier[] }>('/api/memberships/tiers');

        if (response.data?.tiers) {
          setTiers(response.data.tiers.sort((a, b) => a.price - b.price));
        }
      } catch (error) {
        console.error('Failed to fetch membership tiers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTiers();
  }, []);

  const formatPrice = (price: number, currency: string, interval: string) => {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);

    return `${formatted}/${interval}`;
  };

  const handleSubscribe = async (tierId: string) => {
    try {
      await apiClient.post('/api/memberships/subscribe', { tierId });
    } catch (error) {
      console.error('Subscription failed:', error);
    }
  };

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

      <section className="border-b-4 border-black bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <Hero className="text-white mb-6">MEMBERSHIP TIERS</Hero>
          <Body className="max-w-2xl mx-auto text-gray-300 text-lg">
            Compare all membership tiers and choose the one that fits you best.
          </Body>
        </div>
      </section>

      <section className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <H2 className="mb-4">All Membership Tiers</H2>
            <Body className="text-gray-600">
              {tiers.length} tiers available
            </Body>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={tier.featured ? 'border-4 border-black' : ''}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <CardTitle>{tier.name}</CardTitle>
                    {tier.featured && <Badge>Popular</Badge>}
                  </div>
                  <div className="mb-4">
                    <Display as="div">
                      {formatPrice(tier.price, tier.currency, tier.interval)}
                    </Display>
                  </div>
                  <CardDescription>{tier.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <Separator className="mb-6" />
                  <div className="space-y-4">
                    <Caption className="text-gray-500 uppercase">Benefits</Caption>
                    <ul className="space-y-3">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <svg
                            className="h-5 w-5 flex-shrink-0 mt-0.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                          <Body className="text-sm">{benefit}</Body>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    fullWidth
                    variant={tier.featured ? 'primary' : 'secondary'}
                    onClick={() => handleSubscribe(tier.id)}
                  >
                    Subscribe
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 border-b-4 border-black">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Need Help Choosing?</H2>
          <Body className="text-gray-600 mb-8">
            Not sure which tier is right for you? Check out our benefits page to see what each tier includes.
          </Body>
          <Button variant="secondary" size="lg">
            View All Benefits
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
