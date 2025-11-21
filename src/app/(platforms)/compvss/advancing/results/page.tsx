/**
 * Advancing Results Page - UI Rebuild
 * View completed advancing requests and outcomes
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { H1, Body, Caption } from '@/components/ui-rebuild/atoms/Typography';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui-rebuild/atoms/Card';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { apiClient } from '@/lib/api/client';

interface CompletedRequest {
  id: string;
  requestNumber: string;
  type: string;
  title: string;
  completedDate: string;
  outcome: string;
  notes?: string;
}

export default function ResultsPage() {
  const [loading, setLoading] = React.useState(true);
  const [results, setResults] = React.useState<CompletedRequest[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  React.useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
        if (token) {
          apiClient.setAuthToken(token);
        }

        const params: Record<string, string> = {};
        if (searchQuery) params.search = searchQuery;

        const response = await apiClient.get<{ results: CompletedRequest[] }>('/api/compvss/advancing/results', { params });
        if (response.data?.results) {
          setResults(response.data.results);
        }
      } catch (error) {
        console.error('Failed to fetch results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery]);

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
        <div className="mb-8">
          <H1 className="mb-2">Advancing Results</H1>
          <Body className="text-gray-600">{results.length} completed requests</Body>
        </div>

        <div className="mb-8">
          <SearchBar
            placeholder="Search completed requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery('')}
            loading={loading}
          />
        </div>

        <div className="space-y-4">
          {results.map((result) => (
            <Link key={result.id} href={`/compvss/advancing/requests/${result.id}`}>
              <Card className="hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all cursor-pointer">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex gap-2">
                      <Badge>{result.outcome}</Badge>
                    </div>
                    <Caption className="text-gray-500">{result.requestNumber}</Caption>
                  </div>
                  <CardTitle>{result.title}</CardTitle>
                  <CardDescription className="capitalize">{result.type.replace(/-/g, ' ')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Caption className="text-gray-500">
                      Completed: {new Date(result.completedDate).toLocaleDateString()}
                    </Caption>
                  </div>
                  {result.notes && (
                    <Body className="mt-2 text-gray-600">{result.notes}</Body>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}

          {results.length === 0 && (
            <Card variant="compvss">
              <CardContent className="p-12 text-center">
                <Body className="text-gray-500">No completed requests found</Body>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
