'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { AlertCircle, Search, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useIssues } from '@/lib/hooks/compvss/useIssues';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/issues/dashboard

export default function IssuesDashboardPage() {
  const router = useRouter();
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Issues', href: '/compvss/issues/dashboard' },
  ];

  return (
    <CompvssLayout>
      <ContentLayout
        title="Issues Dashboard"
        description="Track and manage reported issues"
        variant="compvss"
        breadcrumbs={breadcrumbs}
        primaryAction={{
          label: 'Report Issue',
          icon: <AlertCircle className="w-5 h-5" />,
          onClick: () => router.push('/compvss/issues/new'),
          variant: 'compvss'
        }}
      >
        <IssuesDashboardContent />
      </ContentLayout>
    </CompvssLayout>
  );
}

function IssuesDashboardContent() {
  const { data: issues, isLoading, error, refetch } = useIssues();

  const stats = useMemo(() => {
    return {
      open: issues?.filter((i: { status: string }) => i.status === 'open').length || 0,
      inProgress: issues?.filter((i: { status: string }) => i.status === 'in-progress').length || 0,
      resolved: issues?.filter((i: { status: string }) => i.status === 'resolved').length || 0,
      critical: issues?.filter((i: { priority: string; status: string }) => i.priority === 'critical' && i.status !== 'resolved').length || 0
    };
  }, [issues]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-blue-500" />
          <BodyText className="text-grey-400">Loading issues...</BodyText>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
          <SectionHeader className="mb-2">Failed to Load Issues</SectionHeader>
          <p className="text-grey-400 mb-4">{error.message}</p>
          <Button variant="compvss" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const statsDisplay = [
    { label: 'Open Issues', value: stats.open.toString(), icon: <AlertCircle className="w-5 h-5" />, color: 'text-warning' },
    { label: 'In Progress', value: stats.inProgress.toString(), icon: <Clock className="w-5 h-5" />, color: 'text-info' },
    { label: 'Resolved', value: stats.resolved.toString(), icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-success' },
    { label: 'Critical', value: stats.critical.toString(), icon: <AlertTriangle className="w-5 h-5" />, color: 'text-error' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-error-light text-error border-destructive/30';
      case 'high':
        return 'bg-warning-light0/20 text-atlvs-orange-500 border-warning/30';
      case 'medium':
        return 'bg-warning-light text-warning border-warning/30';
      case 'low':
        return 'bg-success-light text-success border-success/30';
      default:
        return 'bg-grey-500/20 text-grey-500 border-grey-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-warning-light text-warning border-warning/30';
      case 'in_progress':
        return 'bg-info-light text-info border-info/30';
      case 'resolved':
        return 'bg-success-light text-success border-success/30';
      default:
        return 'bg-grey-500/20 text-grey-500 border-grey-500/30';
    }
  };

  return (
    <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsDisplay.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6">
                  <div className={`p-2 bg-black/50 rounded-lg ${stat.color} w-fit mb-2`}>
                    {stat.icon}
                  </div>
                  <div className="text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-grey-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
            <Input
              placeholder="Search issues..."
              className="pl-12 bg-grey-900/50 border-compvss-cyan-500/30 h-12"
            />
          </div>
        </motion.div>

        {/* Issues List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-compvss-cyan-500" />
                Active Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {issues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                  >
                    <Link href={`/compvss/issues/detail/${issue.id}`}>
                      <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all cursor-pointer">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-caption text-grey-500 -tech">{issue.id}</span>
                              <Badge variant="compvss-outline" className={getPriorityColor(issue.priority)}>
                                {issue.priority}
                              </Badge>
                              <Badge variant="compvss-outline" className={getStatusColor(issue.status)}>
                                {issue.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h3 className="text-white mb-1">{issue.title}</h3>
                            <p className="text-body-sm text-grey-400 -tech mb-2">
                              {issue.category} • {issue.location}
                            </p>
                            <div className="flex items-center gap-4 text-caption text-grey-500 -tech">
                              <span>Reported by {issue.reporter}</span>
                              <span>•</span>
                              <span>{issue.time}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
    </>
  );
}
