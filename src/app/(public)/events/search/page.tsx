'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { SectionHeader } from '@/components/atoms/Typography';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/ui/input';

export default function EventsSearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    const res = await fetch(`/api/events/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(data.data?.events || []);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-6">
      <SectionHeader>Search Events</SectionHeader>
      <Card variant="gvteway" className="mt-6">
        <CardHeader>
          <CardTitle>Find Your Perfect Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search events..."
              className="flex-1"
            />
            <Button variant="primary" onClick={handleSearch}>
              Search
            </Button>
          </div>
          {isLoading ? (
            <p>Searching...</p>
          ) : (
            <div className="space-y-4">
              {results.map((event) => (
                <Card key={event.id} variant="default">
                  <CardContent>
                    <h3 className="font-bold">{event.name}</h3>
                    <p className="text-sm text-gray-600">{event.venue?.name}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
