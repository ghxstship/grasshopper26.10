/**
 * Search Page - UI Rebuild
 * Global search across events, products, and content
 */

'use client';

import * as React from 'react';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { H1, H3, Body } from '@/components/ui-rebuild/atoms/Typography';
import { Button } from '@/components/ui-rebuild/atoms/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui-rebuild/atoms/Card';
import { SearchBar } from '@/components/ui-rebuild/molecules/SearchBar';
import { Badge } from '@/components/ui-rebuild/atoms/Badge';
import { Spinner } from '@/components/ui-rebuild/atoms/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui-rebuild/molecules/Tabs';
import { Navbar } from '@/components/ui-rebuild/organisms/Navbar';
import { Footer } from '@/components/ui-rebuild/organisms/Footer';
import { apiClient } from '@/lib/api/client';

interface SearchResults {
  events: Array<{
    id: string;
    name: string;
    startDate: string;
    venue: string;
  }>;
  products: Array<{
    id: string;
    name: string;
    price: number;
    currency: string;
  }>;
  adventures: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = React.useState(initialQuery);
  const [results, setResults] = React.useState<SearchResults>({ events: [], products: [], adventures: [] });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, [initialQuery]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const response = await apiClient.get<SearchResults>('/api/search', {
        params: { q: searchQuery },
      });

      if (response.data) {
        setResults(response.data);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(query);
  };

  const totalResults = results.events.length + results.products.length + results.adventures.length;

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <H1 className="mb-8">Search</H1>
          <form onSubmit={handleSearch}>
            <SearchBar
              placeholder="Search events, products, adventures..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => {
                setQuery('');
                setResults({ events: [], products: [], adventures: [] });
              }}
              loading={loading}
            />
          </form>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Spinner size="xl" />
          </div>
        ) : query && totalResults === 0 ? (
          <Card>
            <CardContent className="py-24 text-center">
              <H3 className="mb-4">No results found</H3>
              <Body className="text-gray-600">
                Try different keywords or browse our categories.
              </Body>
            </CardContent>
          </Card>
        ) : query ? (
          <>
            <div className="mb-8">
              <Body className="text-gray-600">
                Found {totalResults} results for &quot;{query}&quot;
              </Body>
            </div>

            <Tabs defaultValue="all">
              <TabsList>
                <TabsTrigger value="all">All ({totalResults})</TabsTrigger>
                <TabsTrigger value="events">Events ({results.events.length})</TabsTrigger>
                <TabsTrigger value="products">Products ({results.products.length})</TabsTrigger>
                <TabsTrigger value="adventures">Adventures ({results.adventures.length})</TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="space-y-8">
                  {results.events.length > 0 && (
                    <div>
                      <H3 className="mb-4">Events</H3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.events.map((event) => (
                          <Card key={event.id}>
                            <CardHeader>
                              <CardTitle>{event.name}</CardTitle>
                              <CardDescription>
                                {new Date(event.startDate).toLocaleDateString()} • {event.venue}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter>
                              <Link href={`/(rebuild)/events/${event.id}`} className="w-full">
                                <Button variant="secondary" fullWidth>View Event</Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.products.length > 0 && (
                    <div>
                      <H3 className="mb-4">Products</H3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {results.products.map((product) => (
                          <Card key={product.id}>
                            <CardHeader>
                              <CardTitle>{product.name}</CardTitle>
                              <CardDescription>
                                {new Intl.NumberFormat('en-US', {
                                  style: 'currency',
                                  currency: product.currency,
                                }).format(product.price)}
                              </CardDescription>
                            </CardHeader>
                            <CardFooter>
                              <Link href={`/(rebuild)/marketplace/${product.id}`} className="w-full">
                                <Button variant="secondary" fullWidth>View Product</Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  {results.adventures.length > 0 && (
                    <div>
                      <H3 className="mb-4">Adventures</H3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.adventures.map((adventure) => (
                          <Card key={adventure.id}>
                            <CardHeader>
                              <Badge variant="outline">{adventure.type}</Badge>
                              <CardTitle>{adventure.name}</CardTitle>
                            </CardHeader>
                            <CardFooter>
                              <Link href={`/(rebuild)/adventures/${adventure.id}`} className="w-full">
                                <Button variant="secondary" fullWidth>View Adventure</Button>
                              </Link>
                            </CardFooter>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="events">
                {results.events.length === 0 ? (
                  <Body className="text-center py-12 text-gray-600">No events found</Body>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.events.map((event) => (
                      <Card key={event.id}>
                        <CardHeader>
                          <CardTitle>{event.name}</CardTitle>
                          <CardDescription>
                            {new Date(event.startDate).toLocaleDateString()} • {event.venue}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Link href={`/(rebuild)/events/${event.id}`} className="w-full">
                            <Button variant="secondary" fullWidth>View Event</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="products">
                {results.products.length === 0 ? (
                  <Body className="text-center py-12 text-gray-600">No products found</Body>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {results.products.map((product) => (
                      <Card key={product.id}>
                        <CardHeader>
                          <CardTitle>{product.name}</CardTitle>
                          <CardDescription>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: product.currency,
                            }).format(product.price)}
                          </CardDescription>
                        </CardHeader>
                        <CardFooter>
                          <Link href={`/(rebuild)/marketplace/${product.id}`} className="w-full">
                            <Button variant="secondary" fullWidth>View Product</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="adventures">
                {results.adventures.length === 0 ? (
                  <Body className="text-center py-12 text-gray-600">No adventures found</Body>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.adventures.map((adventure) => (
                      <Card key={adventure.id}>
                        <CardHeader>
                          <Badge variant="outline">{adventure.type}</Badge>
                          <CardTitle>{adventure.name}</CardTitle>
                        </CardHeader>
                        <CardFooter>
                          <Link href={`/(rebuild)/adventures/${adventure.id}`} className="w-full">
                            <Button variant="secondary" fullWidth>View Adventure</Button>
                          </Link>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <Card>
            <CardContent className="py-24 text-center">
              <Body className="text-gray-600">
                Enter a search term to find events, products, and adventures.
              </Body>
            </CardContent>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
