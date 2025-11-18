/* eslint-disable */
/**
 * GVTEWAY Account Settings Page
 * Agent 2.5: Reverse Order Implementation
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';
import { Badge } from '@/components/atoms/Badge';
import { AlertCircle, Calendar, Loader2, Mail, Phone, Shield, Trash2, User } from 'lucide-react';
import { useProfile, useUpdateProfile } from '@/lib/hooks/shared/useProfile';

export default function AccountSettingsPage() {
  return (
    <GvtewayLayout>
      <AccountSettingsContent />
    </GvtewayLayout>
  );
}

function AccountSettingsContent() {
  const { data: profile, isLoading, error, refetch } = useProfile();
  const updateProfile = useUpdateProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    username: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        dateOfBirth: profile.dateOfBirth || '',
        username: profile.username || '',
      });
    }
  }, [profile]);

  const handleSave = async () => {
    await updateProfile.mutateAsync(formData);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
          <p className="text-gray-400">Loading account settings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
          <h2 className="text-xl font-bebas mb-2">Failed to Load Account</h2>
          <p className="text-gray-400 mb-4">{error.message}</p>
          <Button variant="gvteway" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your account information and preferences</p>
        </div>

        {/* Account Status */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white">Account Status</CardTitle>
                
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/50">
                Verified
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Member Since</p>
                <p className="text-white font-medium">January 2024</p>
              </div>
              <div>
                <p className="text-gray-400">Account Type</p>
                <p className="text-white font-medium">Premium</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
                
              </div>
              <Button
                variant="outline"
                onClick={() => setIsEditing(!isEditing)}
                className="border-gray-700"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                disabled={!isEditing}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob" className="text-gray-300 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date of Birth
              </Label>
              <Input
                id="dob"
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            {isEditing && (
              <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700">
                Save Changes
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Security */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Security
            </CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Password</p>
                <p className="text-sm text-gray-400">Last changed 30 days ago</p>
              </div>
              <Button variant="outline" className="border-gray-700">
                Change Password
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-gray-400">Add an extra layer of security</p>
              </div>
              <Button variant="outline" className="border-gray-700">
                Enable 2FA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-950/20 border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Danger Zone
            </CardTitle>
            <CardDescription className="text-red-300/70">
              Irreversible actions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-red-950/30 rounded-lg border border-red-900/50">
              <div>
                <p className="text-white font-medium">Delete Account</p>
                <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
              </div>
              <Button variant="destructive">
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

