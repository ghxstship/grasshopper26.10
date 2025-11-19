/**
 * GVTEWAY Join Membership Page
 * Agent 2.5: Reverse Order Implementation - Module 7
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent, CardHeader } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Check, Crown, Zap, Star } from 'lucide-react';
import { useMemberships } from '@/lib/hooks/gvteway/useMemberships';
import { BodyText, CardTitle, HeroTitle } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/memberships/join

export default function JoinMembershipPage() {  
  const [_selectedTier, _setSelectedTier] = useState<string | null>(null);
  const { data,  } = useMemberships();
  const tiers = (data as any)?.tiers || [
    {
      id: 'basic',
      name: 'Basic',
      price: 0,
      period: 'Forever Free',
      icon: Star,
      color: 'gray',
      features: [
        'Access to all events',
        'Standard ticket prices',
        'Email support',
        'Event notifications',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 9.99,
      period: 'per month',
      icon: Zap,
      color: 'blue',
      popular: true,
      features: [
        'Everything in Basic',
        '10% off all tickets',
        'Early access to events',
        'Priority support',
        'Exclusive member events',
        'No booking fees',
      ],
    },
    {
      id: 'vip',
      name: 'VIP',
      price: 29.99,
      period: 'per month',
      icon: Crown,
      color: 'purple',
      features: [
        'Everything in Premium',
        '20% off all tickets',
        'VIP seating options',
        'Backstage access',
        'Meet & greet opportunities',
        'Concierge service',
        'Free merchandise',
      ],
    },
  ];

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-grey-900 to-black p-6">
        <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <HeroTitle className="text-white mb-4">Choose Your Membership</HeroTitle>
          <BodyText className="text-grey-400">Unlock exclusive benefits and save on every event</BodyText>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isPopular = tier.popular;

            return (
              <Card
                key={tier.id}
                className={`relative ${ isPopular ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-info/50 scale-105' : 'bg-grey-900/50 border-grey-800' }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
                      Most Popular
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full bg-${tier.color}-500/20 flex items-center justify-center`}>
                      <Icon className={`w-8 h-8 text-${tier.color}-400`} />
                    </div>
                  </div>
                  <CardTitle className="text-white">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-white">${tier.price}</span>
                    <span className="text-grey-400 ml-2">{tier.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                        <span className="text-grey-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${ isPopular ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' : tier.id === 'basic' ? 'bg-grey-700 hover:bg-grey-600' : 'bg-accent hover:bg-accent' }`}
                  >
                    {tier.id === 'basic' ? 'Current Plan' : 'Upgrade Now'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <Card className="bg-grey-900/50 border-grey-800">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <CardTitle className="text-white mb-2">Can I cancel anytime?</CardTitle>
              <BodyText className="text-grey-400 text-body-sm">
                Yes, you can cancel your membership at any time. Your benefits will continue until the end of your billing period.
              </BodyText>
            </div>
            <div>
              <CardTitle className="text-white mb-2">Do discounts apply to all events?</CardTitle>
              <BodyText className="text-grey-400 text-body-sm">
                Yes, your membership discount applies to all events on GVTEWAY, with no restrictions.
              </BodyText>
            </div>
            <div>
              <CardTitle className="text-white mb-2">Can I upgrade or downgrade?</CardTitle>
              <BodyText className="text-grey-400 text-body-sm">
                Absolutely! You can change your membership tier at any time from your account settings.
              </BodyText>
            </div>
          </CardContent>
        </Card>
        </div>
      </div>
    </GvtewayLayout>
  );
}
