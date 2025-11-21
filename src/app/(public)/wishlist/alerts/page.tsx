'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';

export default function WishlistAlertsPage() {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/alerts')
      .then(res => res.json())
      .then(data => setAlerts(data.data?.alerts || []));
  }, []);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Price Alerts</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Your Active Alerts</CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <p>No active alerts</p>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded">
                  <p className="font-bold">{alert.eventName}</p>
                  <p className="text-sm">Alert when price drops below ${alert.targetPrice}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
