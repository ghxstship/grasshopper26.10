'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Clock, CheckCircle2, Plus, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useExpenses } from '@/lib/hooks/compvss';
import { useMemo } from 'react';

export default function ExpensesDashboardPage() {
  const { data: expensesData, isLoading, error, refetch } = useExpenses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const expenses = expensesData?.expenses || [];
  
  const stats = useMemo(() => {
    if (!expenses.length) return [
      { label: 'Total Expenses', value: '$0', icon: <DollarSign className="w-5 h-5" /> },
      { label: 'Pending Approval', value: '$0', icon: <Clock className="w-5 h-5" /> },
      { label: 'Approved', value: '$0', icon: <CheckCircle2 className="w-5 h-5" /> },
      { label: 'This Month', value: '$0', icon: <TrendingUp className="w-5 h-5" /> },
    ];
    
    const total = expenses.reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    const pending = expenses.filter((e: any) => e.status === 'pending').reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    const approved = expenses.filter((e: any) => e.status === 'approved').reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    const thisMonth = expenses.filter((e: any) => {
      const expenseDate = new Date(e.date);
      const now = new Date();
      return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    }).reduce((sum: number, e: any) => sum + (e.amount || 0), 0);
    
    return [
      { label: 'Total Expenses', value: `$${total.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" /> },
      { label: 'Pending Approval', value: `$${pending.toLocaleString()}`, icon: <Clock className="w-5 h-5" /> },
      { label: 'Approved', value: `$${approved.toLocaleString()}`, icon: <CheckCircle2 className="w-5 h-5" /> },
      { label: 'This Month', value: `$${thisMonth.toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" /> },
    ];
  }, [expenses]);
  
  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Expenses"
          description="Track and manage expenses"
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'Expenses', href: '/compvss/expenses' },
            { label: 'Dashboard' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
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
          title="Expenses"
          description="Track and manage expenses"
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'Expenses', href: '/compvss/expenses' },
            { label: 'Dashboard' }
          ]}
        >
          <div className="flex items-center justify-center py-12">
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
        title="Expenses"
        description="Track and manage expenses"
        variant="compvss"
        showToolbar={false}
        breadcrumbs={[
          { label: 'Expenses', href: '/compvss/expenses' },
          { label: 'Dashboard' }
        ]}
      >
        <div className="flex justify-end mb-6">
          <Link href="/compvss/expenses/new">
            <Button variant="compvss" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              New Expense
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <Card variant="compvss" className="bg-gray-900/50">
                <CardContent className="pt-6">
                  <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500 w-fit mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bebas text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-oswald">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card variant="compvss" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white">Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div key={expense.id} className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-oswald text-white mb-1">{expense.description}</h3>
                      <p className="text-sm text-gray-400 font-share-tech">{expense.category} • {expense.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bebas text-white mb-1">{expense.amount}</div>
                      <Badge variant="compvss" className={expense.status === 'approved' ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}>
                        {expense.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    </CompvssLayout>
  );
}
