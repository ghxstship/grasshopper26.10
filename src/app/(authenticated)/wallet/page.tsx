/**
 * Wallet Page - UI Rebuild
 * Digital wallet dashboard
 */

'use client';

import * as React from 'react';
import { H1, H3, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface WalletItem {
  id: string;
  type: 'PASS' | 'NFT' | 'CREDENTIAL' | 'LOYALTY';
  name: string;
  description: string;
  status: string;
  value?: number;
  expiresAt?: string;
}

export default function WalletPage() {
  const [items, setItems] = React.useState<WalletItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchWallet = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ items: WalletItem[] }>('/api/wallet');
        if (response.data?.items) {
          setItems(response.data.items);
        }
      } catch (error) {
        console.error('Failed to fetch wallet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  const passes = items.filter((item) => item.type === 'PASS');
  const nfts = items.filter((item) => item.type === 'NFT');
  const credentials = items.filter((item) => item.type === 'CREDENTIAL');
  const loyalty = items.filter((item) => item.type === 'LOYALTY');

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
          <H1 className="mb-4">Digital Wallet</H1>
          <Body className="text-gray-600">
            Manage your passes, NFTs, credentials, and loyalty points
          </Body>
        </div>

        <Tabs defaultValue="passes">
          <TabsList>
            <TabsTrigger value="passes">Passes ({passes.length})</TabsTrigger>
            <TabsTrigger value="nfts">NFTs ({nfts.length})</TabsTrigger>
            <TabsTrigger value="credentials">Credentials ({credentials.length})</TabsTrigger>
            <TabsTrigger value="loyalty">Loyalty ({loyalty.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="passes">
            {passes.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No passes yet</H3>
                  <Body className="text-gray-600">
                    Your digital passes will appear here
                  </Body>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {passes.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge>{item.status}</Badge>
                      </div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {item.expiresAt && (
                        <Caption className="text-gray-500">
                          Expires: {new Date(item.expiresAt).toLocaleDateString()}
                        </Caption>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="nfts">
            {nfts.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No NFTs yet</H3>
                  <Body className="text-gray-600">
                    Your NFT collection will appear here
                  </Body>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {nfts.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="credentials">
            {credentials.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No credentials yet</H3>
                  <Body className="text-gray-600">
                    Your verified credentials will appear here
                  </Body>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {credentials.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant={item.status === 'VERIFIED' ? 'default' : 'outline'}>
                          {item.status}
                        </Badge>
                      </div>
                      <CardTitle>{item.name}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="loyalty">
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Points</CardTitle>
                <CardDescription>Earn points with every purchase</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="font-anton text-6xl mb-4">
                    {loyalty.reduce((sum, item) => sum + (item.value || 0), 0)}
                  </div>
                  <Body className="text-gray-600">Total Points</Body>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
