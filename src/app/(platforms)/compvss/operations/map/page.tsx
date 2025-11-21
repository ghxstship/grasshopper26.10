/**
 * Site Map Page - UI Rebuild
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


export default function SiteMapPage() {
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState<any>(null);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get('/api/compvss/operations/map-data');
        setData(response.data);
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
        <div className="mb-12">
          <H1 className="mb-4">Site Map</H1>
          <Body className="text-gray-600">
            Site Map page content
          </Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Site Map</CardTitle>
            <CardDescription>{data?.siteName || 'Location overview'}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.locations && data.locations.map((loc: any) => (
                <div key={loc.id} className="p-4 border rounded">
                  <Body className="font-medium">{loc.name}</Body>
                  <Body className="text-sm text-gray-500">{loc.coordinates}</Body>
                </div>
              ))}
              {(!data?.locations || data.locations.length === 0) && (
                <Body className="text-gray-500 text-center py-8">No map data available</Body>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
