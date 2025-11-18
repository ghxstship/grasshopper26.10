'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, CheckCircle2, XCircle, Clock, Shield,  } from 'lucide-react';
import { useTeam } from '@/lib/hooks/compvss/useTeam';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { FileUpload } from '@/components/atoms/FileUpload';

interface Credential {
  id: string;
  type: string;
  file: File | null;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  expiryDate?: string;
}

export default function CredentialUploadPage() { 
  const { data,  } = useTeam();
  const initialCreds = (data as any)?.credentials || [
    { id: '1', type: 'Government ID', file: null, status: 'pending' },
    { id: '2', type: 'Background Check', file: null, status: 'pending' },
    { id: '3', type: 'Work Permit', file: null, status: 'pending' },
    { id: '4', type: 'Safety Certification', file: null, status: 'pending' },
  ];
  const [credentials, setCredentials] = useState<Credential[]>(initialCreds);

  const handleFileUpload = (credentialId: string, file: File) => {
    setCredentials(prev => prev.map(cred => 
      cred.id === credentialId 
        ? { ...cred, file, status: 'uploaded' as const }
        : cred
    ));
  };

  const getStatusIcon = (status: Credential['status']) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-error" />;
      case 'uploaded':
        return <Clock className="w-5 h-5 text-warning" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: Credential['status']) => {
    const variants: Record<Credential['status'], 'default' | 'success' | 'warning' | 'error'> = {
      pending: 'default',
      uploaded: 'warning',
      verified: 'success',
      rejected: 'error',
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="Upload Credentials"
        description="Upload required documents for verification"
        variant="compvss"
        showToolbar={false}
        breadcrumbs={[
          { label: 'Team', href: '/compvss/team/directory' },
          { label: 'Onboarding', href: '/compvss/team/onboarding/training' },
          { label: 'Credentials' }
        ]}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Info Card */}
            <Card variant="compvss" className="mb-6 bg-compvss-cyan-500/10 border-compvss-cyan-500/30">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Shield className="w-6 h-6 text-compvss-cyan-500 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-oswald text-white mb-1">Secure Document Upload</h3>
                    <p className="text-sm text-gray-400 font-share-tech">
                      All documents are encrypted and stored securely. Only authorized personnel can access your credentials.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credentials List */}
            <div className="space-y-4 mb-6">
              {credentials.map((credential) => (
                <Card key={credential.id} variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(credential.status)}
                        <div>
                          <h3 className="font-oswald text-white">{credential.type}</h3>
                          {credential.file && (
                            <p className="text-sm text-gray-400 font-share-tech">{credential.file.name}</p>
                          )}
                        </div>
                      </div>
                      {getStatusBadge(credential.status)}
                    </div>

                    {credential.status === 'pending' && (
                      <FileUpload
                        variant="compvss"
                        id={`file-${credential.id}`}
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(credential.id, file);
                        }}
                        dragDropText="Drag and drop or click to upload"
                        browseText="Choose File"
                      />
                    )}

                    {credential.status === 'uploaded' && (
                      <div className="bg-warning/10 border border-yellow-500/30 rounded-lg p-4">
                        <p className="text-sm text-warning font-share-tech">
                          Document uploaded. Awaiting verification...
                        </p>
                      </div>
                    )}

                    {credential.status === 'verified' && (
                      <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                        <p className="text-sm text-success font-share-tech">
                          ✓ Verified and approved
                        </p>
                      </div>
                    )}

                    {credential.status === 'rejected' && (
                      <div className="bg-error/10 border border-red-500/30 rounded-lg p-4">
                        <p className="text-sm text-error font-share-tech">
                          Document rejected. Please upload a valid document.
                        </p>
                        <Button variant="destructive" size="sm" className="mt-2">
                          Re-upload
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Link href="/compvss/team/onboarding/training" className="flex-1">
              <Button variant="compvss" size="lg" className="w-full">
                Continue to Training
              </Button>
            </Link>
            <Link href="/compvss/dashboard">
              <Button variant="compvss-outline" size="lg">
                Skip for Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </ContentLayout>
    </CompvssLayout>
  );
}
