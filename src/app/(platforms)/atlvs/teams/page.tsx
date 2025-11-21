'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

interface Team {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lead: string;
}

export default function TeamsPage() {
  const [loading, setLoading] = React.useState(true);
  const [teams, setTeams] = React.useState<Team[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ teams: Team[] }>('/api/atlvs/teams');
        if (response.data?.teams) setTeams(response.data.teams);
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
            <H1 className="mb-4">Teams</H1>
            <Body className="text-gray-600">
              Manage production teams and crew
            </Body>
          </div>
          <Button variant="atlvs">Create Team</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card 
              key={team.id} 
              variant="atlvs"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/atlvs/teams/${team.id}`)}
            >
              <CardHeader>
                <CardTitle>{team.name}</CardTitle>
                <CardDescription>{team.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Body className="text-sm">
                    <span className="text-gray-600">Members:</span> {team.memberCount}
                  </Body>
                  <Body className="text-sm">
                    <span className="text-gray-600">Lead:</span> {team.lead}
                  </Body>
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