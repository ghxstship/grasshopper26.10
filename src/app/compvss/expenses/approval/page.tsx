'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { DollarSign, CheckCircle2, XCircle, Eye, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useExpenses, useApproveExpense, Expense } from '@/lib/hooks/compvss/useExpenses';
import { useMemo } from 'react';

export default function ExpenseApprovalPage() {
  const { data: expenses = [], isLoading, error, refetch } = useExpenses({ status: 'pending' });
  const approveMutation = useApproveExpense();

  const handleApprove = async (expenseId: string) => {
    try {
      await approveMutation.mutateAsync({ expenseId, approved: true });
      refetch();
    } catch (err) {
      console.error('Failed to approve expense:', err);
    }
  };

  const handleReject = async (expenseId: string) => {
    try {
      await approveMutation.mutateAsync({ expenseId, approved: false });
      refetch();
    } catch (err) {
      console.error('Failed to reject expense:', err);
    }
  };

  const getStatusBadge = (status: Expense['status']) => {
    const config: Record<string, { variant: 'warning' | 'success' | 'error'; label: string }> = {
      pending: { variant: 'warning', label: 'Pending' },
      approved: { variant: 'success', label: 'Approved' },
      rejected: { variant: 'error', label: 'Rejected' },
      reimbursed: { variant: 'success', label: 'Reimbursed' },
    };
    const statusConfig = config[status] || config.pending;
    return <Badge variant={statusConfig.variant}>{statusConfig.label}</Badge>;
  };

  const stats = useMemo(() => ({
    pending: expenses.filter((e: Expense) => e.status === 'pending').length,
    approved: expenses.filter((e: Expense) => e.status === 'approved').length,
    rejected: expenses.filter((e: Expense) => e.status === 'rejected').length,
    totalPending: expenses
      .filter((e: Expense) => e.status === 'pending')
      .reduce((sum: number, e: Expense) => sum + e.amount, 0),
  }), [expenses]);

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Expense Approval Workflow"
          description="Review and approve expense reports"
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'Expenses', href: '/compvss/expenses/dashboard' },
            { label: 'Approval' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading expenses...</p>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Expense Approval Workflow"
          description="Review and approve expense reports"
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'Expenses', href: '/compvss/expenses/dashboard' },
            { label: 'Approval' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Expenses</h2>
              <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
              <Button variant="compvss" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="Expense Approval Workflow"
        description="Review and approve expense reports"
        variant="compvss"
        showToolbar={false}
        breadcrumbs={[
          { label: 'Expenses', href: '/compvss/expenses/dashboard' },
          { label: 'Approval' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card variant="compvss" className="bg-warning/10 border-yellow-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-warning">{stats.pending}</p>
                <p className="text-sm text-gray-400 font-oswald">Pending</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-green-500/10 border-green-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-success">{stats.approved}</p>
                <p className="text-sm text-gray-400 font-oswald">Approved</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-error/10 border-red-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-error">{stats.rejected}</p>
                <p className="text-sm text-gray-400 font-oswald">Rejected</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-compvss-cyan-500/10 border-compvss-cyan-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-compvss-cyan-500">
                  ${stats.totalPending.toFixed(2)}
                </p>
                <p className="text-sm text-gray-400 font-oswald">Total Pending</p>
              </CardContent>
            </Card>
          </div>

          {/* Expenses List */}
          <div className="space-y-4">
            {expenses.map((expense: Expense) => (
              <Card key={expense.id} variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-compvss-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <DollarSign className="w-6 h-6 text-compvss-cyan-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-oswald text-white text-lg">{expense.description}</h3>
                          <Badge variant="default" className="text-xs">{expense.id}</Badge>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-gray-400 font-share-tech mb-2">
                          <span>User: {expense.userId}</span>
                          <span>•</span>
                          <span>Category: {expense.category}</span>
                          <span>•</span>
                          <span>Date: {new Date(expense.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-2xl font-bebas text-compvss-cyan-500">
                          ${expense.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(expense.status)}
                  </div>

                  {expense.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="compvss"
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-success"
                        onClick={() => handleApprove(expense.id)}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="compvss"
                        size="sm"
                        className="flex-1 bg-error hover:bg-red-600"
                        onClick={() => handleReject(expense.id)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="compvss-outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Receipt
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
