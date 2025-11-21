/**
 * COMPVSS Dashboard - UI Rebuild
 * External team platform main dashboard
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Hero, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function CompvssDashboard() {
  const modules = [
    {
      title: 'Production Advancing',
      description: 'Submit and track advancing requests',
      href: '/(rebuild)/compvss/advancing',
      icon: '📋',
    },
    {
      title: 'Day-of-Show',
      description: 'Operations and task management',
      href: '/(rebuild)/compvss/operations',
      icon: '🎬',
    },
    {
      title: 'QR Codes',
      description: 'Scan and generate QR codes',
      href: '/(rebuild)/compvss/qr',
      icon: '📱',
    },
    {
      title: 'Team Directory',
      description: 'View team members and contacts',
      href: '/(rebuild)/compvss/team',
      icon: '👥',
    },
    {
      title: 'Expenses',
      description: 'Submit expense reports',
      href: '/(rebuild)/compvss/expenses',
      icon: '💰',
    },
    {
      title: 'Issues',
      description: 'Report and track issues',
      href: '/(rebuild)/compvss/issues',
      icon: '⚠️',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <Hero className="mb-4">COMPVSS</Hero>
          <Body className="text-gray-600 text-lg">
            External Team Platform - Production & Operations Management
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modules.map((module) => (
            <Link key={module.title} href={module.href}>
              <Card className="h-full hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-5xl mb-4">{module.icon}</div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="secondary" fullWidth>
                    Open →
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
