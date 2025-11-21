/**
 * Riders Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { apiClient } from '@/lib/api/client';

interface Rider {
  id: string;
  name: string;
  talent: string;
  type: 'TECHNICAL' | 'HOSPITALITY' | 'SECURITY' | 'SPECIAL';
  status: 'PENDING' | 'APPROVED' | 'FULFILLED';
  requestDate: string;
}

export default function RidersPage() {
  const [loading, setLoading] = React.useState(true);
  const [riders, setRiders] = React.useState<Rider[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ riders: Rider[] }>('/api/atlvs/documents/riders');
        if (response.data?.riders) setRiders(response.data.riders);
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
            <H1 className="mb-4">Talent Riders</H1>
            <Body className="text-gray-600">
              Manage talent and crew rider requirements
            </Body>
          </div>
          <Button variant="atlvs">New Rider</Button>
        </div>

        <div className="space-y-4">
          {riders.map((rider) => (
            <Card key={rider.id} variant="atlvs">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{rider.name}</CardTitle>
                    <CardDescription>{rider.talent}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={rider.status === 'FULFILLED' ? 'default' : 'outline'}>
                      {rider.status}
                    </Badge>
                    <Badge variant="outline">{rider.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Body className="text-sm text-gray-600">
                  Requested: {new Date(rider.requestDate).toLocaleDateString()}
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
