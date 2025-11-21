/**
 * Profile Settings Page - UI Rebuild
 * Edit profile information
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { H1, Body, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Avatar } from '@/components/ui-rebuild/atoms/Avatar';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

export default function ProfileSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [user, setUser] = React.useState<User | null>(null);
  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<User>('/api/profile');
        if (response.data) {
          setUser(response.data);
          setName(response.data.name);
          setBio(response.data.bio || '');
          setPhone(response.data.phone || '');
          setLocation(response.data.location || '');
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await apiClient.put<User>('/api/profile', {
        name,
        bio,
        phone,
        location,
      });

      if (response.data) {
        setUser(response.data);
        router.push('/profile');
      }
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setSaving(false);
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
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-4">Edit Profile</H1>
          <Body className="text-gray-600">
            Update your profile information
          </Body>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="bg-gray-100 border-2 border-black p-4">
                  <Body className="text-sm text-gray-900">{error}</Body>
                </div>
              )}

              <div className="flex items-center gap-6">
                <Avatar
                  src={user?.image}
                  fallback={user?.name.slice(0, 2).toUpperCase() || '?'}
                  size="xl"
                />
                <Button type="button" variant="secondary">
                  Change Photo
                </Button>
              </div>

              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ''}
                  disabled
                  helperText="Email cannot be changed"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={saving}
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  disabled={saving}
                  placeholder="City, State"
                />
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  disabled={saving}
                  rows={4}
                  className="flex w-full border-2 border-black bg-white px-4 py-2 font-share-tech text-base text-black placeholder:text-gray-400 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-100 shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </CardContent>
            <CardFooter className="flex gap-3">
              <Button type="submit" loading={saving} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => router.back()}>
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>

      <Footer />
    </div>
  );
}
