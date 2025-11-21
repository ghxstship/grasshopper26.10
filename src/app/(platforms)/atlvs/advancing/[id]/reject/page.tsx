'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { H2, BodyText } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Textarea } from '@/components/ui-rebuild/atoms/Textarea';

export default function RejectAdvancingPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReject = async () => {
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/atlvs/advancing/${params.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      });

      if (response.ok) {
        router.push('/atlvs/advancing');
      }
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <H2>Reject Advancing Request</H2>
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <CardTitle>Rejection Reason</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <BodyText className="mb-2">Provide a reason for rejection (required)</BodyText>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button variant="destructive" onClick={handleReject} disabled={loading || !reason.trim()}>
              {loading ? 'Rejecting...' : 'Confirm Rejection'}
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
