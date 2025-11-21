/**
 * Credential Vault Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface VaultItem {
  id: string;
  title: string;
  type: string;
  lastAccessed: string;
  encrypted: boolean;
}

export default function CredentialVaultPage() {
  const [loading, setLoading] = React.useState(true);
  const [vaultItems, setVaultItems] = React.useState<VaultItem[]>([]);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ items: VaultItem[] }>('/api/compvss/credentials/vault');
        if (response.data?.items) {
          setVaultItems(response.data.items);
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
        <div className="mb-8">
          <H1 className="mb-2">Credential Vault</H1>
          <Body className="text-gray-600">Securely stored credentials and documents</Body>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vaultItems.map((item) => (
            <Card key={item.id} variant="compvss">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription className="capitalize">{item.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <Body className="text-sm text-gray-500">Last accessed: {new Date(item.lastAccessed).toLocaleDateString()}</Body>
                {item.encrypted && <Body className="text-sm text-green-600 mt-2">🔒 Encrypted</Body>}
              </CardContent>
            </Card>
          ))}
          {vaultItems.length === 0 && (
            <Card variant="compvss" className="col-span-full">
              <CardContent className="p-12 text-center">
                <Body className="text-gray-500">No items in vault</Body>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
