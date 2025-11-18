/* eslint-disable */
'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState, useEffect } from 'react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/atoms/Textarea';
import { Camera, MapPin, Link as LinkIcon, Instagram, Twitter, Loader2, AlertCircle } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function ProfileSettingsPage() {
  const queryClient = useQueryClient();
  const { data: profile, isLoading, isError } = useQuery({
    queryKey: ['gvteway', 'profile'],
    queryFn: async () => {
      const response = await fetch('/api/gvteway/profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
  });

  const { mutate: updateProfile, isPending: isUpdating } = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch('/api/gvteway/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['gvteway', 'profile'] });
    },
  });
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [twitter, setTwitter] = useState('');

  useEffect(() => {
    if (profile) {
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setWebsite(profile.website || '');
      setInstagram(profile.instagram || '');
      setTwitter(profile.twitter || '');
    }
  }, [profile]);

  const handleSubmit = async () => {
    await updateProfile({ bio, location, website, instagram, twitter });
  };

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (isError) {
    return (
      <GvtewayLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-h5 font-bebas mb-2">Failed to Load Profile</h2>
            <p className="text-gray-400">Unable to load your profile settings</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-h2 text-white mb-2">Profile Settings</h1>
            <p className="text-gray-400">Customize your public profile</p>
          </div>

          <Card variant="gvteway" className="bg-gray-900/50 border-gray-800">
            <CardHeader>
              <CardTitle className="text-white">Profile Photo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-h3">
                  JD
                </div>
                <div className="flex-1">
                  <Button variant="gvteway">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
                <p className="text-body-sm text-gray-400 mt-2">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="gvteway" className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Bio</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="bg-black/50 border-gray-700 text-white min-h-[120px]"
            />
          </CardContent>
        </Card>

        <Card variant="gvteway" className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Location & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-white text-body-sm">Location</span>
              </div>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <LinkIcon className="w-4 h-4 text-gray-400" />
                <span className="text-white text-body-sm">Website</span>
              </div>
              <Input
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="gvteway" className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Social Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Instagram className="w-4 h-4 text-gray-400" />
                <span className="text-white text-body-sm">Instagram</span>
              </div>
              <Input
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="@username"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Twitter className="w-4 h-4 text-gray-400" />
                <span className="text-white text-body-sm">Twitter</span>
              </div>
              <Input
                value={twitter}
                onChange={(e) => setTwitter(e.target.value)}
                placeholder="@username"
                className="bg-black/50 border-gray-700 text-white"
              />
            </div>
          </CardContent>
        </Card>

          <div className="flex justify-end">
            <Button onClick={handleSubmit} variant="gvteway">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
