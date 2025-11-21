/**
 * Issues Page - UI Rebuild
 * Report and track production issues
 */

'use client';

import * as React from 'react';
import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface Issue {
  id: string;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  reportedBy: string;
  reportedDate: string;
  category: string;
}

export default function IssuesPage() {
  const [loading, setLoading] = React.useState(true);
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const router = useRouter();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ issues: Issue[] }>('/api/compvss/issues');
        if (response.data?.issues) setIssues(response.data.issues);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getSeverityIcon = (severity: Issue['severity']) => {
    switch (severity) {
      case 'CRITICAL': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'HIGH': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'MEDIUM': return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'LOW': return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getSeverityColor = (severity: Issue['severity']) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      case 'HIGH': return 'bg-orange-100 text-orange-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar variant="compvss" />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar variant="compvss" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <div>
            <H1 className="mb-4">Issue Reports</H1>
            <Body className="text-gray-600">
              Track and resolve production issues
            </Body>
          </div>
          <Button variant="compvss" onClick={() => router.push('/compvss/issues/new')}>
            Report Issue
          </Button>
        </div>

        <div className="space-y-4">
          {issues.map((issue) => (
            <Card 
              key={issue.id} 
              variant="compvss"
              className="cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => router.push(`/compvss/issues/${issue.id}`)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(issue.severity)}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={issue.status === 'RESOLVED' ? 'default' : 'outline'}>
                          {issue.status.replace('_', ' ')}
                        </Badge>
                        <Body className={`text-xs px-2 py-1 rounded ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </Body>
                        <Badge variant="outline">{issue.category}</Badge>
                      </div>
                      <CardTitle>{issue.title}</CardTitle>
                      <CardDescription>{issue.description}</CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Body className="text-sm text-gray-600">
                  Reported by {issue.reportedBy} on {new Date(issue.reportedDate).toLocaleDateString()}
                </Body>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}