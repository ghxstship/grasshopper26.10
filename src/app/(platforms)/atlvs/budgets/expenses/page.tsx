/**
 * Expenses Page - UI Rebuild
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


interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

export default function ExpensesPage() {
  const [loading, setLoading] = React.useState(true);
  const [expenses, setExpenses] = React.useState<Expense[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ expenses: Expense[] }>('/api/atlvs/budgets/expenses');
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
        <Navbar variant="atlvs" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Expenses</H1>
          <Body className="text-gray-600">
            Expenses page content
          </Body>
        </div>

        <div className="space-y-4">
          {expenses.map((expense) => (
            <Card key={expense.id} variant="atlvs">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{expense.description}</CardTitle>
                    <CardDescription>{expense.category}</CardDescription>
                  </div>
                  <Badge variant={expense.status === 'APPROVED' ? 'default' : 'outline'}>{expense.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Body className="font-semibold">${expense.amount.toLocaleString()}</Body>
                  <Body className="text-sm text-gray-600">{new Date(expense.date).toLocaleDateString()}</Body>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
