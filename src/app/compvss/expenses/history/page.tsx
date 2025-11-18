'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useExpenses } from '@/lib/hooks/compvss/useExpenses';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { History, Filter, Search } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';

export default function ExpenseHistoryPage() {
  const { data: expenses, isLoading } = useExpenses({ status: 'all' });
  
  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-compvss-purple-500" />
        </div>
      </CompvssLayout>
    );
  }
  
  return (
    <CompvssLayout>
      <ContentLayout
        title="Expense History"
        description="View all expense submissions"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'Filter',
            icon: <Filter className="w-4 h-4" />,
            onClick: () => {},
            variant: 'outline'
          }
        ]}
      >
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search expenses..."
              className="pl-12 bg-gray-900/50 border-compvss-cyan-500/30 h-12"
            />
          </div>
        </div>

        <Card variant="compvss" className="bg-gray-900/50">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <History className="w-5 h-5 text-compvss-cyan-500" />
              All Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {expenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-oswald text-white mb-1">{expense.description}</h3>
                      <div className="flex items-center gap-3 text-body-sm text-gray-400 font-share-tech">
                        <Badge variant="compvss-outline" className="text-caption">{expense.category}</Badge>
                        <span>{expense.date}</span>
                        <span>•</span>
                        <span>Approved by {expense.approver}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-h5 font-bebas text-white mb-1">{expense.amount}</div>
                      <Badge 
                        variant="compvss" 
                        className={expense.status === 'approved' ? 'bg-success-light text-success' : 'bg-error-light text-error'}
                      >
                        {expense.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </ContentLayout>
    </CompvssLayout>
  );
}
