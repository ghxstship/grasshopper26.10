'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { H2, BodyText } from '@/components/atoms/Typography';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';

interface StatusInfo {
  id: string;
  status: string;
  requestNumber: string;
  submittedAt: string;
  approvedAt?: string;
  rejectedAt?: string;
  approver?: { name: string };
}

export default function AdvancingStatusPage({ params }: { params: { id: string } }) {
  const [statusInfo, setStatusInfo] = useState<StatusInfo | null>(null);

  const fetchStatus = async () => {
    const response = await fetch(`/api/atlvs/advancing/${params.id}/status`);
    if (response.ok) {
      const data = await response.json();
      setStatusInfo(data);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, [params.id]);

  if (!statusInfo) return <div>Loading...</div>;

  return (
    <div className="container mx-auto p-6">
      <H2>Advancing Request Status</H2>
      
      <Card variant="atlvs" className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{statusInfo.requestNumber}</CardTitle>
            <Badge variant="default">{statusInfo.status}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <BodyText className="font-semibold">Submitted</BodyText>
            <BodyText>{new Date(statusInfo.submittedAt).toLocaleString()}</BodyText>
          </div>
          
          {statusInfo.approvedAt && (
            <div>
              <BodyText className="font-semibold">Approved</BodyText>
              <BodyText>{new Date(statusInfo.approvedAt).toLocaleString()}</BodyText>
              {statusInfo.approver && (
                <BodyText className="text-gray-400">By {statusInfo.approver.name}</BodyText>
              )}
            </div>
          )}
          
          {statusInfo.rejectedAt && (
            <div>
              <BodyText className="font-semibold">Rejected</BodyText>
              <BodyText>{new Date(statusInfo.rejectedAt).toLocaleString()}</BodyText>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
