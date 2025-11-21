/**
 * Digital Passes Page - UI Rebuild
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
import { QrCode, Download } from 'lucide-react';

interface Pass {
  id: string;
  eventName: string;
  eventDate: string;
  type: string;
  status: 'ACTIVE' | 'USED' | 'EXPIRED';
  qrCode: string;
}

export default function DigitalPassesPage() {
  const [loading, setLoading] = React.useState(true);
  const [passes, setPasses] = React.useState<Pass[]>([]);

  React.useEffect(() => {
    const fetchPasses = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ passes: Pass[] }>('/api/wallet/passes');
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
          <H1 className="mb-4">Digital Passes</H1>
          <Body className="text-gray-600">
            Your event passes and tickets
          </Body>
        </div>

        {passes.length === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <QrCode className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <Body className="text-gray-600">
                No passes yet. Purchase tickets to get started.
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
                  </div>
                  <CardTitle>{pass.eventName}</CardTitle>
                  <CardDescription>
                    {new Date(pass.eventDate).toLocaleDateString()} • {pass.type}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 aspect-square flex items-center justify-center mb-4">
                    <QrCode className="w-32 h-32 text-gray-900" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" className="flex-1">
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
