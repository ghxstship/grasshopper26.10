'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { QrCode, Camera, CheckCircle2, XCircle, History } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useScanQR, useQRCodes } from '@/lib/hooks/compvss/useQRCodes';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// API: /api/compvss/qr/scan
const API_ENDPOINT = '/api/compvss/qr/scan';

export default function QRScanPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<{
    id: string;
    type: string;
    name: string;
    status: string;
    details: string;
  } | null>(null);

  const scanQRMutation = useScanQR();
  const { data: qrCodes = [] } = useQRCodes();
  const recentScans = qrCodes.filter((qr: any) => qr.scannedAt)
    .sort((a: any, b: any) => new Date(b.scannedAt).getTime() - new Date(a.scannedAt).getTime())
    .slice(0, 3);

  const handleStartScan = async () => {
    setIsScanning(true);
    // TODO: Implement camera QR scanning
    // For now, simulate scanning
    setTimeout(async () => {
      try {
        const result = await scanQRMutation.mutateAsync('DEMO-QR-CODE');
        setLastScan({
          id: result.id || 'QR-004',
          type: result.type || 'Access Pass',
          name: result.data?.name || 'Jane Smith',
          status: 'valid',
          details: result.data?.details || 'Backstage Access - All Areas'
        });
      } catch (err) {
        console.error('Scan error:', err);
      }
      setIsScanning(false);
    }, 2000);
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="QR Code Scanner"
        description="Scan QR codes for access and tracking"
        variant="compvss"
        showToolbar={true}
        
        actions={[
          {
            label: 'History',
            icon: <History className="w-5 h-5" />,
            onClick: () => window.location.href = '/compvss/qr/history',
            variant: 'outline'
          }
        ]}
      >
        <div className="max-w-4xl mx-auto">
        {/* Scanner Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Card variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="text-center">
                {!isScanning && !lastScan && (
                  <div className="py-12">
                    <div className="w-32 h-32 mx-auto mb-6 bg-compvss-cyan-500/10 rounded-full flex items-center justify-center">
                      <QrCode className="w-16 h-16 text-compvss-cyan-500" />
                    </div>
                    <SectionHeader className="text-white mb-2">Ready to Scan</SectionHeader>
                    <BodyText className="text-grey-400 mb-6">
                      Position QR code within the camera frame
                    </BodyText>
                    <Button
                      variant="compvss"
                      size="xl"
                      onClick={handleStartScan}
                    >
                      <Camera className="w-5 h-5 mr-2" />
                      Start Scanning
                    </Button>
                  </div>
                )}

                {isScanning && (
                  <div className="py-12">
                    <div className="w-64 h-64 mx-auto mb-6 border-4 border-compvss-cyan-500 rounded-lg relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-compvss-cyan-500/20 to-transparent animate-pulse" />
                      <div className="absolute top-0 left-0 right-0 h-1 bg-compvss-cyan-500 animate-scan" />
                    </div>
                    <SectionHeader className="text-white mb-2">Scanning...</SectionHeader>
                    <BodyText className="text-grey-400">
                      Hold steady and align QR code
                    </BodyText>
                  </div>
                )}

                {lastScan && !isScanning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12"
                  >
                    <div className="w-32 h-32 mx-auto mb-6 bg-success-light0/10 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="w-16 h-16 text-success" />
                    </div>
                    <SectionHeader className="text-white mb-2">Scan Successful</SectionHeader>
                    <div className="max-w-md mx-auto mb-6">
                      <div className="p-6 rounded-lg bg-black/50 border border-compvss-cyan-500/30 text-left">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-body-sm text-grey-400 -tech">Type</span>
                          <Badge variant="compvss">{lastScan.type}</Badge>
                        </div>
                        <div className="mb-4">
                          <span className="text-body-sm text-grey-400 -tech block mb-1">Name</span>
                          <span className="text-white">{lastScan.name}</span>
                        </div>
                        <div className="mb-4">
                          <span className="text-body-sm text-grey-400 -tech block mb-1">Details</span>
                          <span className="text-white">{lastScan.details}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-body-sm text-grey-400 -tech">Status</span>
                          <Badge variant="compvss" className="bg-success-light text-success border-success/30">
                            Valid
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-4 justify-center">
                      <Button
                        variant="compvss"
                        size="lg"
                        onClick={() => {
                          setLastScan(null);
                          handleStartScan();
                        }}
                      >
                        Scan Another
                      </Button>
                      <Button
                        variant="compvss-outline"
                        size="lg"
                        onClick={() => setLastScan(null)}
                      >
                        Done
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Scans */}
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
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {scan.status === 'valid' ? (
                            <CheckCircle2 className="w-4 h-4 text-success" />
                          ) : (
                            <XCircle className="w-4 h-4 text-grey-500" />
                          )}
                          <span className="text-white">{scan.name}</span>
                        </div>
                        <p className="text-body-sm text-grey-400 -tech">{scan.type}</p>
                      </div>
                      <Badge 
                        variant={scan.status === 'valid' ? 'compvss' : 'compvss-outline'}
                        className={scan.status === 'valid' ? 'bg-success-light text-success border-success/30' : ''}
                      >
                        {scan.status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-caption text-grey-500 -tech">
                      <span>ID: {scan.id}</span>
                      <span>{scan.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        </div>

      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(256px);
          }
        }
        .animate-scan {
          animation: scan 2s linear infinite;
        }
      `}</style>
      </ContentLayout>
    </CompvssLayout>
  );
}
