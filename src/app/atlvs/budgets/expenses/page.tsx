'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { useState } from 'react';
import { Filter, Download, Plus, Loader2, AlertCircle } from 'lucide-react';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { useBudgetExpenses } from '@/lib/hooks/atlvs/useBudgets';

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
            <p className="text-gray-400">Loading expenses...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Expenses</h2>
            <p className="text-gray-400 mb-4">Unable to load budget expenses</p>
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
      case 'approved': return 'bg-success-light text-success-foreground';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
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
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Total Expenses</div>
          <div className="text-2xl font-bold text-gray-900">${totalExpenses.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">Pending Approval</div>
          <div className="text-2xl font-bold text-warning">${pendingExpenses.toLocaleString()}</div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="text-sm text-gray-600 mb-1">This Month</div>
          <div className="text-2xl font-bold text-info">${totalExpenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
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

      {/* Expenses Table */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Category</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Submitted By</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">Amount</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredExpenses.map(expense => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{expense.description}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{expense.category}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{expense.submittedBy}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                    ${expense.amount.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(expense.status)}`}>
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
