'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Settings, Save, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';
import { Select } from '@/components/atoms/Select';
import { BodyText, HeroTitle } from "@/components/atoms/Typography";

export default function AffiliateSettingsPage() {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [accountDetails, setAccountDetails] = useState('');
  const [minimumPayout, setMinimumPayout] = useState('100');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const queryClient = useQueryClient();

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: { paymentMethod: string; accountDetails: string; minimumPayout: string }) => {
      const response = await fetch('/api/compvss/affiliates/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['affiliate-settings'] });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    },
    onError: () => {
      setError('Failed to save settings');
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    saveSettingsMutation.mutate({ paymentMethod, accountDetails, minimumPayout });
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
    { label: 'Settings', href: '/compvss/affiliates/settings' },
  ];

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <HeroTitle className="compvss-text-gradient">Affiliate Settings</HeroTitle>
          <BodyText className="text-grey-400 mt-1">Manage your affiliate account settings</BodyText>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-grey-900/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-compvss-cyan-500" />
                Payment Information
              </CardTitle>
              <CardDescription className="text-grey-400">
                Configure your payout preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/30 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-error" />
                    <p className="text-body-sm text-error -tech">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-3 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-success" />
                    <BodyText className="text-body-sm text-success -tech">Settings saved successfully!</BodyText>
                  </div>
                )}

                <FormField label="Payment Method" required>
                  <Select 
                    variant="compvss"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={saveSettingsMutation.isPending}
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="paypal">PayPal</option>
                    <option value="crypto">Cryptocurrency</option>
                  </Select>
                </FormField>

                <FormField label="Account Details" required>
                  <Input
                    type="text"
                    placeholder="Enter account information"
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    className="bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    disabled={saveSettingsMutation.isPending}
                    required
                  />
                </FormField>

                <FormField label="Minimum Payout" required>
                  <Select 
                    variant="compvss"
                    value={minimumPayout}
                    onChange={(e) => setMinimumPayout(e.target.value)}
                    disabled={saveSettingsMutation.isPending}
                  >
                    <option value="50">$50</option>
                    <option value="100">$100</option>
                    <option value="250">$250</option>
                  </Select>
                </FormField>

                <Button 
                  type="submit" 
                  variant="compvss" 
                  size="lg" 
                  className="w-full"
                  disabled={saveSettingsMutation.isPending}
                >
                  {saveSettingsMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </CompvssLayout>
  );
}
