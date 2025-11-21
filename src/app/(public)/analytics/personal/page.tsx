'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function PersonalAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/analytics/personal')
      .then(res => res.json())
      .then(data => setAnalytics(data.data));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Personal Analytics</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${analytics?.summary?.totalSpent || 0}</p>
          </CardContent>
        </Card>
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>Events Attended</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.summary?.eventsAttended || 0}</p>
          </CardContent>
        </Card>
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>Tickets Owned</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.summary?.ticketsOwned || 0}</p>
          </CardContent>
        </Card>
        <Card variant="gvteway">
          <CardHeader>
            <CardTitle>Loyalty Points</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.summary?.loyaltyPoints || 0}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
