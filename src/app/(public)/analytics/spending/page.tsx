'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function SpendingAnalyticsPage() {
  const [spending, setSpending] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics/spending')
      .then(res => res.json())
      .then(data => setSpending(data.data));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Spending Insights</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Your Spending Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="font-bold">Total Spent</p>
              <p className="text-2xl">${spending?.totalSpent || 0}</p>
            </div>
            <div>
              <p className="font-bold">Average Per Event</p>
              <p className="text-2xl">${spending?.averagePerEvent || 0}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
