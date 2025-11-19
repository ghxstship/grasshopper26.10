'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { Filter, Download, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useBudgetExpenses } from '@/lib/hooks/atlvs/useBudgets';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/atlvs/budgets/expenses

export default function BudgetExpensesPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const { data: expenses = [], isLoading, isError, refetch } = useBudgetExpenses(
    statusFilter === 'all' ? undefined : statusFilter
  );

  if (isLoading) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-atlvs-green-500" />
            <BodyText className="text-grey-400">Loading expenses...</BodyText>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  if (isError) {
    return (
      <AtlvsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Expenses</SectionHeader>
            <BodyText className="text-grey-400 mb-4">Unable to load budget expenses</BodyText>
            <Button onClick={() => refetch()} variant="atlvs">Retry</Button>
          </div>
        </div>
      </AtlvsLayout>
    );
  }

  const filteredExpenses = expenses || [];

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenses.filter(e => e.status === 'pending').reduce((sum, e) => sum + e.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-atlvs-green-500/20 text-atlvs-green-500';
      case 'pending': return 'bg-warning/20 text-warning';
      case 'rejected': return 'bg-error/20 text-error';
      default: return 'bg-grey-700 text-grey-300';
    }
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="EXPENSE TRACKING"
        description="Monitor and approve project expenses"
        variant="atlvs"
        breadcrumbs={[
          { label: 'Budgets', href: '/atlvs/budgets' },
          { label: 'Expenses' }
        ]}
        actions={[
          {
            label: 'Submit Expense',
            onClick: () => {},
            icon: <Plus className="w-4 h-4" />,
            variant: 'atlvs'
          }
        ]}
      >
        {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <CardDescription className="text-grey-400 mb-1">Total Expenses</CardDescription>
            <CardTitle >${totalExpenses.toLocaleString()}</CardTitle>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <CardDescription className="text-grey-400 mb-1">Pending Approval</CardDescription>
            <CardTitle className="text-warning">${pendingExpenses.toLocaleString()}</CardTitle>
          </CardContent>
        </Card>
        <Card variant="atlvs" className="bg-grey-900/50">
          <CardContent className="pt-6">
            <CardDescription className="text-grey-400 mb-1">This Month</CardDescription>
            <CardTitle className="text-info">${totalExpenses.toLocaleString()}</CardTitle>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card variant="atlvs" className="bg-grey-900/50 mb-4">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Filter className="w-5 h-5 text-grey-400" />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            variant="atlvs"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
            </div>
            <Button variant="atlvs-outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Expenses Table */}
      <Card variant="atlvs" className="bg-grey-900/50">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-grey-800/50 border-b border-grey-700">
              <tr>
                <th className="px-4 py-3 text-left text-body-sm text-grey-400">Description</th>
                <th className="px-4 py-3 text-left text-body-sm text-grey-400">Category</th>
                <th className="px-4 py-3 text-left text-body-sm text-grey-400">Submitted By</th>
                <th className="px-4 py-3 text-left text-body-sm text-grey-400">Date</th>
                <th className="px-4 py-3 text-right text-body-sm text-grey-400">Amount</th>
                <th className="px-4 py-3 text-center text-body-sm text-grey-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-grey-800">
              {filteredExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-grey-800/50">
                  <td className="px-4 py-3 text-body-sm text-white">{expense.description}</td>
                  <td className="px-4 py-3 text-body-sm text-grey-400">{expense.category}</td>
                  <td className="px-4 py-3 text-body-sm text-grey-400">{expense.submittedBy}</td>
                  <td className="px-4 py-3 text-body-sm text-grey-400">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-body-sm text-white text-right">
                    ${expense.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant="atlvs-outline" className={getStatusColor(expense.status)}>
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      </ContentLayout>
    </AtlvsLayout>
  );
}
