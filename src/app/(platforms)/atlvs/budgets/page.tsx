/**
 * ATLVS Budgets - UI Rebuild
 * Budget management and tracking
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Budget {
  id: string;
  name: string;
  totalBudget: number;
  spent: number;
  currency: string;
  status: string;
  project: { name: string };
}

export default function AtlvsBudgetsPage() {
  const [budgets, setBudgets] = React.useState<Budget[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchBudgets = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ budgets: Budget[] }>('/api/atlvs/budgets');
        if (response.data?.budgets) {
          setBudgets(response.data.budgets);
        }
      } catch (error) {
        console.error('Failed to fetch budgets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPercentage = (spent: number, total: number) => {
    return Math.round((spent / total) * 100);
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
            <H1 className="mb-2">Budgets</H1>
            <Body className="text-gray-600">{budgets.length} active budgets</Body>
          </div>
          <Button>Create Budget</Button>
        </div>

        {budgets.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No budgets yet</H3>
              <Body className="mb-8 text-gray-600">Create your first budget</Body>
              <Button>Create Budget</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {budgets.map((budget) => {
              const percentage = getPercentage(budget.spent, budget.totalBudget);
              const remaining = budget.totalBudget - budget.spent;

              return (
                <Card key={budget.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={budget.status === 'ACTIVE' ? 'default' : 'outline'}>
                        {budget.status}
                      </Badge>
                    </div>
                    <CardTitle>{budget.name}</CardTitle>
                    <CardDescription>{budget.project.name}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Caption className="text-gray-500">Budget</Caption>
                        <H3>
                          {formatCurrency(budget.totalBudget, budget.currency)}
                        </H3>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <Caption className="text-gray-500">Spent</Caption>
                        <H3>
                          {formatCurrency(budget.spent, budget.currency)}
                        </H3>
                      </div>
                      <div className="flex items-center justify-between">
                        <Caption className="text-gray-500">Remaining</Caption>
                        <H3>
                          {formatCurrency(remaining, budget.currency)}
                        </H3>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Caption className="text-gray-500">Usage</Caption>
                        <Caption className="text-gray-500">{percentage}%</Caption>
                      </div>
                      <div className="h-2 bg-gray-200 border border-black">
                        <div
                          className="h-full bg-black"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/(rebuild)/atlvs/budgets/${budget.id}`} className="w-full">
                      <Button variant="secondary" fullWidth>View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
