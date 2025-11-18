'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Search, Filter, QrCode, Truck, Wrench, CheckCircle2, AlertCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { Input } from '@/components/atoms/Input';
import { useAssets } from '@/lib/hooks/atlvs/useAssets';
import { useDebounce } from 'use-debounce';

interface _Asset {
  id: string;
  name: string;
  category: 'equipment' | 'vehicle' | 'tool';
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  location: string;
  assignedTo?: string;
  project?: string;
  qrCode: string;
  lastMaintenance: string;
  nextMaintenance: string;
  value: number;
}

export default function AssetsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  
  const { data: assetsData, isLoading, error, refetch } = useAssets();

  // Transform API data to match component interface
  const assets = useMemo(() => {
    if (!assetsData?.assets) return [];
    return assetsData.assets.map((asset: any) => ({
      id: asset.id,
      name: asset.name,
      category: asset.type?.toLowerCase() || 'equipment',
      status: asset.status?.toLowerCase().replace('_', '-') || 'available',
      location: asset.location || 'Unknown',
      assignedTo: asset.assignedTo,
      project: asset.project?.name,
      qrCode: asset.qrCode || asset.id,
      lastMaintenance: asset.lastMaintenanceDate || new Date().toISOString(),
      nextMaintenance: asset.nextMaintenanceDate || new Date().toISOString(),
      value: asset.value || 0
    }));
  }, [assetsData]);
  
  // Remove mock assets - keeping only for reference if needed
  /*
  const mockAssets: Asset[] = [
  {
    id: 'AST-001',
    name: 'LED Wall Panel - 500x500mm',
    category: 'equipment',
    status: 'in-use',
    location: 'Main Stage',
    assignedTo: 'Mike Chen',
    project: 'Summer Music Festival',
    qrCode: 'QR-LED-001',
    lastMaintenance: '2024-04-15',
    nextMaintenance: '2024-07-15',
    value: 15000
  },
  {
    id: 'AST-002',
    name: 'Forklift - 5000lb Capacity',
    category: 'vehicle',
    status: 'available',
    location: 'Equipment Yard',
    qrCode: 'QR-VEH-002',
    lastMaintenance: '2024-05-01',
    nextMaintenance: '2024-08-01',
    value: 35000
  },
  {
    id: 'AST-003',
    name: 'Digital Mixing Console',
    category: 'equipment',
    status: 'in-use',
    location: 'FOH Position',
    assignedTo: 'Sam Patel',
    project: 'Arena Concert Series',
    qrCode: 'QR-AUD-003',
    lastMaintenance: '2024-03-20',
    nextMaintenance: '2024-06-20',
    value: 45000
  },
  {
    id: 'AST-004',
    name: 'Power Distribution Unit',
    category: 'equipment',
    status: 'maintenance',
    location: 'Maintenance Shop',
    qrCode: 'QR-PWR-004',
    lastMaintenance: '2024-05-18',
    nextMaintenance: '2024-05-25',
    value: 8000
  },
  {
    id: 'AST-005',
    name: 'Golf Cart - 6 Passenger',
    category: 'vehicle',
    status: 'in-use',
    location: 'Festival Grounds',
    assignedTo: 'Jordan Lee',
    project: 'Summer Music Festival',
    qrCode: 'QR-VEH-005',
    lastMaintenance: '2024-04-10',
    nextMaintenance: '2024-07-10',
    value: 12000
  },
  {
    id: 'AST-006',
    name: 'Wireless Microphone System',
    category: 'equipment',
    status: 'available',
    location: 'Audio Storage',
    qrCode: 'QR-AUD-006',
    lastMaintenance: '2024-05-05',
    nextMaintenance: '2024-08-05',
    value: 5000
  }
];
*/

  const categories = ['All Categories', 'Equipment', 'Vehicle', 'Tool'];
  
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      const matchesSearch = asset.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           asset.id.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCategory = selectedCategory === 'All Categories' || 
                             asset.category === selectedCategory.toLowerCase();
      const matchesStatus = selectedStatus === 'all' || asset.status === selectedStatus;
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [assets, debouncedSearch, selectedCategory, selectedStatus]);

  const statusCounts = useMemo(() => ({
    all: assets.length,
    available: assets.filter(a => a.status === 'available').length,
    'in-use': assets.filter(a => a.status === 'in-use').length,
    maintenance: assets.filter(a => a.status === 'maintenance').length,
  }), [assets]);

  const totalValue = useMemo(() => 
    assets.reduce((sum, asset) => sum + asset.value, 0),
  [assets]);
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <p className="text-gray-400">Loading assets...</p>
          </div>
        </div>
      </AtlvsLayout>
    );
  }
  
  if (error) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Assets</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="atlvs" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle2 className="w-4 h-4" />;
      case 'in-use': return <Package className="w-4 h-4" />;
      case 'maintenance': return <Wrench className="w-4 h-4" />;
      case 'retired': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'in-use': return 'bg-info-light text-info border-info-border';
      case 'maintenance': return 'bg-warning-light text-warning border-warning-border';
      case 'retired': return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'equipment': return <Package className="w-5 h-5" />;
      case 'vehicle': return <Truck className="w-5 h-5" />;
      case 'tool': return <Wrench className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="ASSET MANAGEMENT"
        description="Track equipment, vehicles, and inventory"
        variant="atlvs"
        showToolbar={false}
      >
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="region" aria-label="_Asset statistics">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Assets
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas" aria-label={`${statusCounts.all} total assets`}>
                    {statusCounts.all}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl" aria-hidden="true">
                  <Package className="w-6 h-6 text-info" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Available
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas text-atlvs-green-500" aria-label={`${statusCounts.available} assets available`}>
                    {statusCounts.available}
                  </CardTitle>
                </div>
                <div className="p-3 bg-atlvs-green-500/10 rounded-xl" aria-hidden="true">
                  <CheckCircle2 className="w-6 h-6 text-atlvs-green-500" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    In Use
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas text-info" aria-label={`${statusCounts['in-use']} assets in use`}>
                    {statusCounts['in-use']}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl" aria-hidden="true">
                  <Truck className="w-6 h-6 text-info" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Value
                  </CardDescription>
                  <CardTitle className="text-3xl font-bebas" aria-label={`${formatCurrency(totalValue)} total asset value`}>
                    {formatCurrency(totalValue)}
                  </CardTitle>
                </div>
                <div className="p-3 bg-purple-500/10 rounded-xl" aria-hidden="true">
                  <Package className="w-6 h-6 text-atlvs-purple-500" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" aria-hidden="true" />
              <Input
                type="text"
                placeholder="Search assets..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="atlvs"
                className="pl-10"
              />
            </div>
          </div>

          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
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
            <Button variant="atlvs-outline" size="sm">
              <QrCode className="w-4 h-4 mr-2" />
              Scan QR
            </Button>
            <Link href="/atlvs/assets/new">
              <Button variant="atlvs" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add Asset
              </Button>
            </Link>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'all', label: 'All', count: statusCounts.all },
            { id: 'available', label: 'Available', count: statusCounts.available },
            { id: 'in-use', label: 'In Use', count: statusCounts['in-use'] },
            { id: 'maintenance', label: 'Maintenance', count: statusCounts.maintenance }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              variant={selectedStatus === tab.id ? 'atlvs' : 'ghost'}
              size="sm"
            >
              {tab.label} ({tab.count})
            </Button>
          ))}
        </div>

        {/* Assets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset, index) => (
            <motion.div
              key={asset.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/atlvs/assets/${asset.id}`}>
                <Card 
                  variant="atlvs" 
                  className="bg-gray-900/50 hover:bg-gray-900 transition-all cursor-pointer h-full"
                >
                  <CardHeader>
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-atlvs-green-500/10 rounded-lg text-atlvs-green-500">
                          {getCategoryIcon(asset.category)}
                        </div>
                        <div className="flex-1">
                          <Badge variant="atlvs-outline" className="text-xs mb-2">
                            {asset.id}
                          </Badge>
                          <CardTitle className="text-white text-sm">
                            {asset.name}
                          </CardTitle>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <Badge 
                        variant="atlvs-outline"
                        className={getStatusColor(asset.status)}
                      >
                        <span className="flex items-center gap-1">
                          {getStatusIcon(asset.status)}
                          {asset.status.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{asset.location}</span>
                      </div>
                      {asset.assignedTo && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Assigned:</span>
                          <span className="text-white">{asset.assignedTo}</span>
                        </div>
                      )}
                      {asset.project && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Project:</span>
                          <span className="text-white truncate ml-2">{asset.project}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-400">Value:</span>
                        <span className="text-white font-bebas">{formatCurrency(asset.value)}</span>
                      </div>
                    </div>

                    {/* QR Code */}
                    <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <QrCode className="w-3 h-3" />
                        <span>{asset.qrCode}</span>
                      </div>
                      <Button variant="ghost" size="sm" className="text-xs">
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
