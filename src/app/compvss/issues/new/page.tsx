'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { CompvssLayout } from '@/components/templates/CompvssLayout';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { AlertCircle, Upload, MapPin, Camera, Send } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/atoms/Card';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { FormField } from '@/components/molecules/FormField';

export default function NewIssuePage() {
  const breadcrumbs = [
    { label: 'Dashboard', href: '/compvss/dashboard' },
    { label: 'Issues', href: '/compvss/issues/dashboard' },
    { label: 'New Issue', href: '/compvss/issues/new' },
  ];

  return (
    <CompvssLayout breadcrumbs={breadcrumbs}>
      <NewIssueContent />
    </CompvssLayout>
  );
}

function NewIssueContent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: '',
    location: '',
  });

  const createIssueMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch('/api/compvss/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create issue');
      return response.json();
    },
    onSuccess: () => {
      router.push('/compvss/issues/dashboard');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createIssueMutation.mutate(formData);
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gradient-to-r from-black via-gray-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bebas compvss-text-gradient">Report Issue</h1>
              <p className="text-gray-400 font-oswald mt-1">Submit a new issue or incident report</p>
            </div>
            <Link href="/compvss/issues/dashboard">
              <Button variant="compvss-outline" size="lg">
                View All Issues
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="compvss" className="bg-gray-900/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-compvss-cyan-500" />
                Issue Details
              </CardTitle>
              <CardDescription className="text-gray-400">
                Provide as much detail as possible to help resolve the issue quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <FormField label="Issue Title" required>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Brief description of the issue"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    variant="compvss"
                    required
                  />
                </FormField>

                {/* Priority */}
                <FormField label="Priority Level" required>
                  <Select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    variant="compvss"
                    required
                  >
                    <option value="low">Low - Minor inconvenience</option>
                    <option value="medium">Medium - Needs attention</option>
                    <option value="high">High - Urgent</option>
                    <option value="critical">Critical - Emergency</option>
                  </Select>
                </FormField>

                {/* Category */}
                <FormField label="Category" required>
                  <Select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    variant="compvss"
                    required
                  >
                    <option value="">Select a category</option>
                    <option value="equipment">Equipment Malfunction</option>
                    <option value="safety">Safety Concern</option>
                    <option value="facility">Facility Issue</option>
                    <option value="technical">Technical Problem</option>
                    <option value="personnel">Personnel Issue</option>
                    <option value="logistics">Logistics</option>
                    <option value="other">Other</option>
                  </Select>
                </FormField>

                {/* Location */}
                <FormField label="Location" hint="Specify where the issue is located">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="location"
                      type="text"
                      placeholder="e.g., Main Stage, Zone B, Backstage Area"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                      variant="compvss"
                      className="pl-10"
                    />
                  </div>
                </FormField>

                {/* Description */}
                <FormField label="Detailed Description" required>
                  <Textarea
                    id="description"
                    rows={6}
                    placeholder="Provide a detailed description of the issue, including what happened, when it occurred, and any relevant context..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    variant="compvss"
                    required
                  />
                </FormField>

                {/* File Upload */}
                <FormField label="Attachments (Photos/Videos)">
                  <div className="border-2 border-dashed border-compvss-cyan-500/30 rounded-lg p-8 text-center hover:border-compvss-cyan-500/50 transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-4 bg-compvss-cyan-500/10 rounded-full">
                        <Camera className="w-8 h-8 text-compvss-cyan-500" />
                      </div>
                      <div>
                        <p className="text-white font-oswald mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-400 font-share-tech">
                          PNG, JPG, MP4 up to 10MB
                        </p>
                      </div>
                      <Button variant="compvss-outline" size="sm" type="button">
                        <Upload className="w-4 h-4 mr-2" />
                        Browse Files
                      </Button>
                    </div>
                  </div>
                </FormField>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    variant="compvss"
                    size="lg"
                    className="flex-1"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Issue
                  </Button>
                  <Link href="/compvss/issues/dashboard" className="flex-1">
                    <Button
                      type="button"
                      variant="compvss-outline"
                      size="lg"
                      className="w-full"
                    >
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Help Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card variant="compvss" className="bg-gray-900/30 border-compvss-cyan-500/20">
              <CardContent className="pt-6">
                <h3 className="text-lg font-bebas text-white mb-3">Reporting Tips</h3>
                <ul className="space-y-2 text-sm text-gray-400 font-share-tech">
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-2" />
                    <span>Be specific and include all relevant details</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-2" />
                    <span>Attach photos or videos when possible</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-2" />
                    <span>Select the appropriate priority level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-compvss-cyan-500 rounded-full mt-2" />
                    <span>For emergencies, also contact on-site security immediately</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
