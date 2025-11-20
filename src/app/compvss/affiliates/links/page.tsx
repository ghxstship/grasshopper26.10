'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Link as LinkIcon, Copy, Plus, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { useAffiliates } from '@/lib/hooks/compvss';
import { BodyText, HeroTitle, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/affiliates/links

export default function AffiliateLinksPage() {
  const { data: affiliateData, isLoading, error, refetch } = useAffiliates();
  const links = affiliateData?.links || [];
  
  if (isLoading) {
    return (
      <CompvssLayout >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <BodyText className="text-grey-400">Loading links...</BodyText>
          </div>
        </div>
      </CompvssLayout>
    );
  }
  
  if (error) {
    return (
      <CompvssLayout >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Failed to Load Links</SectionHeader>
            <p className="text-grey-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const _breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
    { label: 'Links', href: '/compvss/affiliates/links' },
  ];

  return (
    <CompvssLayout>
      <div className="border-b border-grey-800 bg-gradient-to-r from-black via-grey-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <HeroTitle className="compvss-text-gradient">Affiliate Links</HeroTitle>
              <BodyText className="text-grey-400 mt-1">Manage your affiliate links</BodyText>
            </div>
            <Button variant="compvss" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Link
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="compvss" className="bg-grey-900/50">
          <CardHeader>
            <CardTitle className="text-white">Your Affiliate Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {links.map((link, index) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-white mb-2">{link.name}</h3>
                      <div className="flex items-center gap-2 p-2 bg-grey-900 rounded border border-grey-800">
                        <LinkIcon className="w-4 h-4 text-grey-400" />
                        <code className="text-body-sm text-grey-300 -tech flex-1">{link.url}</code>
                        <Button variant="compvss-ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-grey-800">
                    <div>
                      <BodyText className="text-caption text-grey-500 mb-1">Clicks</BodyText>
                      <p className="text-white">{link.clicks}</p>
                    </div>
                    <div>
                      <BodyText className="text-caption text-grey-500 mb-1">Conversions</BodyText>
                      <p className="text-white">{link.conversions}</p>
                    </div>
                    <div>
                      <BodyText className="text-caption text-grey-500 mb-1">Earnings</BodyText>
                      <div className="flex items-center gap-2">
                        <p className="text-compvss-cyan-500">{link.earnings}</p>
                        <TrendingUp className="w-4 h-4 text-success" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </CompvssLayout>
  );
}
