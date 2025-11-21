'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { H2, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/ui-rebuild/atoms/Textarea';

export default function ApproveAdvancingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApprove = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/atlvs/advancing/${params.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      });

      if (response.ok) {
        router.push('/atlvs/advancing');
      }
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <H2>Approve Advancing Request</H2>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Approval Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <BodyText className="mb-2">Add notes for this approval (optional)</BodyText>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter approval notes..."
              rows={4}
            />
          </div>
          <div className="flex gap-2">
            <Button variant="atlvs" onClick={handleApprove} disabled={loading}>
              {loading ? 'Approving...' : 'Confirm Approval'}
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
