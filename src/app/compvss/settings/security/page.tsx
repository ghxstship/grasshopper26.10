'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Shield, Lock, Smartphone, Key, AlertTriangle, Loader2 } from 'lucide-react';
import { useSettings } from '@/lib/hooks/compvss/useSettings';
import { Button } from '@/components/atoms/Button';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { BodyText, HeroTitle, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/settings/security

export default function SecuritySettingsPage() {
  const _breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Settings', href: '/compvss/settings/account' },
    { label: 'Security', href: '/compvss/settings/security' },
  ];

  const { data: settings, isLoading, error,  } = useSettings();
  const sessions = (settings as any)?.sessions || [];

  if (isLoading) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-12 h-12 animate-spin text-compvss-cyan-500" />
        </div>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <div className="flex items-center justify-center py-12">
          <AlertTriangle className="w-12 h-12 text-error" />
        </div>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div>
            <HeroTitle className="compvss-text-gradient">Security Settings</HeroTitle>
            <BodyText className="text-grey-400 mt-1">Manage your account security</BodyText>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Password */}
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Lock className="w-5 h-5 text-compvss-cyan-500" />
                Password
              </CardTitle>
              <CardDescription className="text-grey-400">
                Change your password regularly to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                <div>
                  <SubsectionHeader className="text-white mb-1">Current Password</SubsectionHeader>
                  <BodyText className="text-body-sm text-grey-400 -tech">Last changed 3 months ago</BodyText>
                </div>
                <Button variant="compvss" size="sm">
                  Change Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-compvss-cyan-500" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription className="text-grey-400">
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 rounded-lg bg-black/50 border border-warning/30 mb-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning mt-0.5" />
                  <div>
                    <SubsectionHeader className="text-white mb-1">2FA Not Enabled</SubsectionHeader>
                    <BodyText className="text-body-sm text-grey-400 -tech mb-3">
                      Protect your account with two-factor authentication
                    </BodyText>
                    <Button variant="compvss" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Keys */}
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5 text-compvss-cyan-500" />
                API Keys
              </CardTitle>
              <CardDescription className="text-grey-400">
                Manage API keys for integrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <SubsectionHeader className="text-white">Production API Key</SubsectionHeader>
                    <Badge variant="compvss" className="bg-success-light text-success border-success/30">
                      Active
                    </Badge>
                  </div>
                  <BodyText className="text-body-sm text-grey-400 -tech mb-2">
                    sk_live_••••••••••••••••1234
                  </BodyText>
                  <BodyText className="text-caption text-grey-500 -tech">
                    Created: Nov 1, 2025 • Last used: 2 hours ago
                  </BodyText>
                </div>
                <Button variant="compvss-outline" size="sm">
                  Generate New Key
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-compvss-cyan-500" />
                Active Sessions
              </CardTitle>
              <CardDescription className="text-grey-400">
                Manage devices where you&apos;re currently signed in
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white">{session.device}</h3>
                          {session.current && (
                            <Badge variant="compvss" className="text-caption">Current</Badge>
                          )}
                        </div>
                        <p className="text-body-sm text-grey-400 -tech">
                          {session.location}
                        </p>
                        <p className="text-caption text-grey-500 -tech mt-1">
                          Last active: {session.lastActive}
                        </p>
                      </div>
                      {!session.current && (
                        <Button variant="compvss-outline" size="sm">
                          Revoke
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </CompvssLayout>
  );
}
