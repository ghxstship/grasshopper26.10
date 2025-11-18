'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState } from 'react';
import { FileCheck, AlertCircle, Clock, CheckCircle, Calendar, MapPin, DollarSign, Plus, Loader2 } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';

interface _Permit {
  id: string;
  name: string;
  type: string;
  venue: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'pending' | 'expired' | 'expiring-soon';
  cost: number;
  authority: string;
}

export default function PermitsPage() {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const { documents: permits, isLoading, error } = useDocuments('permit');

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="PERMIT TRACKING"
          description="Loading permits..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Permits' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error || !permits) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="PERMIT TRACKING"
          description="Error loading permits"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Documents', href: '/atlvs/documents' },
            { label: 'Permits' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <AlertCircle className="w-12 h-12 text-error" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const filteredPermits = (permits as any[]).filter((permit: any) => 
    selectedStatus === 'all' || permit.status === selectedStatus
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-success" />;
      case 'pending': return <Clock className="w-5 h-5 text-warning" />;
      case 'expired': return <AlertCircle className="w-5 h-5 text-error" />;
      case 'expiring-soon': return <AlertCircle className="w-5 h-5 text-atlvs-orange-500" />;
      default: return <FileCheck className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      active: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50',
      pending: 'bg-warning-light text-warning border-warning-border',
      expired: 'bg-error-light text-error border-error-border',
      'expiring-soon': 'bg-atlvs-orange-500/20 text-atlvs-orange-500 border-atlvs-orange-500/50'
    };
    return badges[status] || badges.active;
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PERMIT TRACKING"
        description="Manage and track all production permits and licenses"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: 'Permits' }
        ]}
      >
        {/* Toolbar */}
        <div className="flex justify-end mb-6">
          <Button variant="atlvs" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add _Permit
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">Total Permits</CardDescription>
                  <CardTitle className="text-3xl font-bebas">{permits.length}</CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl">
                  <FileCheck className="w-6 h-6 text-atlvs-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">Active</CardDescription>
                  <CardTitle className="text-3xl font-bebas">
                    {permits.filter(p => p.status === 'active').length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-atlvs-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">Expiring Soon</CardDescription>
                  <CardTitle className="text-3xl font-bebas">
                    {permits.filter(p => p.status === 'expiring-soon').length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-orange-500/10 rounded-xl">
                  <AlertCircle className="w-6 h-6 text-atlvs-orange-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">Total Cost</CardDescription>
                  <CardTitle className="text-3xl font-bebas">
                    ${permits.reduce((sum, p) => sum + p.cost, 0).toLocaleString()}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl">
                  <DollarSign className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Filter */}
        <Card variant="atlvs" className="bg-gray-900/50 mb-6">
          <CardHeader>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-300">Filter by status:</span>
              <div className="flex gap-2">
                {['all', 'active', 'pending', 'expiring-soon', 'expired'].map(status => (
                  <Button
                    key={status}
                    variant={selectedStatus === status ? 'atlvs' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedStatus(status)}
                    className="capitalize"
                  >
                    {status.replace('-', ' ')}
                  </Button>
                ))}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Permits List */}
        <Card variant="atlvs" className="bg-gray-900/50 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50 border-b border-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Permit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Venue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Expiry Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Cost
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {filteredPermits.map(permit => {
                  const daysUntilExpiry = getDaysUntilExpiry(permit.expiryDate);
                  
                  return (
                    <tr key={permit.id} className="hover:bg-gray-800/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(permit.status)}
                          <div>
                            <div className="font-medium text-white">{permit.name}</div>
                            <div className="text-sm text-gray-400">{permit.authority}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="atlvs-outline" className="bg-gray-700/50">
                          {permit.type}
                        </Badge>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <MapPin className="w-4 h-4" />
                          {permit.venue}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-sm text-gray-300">
                          <Calendar className="w-4 h-4" />
                          {permit.expiryDate}
                        </div>
                        {permit.status === 'active' && daysUntilExpiry <= 30 && (
                          <div className="text-xs text-atlvs-orange-500 mt-1">
                            {daysUntilExpiry} days remaining
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="atlvs-outline" className={getStatusBadge(permit.status)}>
                          {permit.status.replace('-', ' ')}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-white">
                        ${permit.cost.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Renewal Reminders */}
        <Card variant="atlvs" className="bg-orange-500/10 border-orange-500/50">
          <CardHeader>
            <CardTitle className="mb-4 flex items-center gap-2 text-atlvs-orange-500">
              <AlertCircle className="w-5 h-5" />
              Renewal Reminders
            </CardTitle>
            <div className="space-y-3">
              {permits.filter(p => p.status === 'expiring-soon' || p.status === 'expired').map(permit => (
                <div key={permit.id} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div>
                    <div className="font-medium text-white">{permit.name}</div>
                    <div className="text-sm text-gray-400">
                      {permit.status === 'expired' ? 'Expired on' : 'Expires on'} {permit.expiryDate}
                    </div>
                  </div>
                  <Button variant="atlvs" size="sm">
                    Renew Now
                  </Button>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
