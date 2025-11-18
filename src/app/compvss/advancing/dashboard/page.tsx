'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { motion } from 'framer-motion';
import { ClipboardCheck, Plus, Filter, Search, FileCheck, Building2, Users2, Shield, Camera, Clock, CheckCircle2, XCircle, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useAdvancingRequests } from '@/lib/hooks/compvss';
import { useMemo, useState } from 'react';

export default function AdvancingDashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: requestsData, isLoading, error, refetch } = useAdvancingRequests();
  
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Advancing', href: '/compvss/advancing/dashboard' },
  ];
  
  const stats = useMemo(() => {
    if (!requestsData?.requests) return { total: 0, approved: 0, pending: 0, inReview: 0 };
    
    const requests = requestsData.requests;
    return {
      total: requests.length,
      approved: requests.filter((r: any) => r.status === 'approved').length,
      pending: requests.filter((r: any) => r.status === 'pending').length,
      inReview: requests.filter((r: any) => r.status === 'in_review').length,
    };
  }, [requestsData]);
  
  const recentRequests = useMemo(() => {
    if (!requestsData?.requests) return [];
    return requestsData.requests.slice(0, 4);
  }, [requestsData]);
  
  const filteredRequests = useMemo(() => {
    if (!searchQuery) return recentRequests;
    return recentRequests.filter((req: any) => 
      req.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [recentRequests, searchQuery]);
  
  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Advancing Dashboard"
          description="Manage production advancing requests"
          variant="compvss"
          breadcrumbs={breadcrumbs}
          primaryAction={{
            label: 'New Request',
            icon: <Plus className="w-5 h-5" />,
            onClick: () => router.push('/compvss/advancing/new'),
            variant: 'compvss'
          }}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading advancing requests...</p>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }
  
  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Advancing Dashboard"
          description="Manage production advancing requests"
          variant="compvss"
          breadcrumbs={breadcrumbs}
          primaryAction={{
            label: 'New Request',
            icon: <Plus className="w-5 h-5" />,
            onClick: () => router.push('/compvss/advancing/new'),
            variant: 'compvss'
          }}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Requests</h2>
              <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
              <Button variant="compvss" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }
  
  const categories = [
    { icon: <FileCheck className="w-5 h-5" />, name: 'Access & Credentials', count: 3 },
    { icon: <Building2 className="w-5 h-5" />, name: 'Site Infrastructure', count: 5 },
    { icon: <Users2 className="w-5 h-5" />, name: 'Site Assets', count: 2 },
    { icon: <Shield className="w-5 h-5" />, name: 'Site Utilities', count: 4 },
    { icon: <Users2 className="w-5 h-5" />, name: 'Site Vehicles', count: 1 },
    { icon: <Users2 className="w-5 h-5" />, name: 'Heavy Equipment', count: 2 },
    { icon: <Camera className="w-5 h-5" />, name: 'Technical Production', count: 6 },
    { icon: <Users2 className="w-5 h-5" />, name: 'Hospitality', count: 3 },
    { icon: <Users2 className="w-5 h-5" />, name: 'Travel & Logistics', count: 4 },
  ];


  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge variant="compvss" className="bg-success-light text-success border-success/30">Approved</Badge>;
      case 'pending':
        return <Badge variant="compvss-outline" className="border-warning/30 text-warning">Pending</Badge>;
      case 'in_review':
        return <Badge variant="compvss-outline" className="border-info/30 text-info">In Review</Badge>;
      case 'rejected':
        return <Badge variant="compvss-outline" className="border-destructive/30 text-error">Rejected</Badge>;
      default:
        return <Badge variant="compvss-outline">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-warning" />;
      case 'in_review':
        return <Clock className="w-4 h-4 text-info" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-error" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Production Advancing"
        description="Submit and track advancing requests"
        variant="compvss"
        breadcrumbs={breadcrumbs}
        onSearch={(value) => setSearchQuery(value)}
        searchPlaceholder="Search requests..."
        primaryAction={{
          label: 'New Request',
          icon: <Plus className="w-5 h-5" />,
          onClick: () => router.push('/compvss/advancing/new'),
          variant: 'compvss'
        }}
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card variant="compvss" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-h3 font-bebas text-white mb-1">{stats.total}</div>
              <div className="text-body-sm text-gray-400 font-oswald">Total Requests</div>
            </CardContent>
          </Card>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-h3 font-bebas text-success mb-1">{stats.approved}</div>
              <div className="text-body-sm text-gray-400 font-oswald">Approved</div>
            </CardContent>
          </Card>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-h3 font-bebas text-warning mb-1">{stats.pending}</div>
              <div className="text-body-sm text-gray-400 font-oswald">Pending</div>
            </CardContent>
          </Card>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardContent className="pt-6">
              <div className="text-h3 font-bebas text-info mb-1">{stats.inReview}</div>
              <div className="text-body-sm text-gray-400 font-oswald">In Review</div>
            </CardContent>
          </Card>
        </div>

        {/* Categories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2 className="text-h4 font-bebas text-white mb-4">Request Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/compvss/advancing/category/${category.name.toLowerCase().replace(/ /g, '-')}`}>
                  <Card variant="compvss" className="bg-gray-900/50 hover:bg-gray-900/70 transition-all cursor-pointer h-full">
                    <CardContent className="pt-6 text-center">
                      <div className="p-3 bg-compvss-cyan-500/10 rounded-xl text-compvss-cyan-500 inline-flex mb-3">
                        {category.icon}
                      </div>
                      <p className="font-oswald text-white text-body-sm mb-2">{category.name}</p>
                      <Badge variant="compvss-outline" className="text-caption">
                        {category.count} requests
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Requests */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <ClipboardCheck className="w-5 h-5 text-compvss-cyan-500" />
                  Recent Requests
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="compvss-ghost" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filter
                  </Button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-black/50 border-compvss-cyan-500/30 w-48"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredRequests.map((request: any) => (
                  <Link key={request.id} href={`/compvss/advancing/detail/${request.id}`}>
                    <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all cursor-pointer">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(request.status)}
                            <span className="font-oswald text-white">{request.title}</span>
                          </div>
                          <p className="text-body-sm text-gray-400 font-share-tech">
                            {request.category} • {request.eventId || 'No event'}
                          </p>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      <div className="flex items-center justify-between text-caption text-gray-500 font-share-tech">
                        <span>ID: {request.id}</span>
                        <span>Submitted: {new Date(request.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
