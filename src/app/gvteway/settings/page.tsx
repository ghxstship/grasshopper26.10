/* eslint-disable */
'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Bell, Lock, CreditCard, Shield, Globe, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/Card';
import { Checkbox } from '@/components/atoms/Checkbox';
import { FormField } from '@/components/molecules/FormField';
import { useProfile, useUpdateProfile } from '@/lib/hooks/shared/useProfile';

const SETTINGS_SECTIONS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'payment', label: 'Payment', icon: CreditCard },
  { id: 'privacy', label: 'Privacy', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Globe },
];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const { data: profile, isLoading: profileLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  
  const [accountData, setAccountData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    bio: ''
  });

   
  useEffect(() => {
    if (profile) {
      setAccountData({
        firstName: profile.name?.split(' ')[0] || '',
        lastName: profile.name?.split(' ')[1] || '',
        email: profile.email || '',
        phone: profile.phone || '',
        bio: profile.bio || ''
      });
    }
  }, [profile]);

  const [notifications, setNotifications] = useState({
    eventReminders: true,
    priceAlerts: true,
    newEvents: true,
    socialActivity: false,
    promotions: true
  });

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfile.mutateAsync({
        name: `${accountData.firstName} ${accountData.lastName}`,
        email: accountData.email,
        phone: accountData.phone,
        bio: accountData.bio
      });
      setSuccess('Account settings updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    }
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className="mb-12">
                <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient">
                  SETTINGS
                </h1>
                <p className="text-xl text-gray-400 font-oswald">
                  Manage your account and preferences
                </p>
              </div>

              <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <nav className="space-y-2">
                        {SETTINGS_SECTIONS.map((section) => {
                          const Icon = section.icon;
                          return (
                            <Button
                              key={section.id}
                              onClick={() => setActiveSection(section.id)}
                              variant="ghost"
                              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                                activeSection === section.id
                                  ? 'bg-gvteway-red-500 text-white'
                                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                              }`}
                            >
                              <Icon className="w-5 h-5" />
                              <span className="font-oswald">{section.label}</span>
                            </Button>
                          );
                        })}
                      </nav>
                    </CardContent>
                  </Card>
                </div>

                {/* Content */}
                <div className="lg:col-span-3">
                  {activeSection === 'account' && (
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">Account Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {/* Success/Error Messages */}
                        {success && (
                          <div className="mb-4 p-3 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-success" />
                            <p className="text-sm text-success font-share-tech">{success}</p>
                          </div>
                        )}
                        {error && (
                          <div className="mb-4 p-3 rounded-lg bg-error/10 border border-error/30 flex items-center gap-2">
                            <AlertCircle className="w-5 h-5 text-error" />
                            <p className="text-sm text-error font-share-tech">{error}</p>
                          </div>
                        )}

                        <form onSubmit={handleAccountSubmit} className="space-y-6">
                          <div className="grid md:grid-cols-2 gap-6">
                            <FormField label="First Name">
                              <Input 
                                value={accountData.firstName}
                                onChange={(e) => setAccountData(prev => ({ ...prev, firstName: e.target.value }))}
                                disabled={updateProfile.isPending || profileLoading}
                                variant="gvteway" 
                              />
                            </FormField>
                            <FormField label="Last Name">
                              <Input 
                                value={accountData.lastName}
                                onChange={(e) => setAccountData(prev => ({ ...prev, lastName: e.target.value }))}
                                disabled={updateProfile.isPending || profileLoading}
                                variant="gvteway" 
                              />
                            </FormField>
                          </div>
                          <FormField label="Email Address">
                            <Input 
                              type="email" 
                              value={accountData.email}
                              onChange={(e) => setAccountData(prev => ({ ...prev, email: e.target.value }))}
                              disabled={updateProfile.isPending || profileLoading}
                              variant="gvteway" 
                            />
                          </FormField>
                          <FormField label="Phone Number">
                            <Input 
                              type="tel" 
                              value={accountData.phone}
                              onChange={(e) => setAccountData(prev => ({ ...prev, phone: e.target.value }))}
                              disabled={updateProfile.isPending || profileLoading}
                              variant="gvteway" 
                            />
                          </FormField>
                          <FormField label="Bio">
                            <Textarea 
                              rows={4}
                              value={accountData.bio}
                              onChange={(e) => setAccountData(prev => ({ ...prev, bio: e.target.value }))}
                              disabled={updateProfile.isPending || profileLoading}
                              variant="gvteway"
                            />
                          </FormField>
                          <Button 
                            type="submit"
                            variant="gvteway" 
                            size="lg"
                            disabled={updateProfile.isPending || profileLoading}
                          >
                            {updateProfile.isPending ? (
                              <>
                                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                        </form>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'notifications' && (
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">Notification Preferences</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          {[
                            { key: 'eventReminders', label: 'Event Reminders', description: 'Get notified about upcoming events' },
                            { key: 'priceAlerts', label: 'Price Alerts', description: 'Notify when ticket prices drop' },
                            { key: 'newEvents', label: 'New Events', description: 'Alert for new events in your area' },
                            { key: 'socialActivity', label: 'Social Activity', description: 'Notifications from your social network' },
                            { key: 'promotions', label: 'Promotions', description: 'Special offers and discounts' },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between py-4 border-b border-gray-800 last:border-0">
                              <div>
                                <p className="text-white font-medium">{item.label}</p>
                                <p className="text-gray-400 text-sm">{item.description}</p>
                              </div>
                              <Checkbox 
                                checked={notifications[item.key as keyof typeof notifications]}
                                onChange={(e) => handleNotificationChange(item.key, e.target.checked)}
                                variant="gvteway" 
                              />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'security' && (
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">Security Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div>
                            <h3 className="text-white font-medium mb-4">Change Password</h3>
                            <div className="space-y-4">
                              <FormField label="Current Password">
                                <Input type="password" variant="gvteway" />
                              </FormField>
                              <FormField label="New Password">
                                <Input type="password" variant="gvteway" />
                              </FormField>
                              <FormField label="Confirm New Password">
                                <Input type="password" variant="gvteway" />
                              </FormField>
                              <Button variant="gvteway">Update Password</Button>
                            </div>
                          </div>

                          <div className="pt-6 border-t border-gray-800">
                            <h3 className="text-white font-medium mb-4">Two-Factor Authentication</h3>
                            <p className="text-gray-400 text-sm mb-4">
                              Add an extra layer of security to your account
                            </p>
                            <Button variant="gvteway-outline">Enable 2FA</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {activeSection === 'payment' && (
                    <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                      <CardHeader>
                        <CardTitle className="text-white">Payment Methods</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4 mb-6">
                          {[
                            { type: 'Visa', last4: '4242', exp: '12/25' },
                            { type: 'Mastercard', last4: '5555', exp: '08/26' },
                          ].map((card, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-4">
                                <CreditCard className="w-8 h-8 text-gray-400" />
                                <div>
                                  <p className="text-white font-medium">{card.type} •••• {card.last4}</p>
                                  <p className="text-gray-400 text-sm">Expires {card.exp}</p>
                                </div>
                              </div>
                              <Button variant="outline" size="sm">Remove</Button>
                            </div>
                          ))}
                        </div>
                        <Button variant="gvteway">Add Payment Method</Button>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
