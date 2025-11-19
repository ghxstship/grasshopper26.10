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
import { BodyText, SubsectionHeader } from "@/components/atoms/Typography";

interface Credential {
  id: string;
  type: string;
  file: File | null;
  status: 'pending' | 'uploaded' | 'verified' | 'rejected';
  expiryDate?: string;
}

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/compvss/team/onboarding/credentials

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
        return <FileText className="w-5 h-5 text-grey-500" />;
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
                    <SubsectionHeader className="text-white mb-1">Secure Document Upload</SubsectionHeader>
                    <BodyText className="text-body-sm text-grey-400 -tech">
                      All documents are encrypted and stored securely. Only authorized personnel can access your credentials.
                    </BodyText>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credentials List */}
            <div className="space-y-4 mb-6">
              {credentials.map((credential) => (
                <Card key={credential.id} variant="compvss" className="bg-grey-900/50 backdrop-blur-sm">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(credential.status)}
                        <div>
                          <h3 className="text-white">{credential.type}</h3>
                          {credential.file && (
                            <p className="text-body-sm text-grey-400 -tech">{credential.file.name}</p>
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
                      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
                        <BodyText className="text-body-sm text-warning -tech">
                          Document uploaded. Awaiting verification...
                        </BodyText>
                      </div>
                    )}

                    {credential.status === 'verified' && (
                      <div className="bg-success-light0/10 border border-success/30 rounded-lg p-4">
                        <BodyText className="text-body-sm text-success -tech">
                          ✓ Verified and approved
                        </BodyText>
                      </div>
                    )}

                    {credential.status === 'rejected' && (
                      <div className="bg-error/10 border border-destructive/30 rounded-lg p-4">
                        <BodyText className="text-body-sm text-error -tech">
                          Document rejected. Please upload a valid document.
                        </BodyText>
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
