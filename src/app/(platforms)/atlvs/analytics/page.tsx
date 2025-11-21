/**
 * ATLVS Analytics - UI Rebuild
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, Body, H3, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { apiClient } from '@/lib/api/client';

export default function AtlvsAnalyticsPage() {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }
        const response = await apiClient.get<any>('/api/atlvs/analytics/hub');
        if (response.data) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
                <Display as="div" className="mb-2">24</Display>
                <Body className="text-gray-600">Active Projects</Body>
              </div>
              <div className="text-center">
                <Display as="div" className="mb-2">156</Display>
                <Body className="text-gray-600">Open Tasks</Body>
              </div>
              <div className="text-center">
                <Display as="div" className="mb-2">12</Display>
                <Body className="text-gray-600">Teams</Body>
              </div>
              <div className="text-center">
                <Display as="div" className="mb-2">89%</Display>
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
