/**
 * Apple Wallet Page - UI Rebuild
 * Add tickets and passes to Apple Wallet
 */

'use client';

import * as React from 'react';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface WalletPass {
  id: string;
  type: 'TICKET' | 'PASS' | 'MEMBERSHIP';
  name: string;
  eventDate?: string;
  venue?: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  addedToAppleWallet: boolean;
}

export default function AppleWalletPage() {
  const [loading, setLoading] = React.useState(true);
  const [passes, setPasses] = React.useState<WalletPass[]>([]);
  const [adding, setAdding] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPasses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ passes: WalletPass[] }>('/api/wallet/apple');
        if (response.data?.passes) {
          setPasses(response.data.passes);
        }
      } catch (error) {
        console.error('Failed to fetch passes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPasses();
  }, []);

  const handleAddToAppleWallet = async (passId: string) => {
    try {
      setAdding(passId);
      const response = await apiClient.post<{ passUrl: string }>(`/api/wallet/apple/${passId}/add`);
      if (response.data?.passUrl) {
        window.location.href = response.data.passUrl;
      }
    } catch (error) {
      console.error('Failed to add to Apple Wallet:', error);
    } finally {
      setAdding(null);
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
          <H1 className="mb-4">Apple Wallet</H1>
          <Body className="text-gray-600">
            Add your tickets and passes to Apple Wallet for easy access
          </Body>
        </div>

        {passes.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No passes available</H3>
              <Body className="text-gray-600">
                Purchase tickets or passes to add them to Apple Wallet
              </Body>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {passes.map((pass) => (
              <Card key={pass.id}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant={pass.status === 'ACTIVE' ? 'default' : 'outline'}>
                      {pass.status}
                    </Badge>
                    <Badge variant="outline">{pass.type}</Badge>
                  </div>
                  <CardTitle>{pass.name}</CardTitle>
                  {pass.eventDate && pass.venue && (
                    <CardDescription>
                      {new Date(pass.eventDate).toLocaleDateString()} • {pass.venue}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardFooter>
                  {pass.addedToAppleWallet ? (
                    <div className="w-full">
                      <Badge className="w-full justify-center">Added to Apple Wallet</Badge>
                    </div>
                  ) : (
                    <Button
                      fullWidth
                      onClick={() => handleAddToAppleWallet(pass.id)}
                      loading={adding === pass.id}
                      disabled={adding === pass.id || pass.status !== 'ACTIVE'}
                    >
                      Add to Apple Wallet
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>About Apple Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <Body className="text-sm text-gray-600">
              Apple Wallet allows you to store your tickets, passes, and memberships on your iPhone or Apple Watch. 
              Once added, you can access them quickly without needing to open the app or have an internet connection.
            </Body>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
