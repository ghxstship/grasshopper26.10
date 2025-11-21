/**
 * COMPVSS Credentials Vault - UI Rebuild
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

interface Credential {
  id: string;
  type: string;
  name: string;
  status: string;
  expiresAt?: string;
}

export default function CompvssCredentialsPage() {
  const [credentials, setCredentials] = React.useState<Credential[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ credentials: Credential[] }>('/api/compvss/credentials');
        if (response.data?.credentials) {
          setCredentials(response.data.credentials);
        }
      } catch (error) {
        console.error('Failed to fetch credentials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCredentials();
  }, []);

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
            <H1 className="mb-2">Credentials Vault</H1>
            <Body className="text-gray-600">{credentials.length} credentials</Body>
          </div>
          <Button>Upload Credential</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {credentials.map((credential) => (
            <Card key={credential.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={credential.status === 'VERIFIED' ? 'default' : 'outline'}>
                    {credential.status}
                  </Badge>
                </div>
                <CardTitle>{credential.name}</CardTitle>
                <CardDescription>{credential.type}</CardDescription>
                {credential.expiresAt && (
                  <CardDescription className="mt-2">
                    Expires: {new Date(credential.expiresAt).toLocaleDateString()}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <Button variant="secondary" fullWidth>View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
