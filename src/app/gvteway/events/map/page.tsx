'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, List, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useEvents } from '@/lib/hooks/gvteway/useEvents';

export default function EventsMapPage() {
  const [view, setView] = useState<'map' | 'list'>('map');
  const { data: eventsData, isLoading, isError } = useEvents();
  const events = eventsData?.events || [];

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

  if (isError || !events) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <h2 className="text-xl font-bebas mb-2">Failed to Load Events</h2>
            <p className="text-gray-400">Unable to load events map</p>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-5xl font-bebas gvteway-text-gradient">EVENTS MAP</h1>
                <div className="flex gap-2">
                  <Button
                    variant={view === 'map' ? 'gvteway' : 'outline'}
                    onClick={() => setView('map')}
                  >
                    <MapPin className="w-5 h-5 mr-2" />
                    Map
                  </Button>
                  <Button
                    variant={view === 'list' ? 'gvteway' : 'outline'}
                    onClick={() => setView('list')}
                  >
                    <List className="w-5 h-5 mr-2" />
                    List
                  </Button>
                </div>
              </div>

              {view === 'map' ? (
                <Card variant="gvteway" className="bg-gray-900/50">
                  <CardContent className="p-0">
                    <div className="h-[600px] bg-gray-800 rounded-xl flex items-center justify-center">
                      <p className="text-gray-400">Map integration (Mapbox) - {events.length} events nearby</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <Card key={event.id} variant="gvteway" className="bg-gray-900/50">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bebas text-white">{event.name}</h3>
                            <p className="text-gray-400">{event.location || 'Location TBA'}</p>
                          </div>
                          <Button variant="gvteway" size="sm">View</Button>
                        </div>
                      </CardContent>
                    </Card>
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
