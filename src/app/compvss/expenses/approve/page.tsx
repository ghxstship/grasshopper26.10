'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { CheckCircle2, X, Clock, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useExpenses, useApproveExpense } from '@/lib/hooks/compvss/useExpenses';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/expenses/approve

export default function ExpenseApprovePage() {
  const { data: expenses = [], isLoading, error, refetch } = useExpenses({ status: 'PENDING' });
  const approveMutation = useApproveExpense();

  const handleApprove = async (expenseId: string) => {
    try {
      await approveMutation.mutateAsync({ expenseId, approved: true });
    } catch (err) {
      console.error('Failed to approve expense:', err);
    }
  };

  const handleReject = async (expenseId: string) => {
    try {
      await approveMutation.mutateAsync({ expenseId, approved: false });
    } catch (err) {
      console.error('Failed to reject expense:', err);
    }
  };

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Approve Expenses"
          description="Review and approve pending expenses"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading expenses...</BodyText>
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
          title="Approve Expenses"
          description="Review and approve pending expenses"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Expenses</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message}</p>
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
        title="Approve Expenses"
        description="Review and approve pending expenses"
        variant="compvss"
        showToolbar={false}
        
      >
        <Card variant="compvss" className="bg-grey-900/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-warning" />
                Pending Approval ({expenses.length})
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {expenses.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-success" />
                  <BodyText className="text-grey-400">No expenses pending approval</BodyText>
                </div>
              ) : (
                expenses.map((expense: any, index: number) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white mb-1">{expense.description}</h3>
                      <p className="text-body-sm text-grey-400 -tech mb-2">
                        Submitted by {expense.user} • {expense.date}
                      </p>
                      <Badge variant="compvss-outline" className="text-caption">
                        {expense.category}
                      </Badge>
                    </div>
                    <div className="text-white">{expense.amount}</div>
                  </div>
                  <div className="flex gap-3 pt-3 border-t border-grey-800">
                    <Button 
                      variant="compvss" 
                      size="sm" 
                      className="flex-1 bg-success-light0 hover:bg-success"
                      onClick={() => handleApprove(expense.id)}
                      disabled={approveMutation.isPending}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant="compvss-outline" 
                      size="sm" 
                      className="flex-1 border-destructive/30 text-error hover:bg-error/10"
                      onClick={() => handleReject(expense.id)}
                      disabled={approveMutation.isPending}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </motion.div>
              ))
              )}
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    </CompvssLayout>
  );
}
