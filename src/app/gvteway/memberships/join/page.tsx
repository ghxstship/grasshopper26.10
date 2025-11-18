/**
 * GVTEWAY Join Membership Page
 * Agent 2.5: Reverse Order Implementation - Module 7
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { Check, Crown, Zap, Star,  } from 'lucide-react';
import { useMemberships } from '@/lib/hooks/gvteway/useMemberships';

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
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Choose Your Membership</h1>
          <p className="text-xl text-gray-400">Unlock exclusive benefits and save on every event</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((tier) => {
            const Icon = tier.icon;
            const isPopular = tier.popular;

            return (
              <Card
                key={tier.id}
                className={`relative ${
                  isPopular
                    ? 'bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-blue-500/50 scale-105'
                    : 'bg-gray-900/50 border-gray-800'
                }`}
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
                  <CardTitle className="text-2xl text-white">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-5xl font-bold text-white">${tier.price}</span>
                    <span className="text-gray-400 ml-2">{tier.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {tier.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${
                      isPopular
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                        : tier.id === 'basic'
                        ? 'bg-gray-700 hover:bg-gray-600'
                        : 'bg-purple-600 hover:bg-purple-700'
                    }`}
                  >
                    {tier.id === 'basic' ? 'Current Plan' : 'Upgrade Now'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-white font-medium mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-400 text-sm">
                Yes, you can cancel your membership at any time. Your benefits will continue until the end of your billing period.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Do discounts apply to all events?</h4>
              <p className="text-gray-400 text-sm">
                Yes, your membership discount applies to all events on GVTEWAY, with no restrictions.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-2">Can I upgrade or downgrade?</h4>
              <p className="text-gray-400 text-sm">
                Absolutely! You can change your membership tier at any time from your account settings.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
