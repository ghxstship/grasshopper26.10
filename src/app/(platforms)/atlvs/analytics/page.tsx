/**
 * ATLVS Analytics - UI Rebuild
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function AtlvsAnalyticsPage() {
  const modules = [
    { title: 'Projects', description: 'Project performance metrics', href: '/(rebuild)/atlvs/analytics/projects', icon: '📊' },
    { title: 'Budgets', description: 'Financial reports and forecasts', href: '/(rebuild)/atlvs/analytics/budgets', icon: '💰' },
    { title: 'Teams', description: 'Team performance tracking', href: '/(rebuild)/atlvs/analytics/teams', icon: '👥' },
    { title: 'Advancing', description: 'Advancing analytics', href: '/(rebuild)/atlvs/analytics/advancing', icon: '📋' },
    { title: 'Custom Reports', description: 'Build custom reports', href: '/(rebuild)/atlvs/analytics/reports', icon: '📈' },
    { title: 'Scheduled Reports', description: 'Automated reporting', href: '/(rebuild)/atlvs/analytics/scheduled', icon: '⏰' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Analytics Hub</H1>
          <Body className="text-gray-600">Reports, insights, and performance metrics</Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {modules.map((module) => (
            <Link key={module.title} href={module.href}>
              <Card className="h-full hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                <CardHeader>
                  <div className="text-5xl mb-4">{module.icon}</div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription>{module.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="font-anton text-5xl mb-2">24</div>
                <Body className="text-gray-600">Active Projects</Body>
              </div>
              <div className="text-center">
                <div className="font-anton text-5xl mb-2">156</div>
                <Body className="text-gray-600">Open Tasks</Body>
              </div>
              <div className="text-center">
                <div className="font-anton text-5xl mb-2">12</div>
                <Body className="text-gray-600">Teams</Body>
              </div>
              <div className="text-center">
                <div className="font-anton text-5xl mb-2">89%</div>
                <Body className="text-gray-600">On Budget</Body>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
