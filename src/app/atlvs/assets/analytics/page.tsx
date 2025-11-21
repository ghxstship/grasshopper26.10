'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useAssets } from '@/lib/hooks/atlvs/useAssets';
import { Loader2 } from 'lucide-react';
import { BarChart3, TrendingUp, Package, Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';

interface AssetUsage {
  assetName: string;
  category: string;
  totalBookings: number;
  utilizationRate: number;
  avgDuration: number;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/assets/analytics

export default function AssetAnalyticsPage() {
  const { isLoading } = useAssets();
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-atlvs-green-500" />
        </div>
      </AtlvsLayout>
    );
  }
  
  const assetUsage: AssetUsage[] = [
    { assetName: 'Sound System A', category: 'Audio', totalBookings: 45, utilizationRate: 85, avgDuration: 3 },
    { assetName: 'Stage Lighting Kit', category: 'Lighting', totalBookings: 38, utilizationRate: 72, avgDuration: 4 },
    { assetName: 'Forklift #3', category: 'Vehicle', totalBookings: 52, utilizationRate: 92, avgDuration: 2 }
  ];

  const totalAssets = 24;
  const activeAssets = 18;
  const avgUtilization = 78;

  return (
    <AtlvsLayout>
      <ContentLayout
        title="ASSET ANALYTICS"
        description="Usage statistics and performance metrics"
        breadcrumbs={[
          { label: 'Assets', href: '/atlvs/_assets' },
          { label: 'Analytics' }
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-body-sm text-grey-400 mb-1">Total Assets</div>
                <div className="text-white">{totalAssets}</div>
              </div>
              <Package className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-body-sm text-grey-400 mb-1">Active</div>
                <div className="text-atlvs-green-500">{activeAssets}</div>
              </div>
              <TrendingUp className="w-8 h-8 text-atlvs-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-body-sm text-grey-400 mb-1">Avg Utilization</div>
                <div className="text-atlvs-purple-500">{avgUtilization}%</div>
              </div>
              <BarChart3 className="w-8 h-8 text-atlvs-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-body-sm text-grey-400 mb-1">Total Bookings</div>
                <div className="text-atlvs-orange-500">135</div>
              </div>
              <Clock className="w-8 h-8 text-atlvs-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Table */}
      <Card variant="atlvs" className="bg-grey-900/50">
        <CardHeader>
          <CardTitle>Asset Usage Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-grey-800/50 border-b border-grey-700">
                <tr>
                  <th className="px-4 py-3 text-left text-body-sm text-grey-900">Asset</th>
                  <th className="px-4 py-3 text-left text-body-sm text-grey-900">Category</th>
                  <th className="px-4 py-3 text-center text-body-sm text-grey-900">Bookings</th>
                  <th className="px-4 py-3 text-center text-body-sm text-grey-900">Utilization</th>
                  <th className="px-4 py-3 text-center text-body-sm text-grey-900">Avg Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-grey-200">
                {assetUsage.map((asset, idx) => (
                  <tr key={idx} className="hover:bg-grey-50">
                    <td className="px-4 py-3 text-body-sm text-grey-900">{asset.assetName}</td>
                    <td className="px-4 py-3 text-body-sm text-grey-600">{asset.category}</td>
                    <td className="px-4 py-3 text-body-sm text-grey-900 text-center">{asset.totalBookings}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-24 bg-grey-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${ asset.utilizationRate >= 80 ? 'bg-success' : asset.utilizationRate >= 60 ? 'bg-warning' : 'bg-destructive' }`}
                            style={{ width: `${asset.utilizationRate}%` }}
                          />
                        </div>
                        <span className="text-body-sm text-grey-900">{asset.utilizationRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-body-sm text-grey-900 text-center">{asset.avgDuration} days</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
