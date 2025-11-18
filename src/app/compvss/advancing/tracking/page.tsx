'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Search, Filter, Eye, MessageSquare, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { useAdvancingRequests } from '@/lib/hooks/compvss';

interface AdvancingRequest {
  id: string;
  category: string;
  title: string;
  submittedBy: string;
  submittedAt: string;
  status: 'pending' | 'in-review' | 'approved' | 'rejected' | 'completed';
  priority: 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate: string;
  unreadMessages: number;
}

export default function RequestTrackingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const { data: requestsData, isLoading, error, refetch } = useAdvancingRequests();
  
  const requests = useMemo(() => {
    if (!requestsData?.requests) return [];
    return requestsData.requests.map((req: any) => ({
      id: req.id,
      category: req.category || 'Other',
      title: req.title || 'Untitled Request',
      submittedBy: req.submittedBy || 'Unknown',
      submittedAt: req.createdAt,
      status: req.status,
      priority: req.priority || 'normal',
      assignedTo: req.assignedTo,
      dueDate: req.dueDate,
      unreadMessages: 0,
    }));
  }, [requestsData]);
  
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      const matchesSearch = !searchQuery || 
        req.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
      const matchesCategory = categoryFilter === 'all' || req.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [requests, searchQuery, statusFilter, categoryFilter]);
  
  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Request Tracking"
          description="Monitor and manage all advancing requests"
          
          variant="compvss"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading requests...</p>
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
          title="Request Tracking"
          description="Monitor and manage all advancing requests"
          
          variant="compvss"
          showToolbar={false}
        >
          <div className="flex items-center justify-center py-12">
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
  
  const getStatusBadge = (status: AdvancingRequest['status']) => {
    const config = {
      pending: { variant: 'default' as const, label: 'Pending' },
      'in-review': { variant: 'warning' as const, label: 'In Review' },
      approved: { variant: 'success' as const, label: 'Approved' },
      rejected: { variant: 'error' as const, label: 'Rejected' },
      completed: { variant: 'success' as const, label: 'Completed' },
    };
    return <Badge variant={config[status].variant}>{config[status].label}</Badge>;
  };

  const getPriorityBadge = (priority: AdvancingRequest['priority']) => {
    const config = {
      normal: { variant: 'default' as const, label: 'Normal' },
      high: { variant: 'warning' as const, label: 'High' },
      urgent: { variant: 'error' as const, label: 'Urgent' },
    };
    return <Badge variant={config[priority].variant}>{config[priority].label}</Badge>;
  };

  const getStatusIcon = (status: AdvancingRequest['status']) => {
    switch (status) {
      case 'approved':
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'in-review':
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };


  const statusCounts = {
    all: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    'in-review': requests.filter(r => r.status === 'in-review').length,
    approved: requests.filter(r => r.status === 'approved').length,
    rejected: requests.filter(r => r.status === 'rejected').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Request Tracking"
        description="Monitor and manage advancing requests"
        
        variant="compvss"
        showToolbar={false}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <Link href="/compvss/advancing/dashboard">
              <h1 className="compvss-text-gradient text-h2 font-anton mb-2 cursor-pointer">
                Request Tracking
              </h1>
            </Link>
            <p className="text-gray-400 font-oswald">
              Monitor and manage all advancing requests
            </p>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
            {Object.entries(statusCounts).map(([status, count]) => (
            <Card
              key={status}
              variant="compvss"
              className={`cursor-pointer transition-all ${
                statusFilter === status
                  ? 'bg-compvss-cyan-500/20 border-compvss-cyan-500'
                  : 'bg-gray-900/80 border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40'
              }`}
              onClick={() => setStatusFilter(status)}
            >
              <CardContent className="pt-6 text-center">
                <p className="text-h4 font-bebas text-compvss-cyan-500">{count}</p>
                <p className="text-caption text-gray-400 font-oswald capitalize">{status.replace('-', ' ')}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <Card variant="compvss" className="mb-6 bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search requests..."
                  className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                />
              </div>
              <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    variant="compvss"
                    className="pl-10"
                  >
                    <option value="all">All Categories</option>
                    <option value="Access & Credentials">Access & Credentials</option>
                    <option value="Site Infrastructure">Site Infrastructure</option>
                    <option value="Heavy Equipment">Heavy Equipment</option>
                    <option value="Hospitality">Hospitality</option>
                    <option value="Travel & Logistics">Travel & Logistics</option>
                  </Select>
                </div>

              <Button variant="compvss-outline" className="w-full">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

          {/* Requests List */}
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card key={request.id} variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      {getStatusIcon(request.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-oswald text-white text-h6">{request.title}</h3>
                          {request.unreadMessages > 0 && (
                            <Badge variant="error" className="text-caption">
                              {request.unreadMessages} new
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-3 text-body-sm text-gray-400 font-share-tech mb-2">
                          <span>ID: {request.id}</span>
                          <span>•</span>
                          <span>{request.category}</span>
                          <span>•</span>
                          <span>By: {request.submittedBy}</span>
                          {request.assignedTo && (
                            <>
                              <span>•</span>
                              <span>Assigned to: {request.assignedTo}</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-caption text-gray-500 font-share-tech">
                          <Clock className="w-3 h-3" />
                          <span>Submitted: {new Date(request.submittedAt).toLocaleString()}</span>
                          <span>•</span>
                          <span>Due: {new Date(request.dueDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getStatusBadge(request.status)}
                      {getPriorityBadge(request.priority)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/compvss/advancing/tracking/${request.id}`} className="flex-1">
                      <Button variant="compvss" size="sm" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    <Button variant="compvss-outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Messages {request.unreadMessages > 0 && `(${request.unreadMessages})`}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredRequests.length === 0 && (
            <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
              <CardContent className="pt-6 text-center py-12">
                <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 font-oswald">No requests found matching your filters</p>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
