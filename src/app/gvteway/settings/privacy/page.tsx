/**
 * GVTEWAY Privacy Settings Page
 * Agent 2.5: Reverse Order Implementation
 */

'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent, CardHeader, CardTitle,  } from '@/components/atoms/Card';
import { Button } from '@/components/atoms/Button';
import { Shield, Eye, Lock, Download, Trash2 } from 'lucide-react';

// Simple Switch component
const _Switch = ({ checked, onCheckedChange }: { checked: boolean; onCheckedChange: (checked: boolean) => void }) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={() => onCheckedChange(!checked)}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      checked ? 'bg-blue-600' : 'bg-gray-700'
    }`}
  >
    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
      checked ? 'translate-x-6' : 'translate-x-1'
    }`} />
  </button>
);

// Simple Label component
const _Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-white">
    {children}
  </label>
);

export default function PrivacySettingsPage() {
  const queryClient = useQueryClient();
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showActivity: false,
    showPurchases: false,
    showWishlist: false,
    showAttending: false,
    allowMessages: true,
    allowTagging: true,
    dataCollection: true,
    analytics: false
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (data: typeof privacy) => {
      const response = await fetch('/api/gvteway/settings/privacy', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to save settings');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['privacy-settings'] });
    },
  });

  const _handleSave = () => {
    saveSettingsMutation.mutate(privacy);
  };

  return (
    <GvtewayLayout>
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Settings</h1>
          <p className="text-gray-400">Control your privacy and data</p>
        </div>

        {/* Profile Privacy */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Profile Privacy
            </CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <label className="text-white font-medium">Public Profile</label>
                <p className="text-sm text-gray-400">Make your profile visible to everyone</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.profileVisible}
                onChange={(e) =>
                  setPrivacy({ ...privacy, profileVisible: e.target.checked })
                }
                className="w-12 h-6"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <label className="text-white font-medium">Show Activity</label>
                <p className="text-sm text-gray-400">Display your recent activity</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.showActivity}
                onChange={(e) =>
                  setPrivacy({ ...privacy, showActivity: e.target.checked })
                }
                className="w-12 h-6"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <label className="text-white font-medium">Show Wishlist</label>
                <p className="text-sm text-gray-400">Let others see your wishlist</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.showWishlist}
                onChange={(e) =>
                  setPrivacy({ ...privacy, showWishlist: e.target.checked })
                }
                className="w-12 h-6"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <label className="text-white font-medium">Show Attending Events</label>
                <p className="text-sm text-gray-400">Display events you&apos;re attending</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.showAttending}
                onChange={(e) =>
                  setPrivacy({ ...privacy, showAttending: e.target.checked })
                }
                className="w-12 h-6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Communication Privacy */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Communication Privacy
            </CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <label className="text-white font-medium">Allow Direct Messages</label>
                <p className="text-sm text-gray-400">Let others send you messages</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.allowMessages}
                onChange={(e) =>
                  setPrivacy({ ...privacy, allowMessages: e.target.checked })
                }
                className="w-12 h-6"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <label className="text-white font-medium">Allow Tagging</label>
                <p className="text-sm text-gray-400">Let others tag you in posts</p>
              </div>
              <input
                type="checkbox"
                checked={privacy.allowTagging}
                onChange={(e) =>
                  setPrivacy({ ...privacy, allowTagging: e.target.checked })
                }
                className="w-12 h-6"
              />
            </div>
          </CardContent>
        </Card>

        {/* Data & Privacy */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Data & Privacy
            </CardTitle>
            
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Download Your Data</p>
                <p className="text-sm text-gray-400">Get a copy of your data</p>
              </div>
              <Button variant="outline" className="border-gray-700">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
              <div>
                <p className="text-white font-medium">Data Retention</p>
                <p className="text-sm text-gray-400">We keep your data for 90 days after deletion</p>
              </div>
              <Button variant="outline" className="border-gray-700">
                Learn More
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Cookies & Tracking */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Cookies & Tracking</CardTitle>
            
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Essential Cookies</p>
                  <p className="text-xs text-gray-400">Required for the site to function</p>
                </div>
                <input type="checkbox" checked disabled className="w-12 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Analytics Cookies</p>
                  <p className="text-xs text-gray-400">Help us improve the site</p>
                </div>
                <input type="checkbox" defaultChecked className="w-12 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">Marketing Cookies</p>
                  <p className="text-xs text-gray-400">Personalized ads</p>
                </div>
                <input type="checkbox" className="w-12 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="bg-red-950/20 border-red-900/50">
          <CardHeader>
            <CardTitle className="text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" />
              Delete All Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="destructive" className="w-full">
              Request Data Deletion
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </GvtewayLayout>
  );
}
