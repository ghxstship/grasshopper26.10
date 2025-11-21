'use client';

import { useAdvancing } from '@/hooks/atlvs/useAdvancing';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export default function AtlvsAdvancingPage() {
  const { requests, approveRequest, rejectRequest } = useAdvancing();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Advancing Approvals</SectionHeader>
      <div className="space-y-4 mt-6">
        {requests.map((request) => (
          <Card key={request.id} variant="atlvs">
            <CardHeader>
              <CardTitle>{request.requestNumber}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {request.status}</p>
              <div className="flex gap-2 mt-4">
                <Button variant="primary" onClick={() => approveRequest(request.id)}>
                  Approve
                </Button>
                <Button variant="secondary" onClick={() => rejectRequest(request.id, 'Rejected')}>
                  Reject
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}