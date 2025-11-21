'use client';

import { DashboardPageTemplate } from '@/components/templates/DashboardPageTemplate';
import { User, Bell, Lock, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';
import { CardTitle, BodyText } from '@/components/atoms/Typography';

const _metadata = {
  title: 'Settings | GVTEWAY',
  description: 'Manage your account settings and preferences',
};

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/settings

export default function SettingsPage() {
  const settingsGroups = [
    {
      title: 'Account Settings',
      items: [
        {
          icon: <User className="w-6 h-6" />,
          title: 'Profile',
          description: 'Update your personal information and profile photo',
          href: '/gvteway/settings/profile',
        },
        {
          icon: <Lock className="w-6 h-6" />,
          title: 'Account',
          description: 'Manage your email, password, and account security',
          href: '/gvteway/settings/account',
        },
      ],
    },
    {
      title: 'Preferences',
      items: [
        {
          icon: <Bell className="w-6 h-6" />,
          title: 'Notifications',
          description: 'Control how and when you receive notifications',
          href: '/gvteway/settings/notifications',
        },
        {
          icon: <Shield className="w-6 h-6" />,
          title: 'Privacy',
          description: 'Manage your privacy settings and data preferences',
          href: '/gvteway/settings/privacy',
        },
      ],
    },
    {
      title: 'Billing',
      items: [
        {
          icon: <CreditCard className="w-6 h-6" />,
          title: 'Payment Methods',
          description: 'Add or remove payment methods',
          href: '/gvteway/settings/payment-methods',
        },
      ],
    },
  ];

  return (
    <DashboardPageTemplate
      title="Settings"
      description="Manage your account settings and preferences"
      sections={settingsGroups.map((group) => ({
        title: group.title,
        content: (
          <div className="grid md:grid-cols-2 gap-6">
            {group.items.map((item, i) => (
              <Link key={i} href={item.href} className="card p-6 hover:border-ghxst-primary transition-colors group">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-ghxst-surface rounded-lg text-ghxst-primary group-hover:bg-ghxst-primary group-hover:text-ghxst-white transition-colors">
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-ghxst-primary group-hover:text-ghxst-black transition-colors">
                      {item.title}
                    </CardTitle>
                    <BodyText className="text-ghxst-text-secondary text-body-sm">
                      {item.description}
                    </BodyText>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ),
      }))}
    />
  );
}
