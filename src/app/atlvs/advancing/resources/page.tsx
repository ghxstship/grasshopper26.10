'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState, useMemo } from 'react';
import { Package, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useToast } from '@/lib/hooks/useToast';
import { useAssets } from '@/lib/hooks/atlvs/useAssets';

interface Resource {
  id: string;
  name: string;
  category: string;
  available: number;
  total: number;
  status: 'available' | 'limited' | 'unavailable';
}

export default function AdvancingResourcesPage() {
  const { addToast } = useToast();
  const { data: assetsData, isLoading, error, refetch } = useAssets();
  const [allocatingId, setAllocatingId] = useState<string | null>(null);
  
  // Transform assets into resources
  const resources: Resource[] = useMemo(() => {
    if (!assetsData?.assets) return [];
    
    return assetsData.assets.map((asset) => {
      // Equipment doesn't have quantity field - use mock data
      const available = 10; // Mock available quantity
      const total = 10; // Mock total quantity
      const utilizationRate = 0.3; // Mock utilization
      const actualAvailable = Math.floor(available * (1 - utilizationRate));
      
      let status: 'available' | 'limited' | 'unavailable' = 'available';
      if (actualAvailable === 0) status = 'unavailable';
      else if (actualAvailable < total * 0.5) status = 'limited';
      
      return {
        id: asset.id,
        name: asset.name,
        category: asset.type || 'Equipment',
        available: actualAvailable,
        total,
        status
      };
    });
  }, [assetsData]);
  
  // Calculate metrics
  const metrics = useMemo(() => {
    const total = resources.reduce((sum, r) => sum + r.total, 0);
    const available = resources.reduce((sum, r) => sum + r.available, 0);
    const allocated = total - available;
    const utilization = total > 0 ? Math.round((allocated / total) * 100) : 0;
    
    return { total, available, allocated, utilization };
  }, [resources]);
  
  const handleAllocate = async (resourceId: string, resourceName: string) => {
    setAllocatingId(resourceId);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      addToast({
        title: 'Success',
        description: `${resourceName} allocated successfully`,
        variant: 'success',
      });
    } catch {
      addToast({
        title: 'Error',
        description: 'Failed to allocate resource',
        variant: 'error',
      });
    } finally {
      setAllocatingId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'limited': return 'bg-warning-light text-warning border-warning-border';
      case 'unavailable': return 'bg-error-light text-error border-error-border';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="RESOURCE ALLOCATION"
        description="Manage and allocate production resources"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Advancing', href: '/atlvs/advancing' },
          { label: 'Resources' }
        ]}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-green-500" />
          </div>
        ) : error ? (
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-center py-12">
                <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
                <h3 className="text-lg font-bebas mb-2">Failed to Load Resources</h3>
                <p className="text-gray-400 mb-4">{error.message}</p>
                <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
              </div>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6" role="region" aria-label="Resource allocation statistics">
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="text-sm text-gray-400 mb-1">Total Resources</div>
                  <div className="text-3xl font-bebas atlvs-text-gradient" aria-label={`${metrics.total} total resources`}>{metrics.total}</div>
                </CardHeader>
              </Card>
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="text-sm text-gray-400 mb-1">Available</div>
                  <div className="text-3xl font-bebas text-atlvs-green-500" aria-label={`${metrics.available} resources available`}>{metrics.available}</div>
                </CardHeader>
              </Card>
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="text-sm text-gray-400 mb-1">Allocated</div>
                  <div className="text-3xl font-bebas text-atlvs-purple-500" aria-label={`${metrics.allocated} resources allocated`}>{metrics.allocated}</div>
                </CardHeader>
              </Card>
              <Card variant="atlvs" className="bg-gray-900/50">
                <CardHeader>
                  <div className="text-sm text-gray-400 mb-1">Utilization</div>
                  <div className="text-3xl font-bebas text-info" aria-label={`${metrics.utilization} percent utilization rate`}>{metrics.utilization}%</div>
                </CardHeader>
              </Card>
            </div>

        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6 flex items-center gap-2">
              <Package className="w-5 h-5" aria-hidden="true" />
              Resource Inventory
            </CardTitle>
            <div className="space-y-3">
              {resources.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No resources available</p>
                </div>
              ) : (
                resources.map((resource) => (
                  <div key={resource.id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium mb-1">{resource.name}</div>
                      <div className="text-sm text-gray-400">{resource.category}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bebas atlvs-text-gradient">{resource.available}/{resource.total}</div>
                        <div className="text-xs text-gray-400">Available</div>
                      </div>
                      <Badge variant="atlvs-outline" className={getStatusColor(resource.status)}>
                        {resource.status}
                      </Badge>
                      <Button 
                        variant="atlvs" 
                        size="sm"
                        onClick={() => handleAllocate(resource.id, resource.name)}
                        disabled={resource.available === 0 || allocatingId === resource.id}
                      >
                        {allocatingId === resource.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Allocate'
                        )}
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardHeader>
        </Card>
          </>
        )}
      </ContentLayout>
    </AtlvsLayout>
  );
}
