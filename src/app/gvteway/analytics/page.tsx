'use client';

import { DashboardPageTemplate } from '@/components/templates/DashboardPageTemplate';
import { TrendingUp, Calendar, DollarSign, Users, BarChart3, PieChart } from 'lucide-react';
import Link from 'next/link';
import { CardTitle, BodyText, Metadata } from '@/components/atoms/Typography';

const metadata = {
  title: 'Analytics | GVTEWAY',
  description: 'View your event history, spending insights, and personalized recommendations',
};

export default function AnalyticsPage() {
  return (
    <DashboardPageTemplate
      title="Analytics"
      description="Your personal insights and recommendations"
      stats={[
        {
          icon: <Calendar className="w-8 h-8" />,
          title: 'Events Attended',
          value: '24',
          href: '/gvteway/analytics/history',
        },
        {
          icon: <DollarSign className="w-8 h-8" />,
          title: 'Total Spent',
          value: '$1,250',
          href: '/gvteway/analytics/spending',
        },
        {
          icon: <Users className="w-8 h-8" />,
          title: 'Connections',
          value: '156',
        },
        {
          icon: <TrendingUp className="w-8 h-8" />,
          title: 'This Month',
          value: '5',
        },
      ]}
      sections={[
        {
          title: 'Insights',
          content: (
            <div className="grid md:grid-cols-3 gap-6">
              <Link href="/gvteway/analytics/history" className="card p-6 hover:border-ghxst-primary transition-colors group">
                <BarChart3 className="w-8 h-8 text-ghxst-primary mb-4" />
                <CardTitle className="mb-2 text-ghxst-primary">Event History</CardTitle>
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  View all events you&apos;ve attended and upcoming bookings
                </BodyText>
              </Link>
              <Link href="/gvteway/analytics/spending" className="card p-6 hover:border-ghxst-primary transition-colors group">
                <PieChart className="w-8 h-8 text-ghxst-primary mb-4" />
                <CardTitle className="mb-2 text-ghxst-primary">Spending Insights</CardTitle>
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  Track your spending patterns and budget
                </BodyText>
              </Link>
              <Link href="/gvteway/analytics/recommendations" className="card p-6 hover:border-ghxst-primary transition-colors group">
                <TrendingUp className="w-8 h-8 text-ghxst-primary mb-4" />
                <CardTitle className="mb-2 text-ghxst-primary">Recommendations</CardTitle>
                <BodyText className="text-ghxst-text-secondary text-body-sm">
                  AI-powered event suggestions based on your preferences
                </BodyText>
              </Link>
            </div>
          ),
        },
        {
          title: 'Recent Activity',
          content: (
            <div className="space-y-4">
              {[
                { event: 'Summer Music Festival', date: 'Jun 15, 2025', amount: '$125' },
                { event: 'Electronic Night', date: 'Nov 30, 2025', amount: '$65' },
                { event: 'Jazz Evening', date: 'Oct 12, 2025', amount: '$45' },
              ].map((item, i) => (
                <div key={i} className="card p-4 flex items-center justify-between">
                  <div>
                    <CardTitle className="text-ghxst-primary mb-1">{item.event}</CardTitle>
                    <Metadata className="text-ghxst-text-secondary">{item.date}</Metadata>
                  </div>
                  <BodyText className="text-ghxst-primary">{item.amount}</BodyText>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    />
  );
}
