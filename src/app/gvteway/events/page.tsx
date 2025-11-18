'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, Grid, List, SlidersHorizontal, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useEvents } from '@/lib/hooks/gvteway/useEvents';
import { useDebounce } from 'use-debounce';
import { EVENT_CATEGORIES } from '@/lib/constants/categories';

export default function EventsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  
  const { data: eventsData, isLoading, error, refetch } = useEvents();
  
  const events = useMemo(() => eventsData?.events || [], [eventsData]);
  
  const filteredEvents = useMemo(() => {
    if (!events) return [];
    
    return events.filter(event => {
      const categoryMatch = selectedCategory === 'All' || event.categoryId === selectedCategory;
      const searchMatch = !debouncedSearch || 
        event.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.description?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.location?.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      return categoryMatch && searchMatch;
    });
  }, [events, selectedCategory, debouncedSearch]);
  
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading events...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }
  
  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Events</h2>
            <p className="text-gray-400 mb-4">{error.message}</p>
            <Button variant="gvteway" onClick={() => refetch()}>
              Try Again
            </Button>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-b from-gray-900 to-black" role="search" aria-label="Event search">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient" id="page-title">
                DISCOVER EVENTS
              </h1>
              <p className="text-xl text-gray-400 font-oswald mb-8">
                Find your next unforgettable experience
              </p>

              {/* Search Bar */}
              <div className="flex flex-col sm:flex-row gap-4" role="search">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
                  <Input
                    placeholder="Search events, artists, venues..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-14 text-lg"
                    aria-label="Search events, artists, and venues"
                  />
                </div>
                <Button variant="gvteway" size="lg" className="h-14 px-8" aria-label="Submit search">
                  <Search className="w-5 h-5 mr-2" aria-hidden="true" />
                  Search
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filters & Controls */}
        <section className="px-4 sm:px-6 lg:px-8 py-8 border-b border-gray-800" role="toolbar" aria-label="Event filters and view controls">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Category Filters */}
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
                {EVENT_CATEGORIES.map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? 'gvteway' : 'ghost'}
                    size="sm"
                    className="rounded-full"
                    aria-pressed={selectedCategory === category}
                    aria-label={`Filter by ${category}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" aria-label="Open additional filters">
                  <SlidersHorizontal className="w-4 h-4 mr-2" aria-hidden="true" />
                  More Filters
                </Button>
                <div className="flex gap-2" role="group" aria-label="Change view mode">
                  <Button
                    onClick={() => setViewMode('grid')}
                    variant={viewMode === 'grid' ? 'gvteway' : 'ghost'}
                    size="sm"
                    className="p-2"
                    aria-pressed={viewMode === 'grid'}
                    aria-label="Grid view"
                  >
                    <Grid className="w-5 h-5" aria-hidden="true" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'gvteway' : 'ghost'}
                    size="sm"
                    className="p-2"
                    aria-pressed={viewMode === 'list'}
                    aria-label="List view"
                  >
                    <List className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Events Grid/List */}
        <section className="px-4 sm:px-6 lg:px-8 py-12" aria-labelledby="events-heading">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bebas text-white" id="events-heading">
                {selectedCategory === 'All' ? 'All Events' : `${selectedCategory} Events`}
              </h2>
              <p className="text-gray-400">{filteredEvents.length} events found</p>
            </div>

            <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
              {filteredEvents.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Link href={`/gvteway/events/${event.id}`}>
                    <Card variant="gvteway" className="overflow-hidden hover:scale-105 transition-transform cursor-pointer bg-gray-900/50 backdrop-blur-sm">
                      <div className="relative h-48 bg-gray-800">
                        {event.featured && (
                          <Badge variant="gvteway" className="absolute top-4 right-4 z-10">
                            Featured
                          </Badge>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <Badge variant="gvteway-outline" className="mb-2">
                            Event
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bebas text-white mb-2">{event.name}</h3>
                        <div className="space-y-2 text-sm text-gray-400">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {new Date(event.startDate).toLocaleDateString()} • {new Date(event.startDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location || 'Location TBA'}
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between">
                          <span className="text-2xl font-bebas text-gvteway-red-500">
                            From $0
                          </span>
                          <Button variant="gvteway" size="sm" rounded="full">
                            Get Tickets
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </GvtewayLayout>
  );
}
