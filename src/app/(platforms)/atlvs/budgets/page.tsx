'use client';

import * as React from 'react';
import { H1, Body, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

interface Budget {
  id: string;
  name: string;
  total: number;
  spent: number;
  remaining: number;
  category: string;
  status: 'ON_TRACK' | 'AT_RISK' | 'OVER_BUDGET';
}

interface BudgetSummary {
  totalBudget: number;
  totalSpent: number;
  totalRemaining: number;
  budgets: Budget[];
}

export default function BudgetsPage() {
  const [loading, setLoading] = React.useState(true);
  const [summary, setSummary] = React.useState<BudgetSummary | null>(null);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<BudgetSummary>('/api/atlvs/budgets');
        if (response.data) setSummary(response.data);
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
        <div className="mb-12 flex items-center justify-between">
          <div>
            <H1 className="mb-4">Budget Management</H1>
            <Body className="text-gray-600">
              Track and manage project budgets and expenses
            </Body>
          </div>
          <Button variant="atlvs">Create Budget</Button>
        </div>

        {summary && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card variant="atlvs">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Body className="text-gray-600 mb-2">Total Budget</Body>
                      <Display as="div" className="text-3xl">${summary.totalBudget.toLocaleString()}</Display>
                    </div>
                    <DollarSign className="w-12 h-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="atlvs">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Body className="text-gray-600 mb-2">Total Spent</Body>
                      <Display as="div" className="text-3xl text-red-600">${summary.totalSpent.toLocaleString()}</Display>
                    </div>
                    <TrendingDown className="w-12 h-12 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              
              <Card variant="atlvs">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Body className="text-gray-600 mb-2">Remaining</Body>
                      <Display as="div" className="text-3xl text-green-600">${summary.totalRemaining.toLocaleString()}</Display>
                    </div>
                    <TrendingUp className="w-12 h-12 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget List */}
            <div className="space-y-4">
              {summary.budgets.map((budget) => (
                <Card 
                  key={budget.id} 
                  variant="atlvs"
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => router.push(`/atlvs/budgets/${budget.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle>{budget.name}</CardTitle>
                        <CardDescription>{budget.category}</CardDescription>
                      </div>
                      <Body className={`px-3 py-1 rounded-full text-sm font-medium ${
                        budget.status === 'ON_TRACK' ? 'bg-green-100 text-green-800' :
                        budget.status === 'AT_RISK' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {budget.status.replace('_', ' ')}
                      </Body>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <Body className="text-sm text-gray-600">Total</Body>
                        <Body className="font-semibold text-lg">${budget.total.toLocaleString()}</Body>
                      </div>
                      <div>
                        <Body className="text-sm text-gray-600">Spent</Body>
                        <Body className="font-semibold text-lg text-red-600">${budget.spent.toLocaleString()}</Body>
                      </div>
                      <div>
                        <Body className="text-sm text-gray-600">Remaining</Body>
                        <Body className="font-semibold text-lg text-green-600">${budget.remaining.toLocaleString()}</Body>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Body className="text-sm text-gray-600">Utilization</Body>
                        <Body className="text-sm font-medium">{Math.round((budget.spent / budget.total) * 100)}%</Body>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${
                            budget.status === 'ON_TRACK' ? 'bg-green-600' :
                            budget.status === 'AT_RISK' ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${Math.min((budget.spent / budget.total) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}