'use client';

import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Check } from 'lucide-react';
import { SectionHeader, BodyText } from '@/components/atoms/Typography';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/memberships/benefits

export default function BenefitsPage() {
  const benefits = ['Early access', 'Exclusive events', 'Priority support', 'Discounts'];
  return (
    <ListPageTemplate title="Membership Benefits" description="Unlock exclusive perks">
      <div className="grid md:grid-cols-2 gap-6">
        {benefits.map((benefit, i) => (
          <div key={i} className="card p-6 flex items-start gap-4">
            <Check className="w-6 h-6 text-success flex-shrink-0" />
            <div>
              <SectionHeader className="mb-2 text-ghxst-primary">{benefit}</SectionHeader>
              <BodyText className="text-ghxst-text-secondary text-body-sm">
                Enjoy {benefit.toLowerCase()} with your membership
              </BodyText>
            </div>
          </div>
        ))}
      </div>
    </ListPageTemplate>
  );
}
