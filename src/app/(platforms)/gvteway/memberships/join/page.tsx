/**
 * Join Membership Page - UI Rebuild
 * Onboarding flow for new members
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
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

export default function JoinMembershipPage() {
  const router = useRouter();
  const [tiers, setTiers] = React.useState<MembershipTier[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTier, setSelectedTier] = React.useState<string | null>(null);

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

  const handleJoin = async (tierId: string) => {
    try {
      setSelectedTier(tierId);
      await apiClient.post('/api/memberships/subscribe', { tierId });
      router.push('/memberships/dashboard');
    } catch (error) {
      console.error('Subscription failed:', error);
      setSelectedTier(null);
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
          <Hero className="text-white mb-6">JOIN OUR COMMUNITY</Hero>
          <Body className="max-w-2xl mx-auto text-gray-300 text-lg">
            Choose your membership tier and unlock exclusive benefits, early access, and premium experiences.
          </Body>
        </div>
      </section>

      <section className="border-b-4 border-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-16">
            <H2 className="mb-4">Select Your Membership</H2>
            <Body className="text-gray-600">
              Start with the tier that fits your needs. You can upgrade anytime.
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
                    {tier.featured && <Badge>Most Popular</Badge>}
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
                    <Caption className="text-gray-500 uppercase">What&apos;s Included</Caption>
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
                    size="lg"
                    variant={tier.featured ? 'primary' : 'secondary'}
                    onClick={() => handleJoin(tier.id)}
                    loading={selectedTier === tier.id}
                    disabled={selectedTier !== null}
                  >
                    {selectedTier === tier.id ? 'Processing...' : 'Join Now'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">Questions About Membership?</H2>
          <Body className="text-gray-600 mb-8">
            Learn more about our membership benefits, cancellation policy, and frequently asked questions.
          </Body>
          <div className="flex gap-4 justify-center">
            <Button variant="secondary" onClick={() => router.push('/memberships/benefits')}>
              View Benefits
            </Button>
            <Button variant="ghost" onClick={() => router.push('/memberships')}>
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
