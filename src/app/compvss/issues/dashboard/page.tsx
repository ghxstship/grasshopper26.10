'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Filter, Search, Clock, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useIssues } from '@/lib/hooks/compvss/useIssues';

export default function IssuesDashboardPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Issues', href: '/compvss/issues/dashboard' },
  ];

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <IssuesDashboardContent />
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
          <p className="text-gray-400">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
          <h2 className="text-xl font-bebas mb-2">Failed to Load Issues</h2>
          <p className="text-gray-400 mb-4">{error.message}</p>
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
        return 'bg-error-light text-error border-red-500/30';
      case 'high':
        return 'bg-orange-500/20 text-atlvs-orange-500 border-orange-500/30';
      case 'medium':
        return 'bg-warning-light text-warning border-yellow-500/30';
      case 'low':
        return 'bg-success-light text-success border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-warning-light text-warning border-yellow-500/30';
      case 'in_progress':
        return 'bg-info-light text-info border-blue-500/30';
      case 'resolved':
        return 'bg-success-light text-success border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bebas compvss-text-gradient">Issues Dashboard</h1>
              <p className="text-gray-400 font-oswald mt-1">Track and manage reported issues</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="compvss-ghost" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Link href="/compvss/issues/new">
                <Button variant="compvss" size="lg">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Report Issue
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statsDisplay.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-gray-900/50">
                <CardContent className="pt-6">
                  <div className={`p-2 bg-black/50 rounded-lg ${stat.color} w-fit mb-2`}>
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bebas text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-oswald">{stat.label}</div>
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
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search issues..."
              className="pl-12 bg-gray-900/50 border-compvss-cyan-500/30 h-12"
            />
          </div>
        </motion.div>

        {/* Issues List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
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
                              <span className="text-xs text-gray-500 font-share-tech">{issue.id}</span>
                              <Badge variant="compvss-outline" className={getPriorityColor(issue.priority)}>
                                {issue.priority}
                              </Badge>
                              <Badge variant="compvss-outline" className={getStatusColor(issue.status)}>
                                {issue.status.replace('_', ' ')}
                              </Badge>
                            </div>
                            <h3 className="font-oswald text-white text-lg mb-1">{issue.title}</h3>
                            <p className="text-sm text-gray-400 font-share-tech mb-2">
                              {issue.category} • {issue.location}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 font-share-tech">
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
      </div>
    </div>
  );
}
