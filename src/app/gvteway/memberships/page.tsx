'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Star, Zap, Crown, TrendingUp, Loader2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useMemberships } from '@/lib/hooks/gvteway/useMemberships';

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    icon: Star,
    color: 'gray',
    popular: false,
    features: [
      'Basic event access',
      'Standard ticket prices',
      'Email notifications',
      'Community access',
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    price: 9.99,
    icon: Star,
    color: 'gray',
    popular: false,
    features: [
      'All Free features',
      '5% discount on tickets',
      'Early access to sales',
      'Priority support',
      'Birthday rewards',
      '100 bonus loyalty points/month',
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    price: 19.99,
    icon: Zap,
    color: 'yellow',
    popular: true,
    features: [
      'All Silver features',
      '10% discount on tickets',
      'Exclusive pre-sales',
      'VIP support',
      'Free ticket upgrades',
      'Access to member events',
      '300 bonus loyalty points/month',
      'Merchandise discounts',
    ],
  },
  {
    id: 'platinum',
    name: 'Platinum',
    price: 49.99,
    icon: Crown,
    color: 'purple',
    popular: false,
    features: [
      'All Gold features',
      '20% discount on tickets',
      'Guaranteed ticket access',
      'Concierge service',
      'Backstage access opportunities',
      'Free parking at venues',
      '1000 bonus loyalty points/month',
      'Exclusive merchandise',
      'Meet & greet opportunities',
    ],
  },
];

export default function MembershipsPage() {
  const { data: membership, isLoading } = useMemberships();
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading memberships...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }
  
  const _currentTier = (membership as any)?.tier || 'free';
  
  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <header className="text-center mb-16">
                <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient" id="page-title">
                  MEMBERSHIPS
                </h1>
                <p className="text-xl text-gray-400 font-oswald mb-8">
                  Unlock exclusive benefits and rewards
                </p>
                {membership && (
                  <Badge variant="gvteway" className="text-lg px-6 py-2" role="status" aria-label={`Current membership tier: ${(membership as any).tier}`}>
                    Current: {((membership as any).tier || 'free').toUpperCase()}
                  </Badge>
                )}
                <div className="flex justify-center gap-4" role="group" aria-label="Billing period selection">
                  <Button variant="gvteway" size="lg" aria-pressed="true" aria-label="Monthly billing selected">
                    Monthly Billing
                  </Button>
                  <Button variant="outline" size="lg" aria-pressed="false" aria-label="Annual billing, save 20 percent">
                    Annual Billing
                    <Badge variant="gvteway" className="ml-2">Save 20%</Badge>
                  </Button>
                </div>
              </header>

              {/* Pricing Tiers */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16" role="list" aria-label="Membership tiers">
                {TIERS.map((tier, index) => {
                  const Icon = tier.icon;
                  return (
                    <motion.div
                      key={tier.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      role="listitem"
                    >
                      <Card 
                        variant="gvteway" 
                        className={`bg-gray-900/50 backdrop-blur-sm relative ${
                          tier.popular ? 'ring-2 ring-gvteway-red-500' : ''
                        }`}
                      >
                        {tier.popular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <Badge variant="gvteway" role="status" aria-label="Most popular tier">Most Popular</Badge>
                          </div>
                        )}
                        <CardHeader>
                          <div className="flex justify-between items-start mb-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              tier.color === 'yellow' ? 'bg-warning/20' :
                              tier.color === 'purple' ? 'bg-purple-500/20' :
                              'bg-gray-700'
                            }`} aria-hidden="true">
                              <Icon className={`w-6 h-6 ${
                                tier.color === 'yellow' ? 'text-warning' :
                                tier.color === 'purple' ? 'text-atlvs-purple-500' :
                                'text-gray-400'
                              }`} aria-hidden="true" />
                            </div>
                          </div>
                          <CardTitle className="text-white text-2xl font-bebas mb-2">
                            {tier.name}
                          </CardTitle>
                          <div className="mb-4" aria-label={`${tier.price} dollars per month`}>
                            <span className="text-4xl font-bebas text-white">${tier.price}</span>
                            <span className="text-gray-400">/month</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <ul className="space-y-3 mb-6">
                            {tier.features.map((feature, i) => (
                              <li key={i} className="flex items-start text-sm">
                                <Check className="w-4 h-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                                <span className="text-gray-300">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <Link href={`/gvteway/memberships/join?tier=${tier.id}`}>
                            <Button 
                              variant={tier.popular ? 'gvteway' : 'gvteway-outline'} 
                              className="w-full"
                              rounded="full"
                            >
                              {tier.price === 0 ? 'Current Plan' : 'Upgrade Now'}
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Benefits Section */}
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <TrendingUp className="w-12 h-12 text-gvteway-red-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bebas text-white mb-2">Earn More Points</h3>
                    <p className="text-gray-400">
                      Members earn up to 3x loyalty points on every purchase
                    </p>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Star className="w-12 h-12 text-warning mx-auto mb-4" />
                    <h3 className="text-2xl font-bebas text-white mb-2">Exclusive Access</h3>
                    <p className="text-gray-400">
                      Get first access to tickets and special events
                    </p>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-8 text-center">
                    <Crown className="w-12 h-12 text-atlvs-purple-500 mx-auto mb-4" />
                    <h3 className="text-2xl font-bebas text-white mb-2">VIP Treatment</h3>
                    <p className="text-gray-400">
                      Priority support and premium experiences
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ */}
              <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-3xl font-bebas">
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        q: 'Can I cancel my membership anytime?',
                        a: 'Yes, you can cancel your membership at any time. Your benefits will continue until the end of your billing period.',
                      },
                      {
                        q: 'Do unused loyalty points expire?',
                        a: 'Loyalty points never expire as long as your membership is active.',
                      },
                      {
                        q: 'Can I upgrade or downgrade my tier?',
                        a: 'Yes, you can change your membership tier at any time. Changes take effect immediately.',
                      },
                    ].map((faq, i) => (
                      <div key={i} className="pb-6 border-b border-gray-800 last:border-0">
                        <h4 className="text-white font-medium mb-2">{faq.q}</h4>
                        <p className="text-gray-400 text-sm">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
