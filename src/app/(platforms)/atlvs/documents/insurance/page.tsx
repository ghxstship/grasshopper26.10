/**
 * Insurance Page - UI Rebuild
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

interface Insurance {
  id: string;
  policyNumber: string;
  provider: string;
  type: 'LIABILITY' | 'EQUIPMENT' | 'WORKERS_COMP' | 'PRODUCTION';
  status: 'ACTIVE' | 'EXPIRED' | 'PENDING';
  coverage: number;
  premium: number;
  effectiveDate: string;
  expirationDate: string;
}

export default function InsurancePage() {
  const [loading, setLoading] = React.useState(true);
  const [policies, setPolicies] = React.useState<Insurance[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ policies: Insurance[] }>('/api/atlvs/documents/insurance');
        if (response.data?.policies) setPolicies(response.data.policies);
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
            <H1 className="mb-4">Insurance Policies</H1>
            <Body className="text-gray-600">
              Manage production insurance and certificates
            </Body>
          </div>
          <Button variant="atlvs">Add Policy</Button>
        </div>

        <div className="space-y-4">
          {policies.map((policy) => (
            <Card 
              key={policy.id} 
              variant="atlvs"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/atlvs/documents/${policy.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{policy.provider}</CardTitle>
                    <CardDescription>Policy #{policy.policyNumber}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={policy.status === 'ACTIVE' ? 'default' : 'outline'}>
                      {policy.status}
                    </Badge>
                    <Badge variant="outline">{policy.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <Body className="text-sm text-gray-600">Coverage</Body>
                    <Body className="font-semibold">${policy.coverage.toLocaleString()}</Body>
                  </div>
                  <div>
                    <Body className="text-sm text-gray-600">Premium</Body>
                    <Body className="font-semibold">${policy.premium.toLocaleString()}</Body>
                  </div>
                  <div>
                    <Body className="text-sm text-gray-600">Effective</Body>
                    <Body className="font-semibold">{new Date(policy.effectiveDate).toLocaleDateString()}</Body>
                  </div>
                  <div>
                    <Body className="text-sm text-gray-600">Expires</Body>
                    <Body className="font-semibold">{new Date(policy.expirationDate).toLocaleDateString()}</Body>
                  </div>
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
