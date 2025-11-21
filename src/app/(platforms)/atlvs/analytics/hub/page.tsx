/**
 * Analytics Hub Page - UI Rebuild
 */

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
import { TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';

interface AnalyticsCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  path: string;
}

export default function AnalyticsHubPage() {
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<AnalyticsCategory[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ categories: AnalyticsCategory[] }>('/api/atlvs/analytics/hub');
        if (response.data?.categories) setCategories(response.data.categories);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'trending': return <TrendingUp className="w-8 h-8" />;
      case 'bar': return <BarChart3 className="w-8 h-8" />;
      case 'pie': return <PieChart className="w-8 h-8" />;
      default: return <Activity className="w-8 h-8" />;
    }
  };

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
          <H1 className="mb-4">Analytics Hub</H1>
          <Body className="text-gray-600">
            Comprehensive analytics and reporting dashboard
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Card 
              key={category.id} 
              variant="atlvs"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(category.path)}
            >
              <CardContent className="pt-6">
                <div className="text-green-600 mb-4">
                  {getIcon(category.icon)}
                </div>
                <CardTitle className="mb-2">{category.name}</CardTitle>
                <Body className="text-gray-600">{category.description}</Body>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
