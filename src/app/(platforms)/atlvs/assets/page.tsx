/**
 * ATLVS Assets - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Asset {
  id: string;
  name: string;
  type: string;
  status: string;
  location?: string;
}

export default function AtlvsAssetsPage() {
  const [assets, setAssets] = React.useState<Asset[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        
        const response = await apiClient.get<{ assets: Asset[] }>('/api/atlvs/assets', {
          params,
        });
        if (response.data?.assets) {
          setAssets(response.data.assets);
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [searchQuery]);

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
            <H1 className="mb-2">Assets & Equipment</H1>
            <Body className="text-gray-600">{assets.length} total assets</Body>
          </div>
          <Button>Add Asset</Button>
        </div>

        <div className="mb-8">
          <SearchBar
            placeholder="Search assets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assets.map((asset) => (
            <Card key={asset.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={asset.status === 'AVAILABLE' ? 'default' : 'outline'}>
                    {asset.status}
                  </Badge>
                </div>
                <CardTitle>{asset.name}</CardTitle>
                <CardDescription>{asset.type}</CardDescription>
                {asset.location && (
                  <CardDescription className="mt-2">📍 {asset.location}</CardDescription>
                )}
              </CardHeader>
              <CardFooter>
                <Button variant="secondary" fullWidth>View Details</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
