/**
 * ATLVS Dashboard - UI Rebuild
 * Internal production platform main dashboard
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Hero, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';

export default function AtlvsDashboard() {
  const modules = [
    {
      title: 'Projects',
      description: 'Manage production projects',
      href: '/(rebuild)/atlvs/projects',
      icon: '📁',
    },
    {
      title: 'Tasks',
      description: 'Task management and tracking',
      href: '/(rebuild)/atlvs/tasks',
      icon: '✓',
    },
    {
      title: 'Teams',
      description: 'Team management and scheduling',
      href: '/(rebuild)/atlvs/teams',
      icon: '👥',
    },
    {
      title: 'Budgets',
      description: 'Financial tracking and forecasting',
      href: '/(rebuild)/atlvs/budgets',
      icon: '💰',
    },
    {
      title: 'Assets',
      description: 'Equipment and inventory management',
      href: '/(rebuild)/atlvs/assets',
      icon: '📦',
    },
    {
      title: 'Advancing',
      description: 'Review and approve requests',
      href: '/(rebuild)/atlvs/advancing',
      icon: '📋',
    },
    {
      title: 'Documents',
      description: 'Contract and document management',
      href: '/(rebuild)/atlvs/documents',
      icon: '📄',
    },
    {
      title: 'Analytics',
      description: 'Reports and insights',
      href: '/(rebuild)/atlvs/analytics',
      icon: '📊',
    },
    {
      title: 'Automation',
      description: 'N8N workflow automation',
      href: '/(rebuild)/atlvs/n8n',
      icon: '⚙️',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <Hero className="mb-4">ATLVS</Hero>
          <Body className="text-gray-600 text-lg">
            Internal Production Platform - Complete Project Management
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
