/**
 * Account Settings Page - UI Rebuild
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


export default function AccountSettingsPage() {
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

        const response = await apiClient.get('/api/compvss/settings/account');
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
          <H1 className="mb-4">Account Settings</H1>
          <Body className="text-gray-600">
            Account Settings page content
          </Body>
        </div>

        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div><Body className="font-medium mb-2">Email</Body><input type="email" className="w-full border rounded p-2" defaultValue={data?.email} /></div>
              <div><Body className="font-medium mb-2">Phone</Body><input type="tel" className="w-full border rounded p-2" defaultValue={data?.phone} /></div>
              <div><Body className="font-medium mb-2">Language</Body><select className="w-full border rounded p-2"><option>English</option><option>Spanish</option></select></div>
              <div><Body className="font-medium mb-2">Timezone</Body><select className="w-full border rounded p-2"><option>UTC</option><option>EST</option><option>PST</option></select></div>
              <Button variant="compvss" className="w-full">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
