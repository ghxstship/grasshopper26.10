'use client';

import { useAdvancing } from '@/hooks/atlvs/useAdvancing';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function CompvssAdvancingPage() {
  const { requests, isLoading } = useAdvancing();

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Advancing Requests</SectionHeader>
      <div className="space-y-4 mt-6">
        {isLoading ? (
          <p>Loading requests...</p>
        ) : (
          requests.map((request) => (
            <Card key={request.id} variant="compvss">
              <CardHeader>
                <CardTitle>{request.requestNumber}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Status: {request.status}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}