'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, X, Loader2, Clock, TrendingUp } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { Input } from '@/components/atoms/Input';
import { Card } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import Link from 'next/link';

export interface SearchResult {
  id: string;
  type: 'event' | 'product' | 'task' | 'project' | 'user' | 'page';
  title: string;
  description?: string;
  url: string;
  metadata?: Record<string, unknown>;
}

export interface GlobalSearchProps {
  placeholder?: string;
  onResultClick?: (result: SearchResult) => void;
  variant?: 'gvteway' | 'compvss' | 'atlvs';
}

export function GlobalSearch({ 
  placeholder = 'Search...', 
  onResultClick,
  variant = 'gvteway'
}: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    // Lazy initialization from localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { search, results, isLoading, clearResults } = useSearch();

  // Handle search input change
  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
    if (value.trim()) {
      search(value);
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [search]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K to focus search
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }

      // Escape to close
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleResultClick = useCallback((result: SearchResult) => {
    // Save to recent searches
    const updated = [query, ...recentSearches.filter(s => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));

    // Clear and close
    setQuery('');
    setIsOpen(false);
    clearResults();

    // Call custom handler
    if (onResultClick) {
      onResultClick(result);
    }
  }, [query, recentSearches, onResultClick, clearResults]);

  const handleRecentSearchClick = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    search(searchQuery);
    setIsOpen(true);
  }, [search]);

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  }, []);

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'event': return 'bg-gvteway-red-500/20 text-gvteway-red-500';
      case 'product': return 'bg-compvss-cyan-500/20 text-compvss-cyan-500';
      case 'task': return 'bg-atlvs-purple-500/20 text-atlvs-purple-500';
      case 'project': return 'bg-atlvs-purple-500/20 text-atlvs-purple-500';
      case 'user': return 'bg-gray-500/20 text-gray-400';
      case 'page': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <Input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          className="pl-10 pr-10 bg-black/50 border-gray-700"
          variant={variant}
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              clearResults();
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 animate-spin" />
        )}
      </div>

      {/* Keyboard Shortcut Hint */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs text-gray-500 bg-gray-800 border border-gray-700 rounded">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Results Dropdown */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto bg-gray-900 border-gray-700 shadow-2xl z-50">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  Recent Searches
                </div>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search Results */}
          {query && results.length > 0 && (
            <div className="p-2">
              {results.map((result: SearchResult) => (
                <Link
                  key={result.id}
                  href={result.url}
                  onClick={() => handleResultClick(result)}
                  className="block p-3 hover:bg-gray-800 rounded transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                          {result.type}
                        </Badge>
                        <h4 className="text-sm font-medium text-white truncate">
                          {result.title}
                        </h4>
                      </div>
                      {result.description && (
                        <p className="text-xs text-gray-400 line-clamp-2">
                          {result.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* No Results */}
          {query && !isLoading && results.length === 0 && (
            <div className="p-8 text-center text-gray-500">
              <p className="text-sm">No results found for &quot;{query}&quot;</p>
              <p className="text-xs mt-2">Try different keywords or check your spelling</p>
            </div>
          )}

          {/* Trending/Popular (when no query) */}
          {!query && recentSearches.length === 0 && (
            <div className="p-4">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                <TrendingUp className="w-4 h-4" />
                Popular Searches
              </div>
              <div className="space-y-2">
                {['Events', 'Tickets', 'Projects', 'Tasks'].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleRecentSearchClick(term)}
                    className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
