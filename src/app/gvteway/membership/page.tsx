'use client';

import { GvtewayLayout } from "@/components/templates/GvtewayLayout";
import { PageTitle, SectionHeader, CardTitle, BodyText, Metadata } from "@/components/atoms/Typography";
import { Button } from "@/components/atoms/Button";
import { Check, Sparkles, TrendingUp, Users, Heart, Star } from "lucide-react";

const metadata = {
  title: 'Membership | Join GVTEWAY',
  description: 'Unlock exclusive access to events, early tickets, member pricing, and community perks.',
  keywords: 'membership, subscription, benefits, exclusive access',
};

export default function MembershipPage() {
  const tiers = [
    {
      name: "Explorer",
      price: 0,
      period: "Free Forever",
      description: "Perfect for discovering the local scene",
      features: [
        "Browse all events",
        "Community feed access",
        "Basic event recommendations",
        "Shop marketplace access",
        "Destination guides",
      ],
      cta: "Start Free",
      popular: false,
    },
    {
      name: "Member",
      price: 19,
      period: "per month",
      description: "The full GVTEWAY experience",
      features: [
        "Everything in Explorer",
        "Early ticket access (24h)",
        "Member-only pricing (10-20% off)",
        "Priority entry at venues",
        "Exclusive member events",
        "Advanced recommendations",
        "Save unlimited favorites",
        "Trip planning tools",
        "Member badge & profile",
      ],
      cta: "Join Now",
      popular: true,
    },
    {
      name: "VIP",
      price: 49,
      period: "per month",
      description: "For the ultimate insider",
      features: [
        "Everything in Member",
        "48h early ticket access",
        "VIP pricing (20-30% off)",
        "Dedicated concierge",
        "Backstage access opportunities",
        "Secret shows & experiences",
        "Artist meet & greets",
        "Free merchandise credits",
        "Priority support",
        "Exclusive VIP lounge access",
      ],
      cta: "Go VIP",
      popular: false,
    },
  ];

  const perks = [
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Early Access",
      description: "Get first dibs on tickets before they sell out",
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Member Pricing",
      description: "Save 10-30% on tickets, merch, and experiences",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Priority Entry",
      description: "Skip lines with dedicated member entrance",
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Exclusive Events",
      description: "Access member-only shows and secret experiences",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Rewards Program",
      description: "Earn points for every dollar spent",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Access",
      description: "Connect with 5,000+ active members",
    },
  ];

  return (
    <GvtewayLayout>

      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <PageTitle className="mb-4 uppercase text-ghxst-primary">Membership</PageTitle>
          <BodyText className="text-h6 text-ghxst-text-secondary max-w-2xl mx-auto">
            Your all-access pass to the entertainment ecosystem. 
            One membership, infinite experiences.
          </BodyText>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`card p-8 space-y-6 ${
                  tier.popular
                    ? 'border-4 border-ghxst-accent relative'
                    : 'border-2 border-ghxst-border'
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-ghxst-accent text-ghxst-white px-4 py-1 rounded-full">
                    <Metadata className="font-semibold uppercase">Most Popular</Metadata>
                  </div>
                )}

                <div className="text-center space-y-2">
                  <CardTitle className="text-ghxst-primary uppercase">{tier.name}</CardTitle>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="font-anton text-h1 text-ghxst-primary">
                      ${tier.price}
                    </span>
                    <Metadata className="text-ghxst-text-secondary">{tier.period}</Metadata>
                  </div>
                  <BodyText className="text-ghxst-text-secondary text-body-sm">
                    {tier.description}
                  </BodyText>
                </div>

                <div className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-ghxst-accent flex items-center justify-center mt-0.5">
                        <Check className="w-3 h-3 text-ghxst-white" />
                      </div>
                      <Metadata className="text-ghxst-text-primary">{feature}</Metadata>
                    </div>
                  ))}
                </div>

                <Button
                  variant={tier.popular ? "primary" : "secondary"}
                  size="lg"
                  className="w-full"
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <BodyText className="text-ghxst-text-secondary">
              30-day money-back guarantee • Cancel anytime • No hidden fees
            </BodyText>
          </div>
        </div>
      </section>

      {/* Member Perks */}
      <section className="section-padding bg-ghxst-surface">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-12 uppercase text-center text-ghxst-primary">
            Member Perks
          </SectionHeader>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {perks.map((perk, idx) => (
              <div key={idx} className="text-center space-y-4">
                <div className="w-16 h-16 bg-ghxst-black rounded-full flex items-center justify-center mx-auto text-ghxst-white">
                  {perk.icon}
                </div>
                <CardTitle className="text-ghxst-primary">{perk.title}</CardTitle>
                <BodyText className="text-ghxst-text-secondary">
                  {perk.description}
                </BodyText>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section-padding bg-ghxst-black text-ghxst-white">
        <div className="max-w-7xl mx-auto px-8">
          <SectionHeader className="mb-12 uppercase text-center">
            Join 5,000+ Members
          </SectionHeader>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="font-anton text-h1 mb-2">$500K+</div>
              <Metadata className="text-gray-400">Saved by Members</Metadata>
            </div>
            <div className="text-center">
              <div className="font-anton text-h1 mb-2">15,000+</div>
              <Metadata className="text-gray-400">Connections Made</Metadata>
            </div>
            <div className="text-center">
              <div className="font-anton text-h1 mb-2">200+</div>
              <Metadata className="text-gray-400">Monthly Events</Metadata>
            </div>
            <div className="text-center">
              <div className="font-anton text-h1 mb-2">98%</div>
              <Metadata className="text-gray-400">Satisfaction Rate</Metadata>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="max-w-7xl mx-auto px-8 max-w-3xl">
          <SectionHeader className="mb-8 uppercase text-center text-ghxst-primary">
            Frequently Asked Questions
          </SectionHeader>

          <div className="space-y-6">
            {[
              {
                q: "Can I cancel anytime?",
                a: "Yes! Cancel anytime with no penalties. We offer a 30-day money-back guarantee.",
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards, debit cards, and digital wallets.",
              },
              {
                q: "Do member benefits work at all venues?",
                a: "Most venues participate in our member program. Check individual event pages for details.",
              },
              {
                q: "Can I share my membership?",
                a: "Memberships are individual and non-transferable, but you can gift memberships to friends!",
              },
            ].map((faq, idx) => (
              <div key={idx} className="card p-6 space-y-3">
                <CardTitle className="text-ghxst-primary">{faq.q}</CardTitle>
                <BodyText className="text-ghxst-text-secondary">{faq.a}</BodyText>
              </div>
            ))}
          </div>
        </div>
      </section>

    </GvtewayLayout>
  );
}
