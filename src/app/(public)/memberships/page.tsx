/**
 * Memberships Page - UI Rebuild
 * Membership tiers and subscription plans
 */

'use client';

import * as React from 'react';
import { Hero, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Check, Star, Crown, Zap } from 'lucide-react';

interface MembershipTier {
  id: string;
  name: string;
  description: string;
  price: { monthly: number; annual: number };
  icon: React.ReactNode;
  features: string[];
  popular?: boolean;
  color: string;
}

export default function MembershipsPage() {
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');

  const tiers: MembershipTier[] = [
    {
      id: 'free',
      name: 'Free',
      description: 'Perfect for casual event-goers',
      price: { monthly: 0, annual: 0 },
      icon: <Star className="w-8 h-8" />,
      color: 'text-gray-600',
      features: [
        'Browse all events',
        'Basic event notifications',
        'Standard ticket purchasing',
        'Email support',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'For dedicated fans and frequent attendees',
      price: { monthly: 9.99, annual: 99 },
      icon: <Zap className="w-8 h-8" />,
      color: 'text-blue-600',
      popular: true,
      features: [
        'Everything in Free',
        'Early access to tickets',
        'Exclusive presale codes',
        '10% off all merchandise',
        'Priority customer support',
        'Member-only events',
        'Digital collectibles',
      ],
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Ultimate experience for true enthusiasts',
      price: { monthly: 29.99, annual: 299 },
      icon: <Crown className="w-8 h-8" />,
      color: 'text-yellow-600',
      features: [
        'Everything in Premium',
        'VIP lounge access',
        'Meet & greet opportunities',
        'Backstage tours',
        '20% off all purchases',
        'Dedicated concierge',
        'Exclusive merchandise',
        'Free ticket upgrades',
        'Annual VIP gift package',
      ],
    },
  ];

  const savings = billingCycle === 'annual' ? '2 months free' : null;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="border-b-4 border-black bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-6">
            <Hero>MEMBERSHIP TIERS</Hero>
            <Body className="max-w-2xl mx-auto text-gray-700 text-xl">
              Unlock exclusive benefits, early access, and premium perks with our membership plans.
            </Body>
          </div>
        </div>
      </section>

      {/* Billing Toggle */}
      <section className="border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center gap-4">
            <Button
              variant={billingCycle === 'monthly' ? 'primary' : 'secondary'}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'primary' : 'secondary'}
              onClick={() => setBillingCycle('annual')}
            >
              Annual
              {savings && (
                <Badge className="ml-2" variant="outline">{savings}</Badge>
              )}
            </Button>
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <Card
                key={tier.id}
                className={`relative ${tier.popular ? 'ring-4 ring-black' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pt-8">
                  <div className={`inline-flex items-center justify-center mb-4 ${tier.color}`}>
                    {tier.icon}
                  </div>
                  <CardTitle>{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-6">
                    {tier.price[billingCycle] === 0 ? (
                      <H2>Free</H2>
                    ) : (
                      <>
                        <H2 className="inline">${tier.price[billingCycle]}</H2>
                        <Caption className="text-gray-600">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</Caption>
                      </>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <Body className="text-sm">{feature}</Body>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    fullWidth
                    variant={tier.popular ? 'primary' : 'secondary'}
                  >
                    {tier.price[billingCycle] === 0 ? 'Get Started' : 'Subscribe Now'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="border-t-4 border-black bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <H2 className="mb-4">Why Become a Member?</H2>
            <Body className="max-w-2xl mx-auto text-gray-600">
              Join thousands of members enjoying exclusive benefits and unforgettable experiences.
            </Body>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎟️</div>
                <H3 className="mb-3">Early Access</H3>
                <Body className="text-gray-600">
                  Get first dibs on tickets before they go on sale to the general public.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">💰</div>
                <H3 className="mb-3">Exclusive Discounts</H3>
                <Body className="text-gray-600">
                  Save on tickets, merchandise, and VIP experiences with member pricing.
                </Body>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-6xl mb-4">🎁</div>
                <H3 className="mb-3">Special Perks</H3>
                <Body className="text-gray-600">
                  Enjoy member-only events, merchandise, and surprise rewards throughout the year.
                </Body>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}