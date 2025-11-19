'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { use } from 'react';
import { motion } from 'framer-motion';
import { Edit, MapPin, DollarSign, User, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useAsset } from '@/lib/hooks/atlvs/useAssets';
import { SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/assets/[id]

// API: /api/atlvs/assets/:id
const API_ENDPOINT = '/api/atlvs/assets/:id';

export default function AssetDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: asset, isLoading, error, refetch } = useAsset(id) as any;

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout title="Loading..." description="Asset Details" variant="atlvs">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-green-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error || !asset) {
    return (
      <AtlvsLayout>
        <ContentLayout title="Error" description="Asset Details" variant="atlvs">
          <Card variant="atlvs" className="bg-grey-900/50">
            <CardHeader>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
                <SubsectionHeader className="mb-2">Failed to Load Asset</SubsectionHeader>
                <p className="text-grey-400 mb-4">{error?.message || 'Asset not found'}</p>
                <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'in-use': return 'bg-info-light text-info border-info-border';
      case 'maintenance': return 'bg-warning-light text-warning border-warning-border';
      case 'unavailable': return 'bg-error-light text-error border-error-border';
      default: return 'bg-grey-500/20 text-grey-500 border-grey-500/50';
    }
  };


  return (
    <AtlvsLayout>
      <ContentLayout
        title={asset.name}
        description={`Asset ID: ${asset.id} • ${asset.type || 'Equipment'}`}
        variant="atlvs"
        breadcrumbs={[
          { label: 'Assets', href: '/atlvs/assets' },
          { label: asset.name }
        ]}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h1 className="mb-2 atlvs-text-gradient">
                {asset.name}
              </h1>
              <p className="text-grey-400">
                Asset ID: {asset.id} • {asset.category}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="atlvs" size="sm">
                Book Asset
              </Button>
              <Button variant="ghost" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="atlvs-outline" className={getStatusColor(asset.status)}>
              {asset.status === 'AVAILABLE' && <CheckCircle className="w-3 h-3 mr-1" />}
              {asset.status === 'MAINTENANCE' && <AlertCircle className="w-3 h-3 mr-1" />}
              {asset.status}
            </Badge>
            {asset.type && (
              <Badge variant="atlvs-outline" className="bg-grey-700/50">
                {asset.type}
              </Badge>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            {asset.description && (
              <Card variant="atlvs" className="bg-grey-900/50">
                <CardHeader>
                  <CardTitle className="mb-4">Description</CardTitle>
                  <p className="text-grey-300">{asset.description}</p>
                </CardHeader>
              </Card>
            )}

            {/* Asset Information */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Asset Information</CardTitle>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-grey-800/50 rounded-lg">
                    <div className="text-body-sm text-grey-400 mb-1">Asset Type</div>
                    <div className="font-medium">{asset.type || 'N/A'}</div>
                  </div>
                  <div className="p-4 bg-grey-800/50 rounded-lg">
                    <div className="text-body-sm text-grey-400 mb-1">Status</div>
                    <div className="font-medium">{asset.status}</div>
                  </div>
                  {asset.location && (
                    <div className="p-4 bg-grey-800/50 rounded-lg">
                      <div className="text-body-sm text-grey-400 mb-1">Location</div>
                      <div className="font-medium">{asset.location}</div>
                    </div>
                  )}
                  {asset.serialNumber && (
                    <div className="p-4 bg-grey-800/50 rounded-lg">
                      <div className="text-body-sm text-grey-400 mb-1">Serial Number</div>
                      <div className="font-medium">{asset.serialNumber}</div>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Asset Details */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Asset Details</CardTitle>
                <div className="space-y-4">
                  {asset.location && (
                    <div>
                      <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Location
                      </div>
                      <div className="font-medium">{asset.location}</div>
                    </div>
                  )}
                  {asset.value && (
                    <div>
                      <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        Asset Value
                      </div>
                      <div className="font-medium">${asset.value.toLocaleString()}</div>
                    </div>
                  )}
                  {asset.purchaseDate && (
                    <div>
                      <div className="text-body-sm text-grey-400 mb-1">Purchase Date</div>
                      <div className="font-medium">{new Date(asset.purchaseDate).toLocaleDateString()}</div>
                    </div>
                  )}
                  {asset.assignedTo ? (
                    <div>
                      <div className="text-body-sm text-grey-400 mb-1 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        Assigned To
                      </div>
                      <div className="font-medium">{asset.assignedTo}</div>
                    </div>
                  ) : (
                    <div className="p-3 bg-atlvs-green-500/10 border border-atlvs-green-500/20 rounded-lg">
                      <div className="text-body-sm text-atlvs-green-500 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        Available for booking
                      </div>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>

            {/* Quick Actions */}
            <Card variant="atlvs" className="bg-grey-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Quick Actions</CardTitle>
                <div className="space-y-2">
                  <Button variant="atlvs" size="sm" className="w-full">
                    Book Asset
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    Request Maintenance
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    View History
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
