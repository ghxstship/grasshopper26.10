'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Calendar, MapPin, Filter, Loader2 } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Card, CardContent } from '@/components/atoms/Card';
import { useEvents } from '@/lib/hooks/gvteway/useEvents';

export default function EventSearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: eventsData, isLoading } = useEvents({ search: searchQuery });
  const events = eventsData?.events || [];

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Searching events...</p>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  const results = events || [];

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-20 pb-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">SEARCH EVENTS</h1>
              
              <div className="flex gap-4 mb-8">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search events, artists, venues..."
                    className="pl-12 h-14"
                  />
                </div>
                <Button variant="outline" size="lg">
                  <Filter className="w-5 h-5 mr-2" />
                  Filters
                </Button>
              </div>

              <p className="text-gray-400 mb-6">Found {results.length} events</p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link href={`/gvteway/events/${event.id}`}>
                      <Card variant="gvteway" className="bg-gray-900/50 hover:scale-105 transition-transform cursor-pointer">
                        <div className="h-48 bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20" />
                        <CardContent className="p-6">
                          <h3 className="text-xl font-bebas text-white mb-3">{event.name}</h3>
                          <div className="space-y-2 text-sm text-gray-400 mb-4">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(event.startDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location || 'TBA'}
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-2xl font-bebas text-gvteway-red-500">From $0</span>
                            <Button variant="gvteway" size="sm">View</Button>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
