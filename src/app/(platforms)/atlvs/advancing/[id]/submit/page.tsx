'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { H2, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/ui-rebuild/atoms/Textarea';

export default function SubmitAdvancingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/atlvs/advancing/${params.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push('/atlvs/advancing');
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <H2>Submit Advancing Request</H2>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <BodyText className="mb-2">Title</BodyText>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter request title"
            />
          </div>
          <div>
            <BodyText className="mb-2">Description</BodyText>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter request description"
              rows={4}
            />
          </div>
          <div>
            <BodyText className="mb-2">Budget</BodyText>
            <Input
              type="number"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="Enter budget amount"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="atlvs" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
            <Button variant="ghost" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
