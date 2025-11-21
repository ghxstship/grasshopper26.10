/**
 * New Advancing Request Page - UI Rebuild
 * Create new advancing requests for production needs
 */

'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Input } from '@/components/ui-rebuild/atoms/Input';
import { Select } from '@/components/ui-rebuild/atoms/Select';
import { Textarea } from '@/components/ui-rebuild/atoms/Textarea';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { Alert } from '@/components/ui-rebuild/molecules/Alert';
import { apiClient } from '@/lib/api/client';

const REQUEST_TYPES = [
  { value: 'hospitality', label: 'Hospitality' },
  { value: 'technical-production', label: 'Technical Production' },
  { value: 'travel-lodging', label: 'Travel & Lodging' },
  { value: 'logistics', label: 'Logistics' },
  { value: 'site-infrastructure', label: 'Site Infrastructure' },
  { value: 'site-utilities', label: 'Site Utilities' },
  { value: 'site-vehicles', label: 'Site Vehicles' },
  { value: 'site-assets', label: 'Site Assets' },
  { value: 'heavy-equipment', label: 'Heavy Equipment' },
  { value: 'access-credentials', label: 'Access & Credentials' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

export default function NewRequestPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [formData, setFormData] = React.useState({
    type: '',
    title: '',
    description: '',
    priority: 'medium',
    quantity: '1',
    deadline: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.type || !formData.title || !formData.description) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
      if (token) {
        apiClient.setAuthToken(token);
      }

      await apiClient.post('/api/compvss/advancing/requests', {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        quantity: parseInt(formData.quantity) || 1,
        deadline: formData.deadline || null,
        notes: formData.notes || null,
      });

      router.push('/compvss/advancing/requests');
    } catch (err) {
      console.error('Failed to create request:', err);
      setError('Failed to create request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <H1 className="mb-2">New Advancing Request</H1>
          <Body className="text-gray-600">
            Submit a new request for production resources and services
          </Body>
        </div>

        {error && (
          <Alert variant="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card variant="compvss" className="mb-6">
            <CardHeader>
              <CardTitle>Request Details</CardTitle>
              <CardDescription>Provide information about your advancing needs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label htmlFor="type" className="block mb-2">
                  <Caption className="font-medium">Request Type *</Caption>
                </label>
                <Select
                  id="type"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  options={[{ value: '', label: 'Select a type...' }, ...REQUEST_TYPES]}
                  required
                />
              </div>

              <div>
                <label htmlFor="title" className="block mb-2">
                  <Caption className="font-medium">Request Title *</Caption>
                </label>
                <Input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Brief description of what you need"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block mb-2">
                  <Caption className="font-medium">Detailed Description *</Caption>
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Provide detailed information about your request"
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="priority" className="block mb-2">
                    <Caption className="font-medium">Priority</Caption>
                  </label>
                  <Select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) => handleChange('priority', e.target.value)}
                    options={PRIORITY_LEVELS}
                  />
                </div>

                <div>
                  <label htmlFor="quantity" className="block mb-2">
                    <Caption className="font-medium">Quantity</Caption>
                  </label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="deadline" className="block mb-2">
                    <Caption className="font-medium">Deadline</Caption>
                  </label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="notes" className="block mb-2">
                  <Caption className="font-medium">Additional Notes</Caption>
                </label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Any additional information or special requirements"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="submit"
              variant="compvss"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={submitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
}
