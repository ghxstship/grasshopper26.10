/**
 * Overview Page - UI Rebuild
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


interface OverviewData {
  activeProjects: number;
  pendingApprovals: number;
  totalBudget: number;
  teamMembers: number;
}

export default function OverviewPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<OverviewData | null>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<OverviewData>('/api/atlvs/overview');
        if (response.data) setData(response.data);
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
          <H1 className="mb-4">Overview</H1>
          <Body className="text-gray-600">
            Overview page content
          </Body>
        </div>

        {data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card variant="atlvs">
              <CardContent className="pt-6 text-center">
                <Body className="text-gray-600 mb-2">Active Projects</Body>
                <Display as="div" className="text-4xl">{data.activeProjects}</Display>
              </CardContent>
            </Card>
            <Card variant="atlvs">
              <CardContent className="pt-6 text-center">
                <Body className="text-gray-600 mb-2">Pending Approvals</Body>
                <Display as="div" className="text-4xl text-yellow-600">{data.pendingApprovals}</Display>
              </CardContent>
            </Card>
            <Card variant="atlvs">
              <CardContent className="pt-6 text-center">
                <Body className="text-gray-600 mb-2">Total Budget</Body>
                <Display as="div" className="text-4xl">${data.totalBudget.toLocaleString()}</Display>
              </CardContent>
            </Card>
            <Card variant="atlvs">
              <CardContent className="pt-6 text-center">
                <Body className="text-gray-600 mb-2">Team Members</Body>
                <Display as="div" className="text-4xl">{data.teamMembers}</Display>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
