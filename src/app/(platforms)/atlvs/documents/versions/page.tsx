/**
 * Version History Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { apiClient } from '@/lib/api/client';

interface Version {
  id: string;
  documentName: string;
  versionNumber: string;
  changes: string;
  modifiedBy: string;
  modifiedAt: string;
}

export default function VersionHistoryPage() {
  const [loading, setLoading] = React.useState(true);
  const [versions, setVersions] = React.useState<Version[]>([]);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ versions: Version[] }>('/api/atlvs/documents/versions');
        if (response.data?.versions) setVersions(response.data.versions);
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
        <div className="mb-12">
          <H1 className="mb-4">Version History</H1>
          <Body className="text-gray-600">
            Track document revisions and changes
          </Body>
        </div>

        <div className="space-y-4">
          {versions.map((version) => (
            <Card key={version.id} variant="atlvs">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{version.documentName}</CardTitle>
                    <CardDescription>{version.changes}</CardDescription>
                  </div>
                  <Badge variant="outline">v{version.versionNumber}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Body className="text-sm text-gray-600">
                  Modified by {version.modifiedBy} on {new Date(version.modifiedAt).toLocaleDateString()}
                </Body>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
