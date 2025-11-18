'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Shield, Lock, Unlock, Users2, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useQRCodes } from '@/lib/hooks/compvss/useQRCodes';

export default function QRAccessControlPage() {
  const { data, isLoading, error, refetch } = useQRCodes({ type: 'access' });
  const zones = data || [];

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="QR Access Control"
          description="Loading access zones..."
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'QR Codes', href: '/compvss/qr/dashboard' },
            { label: 'Access Control' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading access control...</p>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="QR Access Control"
          description="Error loading zones"
          variant="compvss"
          showToolbar={false}
          breadcrumbs={[
            { label: 'QR Codes', href: '/compvss/qr/dashboard' },
            { label: 'Access Control' }
          ]}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-xl font-bebas mb-2">Failed to Load Access Control</h2>
              <p className="text-gray-400 mb-4">{error.message}</p>
              <Button variant="compvss" onClick={() => refetch()}>Try Again</Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  const getAccessBadge = (level: string) => {
    switch (level) {
      case 'exclusive':
        return <Badge variant="compvss" className="bg-purple-500/20 text-atlvs-purple-500 border-purple-500/30">Exclusive</Badge>;
      case 'restricted':
        return <Badge variant="compvss" className="bg-orange-500/20 text-atlvs-orange-500 border-orange-500/30">Restricted</Badge>;
      case 'public':
        return <Badge variant="compvss" className="bg-success-light text-success border-green-500/30">Public</Badge>;
      default:
        return null;
    }
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Access Control"
        description="Manage zone access and permissions"
        variant="compvss"
        showToolbar={false}
        breadcrumbs={[
          { label: 'QR System', href: '/compvss/qr/hub' },
          { label: 'Access Control' }
        ]}
      >
        <div className="grid md:grid-cols-2 gap-6">
          {zones.map((zone, index) => (
            <motion.div
              key={zone.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-gray-900/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white flex items-center gap-2">
                      <Shield className="w-5 h-5 text-compvss-cyan-500" />
                      {zone.name}
                    </CardTitle>
                    {getAccessBadge(zone.accessLevel)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-400 font-share-tech">
                          {zone.activeUsers} / {zone.capacity}
                        </span>
                      </div>
                      <div className="text-sm font-share-tech">
                        <span className="text-compvss-cyan-500">{Math.round((zone.activeUsers / zone.capacity) * 100)}%</span>
                        <span className="text-gray-500"> capacity</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-compvss-cyan-500 to-compvss-teal-500 h-2 rounded-full transition-all"
                        style={{ width: `${(zone.activeUsers / zone.capacity) * 100}%` }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="compvss-outline" size="sm" className="flex-1">
                        <Lock className="w-4 h-4 mr-2" />
                        Lock Zone
                      </Button>
                      <Button variant="compvss-ghost" size="sm" className="flex-1">
                        <Unlock className="w-4 h-4 mr-2" />
                        Unlock
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
