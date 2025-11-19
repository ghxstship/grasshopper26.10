'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { History, Download, Filter, Search, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { useQRCodes, QRCode } from '@/lib/hooks/compvss/useQRCodes';
import { useMemo } from 'react';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/qr/history

export default function QRHistoryPage() {
  const { data: qrCodes = [], isLoading, error, refetch } = useQRCodes();
  
  const scans = useMemo(() => {
    return qrCodes
      .filter((qr: QRCode) => qr.scannedAt)
      .map((qr: QRCode) => ({
        id: qr.id,
        type: qr.type,
        user: qr.scannedBy || 'Unknown',
        location: ((qr.data as any)?.location as string) || 'Unknown',
        timestamp: qr.scannedAt || '',
        status: 'valid',
        qrId: qr.code,
      }))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [qrCodes]);

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="QR Scan History"
          description="View all QR code scans"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading scan history...</BodyText>
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
          title="QR Scan History"
          description="View all QR code scans"
          variant="compvss"
          showToolbar={false}
          
        >
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load History</SectionHeader>
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return <Badge variant="compvss" className="bg-success-light text-success border-success/30">Valid</Badge>;
      case 'redeemed':
        return <Badge variant="compvss" className="bg-info-light text-info border-info/30">Redeemed</Badge>;
      case 'expired':
        return <Badge variant="compvss-outline" className="border-destructive/30 text-error">Expired</Badge>;
      case 'invalid':
        return <Badge variant="compvss-outline" className="border-warning/30 text-warning">Invalid</Badge>;
      default:
        return null;
    }
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="QR Scan History"
        description="View all QR code scan records"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'Filter',
            icon: <Filter className="w-4 h-4" />,
            onClick: () => {},
            variant: 'outline'
          },
          {
            label: 'Export',
            icon: <Download className="w-4 h-4" />,
            onClick: () => {},
            variant: 'outline'
          }
        ]}
      >
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
            <Input
              placeholder="Search by user, location, or QR ID..."
              className="pl-12 bg-grey-900/50 border-compvss-cyan-500/30 h-12"
            />
          </div>
        </motion.div>

        {/* History List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <History className="w-5 h-5 text-compvss-cyan-500" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {scans.map((scan, index) => (
                  <motion.div
                    key={scan.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="compvss-outline" className="text-caption">
                            {scan.type}
                          </Badge>
                          {getStatusBadge(scan.status)}
                        </div>
                        <h3 className="text-white mb-1">{scan.user}</h3>
                        <p className="text-body-sm text-grey-400 -tech mb-2">
                          {scan.location}
                        </p>
                        <div className="flex items-center gap-4 text-caption text-grey-500 -tech">
                          <span>QR ID: {scan.qrId}</span>
                          <span>•</span>
                          <span>{typeof scan.timestamp === 'string' ? scan.timestamp : new Date(scan.timestamp).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
