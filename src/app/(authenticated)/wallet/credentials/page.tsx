/**
 * Credentials Page - UI Rebuild
 * Verified credentials and digital IDs
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { Shield, CheckCircle } from 'lucide-react';

interface Credential {
  id: string;
  type: 'ID' | 'LICENSE' | 'CERTIFICATION' | 'MEMBERSHIP';
  name: string;
  issuer: string;
  issuedDate: string;
  expiryDate?: string;
  status: 'VERIFIED' | 'PENDING' | 'EXPIRED';
  credentialNumber: string;
}

export default function CredentialsPage() {
  const [loading, setLoading] = React.useState(true);
  const [credentials, setCredentials] = React.useState<Credential[]>([]);

  React.useEffect(() => {
    const fetchCredentials = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ credentials: Credential[] }>('/api/wallet/credentials');
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

  const getStatusColor = (status: Credential['status']) => {
    switch (status) {
      case 'VERIFIED':
        return 'default';
      case 'PENDING':
        return 'outline';
      case 'EXPIRED':
        return 'ghost';
      default:
        return 'outline';
    }
  };

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
        <div className="mb-12">
          <H1 className="mb-4">Digital Credentials</H1>
          <Body className="text-gray-600">
            Manage your verified credentials and digital IDs
          </Body>
        </div>

        {credentials.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <H3 className="mb-4">No credentials yet</H3>
              <Body className="text-gray-600 mb-6">
                Add your verified credentials to access exclusive features
              </Body>
              <Button>Add Credential</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {credentials.map((credential) => (
              <Card key={credential.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      <Badge variant="outline">{credential.type}</Badge>
                    </div>
                    <Badge variant={getStatusColor(credential.status)}>
                      {credential.status === 'VERIFIED' && (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {credential.status}
                    </Badge>
                  </div>
                  <CardTitle>{credential.name}</CardTitle>
                  <CardDescription>
                    Issued by {credential.issuer}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Caption className="text-gray-500">Credential Number</Caption>
                    <Body className="text-sm font-mono">{credential.credentialNumber}</Body>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Caption className="text-gray-500">Issued</Caption>
                      <Body className="text-sm">
                        {new Date(credential.issuedDate).toLocaleDateString()}
                      </Body>
                    </div>
                    {credential.expiryDate && (
                      <div>
                        <Caption className="text-gray-500">Expires</Caption>
                        <Body className="text-sm">
                          {new Date(credential.expiryDate).toLocaleDateString()}
                        </Body>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button variant="secondary" size="sm" className="flex-1">
                    View Details
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1">
                    Share
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Digital Credentials</CardTitle>
          </CardHeader>
          <CardContent>
            <Body className="text-sm text-gray-600">
              Digital credentials are verified documents that prove your identity, qualifications, or memberships. 
              They are securely stored and can be shared with trusted parties when needed.
            </Body>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
