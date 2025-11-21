/**
 * ATLVS Vendors Directory - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Vendor {
  id: string;
  name: string;
  category: string;
  status: string;
  rating?: number;
  contractsCount: number;
}

export default function AtlvsVendorsPage() {
  const [vendors, setVendors] = React.useState<Vendor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;
        
        const response = await apiClient.get<{ vendors: Vendor[] }>('/api/atlvs/vendors', {
          params,
        });
        if (response.data?.vendors) {
          setVendors(response.data.vendors);
        }
      } catch (error) {
        console.error('Failed to fetch vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
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
            <H1 className="mb-2">Vendor Directory</H1>
            <Body className="text-gray-600">{vendors.length} vendors</Body>
          </div>
          <Button>Add Vendor</Button>
        </div>

        <div className="mb-8">
          <SearchBar
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <Card key={vendor.id}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant={vendor.status === 'ACTIVE' ? 'default' : 'outline'}>
                    {vendor.status}
                  </Badge>
                </div>
                <CardTitle>{vendor.name}</CardTitle>
                <CardDescription>{vendor.category}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {vendor.rating && (
                  <Caption className="flex items-center gap-2">
                    ⭐ {vendor.rating}/5
                  </Caption>
                )}
                <Caption className="text-gray-500">
                  {vendor.contractsCount} active contracts
                </Caption>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
