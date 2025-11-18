'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { Shield, Upload, FileCheck, AlertCircle, Calendar, CheckCircle2, Clock, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { IconButton } from '@/components/atoms/IconButton';
import { useCredentials, Credential } from '@/lib/hooks/compvss/useCredentials';
import { useMemo } from 'react';

export default function CredentialVaultPage() {
  const router = useRouter();
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Credentials', href: '/compvss/credentials/vault' },
  ];

  const { data, isLoading, error, refetch } = useCredentials();
  const credentials = useMemo(() => data?.credentials || [], [data]);

  const stats = useMemo(() => {
    const total = credentials.length;
    const verified = credentials.filter((c: Credential) => c.status === 'verified').length;
    const expired = credentials.filter((c: Credential) => c.status === 'expired').length;
    const pending = credentials.filter((c: Credential) => c.status === 'pending').length;
    
    return [
      { label: 'Total Credentials', value: total.toString(), icon: <FileCheck className="w-5 h-5" /> },
      { label: 'Verified', value: verified.toString(), icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-success' },
      { label: 'Expired', value: expired.toString(), icon: <Clock className="w-5 h-5" />, color: 'text-warning' },
      { label: 'Pending', value: pending.toString(), icon: <AlertCircle className="w-5 h-5" />, color: 'text-info' },
    ];
  }, [credentials]);

  if (isLoading) {
    return (
      <CompvssLayout>
        <ContentLayout
          title="Credential Vault"
          description="Manage your certifications and credentials"
          variant="compvss"
          breadcrumbs={breadcrumbs}
          primaryAction={{
            label: 'Upload Credential',
            icon: <Upload className="w-5 h-5" />,
            onClick: () => router.push('/compvss/credentials/upload'),
            variant: 'compvss'
          }}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <p className="text-gray-400">Loading credentials...</p>
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
          title="Credential Vault"
          description="Manage your certifications and credentials"
          variant="compvss"
          breadcrumbs={breadcrumbs}
          primaryAction={{
            label: 'Upload Credential',
            icon: <Upload className="w-5 h-5" />,
            onClick: () => router.push('/compvss/credentials/upload'),
            variant: 'compvss'
          }}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <h2 className="text-h5 font-bebas mb-2">Failed to Load Credentials</h2>
              <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
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
      case 'verified':
        return <Badge variant="compvss" className="bg-success-light text-success border-success/30">Verified</Badge>;
      case 'expiring':
        return <Badge variant="compvss-outline" className="border-warning/30 text-warning">Expiring Soon</Badge>;
      case 'pending':
        return <Badge variant="compvss-outline" className="border-info/30 text-info">Pending</Badge>;
      case 'expired':
        return <Badge variant="compvss-outline" className="border-destructive/30 text-error">Expired</Badge>;
      default:
        return <Badge variant="compvss-outline">{status}</Badge>;
    }
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Credential Vault"
        description="Manage your certifications and credentials"
        variant="compvss"
        breadcrumbs={breadcrumbs}
        primaryAction={{
          label: 'Upload Credential',
          icon: <Upload className="w-5 h-5" />,
          onClick: () => router.push('/compvss/credentials/upload'),
          variant: 'compvss'
        }}
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
              <Card variant="compvss" className="bg-gray-900/50">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 bg-compvss-cyan-500/10 rounded-lg ${stat.color || 'text-compvss-cyan-500'}`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-h3 font-bebas text-white mb-1">{stat.value}</div>
                  <div className="text-body-sm text-gray-400 font-oswald">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Credentials List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Shield className="w-5 h-5 text-compvss-cyan-500" />
                Your Credentials
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {credentials.map((cred: Credential, index: number) => (
                  <motion.div
                    key={cred.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="p-4 rounded-lg bg-black/50 border border-compvss-cyan-500/20 hover:border-compvss-cyan-500/40 transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <FileCheck className="w-4 h-4 text-compvss-cyan-500" />
                          <h3 className="font-oswald text-white">{cred.name}</h3>
                        </div>
                        <p className="text-body-sm text-gray-400 font-share-tech mb-2">
                          {cred.type}
                        </p>
                        <div className="flex items-center gap-4 text-caption text-gray-500 font-share-tech">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Issued: {cred.issuedDate || 'N/A'}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Expires: {cred.expiryDate || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(cred.status)}
                        <IconButton
                          variant="ghost"
                          size="sm"
                          icon={<Download className="w-4 h-4" />}
                          className="text-compvss-cyan-500 hover:text-compvss-teal-500 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                      <span className="text-caption text-gray-500 font-share-tech">
                        ID: {cred.id}
                      </span>
                      <Link href={`/compvss/credentials/detail/${cred.id}`}>
                        <Button variant="compvss-ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-6"
        >
          <Card variant="compvss" className="bg-gray-900/30 border-compvss-cyan-500/20">
            <CardContent className="pt-6">
              <h3 className="text-h6 font-bebas text-white mb-3">Credential Requirements</h3>
              <ul className="space-y-2 text-body-sm text-gray-400 font-share-tech">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-2" />
                  <span>Upload clear, legible copies of all certifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-2" />
                  <span>Ensure credentials are current and not expired</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-2" />
                  <span>Verification typically takes 1-2 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-2" />
                  <span>You&apos;ll receive notifications 30 days before expiration</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
