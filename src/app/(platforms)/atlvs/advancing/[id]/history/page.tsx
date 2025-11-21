'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { H2, BodyText, BodyTextSmall } from '@/components/atoms/Typography';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';

interface HistoryEntry {
  id: string;
  action: string;
  userId: string;
  notes?: string;
  createdAt: string;
  user?: { name: string };
}

export default function AdvancingHistoryPage({ params }: { params: { id: string } }) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const fetchHistory = async () => {
    const response = await fetch(`/api/atlvs/advancing/${params.id}/history`);
    if (response.ok) {
      const data = await response.json();
      setHistory(data);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [params.id]);

  return (
    <div className="container mx-auto p-6">
      <H2>Advancing Request History</H2>
      
      <div className="mt-6 space-y-4">
        {history.map((entry) => (
          <Card key={entry.id} variant="atlvs">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>{entry.action}</CardTitle>
                <Badge variant="default">{new Date(entry.createdAt).toLocaleDateString()}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <BodyText>{entry.notes || 'No notes provided'}</BodyText>
              <BodyTextSmall className="mt-2 text-gray-400">
                By {entry.user?.name || 'Unknown'}
              </BodyTextSmall>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
