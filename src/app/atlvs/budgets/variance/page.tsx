'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Loader2, AlertCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { useBudgetVariance } from '@/lib/hooks/atlvs/useBudgets';

export default function BudgetVariancePage() {
  const { data, isLoading, error, refetch } = useBudgetVariance();
  const variances = data?.variances || [];
  const _totals = data?.totals || { budgeted: 0, actual: 0, variance: 0 };

  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="VARIANCE ANALYSIS"
          description="Loading variance data..."
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Variance' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
              <p className="text-gray-400">Loading variance analysis...</p>
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
          title="VARIANCE ANALYSIS"
          description="Error loading variance data"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Variance' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Variance Data</h2>
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
        title="VARIANCE ANALYSIS"
        description="Compare budgeted vs actual spending"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Budgets', href: '/atlvs/budgets' },
          { label: 'Variance' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-body-sm text-gray-400 mb-1">Total Budgeted</div>
              <div className="text-h3 font-bebas atlvs-text-gradient">$275K</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-body-sm text-gray-400 mb-1">Total Actual</div>
              <div className="text-h3 font-bebas text-atlvs-purple-500">$281K</div>
            </CardHeader>
          </Card>
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-body-sm text-gray-400 mb-1">Variance</div>
              <div className="text-h3 font-bebas text-error">+$6K</div>
            </CardHeader>
          </Card>
        </div>

        <Card variant="atlvs" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="mb-6">Category Breakdown</CardTitle>
            <div className="space-y-4">
              {variances.map((item, i) => (
                <div key={i} className="p-4 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium">{item.category}</span>
                    <div className="flex items-center gap-2">
                      {item.variance < 0 ? (
                        <TrendingDown className="w-4 h-4 text-atlvs-green-500" />
                      ) : item.variance > 0 ? (
                        <TrendingUp className="w-4 h-4 text-error" />
                      ) : null}
                      <span className={item.variance < 0 ? 'text-atlvs-green-500' : item.variance > 0 ? 'text-error' : 'text-gray-400'}>
                        {item.variance < 0 ? '' : '+'}{item.variance.toLocaleString()} ({item.percent}%)
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-body-sm">
                    <div>
                      <div className="text-gray-400">Budgeted</div>
                      <div className="font-medium">${item.budgeted.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-gray-400">Actual</div>
                      <div className="font-medium">${item.actual.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardHeader>
        </Card>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
