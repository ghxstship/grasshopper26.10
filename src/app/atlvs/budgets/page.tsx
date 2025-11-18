'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Plus, Download, Filter, PieChart, Loader2, AlertCircle } from 'lucide-react';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { DataTable, DataTableColumn } from '@/components/atlvs/DataTable';
import { useBudgets } from '@/lib/hooks/atlvs/useBudgets';

interface BudgetItem extends Record<string, unknown> {
  id: string;
  category: string;
  budgeted: number;
  spent: number;
  remaining: number;
  status: 'on-track' | 'warning' | 'over-budget';
  lastUpdated: string;
}

export default function BudgetsPage() {
  const { data: budgets, isLoading, error, refetch } = useBudgets();
  
  const budgetData: BudgetItem[] = useMemo(() => budgets || [], [budgets]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const stats = useMemo(() => {
    const totalBudget = budgetData.reduce((sum, item) => sum + item.budgeted, 0);
    const totalSpent = budgetData.reduce((sum, item) => sum + item.spent, 0);
    const totalRemaining = totalBudget - totalSpent;
    const percentageSpent = (totalSpent / totalBudget) * 100;
    return { totalBudget, totalSpent, totalRemaining, percentageSpent };
  }, [budgetData]);
  
  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <p className="text-gray-400">Loading budgets...</p>
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
            <h2 className="text-h5 font-bebas mb-2">Failed to Load Budgets</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="atlvs" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  const columns: DataTableColumn<BudgetItem>[] = [
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      width: '25%'
    },
    {
      key: 'budgeted',
      header: 'Budgeted',
      sortable: true,
      render: (value) => formatCurrency(value as number)
    },
    {
      key: 'spent',
      header: 'Spent',
      sortable: true,
      render: (value) => formatCurrency(value as number)
    },
    {
      key: 'remaining',
      header: 'Remaining',
      sortable: true,
      render: (value) => {
        const amount = value as number;
        return (
          <span className={amount < 0 ? 'text-error' : 'text-atlvs-green-500'}>
            {formatCurrency(amount)}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, row) => {
        const percentage = (row.spent / row.budgeted) * 100;
        const status = value as string;
        return (
          <div className="flex items-center gap-2">
            <Badge
              variant="atlvs-outline"
              className={
                status === 'on-track' ? 'bg-atlvs-green-500/20 text-atlvs-green-500 border-atlvs-green-500/50' :
                status === 'warning' ? 'bg-warning-light text-warning border-warning-border' :
                'bg-error-light text-error border-error-border'
              }
            >
              {percentage.toFixed(0)}%
            </Badge>
          </div>
        );
      }
    }
  ];

  return (
    <AtlvsLayout>
      <ContentLayout
        title="BUDGETS"
        description="Track expenses and manage project budgets"
        variant="atlvs"
        showToolbar={false}
      >
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" role="region" aria-label="Budget summary statistics">
          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Budget
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas" aria-label={`Total budget: ${formatCurrency(stats.totalBudget)}`}>
                    {formatCurrency(stats.totalBudget)}
                  </CardTitle>
                </div>
                <div className="p-3 bg-info/10 rounded-xl" aria-hidden="true">
                  <DollarSign className="w-6 h-6 text-info" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Total Spent
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas" aria-label={`Total spent: ${formatCurrency(stats.totalSpent)}, ${stats.percentageSpent.toFixed(1)} percent of budget`}>
                    {formatCurrency(stats.totalSpent)}
                  </CardTitle>
                  <div className="text-caption text-gray-400 mt-1" aria-hidden="true">
                    {stats.percentageSpent.toFixed(1)}% of budget
                  </div>
                </div>
                <div className="p-3 bg-warning-light0/10 rounded-xl" aria-hidden="true">
                  <TrendingUp className="w-6 h-6 text-atlvs-orange-500" aria-hidden="true" />
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Remaining
                  </CardDescription>
                  <CardTitle className={`text-h3 font-bebas ${
                    stats.totalRemaining < 0 ? 'text-error' : 'text-atlvs-green-500'
                  }`} aria-label={`Remaining budget: ${formatCurrency(stats.totalRemaining)}${stats.totalRemaining < 0 ? ', over budget' : ''}`}>
                    {formatCurrency(stats.totalRemaining)}
                  </CardTitle>
                </div>
                <div className={`p-3 rounded-xl ${
                  stats.totalRemaining < 0 ? 'bg-error/10' : 'bg-atlvs-green-500/10'
                }`}>
                  {stats.totalRemaining < 0 ? (
                    <TrendingDown className="w-6 h-6 text-error" />
                  ) : (
                    <DollarSign className="w-6 h-6 text-atlvs-green-500" />
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card variant="atlvs" className="bg-gray-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardDescription className="text-gray-400 mb-1">
                    Over Budget Items
                  </CardDescription>
                  <CardTitle className="text-h3 font-bebas text-error">
                    {budgetData.filter((item: BudgetItem) => item.status === 'over-budget').length}
                  </CardTitle>
                </div>
                <div className="p-3 bg-error/10 rounded-xl">
                  <AlertTriangle className="w-6 h-6 text-error" />
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card variant="atlvs" className="bg-gray-900/50 mb-8">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <CardTitle>Overall Budget Progress</CardTitle>
              <Badge variant="atlvs-outline">
                {stats.percentageSpent.toFixed(1)}% Used
              </Badge>
            </div>
            <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  stats.percentageSpent > 100 ? 'bg-error' :
                  stats.percentageSpent > 90 ? 'bg-warning' :
                  'bg-atlvs-green-500'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(stats.percentageSpent, 100)}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </CardHeader>
        </Card>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-400">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <PieChart className="w-4 h-4 mr-2" />
              View Chart
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="atlvs-outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="atlvs" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </div>
        </div>

        {/* Budget Table */}
        <DataTable
          data={budgetData}
          columns={columns}
          searchable={true}
          exportable={true}
        />
      </ContentLayout>
    </AtlvsLayout>
  );
}
