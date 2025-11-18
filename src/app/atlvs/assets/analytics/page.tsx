'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useAssets } from '@/lib/hooks/atlvs/useAssets';
import { Loader2 } from 'lucide-react';
import { BarChart3, TrendingUp, Package, Clock } from 'lucide-react';

interface AssetUsage {
  assetName: string;
  category: string;
  totalBookings: number;
  utilizationRate: number;
  avgDuration: number;
}

export default function AssetAnalyticsPage() {
  const { data: _assetsData, isLoading } = useAssets();
  
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Assets</div>
              <div className="text-2xl font-bold text-gray-900">{totalAssets}</div>
            </div>
            <Package className="w-8 h-8 text-info" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Active</div>
              <div className="text-2xl font-bold text-success">{activeAssets}</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Avg Utilization</div>
              <div className="text-2xl font-bold text-atlvs-purple-500">{avgUtilization}%</div>
            </div>
            <BarChart3 className="w-8 h-8 text-atlvs-purple-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Bookings</div>
              <div className="text-2xl font-bold text-atlvs-orange-500">135</div>
            </div>
            <Clock className="w-8 h-8 text-atlvs-orange-500" />
          </div>
        </div>
      </div>

      {/* Usage Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Asset Usage Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Asset</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Bookings</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Utilization</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Avg Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {assetUsage.map((asset, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{asset.assetName}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{asset.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{asset.totalBookings}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            asset.utilizationRate >= 80 ? 'bg-success' : 
                            asset.utilizationRate >= 60 ? 'bg-yellow-600' : 'bg-red-600'
                          }`}
                          style={{ width: `${asset.utilizationRate}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{asset.utilizationRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-center">{asset.avgDuration} days</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
