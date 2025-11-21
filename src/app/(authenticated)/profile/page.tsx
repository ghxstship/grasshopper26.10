/**
 * Profile Page - UI Rebuild
 * User profile management
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { H1, Body, Caption, Label } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Avatar } from '@/components/ui-rebuild/atoms/Avatar';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  bio?: string;
  role: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  // Profile form
  const [name, setName] = React.useState('');
  const [bio, setBio] = React.useState('');

  // Password form
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

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
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await apiClient.put<User>('/api/profile', {
        name,
        bio,
      });

      if (response.data) {
        setUser(response.data);
      }
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err 
        ? (err.message as string)
        : 'Failed to update profile';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setSaving(true);

    try {
      await apiClient.post('/api/profile/password', {
        currentPassword,
        newPassword,
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err 
        ? (err.message as string)
        : 'Failed to change password';
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar user={user} />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <div className="flex items-center gap-6 mb-6">
            <Avatar
              src={user.image}
              fallback={getInitials(user.name)}
              size="xl"
            />
            <div>
              <H1 className="mb-2">{user.name}</H1>
              <Body className="text-gray-600">{user.email}</Body>
              <Caption className="text-gray-500">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </Caption>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card>
              <form onSubmit={handleUpdateProfile}>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your profile details</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {error && (
                    <div className="bg-gray-100 border-2 border-black p-4">
                      <Body className="text-sm text-gray-900">{error}</Body>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="name">
                      Full Name
                    </Label>
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
                    <Label htmlFor="email">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={user.email}
                      disabled
                      helperText="Email cannot be changed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="bio">
                      Bio
                    </Label>
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

                <CardFooter>
                  <Button type="submit" loading={saving} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card>
              <form onSubmit={handleChangePassword}>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  {error && (
                    <div className="bg-gray-100 border-2 border-black p-4">
                      <Body className="text-sm text-gray-900">{error}</Body>
                    </div>
                  )}

                  <div>
                    <Label htmlFor="currentPassword">
                      Current Password
                    </Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      disabled={saving}
                    />
                  </div>

                  <div>
                    <Label htmlFor="newPassword">
                      New Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      disabled={saving}
                      helperText="Minimum 8 characters"
                    />
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={saving}
                    />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button type="submit" loading={saving} disabled={saving}>
                    {saving ? 'Updating...' : 'Update Password'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Manage how you receive notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  <Body className="text-sm text-gray-600 mb-4">
                    Configure your notification settings to stay updated on orders, events, and promotions.
                  </Body>
                  <Button onClick={() => router.push('/settings/notifications')}>
                    Manage Notifications
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your privacy and data sharing preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <Body className="text-sm text-gray-600 mb-4">
                    Manage who can see your profile and activity.
                  </Body>
                  <Button onClick={() => router.push('/settings/privacy')}>
                    Privacy Settings
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language & Region</CardTitle>
                  <CardDescription>Set your preferred language and regional settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="language">Language</Label>
                    <select
                      id="language"
                      className="flex w-full border-2 border-black bg-white px-4 py-2 font-share-tech text-base text-black transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px]"
                      defaultValue="en"
                    >
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="timezone">Timezone</Label>
                    <select
                      id="timezone"
                      className="flex w-full border-2 border-black bg-white px-4 py-2 font-share-tech text-base text-black transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-black focus:ring-offset-2 shadow-[2px_2px_0_0_rgba(0,0,0,1)] focus:shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-[-2px] focus:translate-y-[-2px]"
                      defaultValue="America/New_York"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                  <Button variant="secondary">Save Preferences</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
