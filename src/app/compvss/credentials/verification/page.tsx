'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { motion } from 'framer-motion';
import { Shield, CheckCircle2, XCircle, AlertCircle, Calendar, Loader2, Clock } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useCredentials, useVerifyCredential, Credential } from '@/lib/hooks/compvss/useCredentials';
import { useMemo } from 'react';
import { BodyText, SectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/credentials/verification

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
      <CompvssLayout>
        <ContentLayout
          title="Credential Verification"
          description="Review and verify team credentials"
          variant="compvss"
          breadcrumbs={breadcrumbs}
          showToolbar={false}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-compvss-cyan-500" />
              <BodyText className="text-grey-400">Loading credentials...</BodyText>
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
          title="Credential Verification"
          description="Review and verify team credentials"
          variant="compvss"
          breadcrumbs={breadcrumbs}
          showToolbar={false}
        >
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
              <SectionHeader className="mb-2">Failed to Load Credentials</SectionHeader>
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
        title="Credential Verification"
        description="Review and verify team credentials"
        variant="compvss"
        breadcrumbs={breadcrumbs}
        showToolbar={false}
      >
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <Card variant="compvss" className="bg-warning/10 border-warning/30">
              <CardContent className="pt-6 text-center">
                <p className="text-warning">{stats.pending}</p>
                <BodyText className="text-body-sm text-grey-400">Pending</BodyText>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-success-light0/10 border-success/30">
              <CardContent className="pt-6 text-center">
                <p className="text-success">{stats.verified}</p>
                <BodyText className="text-body-sm text-grey-400">Verified</BodyText>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-warning/10 border-warning/30">
              <CardContent className="pt-6 text-center">
                <p className="text-warning">{stats.expired}</p>
                <BodyText className="text-body-sm text-grey-400">Expired</BodyText>
              </CardContent>
            </Card>
            <Card variant="compvss" className="bg-error/10 border-destructive/30">
              <CardContent className="pt-6 text-center">
                <p className="text-error">{stats.rejected}</p>
                <BodyText className="text-body-sm text-grey-400">Rejected</BodyText>
              </CardContent>
            </Card>
          </div>

          {/* Credentials List */}
          <div className="space-y-4">
            {credentials.map((credential: Credential) => (
              <Card key={credential.id} variant="compvss" className="bg-grey-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-12 h-12 rounded-full bg-compvss-cyan-500/20 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-compvss-cyan-500" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-white">{credential.name}</h3>
                          <Badge variant="default" className="text-caption">{credential.id}</Badge>
                        </div>
                        <p className="text-body-sm text-grey-400 -tech mb-2">
                          {credential.type}
                        </p>
                        <div className="flex gap-4 text-caption text-grey-500 -tech">
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
                        className="flex-1 bg-success-light0 hover:bg-success"
                        onClick={() => handleVerify(credential.id)}
                        disabled={verifyMutation.isPending}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Verify
                      </Button>
                      <Button
                        variant="compvss"
                        size="sm"
                        className="flex-1 bg-error hover:bg-destructive"
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
      </ContentLayout>
    </CompvssLayout>
  );
}
