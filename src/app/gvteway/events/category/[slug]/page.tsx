'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Filter, Grid, List, Loader2, MapPin } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Select } from '@/components/atoms/Select';
import { useEvents } from '@/lib/hooks/gvteway/useEvents';

const CATEGORIES = {
  music: { name: 'Music', icon: '🎵', color: 'from-gvteway-red-500 to-pink-500' },
  sports: { name: 'Sports', icon: '⚽', color: 'from-gvteway-blue-500 to-cyan-500' },
  comedy: { name: 'Comedy', icon: '😂', color: 'from-purple-500 to-pink-500' },
  theater: { name: 'Theater', icon: '🎭', color: 'from-green-500 to-emerald-500' },
};

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const category = CATEGORIES[params.slug as keyof typeof CATEGORIES] || CATEGORIES.music;

  // Fetch events with category filter
  const { data: eventsData, isLoading, error, refetch } = useEvents({ 
    category: params.slug 
  });

  // Transform and filter events
  const displayEvents = useMemo(() => {
    if (!eventsData?.events) return [];
    
    let filtered = eventsData.events;
    
    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter((event: any) => {
        const eventDate = new Date(event.startDate);
        
        if (dateFilter === 'week') {
          const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
          return eventDate >= now && eventDate <= weekFromNow;
        } else if (dateFilter === 'month') {
          const monthFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          return eventDate >= now && eventDate <= monthFromNow;
        } else if (dateFilter === 'year') {
          const yearFromNow = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          return eventDate >= now && eventDate <= yearFromNow;
        }
        return true;
      });
    }
    
    return filtered;
  }, [eventsData, dateFilter]);

  // Loading state
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading {category.name.toLowerCase()} events...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-h5 font-bebas mb-2">Failed to Load Events</h2>
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
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Header */}
              <div className={`relative mb-12 p-12 rounded-2xl bg-gradient-to-br ${category.color}`}>
                <div className="relative z-10">
                  <div className="text-h1 mb-4">{category.icon}</div>
                  <h1 className="text-h1 font-bebas text-white mb-4">
                    {category.name.toUpperCase()} EVENTS
                  </h1>
                  <p className="text-h5 text-white/90">
                    Discover the best {category.name.toLowerCase()} events near you
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                  <Select 
                    variant="gvteway"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  >
                    <option value="all">All Dates</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                    <option value="year">This Year</option>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() => setViewMode('grid')}
                    variant={viewMode === 'grid' ? 'gvteway' : 'outline'}
                    size="sm"
                  >
                    <Grid className="w-5 h-5" />
                  </Button>
                  <Button
                    onClick={() => setViewMode('list')}
                    variant={viewMode === 'list' ? 'gvteway' : 'outline'}
                    size="sm"
                  >
                    <List className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Events Grid */}
              {displayEvents.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-h6">No {category.name.toLowerCase()} events found.</p>
                </div>
              ) : (
                <div className={viewMode === 'grid' ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                  {displayEvents.map((event: any, index: number) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Link href={`/gvteway/events/${event.id}`}>
                        <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm overflow-hidden hover:scale-105 transition-transform cursor-pointer">
                          <div className="relative h-48 bg-gradient-to-br from-gray-800 to-gray-900" />
                          <CardContent className="p-6">
                            <Badge variant="gvteway" className="mb-3">{category.name}</Badge>
                            <h3 className="text-h5 font-bebas text-white mb-2">{event.title}</h3>
                            <div className="space-y-2 text-body-sm text-gray-400 mb-4">
                              <div className="flex items-center">
                                <Calendar className="w-4 h-4 mr-2" />
                                {event.startDate ? new Date(event.startDate).toLocaleDateString() : 'TBA'}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-2" />
                                {event.venue?.name || 'Venue TBA'}
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-h4 font-bebas text-gvteway-red-500">
                                ${event.ticketTypes?.[0]?.price || '0.00'}
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
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
