'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, AlertCircle, Calendar, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useCredentials, useVerifyCredential, Credential } from '@/lib/hooks/compvss/useCredentials';
import { useMemo } from 'react';

export default function CredentialVerificationPage() {
  const { data, isLoading, error, refetch } = useCredentials({ status: 'pending' });
  const credentials = useMemo(() => data?.credentials || [], [data]);
  const verifyMutation = useVerifyCredential();

  const handleVerify = async (credId: string) => {
    try {
      await verifyMutation.mutateAsync({ credentialId: credId, verified: true });
      refetch();
    } catch (err) {
      console.error('Failed to verify credential:', err);
    }
  };

  const handleReject = async (credId: string) => {
    try {
      await verifyMutation.mutateAsync({ credentialId: credId, verified: false });
      refetch();
    } catch (err) {
      console.error('Failed to reject credential:', err);
    }
  };

  const getStatusBadge = (status: Credential['status']) => {
    const config: Record<string, { variant: 'warning' | 'success' | 'error'; label: string; icon: typeof AlertCircle }> = {
      pending: { variant: 'warning', label: 'Pending', icon: AlertCircle },
      verified: { variant: 'success', label: 'Verified', icon: CheckCircle2 },
      expired: { variant: 'error', label: 'Expired', icon: Calendar },
      expiring: { variant: 'warning', label: 'Expiring Soon', icon: Clock },
    };
    const statusConfig = config[status] || config.pending;
    const { variant, label, icon: Icon } = statusConfig;
    return (
      <Badge variant={variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {label}
      </Badge>
    );
  };

  const stats = useMemo(() => ({
    pending: credentials.filter((c: Credential) => c.status === 'pending').length,
    verified: credentials.filter((c: Credential) => c.status === 'verified').length,
    expired: credentials.filter((c: Credential) => c.status === 'expired').length,
    rejected: credentials.filter((c: Credential) => c.status === 'rejected').length,
  }), [credentials]);

  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Credentials', href: '/compvss/credentials/vault' },
    { label: 'Verification', href: '/compvss/credentials/verification' },
  ];

  if (isLoading) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
            <p className="text-gray-400">Loading credentials...</p>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  if (error) {
    return (
      <CompvssLayout breadcrumbs={breadcrumbs}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Credentials</h2>
            <p className="text-gray-400 mb-4">{error.message || 'An error occurred'}</p>
            <Button variant="compvss" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </CompvssLayout>
    );
  }

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bebas compvss-text-gradient">Credential Verification</h1>
          <p className="text-gray-400 font-oswald mt-1">Review and verify team credentials</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card variant="compvss" className="bg-warning/10 border-yellow-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-warning">{stats.pending}</p>
                <p className="text-sm text-gray-400 font-oswald">Pending</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-green-500/10 border-green-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-success">{stats.verified}</p>
                <p className="text-sm text-gray-400 font-oswald">Verified</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-warning/10 border-yellow-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-warning">{stats.expired}</p>
                <p className="text-sm text-gray-400 font-oswald">Expired</p>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-error/10 border-red-500/30">
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bebas text-error">{stats.rejected}</p>
                <p className="text-sm text-gray-400 font-oswald">Rejected</p>
              </CardContent>
            </Card>
          </div>

          {/* Credentials List */}
          <div className="space-y-4">
            {credentials.map((credential: Credential) => (
              <Card key={credential.id} variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-compvss-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-compvss-cyan-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-oswald text-white text-lg">{credential.name}</h3>
                          <Badge variant="default" className="text-xs">{credential.id}</Badge>
                        </div>
                        <p className="text-sm text-gray-400 font-share-tech mb-2">
                          {credential.type}
                        </p>
                        <div className="flex gap-4 text-xs text-gray-500 font-share-tech">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Issued: {credential.issuedDate ? new Date(credential.issuedDate).toLocaleDateString() : 'N/A'}</span>
                          </div>
                          {credential.expiryDate && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>Expires: {new Date(credential.expiryDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(credential.status)}
                  </div>

                  {credential.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        variant="compvss"
                        size="sm"
                        className="flex-1 bg-green-500 hover:bg-success"
                        onClick={() => handleVerify(credential.id)}
                        disabled={verifyMutation.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Verify
                      </Button>
                      <Button
                        variant="compvss"
                        size="sm"
                        className="flex-1 bg-error hover:bg-red-600"
                        onClick={() => handleReject(credential.id)}
                        disabled={verifyMutation.isPending}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button variant="compvss-outline" size="sm">
                        View Document
                      </Button>
                    </div>
                  )}

                  {credential.status === 'expired' && (
                    <Button variant="compvss" size="sm" className="w-full">
                      Request Renewal
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>
      </div>
    </CompvssLayout>
  );
}
