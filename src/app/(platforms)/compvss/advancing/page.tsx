/**
 * COMPVSS Advancing Page - UI Rebuild
 * View and manage advancing requests
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

interface AdvancingRequest {
  id: string;
  requestNumber: string;
  type: string;
  title: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'IN_PROGRESS';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  submittedDate: string;
}

export default function CompvssAdvancingPage() {
  const [loading, setLoading] = React.useState(true);
  const [requests, setRequests] = React.useState<AdvancingRequest[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ requests: AdvancingRequest[] }>('/api/compvss/advancing/requests');
        if (response.data?.requests) setRequests(response.data.requests);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getPriorityColor = (priority: AdvancingRequest['priority']) => {
    switch (priority) {
      case 'URGENT': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
            <H1 className="mb-4">Advancing Requests</H1>
            <Body className="text-gray-600">
              Submit and track production advancing requests
            </Body>
          </div>
          <Button variant="compvss" onClick={() => router.push('/compvss/advancing/new')}>
            New Request
          </Button>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <Card 
              key={request.id} 
              variant="compvss"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/compvss/advancing/${request.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={request.status === 'APPROVED' ? 'default' : 'outline'}>
                        {request.status}
                      </Badge>
                      <Body className={`text-xs px-2 py-1 rounded ${getPriorityColor(request.priority)}`}>
                        {request.priority}
                      </Body>
                    </div>
                    <CardTitle>{request.title}</CardTitle>
                    <CardDescription>Request #{request.requestNumber} • {request.type}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Body className="text-sm text-gray-600">
                  Submitted: {new Date(request.submittedDate).toLocaleDateString()}
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