'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/analytics/recommendations')
      .then(res => res.json())
      .then(data => setRecommendations(data.data?.recommendations || []));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Recommended For You</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {recommendations.map((event) => (
          <Card key={event.id} variant="gvteway">
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{event.venue?.name}</p>
              <p className="text-sm text-gray-600">Match: {event.matchScore}%</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
