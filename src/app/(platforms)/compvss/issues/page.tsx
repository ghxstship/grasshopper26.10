/**
 * COMPVSS Issues - UI Rebuild
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface Issue {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  createdAt: string;
}

export default function CompvssIssuesPage() {
  const [issues, setIssues] = React.useState<Issue[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const response = await apiClient.get<{ issues: Issue[] }>('/api/compvss/issues');
        if (response.data?.issues) {
          setIssues(response.data.issues);
        }
      } catch (error) {
        console.error('Failed to fetch issues:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const open = issues.filter((i) => i.status === 'OPEN');
  const inProgress = issues.filter((i) => i.status === 'IN_PROGRESS');
  const resolved = issues.filter((i) => i.status === 'RESOLVED');

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex justify-center items-center py-24">
          <Spinner size="xl" />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-12">
          <div>
            <H1 className="mb-2">Issues</H1>
            <Body className="text-gray-600">{issues.length} total issues</Body>
          </div>
          <Link href="/(rebuild)/compvss/issues/new">
            <Button>Report Issue</Button>
          </Link>
        </div>

        <Tabs defaultValue="open">
          <TabsList>
            <TabsTrigger value="open">Open ({open.length})</TabsTrigger>
            <TabsTrigger value="in-progress">In Progress ({inProgress.length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolved ({resolved.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="open">
            {open.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <H3 className="mb-4">No open issues</H3>
                  <Body className="text-gray-600">All issues have been addressed</Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {open.map((issue) => (
                  <Card key={issue.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge variant="outline">{issue.category}</Badge>
                            <Badge>{issue.priority}</Badge>
                          </div>
                          <CardTitle>{issue.title}</CardTitle>
                          <CardDescription>{issue.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardFooter>
                      <Link href={`/(rebuild)/compvss/issues/${issue.id}`} className="w-full">
                        <Button variant="secondary" fullWidth>View Details</Button>
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="in-progress">
            {inProgress.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <Body className="text-gray-600">No issues in progress</Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {inProgress.map((issue) => (
                  <Card key={issue.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{issue.title}</CardTitle>
                          <CardDescription>{issue.category}</CardDescription>
                        </div>
                        <Badge>IN PROGRESS</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="resolved">
            {resolved.length === 0 ? (
              <Card>
                <CardContent className="py-24 text-center">
                  <Body className="text-gray-600">No resolved issues</Body>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {resolved.map((issue) => (
                  <Card key={issue.id} className="opacity-60">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle>{issue.title}</CardTitle>
                          <CardDescription>{issue.category}</CardDescription>
                        </div>
                        <Badge variant="ghost">RESOLVED</Badge>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
}
