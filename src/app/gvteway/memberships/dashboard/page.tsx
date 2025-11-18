'use client';

import { DashboardPageTemplate } from '@/components/templates/DashboardPageTemplate';
import { Crown, Calendar, DollarSign, TrendingUp } from 'lucide-react';
import { BodyText } from '@/components/atoms/Typography';

const metadata = { title: 'Membership Dashboard | GVTEWAY' };

export default function MembershipDashboardPage() {
  return (
    <DashboardPageTemplate
      title="Membership Dashboard"
      description="Track your membership benefits and usage"
      stats={[
        { icon: <Crown className="w-8 h-8" />, title: 'Current Tier', value: 'Plus' },
        { icon: <Calendar className="w-8 h-8" />, title: 'Member Since', value: 'Jan 2025' },
        { icon: <DollarSign className="w-8 h-8" />, title: 'Savings', value: '$150' },
        { icon: <TrendingUp className="w-8 h-8" />, title: 'Events', value: '24' },
      ]}
      sections={[
        {
          title: 'Your Benefits',
          content: <BodyText className="text-ghxst-text-secondary">Access all Plus tier benefits</BodyText>,
        },
      ]}
    />
  );
}
