'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { AtlvsLayout } from '@/components/templates/AtlvsLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { useState, useMemo } from 'react';
import { useProfile, useUpdateProfile } from '@/lib/hooks/shared/useProfile';
import { motion } from 'framer-motion';
import { Save, Upload } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';

export default function ProfileSettingsPage() {
  const { data: profileData } = useProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const initialProfile = useMemo(() => ({
    name: profileData?.name || '',
    email: profileData?.email || '',
    phone: profileData?.phone || '',
    role: profileData?.role || '',
    department: profileData?.department || '',
    bio: profileData?.bio || '',
    location: profileData?.location || '',
    timezone: profileData?.timezone || ''
  }), [profileData]);

  const [profile, setProfile] = useState(initialProfile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profile);
  };

  return (
    <AtlvsLayout>
      <ContentLayout
        title="PROFILE SETTINGS"
        description="Manage your personal information"
        breadcrumbs={[
          { label: 'Settings', href: '/atlvs/settings' },
          { label: 'Profile' }
        ]}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Profile Photo</CardTitle>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-atlvs-green-500 to-atlvs-purple-500 flex items-center justify-center font-bebas text-h2">
                    {profile.name.split(' ').map((n: string) => n[0]).join('')}
                  </div>
                  <Button variant="atlvs" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Photo
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card variant="atlvs" className="bg-gray-900/50">
              <CardHeader>
                <CardTitle className="mb-6">Personal Information</CardTitle>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Full Name">
                      <Input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                        variant="atlvs"
                      />
                    </FormField>
                    <FormField label="Email">
                      <Input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                        variant="atlvs"
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Phone">
                      <Input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        variant="atlvs"
                      />
                    </FormField>
                    <FormField label="Location">
                      <Input
                        type="text"
                        value={profile.location}
                        onChange={(e) => setProfile({...profile, location: e.target.value})}
                        variant="atlvs"
                      />
                    </FormField>
                  </div>

                  <FormField label="Bio">
                    <Textarea
                      rows={4}
                      value={profile.bio}
                      onChange={(e) => setProfile({...profile, bio: e.target.value})}
                      variant="atlvs"
                    />
                  </FormField>
                </div>
              </CardHeader>
            </Card>

            <div className="flex items-center justify-end gap-4">
              <Button type="submit" variant="atlvs">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </form>
        </motion.div>
      </ContentLayout>
    </AtlvsLayout>
  );
}
