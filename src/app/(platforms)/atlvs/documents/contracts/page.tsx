/**
 * Contracts Page - UI Rebuild
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

interface Contract {
  id: string;
  name: string;
  vendor: string;
  type: 'VENDOR' | 'TALENT' | 'LOCATION' | 'SERVICE';
  status: 'DRAFT' | 'PENDING' | 'SIGNED' | 'EXPIRED';
  value: number;
  startDate: string;
  endDate: string;
}

export default function ContractsPage() {
  const [loading, setLoading] = React.useState(true);
  const [contracts, setContracts] = React.useState<Contract[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ contracts: Contract[] }>('/api/atlvs/documents/contracts');
        if (response.data?.contracts) setContracts(response.data.contracts);
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
            <H1 className="mb-4">Contracts</H1>
            <Body className="text-gray-600">
              Manage vendor, talent, and service contracts
            </Body>
          </div>
          <Button variant="atlvs">New Contract</Button>
        </div>

        <div className="space-y-4">
          {contracts.map((contract) => (
            <Card 
              key={contract.id} 
              variant="atlvs"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/atlvs/documents/${contract.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{contract.name}</CardTitle>
                    <CardDescription>{contract.vendor}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={contract.status === 'SIGNED' ? 'default' : 'outline'}>
                      {contract.status}
                    </Badge>
                    <Badge variant="outline">{contract.type}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Body className="text-sm text-gray-600">Contract Value</Body>
                    <Body className="font-semibold">${contract.value.toLocaleString()}</Body>
                  </div>
                  <div>
                    <Body className="text-sm text-gray-600">Start Date</Body>
                    <Body className="font-semibold">{new Date(contract.startDate).toLocaleDateString()}</Body>
                  </div>
                  <div>
                    <Body className="text-sm text-gray-600">End Date</Body>
                    <Body className="font-semibold">{new Date(contract.endDate).toLocaleDateString()}</Body>
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
