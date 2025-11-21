/**
 * QR Tracking Page - UI Rebuild
 */

'use client';

import * as React from 'react';
import { H1, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';


export default function QrTrackingPage() {
  const [qrCode, setQrCode] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [asset, setAsset] = React.useState<any>(null);


  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) apiClient.setAuthToken(token);
      const response = await apiClient.get(`/api/atlvs/assets/qr/${qrCode}`);
      setAsset(response.data);
    } catch (error) {
      console.error('Failed to fetch asset:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">QR Tracking</H1>
          <Body className="text-gray-600">
            QR Tracking page content
          </Body>
        </div>

        <Card variant="atlvs" className="max-w-md mx-auto mb-6">
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>Enter QR code to track asset</CardDescription>
          </CardHeader>
          <form onSubmit={handleScan}>
            <CardContent>
              <Label htmlFor="qr">QR Code</Label>
              <Input id="qr" value={qrCode} onChange={(e) => setQrCode(e.target.value)} required />
            </CardContent>
            <CardFooter>
              <Button variant="atlvs" type="submit" disabled={loading} loading={loading}>Track Asset</Button>
            </CardFooter>
          </form>
        </Card>
        {asset && (
          <Card variant="atlvs" className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>{asset.name}</CardTitle>
              <CardDescription>{asset.type}</CardDescription>
            </CardHeader>
            <CardContent>
              <Body>Location: {asset.location}</Body>
              <Body>Status: {asset.status}</Body>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}
