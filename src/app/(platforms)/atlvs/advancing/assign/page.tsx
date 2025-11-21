/**
 * Assign Resources Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Select } from '@/components/ui-rebuild/atoms/Select';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


interface Resource {
  id: string;
  name: string;
  type: string;
  available: boolean;
}

export default function AssignResourcesPage() {
  const [loading, setLoading] = React.useState(true);
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [selectedRequest, setSelectedRequest] = React.useState('');
  const [selectedResource, setSelectedResource] = React.useState('');
  const [assigning, setAssigning] = React.useState(false);


  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ resources: Resource[] }>('/api/atlvs/resources');
        if (response.data?.resources) {
          setResources(response.data.resources);
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
          <H1 className="mb-4">Assign Resources</H1>
          <Body className="text-gray-600">
            Assign Resources page content
          </Body>
        </div>

        <Card variant="atlvs">
          <CardHeader>
            <CardTitle>Assign Resources to Request</CardTitle>
            <CardDescription>Allocate team members and equipment to advancing requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="request">Select Request</Label>
              <Input
                id="request"
                placeholder="Enter request number"
                value={selectedRequest}
                onChange={(e) => setSelectedRequest(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="resource">Select Resource</Label>
              <Select
                id="resource"
                value={selectedResource}
                onChange={(e) => setSelectedResource(e.target.value)}
                options={[
                  { value: "", label: "Choose a resource..." },
                  ...resources.filter(r => r.available).map(resource => ({
                    value: resource.id,
                    label: `${resource.name} (${resource.type})`
                  }))
                ]}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="atlvs"
              disabled={!selectedRequest || !selectedResource || assigning}
              loading={assigning}
            >
              Assign Resource
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
