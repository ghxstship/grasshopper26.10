'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Shield, Upload, Plus, X } from 'lucide-react';
// Removed unused import
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';
import { FileUpload } from '@/components/atoms/FileUpload';
import { CompvssLayout } from '@/components/templates/CompvssLayout';
import { ContentLayout } from '@/components/templates/ContentLayout';

interface AccessRequest {
  personName: string;
  role: string;
  accessLevel: string;
  duration: string;
  reason: string;
}

export default function AccessCredentialsRequestPage() {
  const router = useRouter();
  const initialRequests = [
    { personName: '', role: '', accessLevel: '', duration: '', reason: '' }
  ];
  const [requests, setRequests] = useState<AccessRequest[]>(initialRequests);
  const [attachments, setAttachments] = useState<File[]>([]);

  const submitRequestMutation = useMutation({
    mutationFn: async (data: { requests: AccessRequest[]; attachments: File[] }) => {
      const formData = new FormData();
      formData.append('requests', JSON.stringify(data.requests));
      data.attachments.forEach((file, index) => {
        formData.append(`attachment_${index}`, file);
      });
      const response = await fetch('/api/compvss/advancing/access-credentials', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to submit request');
      return response.json();
    },
    onSuccess: () => {
      router.push('/compvss/advancing/dashboard');
    },
  });

  const addRequest = () => {
    setRequests([...requests, { personName: '', role: '', accessLevel: '', duration: '', reason: '' }]);
  };

  const removeRequest = (index: number) => {
    setRequests(requests.filter((_, i) => i !== index));
  };

  const updateRequest = (index: number, field: keyof AccessRequest, value: string) => {
    const updated = [...requests];
    updated[index][field] = value;
    setRequests(updated);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments([...attachments, ...Array.from(e.target.files)]);
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments(attachments.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRequestMutation.mutate({ requests, attachments });
  };

  return (
    <CompvssLayout>
      <ContentLayout
        title="ACCESS & CREDENTIALS REQUEST"
        description="Submit access and credential requirements"
        variant="compvss"
        breadcrumbs={[
          { label: 'Advancing', href: '/compvss/advancing' },
          { label: 'Categories', href: '/compvss/advancing/categories' },
          { label: 'Access & Credentials', href: '/compvss/advancing/categories/access-credentials' }
        ]}
      >
        <div className="min-h-screen bg-black text-white p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,255,255,0.1),transparent_50%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          
          <div className="relative z-10 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-8">
                <Link href="/compvss/advancing/dashboard">
                  <h1 className="compvss-text-gradient text-4xl font-anton mb-2 cursor-pointer">
                    Access & Credentials Request
                  </h1>
                </Link>
                <p className="text-gray-400 font-oswald">
                  Request access passes, credentials, and security clearances
                </p>
              </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Details */}
            {requests.map((request, index) => (
              <Card key={index} variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-compvss-cyan-500" />
                      <CardTitle className="text-white">Person #{index + 1}</CardTitle>
                    </div>
                    {requests.length > 1 && (
                      <Button
                        type="button"
                        variant="compvss-outline"
                        size="sm"
                        onClick={() => removeRequest(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Full Name" required>
                      <Input
                        value={request.personName}
                        onChange={(e) => updateRequest(index, 'personName', e.target.value)}
                        placeholder="John Doe"
                        variant="compvss"
                        required
                      />
                    </FormField>

                    <FormField label="Role/Position" required>
                      <Input
                        value={request.role}
                        onChange={(e) => updateRequest(index, 'role', e.target.value)}
                        placeholder="Production Manager"
                        variant="compvss"
                        required
                      />
                    </FormField>

                    <FormField label="Access Level" required>
                      <Select
                        value={request.accessLevel}
                        onChange={(e) => updateRequest(index, 'accessLevel', e.target.value)}
                        variant="compvss"
                        required
                      >
                        <option value="">Select level...</option>
                        <option value="all-access">All Access</option>
                        <option value="backstage">Backstage</option>
                        <option value="stage">Stage</option>
                        <option value="vip">VIP Areas</option>
                        <option value="production">Production Areas</option>
                        <option value="general">General Admission</option>
                      </Select>
                    </FormField>

                    <FormField label="Duration" required>
                      <Select
                        value={request.duration}
                        onChange={(e) => updateRequest(index, 'duration', e.target.value)}
                        variant="compvss"
                        required
                      >
                        <option value="">Select duration...</option>
                        <option value="single-day">Single Day</option>
                        <option value="multi-day">Multi-Day</option>
                        <option value="load-in">Load-In Only</option>
                        <option value="load-out">Load-Out Only</option>
                        <option value="full-run">Full Run</option>
                      </Select>
                    </FormField>

                    <div className="md:col-span-2">
                      <FormField label="Reason for Access" required>
                        <Textarea
                          value={request.reason}
                          onChange={(e) => updateRequest(index, 'reason', e.target.value)}
                          placeholder="Explain why this access is needed..."
                          rows={3}
                          variant="compvss"
                          required
                        />
                      </FormField>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            <Button
              type="button"
              variant="compvss-outline"
              onClick={addRequest}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Another Person
            </Button>

            {/* File Attachments */}
            <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Upload className="w-5 h-5 text-compvss-cyan-500" />
                  Supporting Documents
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Upload ID copies, insurance certificates, or other required documents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FileUpload
                  variant="compvss"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                  onChange={handleFileUpload}
                  dragDropText="Drag and drop files or click to browse"
                  browseText="Choose Files"
                />
                <p className="text-xs text-gray-500 font-share-tech mt-2 text-center">
                  PDF, JPG, PNG, DOC (Max 10MB each)
                </p>

                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/50 p-3 rounded-lg">
                        <span className="text-sm text-gray-300 font-share-tech">{file.name}</span>
                        <Button
                          type="button"
                          variant="compvss-outline"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Priority & Notes */}
            <Card variant="compvss" className="bg-gray-900/80 backdrop-blur-sm border-2 border-compvss-cyan-500/20">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField label="Priority Level">
                    <Select variant="compvss">
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </Select>
                  </FormField>

                  <FormField label="Event Date">
                    <Input
                      type="date"
                      variant="compvss"
                    />
                  </FormField>
                </div>

                <FormField label="Additional Notes" className="mt-4">
                  <Textarea
                    placeholder="Any special requirements or additional information..."
                    rows={4}
                    variant="compvss"
                  />
                </FormField>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex gap-4">
              <Button type="submit" variant="compvss" size="lg" className="flex-1">
                Submit Request
              </Button>
              <Link href="/compvss/advancing/dashboard">
                <Button type="button" variant="compvss-outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
      </ContentLayout>
    </CompvssLayout>
  );
}
