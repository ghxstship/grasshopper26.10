/**
 * Accept Invite Page - UI Rebuild
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


export default function InvitePage() {
  const [email, setEmail] = React.useState('');
  const [role, setRole] = React.useState('member');
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [data, setData] = React.useState<any>(null);


  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) apiClient.setAuthToken(token);
      await apiClient.post('/api/atlvs/auth/invite', { email, role });
      setSuccess(true);
      setEmail('');
    } catch (error) {
      console.error('Failed to send invite:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="atlvs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Accept Invite</H1>
          <Body className="text-gray-600">
            Accept Invite page content
          </Body>
        </div>

        <Card variant="atlvs" className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Invite Team Member</CardTitle>
            <CardDescription>Send an invitation to join your team</CardDescription>
          </CardHeader>
          <form onSubmit={handleInvite}>
            <CardContent className="space-y-4">
              {success && <div className="p-3 bg-green-50 border-2 border-green-600 text-green-600"><Body>Invitation sent!</Body></div>}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <select id="role" value={role} onChange={(e) => setRole(e.target.value)} className="w-full p-2 border-2 border-black">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="atlvs" type="submit" disabled={loading} loading={loading} className="w-full">Send Invitation</Button>
            </CardFooter>
          </form>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
