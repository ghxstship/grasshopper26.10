/**
 * Settings Page - UI Rebuild
 * User settings hub
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'Account',
      description: 'Manage your account settings',
      href: '/settings/account',
      icon: '👤',
    },
    {
      title: 'Profile',
      description: 'Update your profile information',
      href: '/settings/profile',
      icon: '✏️',
    },
    {
      title: 'Payment Methods',
      description: 'Manage payment methods',
      href: '/settings/payment',
      icon: '💳',
    },
    {
      title: 'Notifications',
      description: 'Configure notification preferences',
      href: '/settings/notifications',
      icon: '🔔',
    },
    {
      title: 'Privacy',
      description: 'Control your privacy settings',
      href: '/settings/privacy',
      icon: '🔒',
    },
    {
      title: 'Security',
      description: 'Security and two-factor authentication',
      href: '/settings/security',
      icon: '🛡️',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Settings</H1>
          <Body className="text-gray-600">
            Manage your account preferences and settings
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {settingsSections.map((section) => (
            <Link key={section.title} href={section.href}>
              <Card className="h-full hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-4xl mb-4">{section.icon}</div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
