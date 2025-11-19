'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { motion } from 'framer-motion';
import { ClipboardCheck, QrCode, AlertCircle, DollarSign, Calendar, CheckCircle2, Clock, Activity, Bell, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useCheckIns } from '@/lib/hooks/compvss/useCheckIns';
import { useExpenses } from '@/lib/hooks/compvss/useExpenses';
import { useIssues } from '@/lib/hooks/compvss/useIssues';
import { useMemo } from 'react';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/dashboard

export default function CompvssDashboardPage() {
  const breadcrumbs = [
    { label: 'COMPVSS', href: '/compvss' },
    { label: 'Dashboard', href: '/compvss/dashboard' },
  ];

  return (
    <CompvssLayout>
      <ContentLayout
        title="Dashboard"
        description="Welcome back, Team Member"
        variant="compvss"
        breadcrumbs={breadcrumbs}
        showToolbar={false}
      >
        <CompvssDashboardContent />
      </ContentLayout>
    </CompvssLayout>
  );
}

function CompvssDashboardContent() {
  const { data: checkIns = [], isLoading: checkInsLoading } = useCheckIns();
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: issues = [], isLoading: issuesLoading } = useIssues();
  
  const isLoading = checkInsLoading || expensesLoading || issuesLoading;
  
  const stats = useMemo(() => [
    { 
      label: 'Active Check-Ins', 
      value: checkIns.filter((c) => c.status === 'active').length.toString(), 
      icon: <CheckCircle2 className="w-5 h-5" />, 
      change: '+3' 
    },
    { 
      label: 'Pending Expenses', 
      value: expenses.filter((e) => e.status === 'pending').length.toString(), 
      icon: <Clock className="w-5 h-5" />, 
      change: '-2' 
    },
    { 
      label: 'Issues Reported', 
      value: issues.filter((i) => i.status === 'open').length.toString(), 
      icon: <AlertCircle className="w-5 h-5" />, 
      change: '+1' 
    },
    { 
      label: 'Total Check-Ins', 
      value: checkIns.length.toString(), 
      icon: <Activity className="w-5 h-5" />, 
      change: '+12' 
    },
  ], [checkIns, expenses, issues]);

  const upcomingEvents = [
    { name: 'Summer Music Festival', date: 'June 15, 2025', role: 'Stage Crew', status: 'confirmed' },
    { name: 'Tech Conference 2025', date: 'June 22, 2025', role: 'AV Technician', status: 'pending' },
    { name: 'Food & Wine Expo', date: 'July 3, 2025', role: 'Logistics', status: 'confirmed' },
  ];

  const recentActivity = [
    { action: 'Submitted advancing request', category: 'Site Infrastructure', time: '2 hours ago' },
    { action: 'Completed task', task: 'Equipment Setup', time: '5 hours ago' },
    { action: 'Reported issue', issue: 'Power outage in Zone B', time: '1 day ago' },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
          <BodyText className="text-grey-400">Loading dashboard...</BodyText>
        </div>
      </div>
    );
  }
  
  return (
    <>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500">
                      {stat.icon}
                    </div>
                    <Badge variant="compvss-outline" className="text-caption">
                      {stat.change}
                    </Badge>
                  </div>
                  <div className="text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-grey-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <SectionHeader className="text-white mb-4">Quick Actions</SectionHeader>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/compvss/advancing/new">
              <Card variant="compvss" className="bg-grey-900/50 hover:bg-grey-900/70 transition-all cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <ClipboardCheck className="w-8 h-8 text-compvss-cyan-500 mx-auto mb-3" />
                  <BodyText className="text-white">Submit Request</BodyText>
                </CardContent>
              </Card>
            </Link>
            <Link href="/compvss/qr/scan">
              <Card variant="compvss" className="bg-grey-900/50 hover:bg-grey-900/70 transition-all cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <QrCode className="w-8 h-8 text-compvss-cyan-500 mx-auto mb-3" />
                  <BodyText className="text-white">Scan QR Code</BodyText>
                </CardContent>
              </Card>
            </Link>
            <Link href="/compvss/issues/new">
              <Card variant="compvss" className="bg-grey-900/50 hover:bg-grey-900/70 transition-all cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <AlertCircle className="w-8 h-8 text-compvss-cyan-500 mx-auto mb-3" />
                  <BodyText className="text-white">Report Issue</BodyText>
                </CardContent>
              </Card>
            </Link>
            <Link href="/compvss/expenses/new">
              <Card variant="compvss" className="bg-grey-900/50 hover:bg-grey-900/70 transition-all cursor-pointer h-full">
                <CardContent className="pt-6 text-center">
                  <DollarSign className="w-8 h-8 text-compvss-cyan-500 mx-auto mb-3" />
                  <BodyText className="text-white">Submit Expense</BodyText>
                </CardContent>
              </Card>
            </Link>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-compvss-cyan-500" />
                    Upcoming Events
                  </CardTitle>
                  <Link href="/compvss/events">
                    <Button variant="compvss-ghost" size="sm">
                      View All
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-white">{event.name}</h3>
                        <Badge 
                          variant={event.status === 'confirmed' ? 'compvss' : 'compvss-outline'}
                          className="text-caption"
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <p className="text-body-sm text-grey-400 -tech mb-1">{event.date}</p>
                      <p className="text-body-sm text-compvss-cyan-500 -tech">Role: {event.role}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-compvss-cyan-500" />
                    Recent Activity
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                    >
                      <div className="w-2 h-2 bg-compvss-cyan-500 rounded-full mt-2" />
                      <div className="flex-1">
                        <p className="text-white text-body-sm">{activity.action}</p>
                        {activity.category && (
                          <p className="text-compvss-cyan-500 -tech text-caption mt-1">
                            {activity.category}
                          </p>
                        )}
                        {activity.task && (
                          <p className="text-compvss-cyan-500 -tech text-caption mt-1">
                            {activity.task}
                          </p>
                        )}
                        {activity.issue && (
                          <p className="text-compvss-cyan-500 -tech text-caption mt-1">
                            {activity.issue}
                          </p>
                        )}
                        <p className="text-grey-500 -tech text-caption mt-1">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
    {/* Upcoming Events */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-compvss-cyan-500" />
              Upcoming Events
            </CardTitle>
            <Link href="/compvss/events">
              <Button variant="compvss-ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white">{event.name}</h3>
                  <Badge 
                    variant={event.status === 'confirmed' ? 'compvss' : 'compvss-outline'}
                    className="text-caption"
                  >
                    {event.status}
                  </Badge>
                </div>
                <p className="text-body-sm text-grey-400 -tech mb-1">{event.date}</p>
                <p className="text-body-sm text-compvss-cyan-500 -tech">Role: {event.role}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>

    {/* Recent Activity */}
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-compvss-cyan-500" />
              Recent Activity
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
              >
                <div className="w-2 h-2 bg-compvss-cyan-500 rounded-full mt-2" />
                <div className="flex-1">
                  <p className="text-white text-body-sm">{activity.action}</p>
                  {activity.category && (
                    <p className="text-compvss-cyan-500 -tech text-caption mt-1">
                      {activity.category}
                    </p>
                  )}
                  {activity.task && (
                    <p className="text-compvss-cyan-500 -tech text-caption mt-1">
                      {activity.task}
                    </p>
                  )}
                  {activity.issue && (
                    <p className="text-compvss-cyan-500 -tech text-caption mt-1">
                      {activity.issue}
                    </p>
                  )}
                  <p className="text-grey-500 -tech text-caption mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  </div>
    </>
  );
}
