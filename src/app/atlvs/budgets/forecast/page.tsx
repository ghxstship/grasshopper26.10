'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { TrendingUp, AlertTriangle, DollarSign, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { useBudgetForecast } from '@/lib/hooks/atlvs/useBudgets';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/budgets/forecast

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
              <BodyText className="text-grey-400">Loading budget forecast...</BodyText>
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
              <SectionHeader className="mb-2">Failed to Load Forecast</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
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
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="text-grey-400 mb-1">Total Projected</CardDescription>
                <CardTitle >${totalProjected.toLocaleString()}</CardTitle>
              </div>
              <TrendingUp className="w-8 h-8 text-info" />
            </div>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="text-grey-400 mb-1">Actual Spend</CardDescription>
                <CardTitle className="text-atlvs-green-500">${totalActual.toLocaleString()}</CardTitle>
              </div>
              <DollarSign className="w-8 h-8 text-atlvs-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="text-grey-400 mb-1">Variance</CardDescription>
                <CardTitle className={`${totalVariance > 0 ? 'text-atlvs-green-500' : 'text-error'}`}>
                  ${Math.abs(totalVariance).toLocaleString()}
                </CardTitle>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forecast Table */}
      <Card variant="atlvs" className="bg-grey-900/50">
        <CardHeader>
          <CardTitle>Monthly Forecast</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-grey-800/50 border-b border-grey-700">
              <tr>
                <th className="px-4 py-3 text-left text-body-sm text-grey-400">Month</th>
                <th className="px-4 py-3 text-right text-body-sm text-grey-400">Projected</th>
                <th className="px-4 py-3 text-right text-body-sm text-grey-400">Actual</th>
                <th className="px-4 py-3 text-right text-body-sm text-grey-400">Variance</th>
                <th className="px-4 py-3 text-center text-body-sm text-grey-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-800">
              {forecastData.map(data => (
                <tr key={data.month} className="hover:bg-grey-800/50">
                  <td className="px-4 py-3 text-body-sm text-white">{data.month}</td>
                  <td className="px-4 py-3 text-body-sm text-white text-right">
                    ${data.projected.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-white text-right">
                    {data.actual > 0 ? `$${data.actual.toLocaleString()}` : '-'}
                  </td>
                  <td className={`px-4 py-3 text-body-sm text-right ${ data.variance < 0 ? 'text-error' : data.variance > 0 ? 'text-atlvs-green-500' : 'text-grey-400' }`}>
                    {data.variance !== 0 ? `$${Math.abs(data.variance).toLocaleString()}` : '-'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {data.actual > 0 ? (
                      <span className={`px-3 py-1 rounded-full text-caption ${ data.variance < 0 ? 'bg-atlvs-green-500/20 text-atlvs-green-500' : 'bg-error/20 text-error' }`}>
                        {data.variance < 0 ? 'Under Budget' : 'Over Budget'}
                      </span>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-caption bg-grey-700 text-grey-300">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
        </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
