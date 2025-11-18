'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { User, Mail, Phone, Building2, Save, Shield } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProfile, useUpdateProfile } from '@/lib/hooks/shared/useProfile';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { Select } from '@/components/atoms/Select';

export default function AccountSettingsPage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Settings', href: '/compvss/settings/account' },
    { label: 'Account', href: '/compvss/settings/account' },
  ];

  const { data: profileData } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const initialData = useMemo(() => ({
    firstName: profileData?.name?.split(' ')[0] || '',
    lastName: profileData?.name?.split(' ')[1] || '',
    email: profileData?.email || '',
    phone: profileData?.phone || '',
    organization: profileData?.organization || '',
    role: profileData?.role || '',
  }), [profileData]);

  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
      organization: formData.organization,
      role: formData.role
    });
  };

  return (
    <CompvssLayout>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <h1 className="text-h3 font-bebas compvss-text-gradient">Account Settings</h1>
            <p className="text-gray-400 font-oswald mt-1">Manage your account information</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5 text-compvss-cyan-500" />
                Personal Information
              </CardTitle>
              <CardDescription className="text-gray-400">
                Update your personal details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="First Name" required>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    />
                  </FormField>
                  <FormField label="Last Name" required>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    />
                  </FormField>
                </div>

                {/* Email */}
                <FormField label="Email Address" required>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    />
                  </div>
                </FormField>

                {/* Phone */}
                <FormField label="Phone Number">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    />
                  </div>
                </FormField>

                {/* Organization */}
                <FormField label="Organization" required>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="organization"
                      type="text"
                      value={formData.organization}
                      onChange={(e) => handleChange('organization', e.target.value)}
                      className="pl-10 bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    />
                  </div>
                </FormField>

                {/* Role */}
                <FormField label="Role" required>
                  <Select
                    variant="compvss"
                    value={formData.role}
                    onChange={(e) => handleChange('role', e.target.value)}
                  >
                    <option value="Stage Manager">Stage Manager</option>
                    <option value="Audio Engineer">Audio Engineer</option>
                    <option value="Lighting Technician">Lighting Technician</option>
                    <option value="Security">Security</option>
                    <option value="Vendor">Vendor</option>
                    <option value="Media">Media</option>
                    <option value="Other">Other</option>
                  </Select>
                </FormField>

                {/* Save Button */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="compvss"
                    size="lg"
                    className="flex-1"
                  >
                    <Save className="w-5 h-5 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm mt-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-compvss-cyan-500" />
                Account Security
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                  <div>
                    <h3 className="font-oswald text-white mb-1">Password</h3>
                    <p className="text-body-sm text-gray-400 font-share-tech">Last changed 3 months ago</p>
                  </div>
                  <Button variant="compvss-outline" size="sm">
                    Change Password
                  </Button>
                </div>
                <div className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                  <div>
                    <h3 className="font-oswald text-white mb-1">Two-Factor Authentication</h3>
                    <p className="text-body-sm text-gray-400 font-share-tech">Not enabled</p>
                  </div>
                  <Button variant="compvss-outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </CompvssLayout>
  );
}
