/**
 * Team Analytics Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import Link from 'next/link';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface Team {
  id: string;
  name: string;
  members: number;
  activeProjects: number;
  completionRate: number;
  utilization: number;
}

export default function TeamAnalyticsPage() {
  const [loading, setLoading] = React.useState(true);
  const [teams, setTeams] = React.useState<Team[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ teams: Team[] }>('/api/atlvs/analytics/teams');
        if (response.data?.teams) {
          setTeams(response.data.teams);
        }
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
          <H1 className="mb-4">Team Analytics</H1>
          <Body className="text-gray-600">
            Team Analytics page content
          </Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teams.map((team) => (
            <Link key={team.id} href={`/atlvs/team/${team.id}`}>
              <Card variant="atlvs" className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{team.name}</CardTitle>
                  <CardDescription>{team.members} members</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Body className="text-sm text-gray-600">Active Projects</Body>
                      <Display as="div" className="text-2xl">{team.activeProjects}</Display>
                    </div>
                    <div>
                      <Body className="text-sm text-gray-600">Completion Rate</Body>
                      <Display as="div" className="text-2xl">{team.completionRate}%</Display>
                    </div>
                  </div>
                  <div>
                    <Body className="text-sm text-gray-600 mb-2">Utilization: {team.utilization}%</Body>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${team.utilization}%` }} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
