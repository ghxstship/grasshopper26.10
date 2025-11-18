'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Crown, Star, Zap, Check } from 'lucide-react';
import Link from 'next/link';
import { SectionHeader, CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';

export default function MembershipsPage() {
  const tiers = [
    {
      name: 'Free',
      price: 0,
      icon: <Star className="w-8 h-8" />,
      features: ['Event discovery', 'Basic ticketing', 'Community access', 'Mobile app'],
      cta: 'Current Plan',
      featured: false,
    },
    {
      name: 'Plus',
      price: 9.99,
      icon: <Zap className="w-8 h-8" />,
      features: ['Everything in Free', 'Early access', 'Exclusive events', 'Priority support', '10% off tickets'],
      cta: 'Upgrade to Plus',
      featured: true,
    },
    {
      name: 'VIP',
      price: 29.99,
      icon: <Crown className="w-8 h-8" />,
      features: ['Everything in Plus', 'VIP experiences', 'Meet & greets', 'Concierge service', '20% off tickets', 'Free transfers'],
      cta: 'Upgrade to VIP',
      featured: false,
    },
  ];

  return (
    <ListPageTemplate
      title="Membership Tiers"
      description="Unlock exclusive benefits and enhance your event experience"
    >
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`card p-8 ${tier.featured ? 'border-ghxst-primary border-4' : ''} relative`}
          >
            {tier.featured && (
              <Badge variant="warning" className="absolute -top-3 left-1/2 -translate-x-1/2">
                Most Popular
              </Badge>
            )}
            <div className="text-center mb-6">
              <div className="inline-flex p-4 bg-ghxst-surface rounded-full text-ghxst-primary mb-4">
                {tier.icon}
              </div>
              <SectionHeader className="mb-2 text-ghxst-primary">{tier.name}</SectionHeader>
              <div className="mb-4">
                <span className="text-h1 font-anton text-ghxst-primary">${tier.price}</span>
                <Metadata className="text-ghxst-text-secondary">/month</Metadata>
              </div>
            </div>
            <ul className="space-y-3 mb-8">
              {tier.features.map((feature, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                  <BodyText className="text-ghxst-text-secondary text-body-sm">{feature}</BodyText>
                </li>
              ))}
            </ul>
            <Button
              variant={tier.featured ? 'primary' : 'secondary'}
              size="lg"
              className="w-full"
            >
              {tier.cta}
            </Button>
          </div>
        ))}
      </div>

      <div className="card p-8 bg-ghxst-surface text-center">
        <SectionHeader className="mb-4 text-ghxst-primary">Need Help Choosing?</SectionHeader>
        <BodyText className="text-ghxst-text-secondary mb-6">
          Compare all features or talk to our team to find the perfect plan
        </BodyText>
        <div className="flex gap-4 justify-center">
          <Link href="/gvteway/memberships/benefits">
            <Button variant="secondary" size="md">Compare Features</Button>
          </Link>
          <Button variant="primary" size="md">Contact Support</Button>
        </div>
      </div>
    </ListPageTemplate>
  );
}
