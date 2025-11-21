'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function ReferralAnalyticsPage() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetch('/api/compvss/referrals/analytics')
      .then(res => res.json())
      .then(data => setAnalytics(data.data));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Referral Analytics</SectionHeader>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.overview?.totalClicks || 0}</p>
          </CardContent>
        </Card>
        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Conversions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.overview?.totalConversions || 0}</p>
          </CardContent>
        </Card>
        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">${analytics?.overview?.totalRevenue || 0}</p>
          </CardContent>
        </Card>
        <Card variant="compvss">
          <CardHeader>
            <CardTitle>Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics?.overview?.conversionRate?.toFixed(1) || 0}%</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
