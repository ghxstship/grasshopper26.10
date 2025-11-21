/**
 * Expenses Page - UI Rebuild
 * Submit and track expense reports
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedDate: string;
  receiptUrl?: string;
}

export default function ExpensesPage() {
  const [loading, setLoading] = React.useState(true);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ expenses: Expense[] }>('/api/compvss/expenses');
        if (response.data?.expenses) setExpenses(response.data.expenses);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="compvss" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <H1 className="mb-4">Expense Reports</H1>
            <Body className="text-gray-600">
              Submit and track your expense reimbursements
            </Body>
          </div>
          <Button variant="compvss" onClick={() => router.push('/compvss/expenses/new')}>
            Submit Expense
          </Button>
        </div>

        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card 
              key={expense.id} 
              variant="compvss"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/compvss/expenses/${expense.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{expense.description}</CardTitle>
                    <CardDescription>{expense.category}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Body className="font-semibold text-lg">${expense.amount.toFixed(2)}</Body>
                    <Badge variant={expense.status === 'APPROVED' ? 'default' : expense.status === 'PENDING' ? 'outline' : 'ghost'}>
                      {expense.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Body className="text-sm text-gray-600">
                  Submitted: {new Date(expense.submittedDate).toLocaleDateString()}
                </Body>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}