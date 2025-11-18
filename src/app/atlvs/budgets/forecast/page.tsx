'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { TrendingUp, AlertTriangle, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useBudgetForecast } from '@/lib/hooks/atlvs/useBudgets';

export default function BudgetForecastPage() {
  const { data, isLoading, error, refetch } = useBudgetForecast();
  const forecastData = data?.forecastData || [];
  const totalProjected = data?.totalProjected || 0;
  const totalActual = data?.totalActual || 0;
  const totalVariance = data?.totalVariance || 0;

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="BUDGET FORECAST"
          description="Loading forecast..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Forecast' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading budget forecast...</p>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  if (error) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="BUDGET FORECAST"
          description="Error loading forecast"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Forecast' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Forecast</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="atlvs" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  return (
    <AtlvsLayout>
      <ContentLayout
        title="BUDGET FORECAST"
        description="Project future spending and track variance"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Budgets', href: '/atlvs/budgets' },
          { label: 'Forecast' }
        ]}
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Total Projected</div>
              <div className="text-2xl font-bold text-gray-900">${totalProjected.toLocaleString()}</div>
            </div>
            <TrendingUp className="w-8 h-8 text-info" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Actual Spend</div>
              <div className="text-2xl font-bold text-success">${totalActual.toLocaleString()}</div>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Variance</div>
              <div className={`text-2xl font-bold ${totalVariance > 0 ? 'text-success' : 'text-error'}`}>
                ${Math.abs(totalVariance).toLocaleString()}
              </div>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
      </div>

      {/* Forecast Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Forecast</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Month</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Projected</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Actual</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Variance</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {forecastData.map(data => (
                <tr key={data.month} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{data.month}</td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    ${data.projected.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {data.actual > 0 ? `$${data.actual.toLocaleString()}` : '-'}
                  </td>
                  <td className={`px-4 py-3 text-sm text-right font-medium ${
                    data.variance < 0 ? 'text-error' : data.variance > 0 ? 'text-success' : 'text-gray-600'
                  }`}>
                    {data.variance !== 0 ? `$${Math.abs(data.variance).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {data.actual > 0 ? (
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        data.variance < 0 ? 'bg-success-light text-success-foreground' : 'bg-red-100 text-red-800'
                      }`}>
                        {data.variance < 0 ? 'Under Budget' : 'Over Budget'}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Pending
                      </span>
                    )}
                  </td>
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
