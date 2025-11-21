/**
 * User Profile Page - UI Rebuild
 * Public user profile view
 */

'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Hero, H2, Body, Caption, Display } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Avatar } from '@/components/ui-rebuild/atoms/Avatar';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface UserProfile {
  username: string;
  name: string;
  bio?: string;
  image?: string;
  followers: number;
  following: number;
  posts: number;
}

export default function UserProfilePage() {
  const params = useParams();
  const [profile, setProfile] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get<UserProfile>(`/api/social/users/${params.username}`);
        if (response.data) {
          setProfile(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.username]);

  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <H2 className="mb-4">User Not Found</H2>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <Avatar
                src={profile.image}
                fallback={getInitials(profile.name)}
                size="xl"
              />
              <div className="flex-1">
                <Hero className="mb-2">{profile.name}</Hero>
                <Caption className="text-gray-500 mb-4">@{profile.username}</Caption>
                {profile.bio && <Body className="mb-6">{profile.bio}</Body>}
                <div className="flex items-center gap-8 mb-6">
                  <div>
                    <Display as="div" className="text-2xl">{profile.posts}</Display>
                    <Caption className="text-gray-500">Posts</Caption>
                  </div>
                  <div>
                    <Display as="div" className="text-2xl">{profile.followers}</Display>
                    <Caption className="text-gray-500">Followers</Caption>
                  </div>
                  <div>
                    <Display as="div" className="text-2xl">{profile.following}</Display>
                    <Caption className="text-gray-500">Following</Caption>
                  </div>
                </div>
                <Button>Follow</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <H2 className="mb-6">Recent Posts</H2>
          <Card>
            <CardContent className="py-12 text-center">
              <Body className="text-gray-600">No posts yet</Body>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
}
