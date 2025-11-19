'use client';
import { ListPageTemplate } from '@/components/templates/ListPageTemplate';
import { Search } from 'lucide-react';
import { Input } from '@/components/atoms/Input';
import { useState } from 'react';

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/events/search

export default function SearchPage() {
  const [query, setQuery] = useState('');
  return (
    <ListPageTemplate title="Search Events" description="Find your next experience">
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ghxst-text-secondary" />
          <Input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events, artists, venues..."
            className="pl-12"
          />
        </div>
      </div>
      <div className="card p-8 text-center">
        <p className="text-ghxst-text-secondary">
          {query ? `Searching for "${query}"...` : 'Enter a search term to find events'}
        </p>
      </div>
    </ListPageTemplate>
  );
}
