'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/atlvs/reports')
      .then(res => res.json())
      .then(data => {
        setReports(data.data?.reports || []);
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Reports</SectionHeader>
      <div className="flex justify-end mb-6">
        <Button variant="atlvs">Create Report</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          <p>Loading reports...</p>
        ) : reports.length === 0 ? (
          <Card variant="atlvs">
            <CardContent>
              <p>No reports yet</p>
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => (
            <Card key={report.id} variant="atlvs">
              <CardHeader>
                <CardTitle>{report.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">Type: {report.type}</p>
                <p className="text-sm text-gray-600">
                  Created: {new Date(report.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
