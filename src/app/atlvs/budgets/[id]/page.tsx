'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertCircle, DollarSign, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useBudget } from '@/lib/hooks/atlvs/useBudgets';

export default function BudgetDetailPage({ params }: { params: { id: string } }) {
  // Fetch budget data with React Query
  const { data: budget, isLoading, error, refetch } = useBudget(params.id);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50';
      case 'warning': return 'bg-warning-light text-warning border-warning-border';
      case 'over-budget': return 'bg-error-light text-error border-error-border';
      default: return 'bg-gray-500/20 text-gray-500 border-gray-500/50';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="Loading Budget..."
          description="Please wait"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Loading...' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-atlvs-purple-500" />
          </div>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  // Error state
  if (error || !budget) {
    return (
      <AtlvsLayout>
        <ContentLayout
          title="Error Loading Budget"
          description="Unable to fetch budget details"
          variant="atlvs"
          breadcrumbs={[
            { label: 'Budgets', href: '/atlvs/budgets' },
            { label: 'Error' }
          ]}
        >
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
                <p className="text-gray-400 mb-4">
                  {error instanceof Error ? error.message : 'Failed to load budget details'}
                </p>
                <Button variant="atlvs" onClick={() => refetch()}>
                  Try Again
                </Button>
              </div>
            </CardHeader>
          </Card>
        </ContentLayout>
      </AtlvsLayout>
    );
  }

  const percentSpent = (budget.totalSpent / budget.totalBudget) * 100;

  return (
    <AtlvsLayout>
      <ContentLayout
        title={budget.name}
        description={`${budget.project} • ${budget.currency}`}
        variant="atlvs"
        breadcrumbs={[
          { label: 'Budgets', href: '/atlvs/budgets' },
          { label: budget.name }
        ]}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start justify-between mb-4">
            <Badge variant="atlvs-outline" className={getStatusColor(budget.status)}>
              {budget.status === 'on-track' && <TrendingUp className="w-3 h-3 mr-1" />}
              {budget.status === 'warning' && <AlertCircle className="w-3 h-3 mr-1" />}
              {budget.status === 'over-budget' && <TrendingDown className="w-3 h-3 mr-1" />}
              {budget.status.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Badge>
          </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">Total Budget</div>
                <DollarSign className="w-5 h-5 text-gray-400" />
              </div>
              <div className="text-3xl font-bebas atlvs-text-gradient">
                ${budget.totalBudget.toLocaleString()}
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">Total Spent</div>
                <TrendingDown className="w-5 h-5 text-red-400" />
              </div>
              <div className="text-3xl font-bebas text-red-400">
                ${budget.totalSpent.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{percentSpent.toFixed(1)}% of budget</div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm text-gray-400">Remaining</div>
                <TrendingUp className="w-5 h-5 text-atlvs-green-500" />
              </div>
              <div className="text-3xl font-bebas text-atlvs-green-500">
                ${budget.totalRemaining.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500">{(100 - percentSpent).toFixed(1)}% remaining</div>
            </CardHeader>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card variant="atlvs" className="bg-gray-900/50 mb-6">
          <CardHeader>
            <CardTitle className="mb-4">Overall Progress</CardTitle>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Budget Utilization</span>
                <span className="font-medium">{percentSpent.toFixed(1)}%</span>
              </div>
              <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentSpent}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className={`h-full ${
                    percentSpent > 90 ? 'bg-error' : 
                    percentSpent > 75 ? 'bg-warning' : 
                    'bg-gradient-to-r from-atlvs-green-500 to-atlvs-purple-500'
                  }`}
                />
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Budget Items */}
          <div className="lg:col-span-2 space-y-6">
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Budget Breakdown</CardTitle>
                <div className="space-y-4">
                  {budget.items.map((item: any) => {
                    const itemPercent = (item.spent / item.allocated) * 100;
                    return (
                      <div key={item.id} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="font-medium mb-1">{item.category}</div>
                            <div className="text-sm text-gray-400">{item.description}</div>
                          </div>
                          <Badge variant="atlvs-outline" className={getStatusColor(item.status)}>
                            {item.status.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                          <div>
                            <div className="text-gray-500">Allocated</div>
                            <div className="font-medium">${item.allocated.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Spent</div>
                            <div className="font-medium text-red-400">${item.spent.toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-gray-500">Remaining</div>
                            <div className="font-medium text-atlvs-green-500">${item.remaining.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              itemPercent > 100 ? 'bg-error' :
                              itemPercent > 90 ? 'bg-warning' :
                              'bg-atlvs-green-500'
                            }`}
                            style={{ width: `${Math.min(itemPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Transactions */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Recent Transactions</CardTitle>
                <div className="space-y-3">
                  {budget.recentTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-sm font-medium">{transaction.description}</div>
                        <div className="text-sm font-medium text-red-400">
                          -${transaction.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(transaction.date).toLocaleDateString()}
                        </span>
                        <span>{transaction.category}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="w-full mt-4">
                  View All Transactions
                </Button>
              </CardHeader>
            </Card>

            {/* Quick Actions */}
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-4">Quick Actions</CardTitle>
                <div className="space-y-2">
                  <Button variant="atlvs" size="sm" className="w-full">
                    Add Expense
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    Export Report
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full">
                    Request Approval
                  </Button>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
