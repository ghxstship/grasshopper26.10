'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { QrCode, Scan, History, Shield, Utensils, Package, Plus, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useQRCodes, QRCode } from '@/lib/hooks/compvss/useQRCodes';
import { useMemo } from 'react';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/qr/hub

export default function QRHubPage() {
  const { data: qrCodes = [], isLoading, error, refetch } = useQRCodes();

  const stats = useMemo(() => {
    const totalScans = qrCodes.filter((qr: QRCode) => qr.scannedAt).length;
    const activeQRCodes = qrCodes.length;
    const accessPasses = qrCodes.filter((qr: QRCode) => qr.type === 'access').length;
    const mealVouchers = qrCodes.filter((qr: QRCode) => qr.type === 'meal').length;
    
    return [
      { label: 'Total Scans Today', value: totalScans.toString(), icon: <Scan className="w-5 h-5" /> },
      { label: 'Active QR Codes', value: activeQRCodes.toString(), icon: <QrCode className="w-5 h-5" /> },
      { label: 'Access Passes', value: accessPasses.toString(), icon: <Shield className="w-5 h-5" /> },
      { label: 'Meal Vouchers', value: mealVouchers.toString(), icon: <Utensils className="w-5 h-5" /> },
    ];
  }, [qrCodes]);

  const qrCategories = useMemo(() => {
    const accessCount = qrCodes.filter((qr: QRCode) => qr.type === 'access').length;
    const equipmentCount = qrCodes.filter((qr: QRCode) => qr.type === 'equipment').length;
    const mealCount = qrCodes.filter((qr: QRCode) => qr.type === 'meal').length;
    
    return [
      {
        id: 'access',
        name: 'Access Passes',
        icon: <Shield className="w-8 h-8" />,
        description: 'Crew and staff access credentials',
        count: accessCount,
        color: 'from-green-500 to-emerald-600',
      },
      {
        id: 'equipment',
        name: 'Equipment Tracking',
        icon: <Package className="w-8 h-8" />,
        description: 'Track equipment check-in/out',
        count: equipmentCount,
        color: 'from-blue-500 to-cyan-600',
      },
      {
        id: 'meals',
        name: 'Meal Vouchers',
        icon: <Utensils className="w-8 h-8" />,
        description: 'Catering and meal redemption',
        count: mealCount,
        color: 'from-orange-500 to-amber-600',
      },
    ];
  }, [qrCodes]);

  const recentScans = useMemo(() => {
    return qrCodes
      .filter((qr: QRCode) => qr.scannedAt)
      .sort((a: QRCode, b: QRCode) => {
        const aTime = a.scannedAt ? new Date(a.scannedAt).getTime() : 0;
        const bTime = b.scannedAt ? new Date(b.scannedAt).getTime() : 0;
        return bTime - aTime;
      })
      .slice(0, 4)
      .map((qr: QRCode) => ({
        id: qr.id,
        type: qr.type,
        user: qr.scannedBy || 'Unknown',
        location: ((qr.data as any)?.location as string) || 'Unknown',
        time: qr.scannedAt ? new Date(qr.scannedAt).toLocaleString() : 'Unknown',
        status: 'valid',
      }));
  }, [qrCodes]);

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="QR Code Hub"
          description="Manage and track QR codes"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading QR codes...</BodyText>
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
          title="QR Code Hub"
          description="Manage and track QR codes"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load QR Codes</SectionHeader>
              <p className="text-grey-400 mb-4">{error.message || 'An error occurred'}</p>
              <Button variant="compvss" onClick={() => refetch()}>
                Try Again
              </Button>
            </div>
          </div>
        </ContentLayout>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout>
      <ContentLayout
        title="QR Code Hub"
        description="Manage and track QR codes"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'Scan QR',
            icon: <Scan className="w-5 h-5" />,
            onClick: () => window.location.href = '/compvss/qr/scan',
            variant: 'outline'
          },
          {
            label: 'Generate QR',
            icon: <Plus className="w-5 h-5" />,
            onClick: () => window.location.href = '/compvss/qr/generate',
            variant: 'compvss'
          }
        ]}
      >
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="compvss" className="bg-grey-900/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="p-2 bg-compvss-cyan-500/10 rounded-lg text-compvss-cyan-500">
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-grey-400">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* QR Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <SectionHeader className="text-white mb-6">QR Code Categories</SectionHeader>
          <div className="grid md:grid-cols-3 gap-6">
            {qrCategories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
              >
                <Link href={`/compvss/qr/category/${category.id}`}>
                  <Card variant="compvss" className="bg-grey-900/50 hover:bg-grey-900/70 transition-all cursor-pointer h-full">
                    <CardContent className="pt-6">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${category.color} flex items-center justify-center text-white mb-4`}>
                        {category.icon}
                      </div>
                      <h3 className="text-white mb-2">{category.name}</h3>
                      <p className="text-body-sm text-grey-400 -tech mb-4">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-grey-800">
                        <span className="text-body-sm text-grey-500 -tech">Active Codes</span>
                        <Badge variant="compvss" className="bg-compvss-cyan-500/20 text-compvss-cyan-500">
                          {category.count}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-compvss-cyan-500" />
                  Recent Scans
                </CardTitle>
                <Link href="/compvss/qr/history">
                  <Button variant="compvss-ghost" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScans.map((scan: { id: string; type: string; user: string; location: string; time: string; status: string }) => (
                  <div
                    key={scan.id}
                    className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h3 className="text-white">{scan.user}</h3>
                        <p className="text-body-sm text-grey-400 -tech">{scan.type}</p>
                      </div>
                      <Badge 
                        variant={scan.status === 'valid' ? 'compvss' : 'compvss-outline'}
                        className={scan.status === 'valid' ? 'bg-success-light text-success border-success/30' : 'bg-info-light text-info border-info/30'}
                      >
                        {scan.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-caption text-grey-500 -tech">
                      <span>{scan.location}</span>
                      <span>{scan.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
