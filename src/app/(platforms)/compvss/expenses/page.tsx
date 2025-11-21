/**
 * COMPVSS Expenses - UI Rebuild
 * Expense report management
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H2, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  category: string;
}

export default function CompvssExpensesPage() {
  const [expenses, setExpenses] = React.useState<Expense[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ expenses: Expense[] }>('/api/compvss/expenses');
        if (response.data?.expenses) {
          setExpenses(response.data.expenses);
        }
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <H1 className="mb-2">Expense Reports</H1>
            <Body className="text-gray-600">{expenses.length} total expenses</Body>
          </div>
          <Link href="/(rebuild)/compvss/expenses/new">
            <Button>New Expense</Button>
          </Link>
        </div>

        {expenses.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No expenses yet</H3>
              <Body className="mb-8 text-gray-600">Create your first expense report</Body>
              <Link href="/(rebuild)/compvss/expenses/new">
                <Button>New Expense</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {expenses.map((expense) => (
              <Card key={expense.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle>{expense.description}</CardTitle>
                      <CardDescription>
                        {expense.category} • {new Date(expense.createdAt).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <H2>
                          {formatPrice(expense.amount, expense.currency)}
                        </H2>
                      </div>
                      <Badge variant={expense.status === 'APPROVED' ? 'default' : 'outline'}>
                        {expense.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  <Link href={`/(rebuild)/compvss/expenses/${expense.id}`} className="w-full">
                    <Button variant="secondary" fullWidth>View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
