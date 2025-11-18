'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

import { motion } from 'framer-motion';
import { Upload, Save, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { FormField } from '@/components/molecules/FormField';

export default function CredentialUploadPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch('/api/compvss/credentials', {
        method: 'POST',
        body: data,
      });
      if (!response.ok) throw new Error('Failed to upload credential');
      return response.json();
    },
    onSuccess: () => {
      setSuccess(true);
      setTimeout(() => {
        router.push('/compvss/credentials/vault');
      }, 2000);
    },
    onError: () => {
      setError('Failed to upload credential');
    },
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('issuer', formData.issuer);
    formDataToSend.append('issueDate', formData.issueDate);
    formDataToSend.append('expiryDate', formData.expiryDate);
    formDataToSend.append('credentialId', formData.credentialId);
    if (file) {
      formDataToSend.append('file', file);
    }

    uploadMutation.mutate(formDataToSend);
  };

  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Credentials', href: '/compvss/credentials/vault' },
    { label: 'Upload', href: '/compvss/credentials/upload' },
  ];

  return (
    <CompvssLayout>
      <ContentLayout
        title="Upload Credential"
        description="Add a new certification or credential"
        variant="compvss"
        breadcrumbs={breadcrumbs}
        showToolbar={true}
      >
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card variant="compvss" className="bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-white">Credential Details</CardTitle>
              <CardDescription className="text-gray-400">
                Enter information about your certification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error Message */}
                {error && (
                  <div className="p-3 rounded-lg bg-error/10 border border-error/30 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-error" />
                    <p className="text-body-sm text-error font-share-tech">{error}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="p-3 rounded-lg bg-success/10 border border-success/30 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    <p className="text-body-sm text-success font-share-tech">Credential uploaded successfully! Redirecting...</p>
                  </div>
                )}

                <FormField label="Credential Name" required>
                  <Input
                    type="text"
                    placeholder="e.g., OSHA Safety Certification"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    disabled={uploadMutation.isPending}
                    required
                  />
                </FormField>

                <FormField label="Issuing Organization" required>
                  <Input
                    type="text"
                    placeholder="e.g., OSHA"
                    value={formData.issuer}
                    onChange={(e) => handleChange('issuer', e.target.value)}
                    className="bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    disabled={uploadMutation.isPending}
                    required
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Issue Date" required>
                    <Input
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleChange('issueDate', e.target.value)}
                      className="bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                      disabled={uploadMutation.isPending}
                      required
                    />
                  </FormField>
                  <FormField label="Expiry Date">
                    <Input
                      type="date"
                      value={formData.expiryDate}
                      onChange={(e) => handleChange('expiryDate', e.target.value)}
                      className="bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                      disabled={uploadMutation.isPending}
                    />
                  </FormField>
                </div>

                <FormField label="Credential ID">
                  <Input
                    type="text"
                    placeholder="Certificate number or ID"
                    value={formData.credentialId}
                    onChange={(e) => handleChange('credentialId', e.target.value)}
                    className="bg-black/50 border-compvss-cyan-500/30 focus:border-compvss-cyan-500 text-white"
                    disabled={uploadMutation.isPending}
                  />
                </FormField>

                <FormField label="Upload Document" required>
                  <input
                    type="file"
                    id="credential-file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploadMutation.isPending}
                    required
                  />
                  <label
                    htmlFor="credential-file"
                    className="block border-2 border-dashed border-compvss-cyan-500/30 rounded-lg p-8 text-center hover:border-compvss-cyan-500/50 transition-colors cursor-pointer"
                  >
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    {file ? (
                      <p className="text-compvss-cyan-500 font-share-tech mb-2">
                        {file.name}
                      </p>
                    ) : (
                      <p className="text-gray-400 font-share-tech mb-2">
                        Click to upload or drag and drop
                      </p>
                    )}
                    <p className="text-caption text-gray-500 font-share-tech">
                      PDF, JPG, PNG up to 10MB
                    </p>
                  </label>
                </FormField>

                <Button 
                  type="submit" 
                  variant="compvss" 
                  size="lg" 
                  className="w-full"
                  disabled={uploadMutation.isPending || success}
                >
                  {uploadMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5 mr-2" />
                      Save Credential
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
