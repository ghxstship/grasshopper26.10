'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { FileText, Download, Eye, Edit, Plus, Search, Music, Utensils, Truck,  } from 'lucide-react';
import { useDocuments } from '@/lib/hooks/atlvs/useDocuments';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';

interface _Rider {
  id: string;
  name: string;
  type: 'technical' | 'hospitality' | 'production';
  artist: string;
  venue: string;
  date: string;
  status: 'approved' | 'pending' | 'draft';
  size: string;
}

export default function RidersPage() {  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const { documents,  } = useDocuments('rider');
  const riders = (documents as any) || [];

  const filteredRiders = riders.filter(rider => {
    const matchesSearch = rider.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rider.artist.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || rider.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || rider.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'technical': return <Music className="w-5 h-5" />;
      case 'hospitality': return <Utensils className="w-5 h-5" />;
      case 'production': return <Truck className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const _getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      technical: 'bg-info-light text-info border-info-border',
      hospitality: 'bg-atlvs-purple-500/20 text-atlvs-purple-500 border-atlvs-purple-500/50',
      production: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50'
    };
    return colors[type] || 'bg-gray-500/20 text-gray-500 border-gray-500/50';
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      approved: 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50',
      pending: 'bg-warning-light text-warning border-warning-border',
      draft: 'bg-gray-500/20 text-gray-500 border-gray-500/50'
    };
    return badges[status] || badges.draft;
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="RIDER STORAGE"
        description="Manage technical, hospitality, and production riders"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Documents', href: '/atlvs/documents' },
          { label: 'Riders' }
        ]}
      >
        {/* Toolbar */}
        <div className="flex justify-end mb-6">
          <Button variant="atlvs" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            New _Rider
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search riders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            variant="atlvs"
          >
            <option value="all">All Types</option>
            <option value="technical">Technical</option>
            <option value="hospitality">Hospitality</option>
            <option value="production">Production</option>
          </Select>
          <Select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            variant="atlvs"
          >
            <option value="all">All Status</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="draft">Draft</option>
          </Select>
        </div>

        {/* Riders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {filteredRiders.map(rider => (
            <Card key={rider.id} variant="atlvs" className="bg-gray-900/50 hover:bg-gray-900 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    {getTypeIcon(rider.type)}
                  </div>
                  <Badge variant="atlvs-outline" className={getStatusBadge(rider.status)}>
                    {rider.status}
                  </Badge>
                </div>
                
                <CardTitle className="text-white mb-4">{rider.name}</CardTitle>
                
                <div className="space-y-2 mb-4 text-body-sm text-gray-400">
                  <div className="flex items-center justify-between">
                    <span>Artist:</span>
                    <span className="font-medium text-white">{rider.artist}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Venue:</span>
                    <span className="font-medium text-white">{rider.venue}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Date:</span>
                    <span className="font-medium text-white">{rider.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Size:</span>
                    <span className="font-medium text-white">{rider.size}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t border-gray-700">
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="atlvs" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        {filteredRiders.length === 0 && (
          <Card variant="atlvs" className="bg-gray-900/50 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-400">No riders found</p>
          </Card>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">Total Riders</CardDescription>
                  <CardTitle className="text-h3 font-bebas">{riders.length}</CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl">
                  <FileText className="w-6 h-6 text-atlvs-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">Technical</CardDescription>
                  <CardTitle className="text-h3 font-bebas">
                    {riders.filter(r => r.type === 'technical').length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl">
                  <Music className="w-6 h-6 text-info" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">Hospitality</CardDescription>
                  <CardTitle className="text-h3 font-bebas">
                    {riders.filter(r => r.type === 'hospitality').length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-accent/100/10 rounded-xl">
                  <Utensils className="w-6 h-6 text-atlvs-purple-500" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">Production</CardDescription>
                  <CardTitle className="text-h3 font-bebas">
                    {riders.filter(r => r.type === 'production').length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl">
                  <Truck className="w-6 h-6 text-atlvs-green-500" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
