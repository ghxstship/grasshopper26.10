'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Link as LinkIcon, Copy, Plus, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { useAffiliates } from '@/lib/hooks/compvss';

export default function AffiliateLinksPage() {
  const { data: affiliateData, isLoading, error, refetch } = useAffiliates();
  const links = affiliateData?.links || [];
  
  if (isLoading) {
    return (
      <CompvssLayout breadcrumbs={[
        { label: 'Dashboard', href: '/compvss/dashboard' },
        { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
        { label: 'Links', href: '/compvss/affiliates/links' },
      ]}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading links...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }
  
  if (error) {
    return (
      <CompvssLayout breadcrumbs={[
        { label: 'Dashboard', href: '/compvss/dashboard' },
        { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
        { label: 'Links', href: '/compvss/affiliates/links' },
      ]}>
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Links</h2>
            <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Affiliates', href: '/compvss/affiliates/dashboard' },
    { label: 'Links', href: '/compvss/affiliates/links' },
  ];

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bebas compvss-text-gradient">Affiliate Links</h1>
              <p className="text-gray-400 font-oswald mt-1">Manage your affiliate links</p>
            </div>
            <Button variant="compvss" size="lg">
              <Plus className="w-5 h-5 mr-2" />
              Create Link
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card variant="compvss" className="bg-gray-900/50">
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
                      <h3 className="font-oswald text-white mb-2">{link.name}</h3>
                      <div className="flex items-center gap-2 p-2 bg-gray-900 rounded border border-gray-800">
                        <LinkIcon className="w-4 h-4 text-gray-400" />
                        <code className="text-sm text-gray-300 font-share-tech flex-1">{link.url}</code>
                        <Button variant="compvss-ghost" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-500 font-oswald mb-1">Clicks</p>
                      <p className="text-lg font-bebas text-white">{link.clicks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-oswald mb-1">Conversions</p>
                      <p className="text-lg font-bebas text-white">{link.conversions}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-oswald mb-1">Earnings</p>
                      <div className="flex items-center gap-2">
                        <p className="text-lg font-bebas text-compvss-cyan-500">{link.earnings}</p>
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
