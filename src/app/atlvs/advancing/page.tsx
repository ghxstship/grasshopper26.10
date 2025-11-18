'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState, useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Inbox, CheckCircle2, Clock, AlertCircle, XCircle, Filter, Search, Download, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { useAdvancingRequests } from '@/lib/hooks/atlvs/useAdvancingRequestQuery';
import { useAdvancingStore } from '@/lib/stores';
import { useDebounce } from 'use-debounce';

interface AdvancingRequest {
  id: string;
  status: string;
  type?: string;
  title?: string;
  description?: string;
  project?: string;
  priority?: string;
  requestedAt?: string;
  requestedBy?: string;
  dueDate?: string;
  [key: string]: unknown;
}

const categories = [
  'All Categories',
  'Access & Credentials',
  'Site Infrastructure',
  'Site Assets',
  'Site Utilities',
  'Site Vehicles',
  'Heavy Equipment',
  'Technical Production',
  'Hospitality',
  'Travel & Logistics'
];

export default function AdvancingPage() {
  // Data fetching
  const { data: requests = [], isLoading, error, refetch } = useAdvancingRequests();

  const exportMutation = useMutation({
    mutationFn: async (data: AdvancingRequest[]) => {
      const response = await fetch('/api/atlvs/advancing/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requests: data }),
      });
      if (!response.ok) throw new Error('Failed to export');
      return response.blob();
    },
  });
  const { filters, updateFilters } = useAdvancingStore();
  
  // Local state
  const [searchQuery, setSearchQuery] = useState(filters.search);
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  
  // Update store when debounced search changes
  useMemo(() => {
    updateFilters({ search: debouncedSearch });
  }, [debouncedSearch, updateFilters]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-review': return <Eye className="w-4 h-4" />;
      case 'approved': return <CheckCircle2 className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'needs-info': return <AlertCircle className="w-4 h-4" />;
      default: return <Inbox className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-warning-light text-warning border-warning-border';
      case 'in-review': return 'bg-info-light text-info border-info-border';
      case 'approved': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'rejected': return 'bg-error-light text-error border-error-border';
      case 'needs-info': return 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-warning';
      case 'low': return 'bg-info';
      default: return 'bg-gray-500';
    }
  };

  // Filter and search logic
  const filteredRequests = useMemo(() => {
    if (!requests) return [];
    
    const typedRequests = requests as AdvancingRequest[];
    return typedRequests.filter((req: AdvancingRequest) => {
      const categoryMatch = filters.category === 'All Categories' || req.type === filters.category;
      const statusMatch = filters.status === 'all' || req.status === filters.status;
      const searchMatch = !debouncedSearch || 
        req.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        req.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        req.project?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      return categoryMatch && statusMatch && searchMatch;
    });
  }, [requests, filters.category, filters.status, debouncedSearch]);

  const statusCounts = useMemo(() => {
    if (!requests) return { all: 0, pending: 0, 'under-review': 0, approved: 0, rejected: 0 };
    
    const typedRequests = requests as AdvancingRequest[];
    return {
      all: typedRequests.length,
      pending: typedRequests.filter((r: AdvancingRequest) => r.status === 'pending').length,
      'under-review': typedRequests.filter((r: AdvancingRequest) => r.status === 'under-review').length,
      approved: typedRequests.filter((r: AdvancingRequest) => r.status === 'approved').length,
      rejected: typedRequests.filter((r: AdvancingRequest) => r.status === 'rejected').length
    };
  }, [requests]);
  
  // Event handlers
  const handleCategoryChange = (category: string) => {
    updateFilters({ category });
  };
  
  const handleStatusChange = (status: string) => {
    updateFilters({ status });
  };
  
  const handleExport = () => {
    exportMutation.mutate(filteredRequests);
  };
  
  // Loading state
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <p className="text-gray-400">Loading requests...</p>
          </div>
        </div>
      </AtlvsLayout>
    );
  }
  
  // Error state
  if (error) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Requests</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="atlvs" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PRODUCTION ADVANCING"
        description="Review and approve advancing requests from external teams"
        variant="atlvs"
        showToolbar={false}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8" role="region" aria-label="Advancing request statistics">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Requests
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas" aria-label={`${statusCounts.all} total requests`}>
                    {statusCounts.all}
                  </CardTitle>
                </div>
                <Inbox className="w-6 h-6 text-gray-400" aria-hidden="true" />
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Pending
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas text-warning">
                    {statusCounts.pending}
                  </CardTitle>
                </div>
                <Clock className="w-6 h-6 text-warning" />
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Under Review
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas text-info">
                    {statusCounts['under-review']}
                  </CardTitle>
                </div>
                <Eye className="w-6 h-6 text-info" />
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Approved
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas text-atlvs-green-500">
                    {statusCounts.approved}
                  </CardTitle>
                </div>
                <CheckCircle2 className="w-6 h-6 text-atlvs-green-500" />
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Rejected
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas text-error">
                    {statusCounts.rejected}
                  </CardTitle>
                </div>
                <XCircle className="w-6 h-6 text-error" />
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="Search requests..."
                variant="atlvs"
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Select
            value={filters.category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            variant="atlvs"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </Button>
            <Button 
              variant="atlvs-outline" 
              size="sm"
              onClick={handleExport}
              disabled={filteredRequests.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: statusCounts.all },
            { id: 'pending', label: 'Pending', count: statusCounts.pending },
            { id: 'under-review', label: 'Under Review', count: statusCounts['under-review'] },
            { id: 'approved', label: 'Approved', count: statusCounts.approved },
            { id: 'rejected', label: 'Rejected', count: statusCounts.rejected }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => handleStatusChange(tab.id)}
              variant={filters.status === tab.id ? 'atlvs' : 'ghost'}
              size="sm"
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <div className="text-center py-12">
                  <Inbox className="w-12 h-12 mx-auto mb-4 text-gray-500" />
                  <h3 className="text-lg font-bebas mb-2">No Requests Found</h3>
                  <p className="text-gray-400">
                    {debouncedSearch ? 'Try adjusting your search or filters' : 'No advancing requests at this time'}
                  </p>
                </div>
              </CardHeader>
            </Card>
          ) : (
            filteredRequests.map((request: AdvancingRequest, index: number) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/atlvs/advancing/${request.id}`}>
                <Card 
                  variant="atlvs" 
                  className="bg-gray-900/50 hover:bg-gray-900 transition-all cursor-pointer"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      {/* Left Side */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="atlvs-outline" className="text-xs">
                            {request.id}
                          </Badge>
                          <Badge variant="atlvs-outline" className="text-xs">
                            {request.type}
                          </Badge>
                          <div className={`w-2 h-2 rounded-full ${getPriorityColor(request.priority || 'medium')}`} />
                        </div>
                        <CardTitle className="text-white mb-2">
                          {request.title}
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{request.requestedBy || 'Unknown'}</span>
                          <span>•</span>
                          <span>{request.project || 'N/A'}</span>
                          <span>•</span>
                          <span>Due: {request.dueDate ? new Date(request.dueDate).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>

                      {/* Right Side */}
                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="atlvs-outline"
                          className={getStatusColor(request.status)}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {request.status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </span>
                        </Badge>
                        {request.status === 'pending' && (
                          <div className="flex gap-2">
                            <Button variant="atlvs" size="sm">
                              Review
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))
          )}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
