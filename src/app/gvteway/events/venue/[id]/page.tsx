'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useVenue, useEvents } from '@/lib/hooks/gvteway';

export default function VenuePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: venue, isLoading: venueLoading, isError: venueError } = useVenue(id);
  const { data: eventsData } = useEvents();
  const events = eventsData?.events || [];

  if (venueLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gvteway-red-500" />
        </div>
      </GvtewayLayout>
    );
  }

  if (venueError || !venue) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <p className="text-white mb-4">Failed to load venue</p>
            <Button variant="gvteway" onClick={() => window.location.reload()}>
              Retry
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="h-96 bg-gradient-to-br from-gvteway-red-500/20 to-gvteway-blue-500/20 rounded-2xl mb-8" />
              
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <h1 className="text-5xl font-bebas text-white mb-4">{venue.name}</h1>
                  
                  <div className="space-y-3 mb-8 text-gray-300">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3" />
                      {venue.address}, {venue.city}, {venue.state} {venue.postalCode}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-3 text-warning" />
                      Capacity: {venue.capacity.toLocaleString()}
                    </div>
                  </div>

                  <h2 className="text-3xl font-bebas text-white mb-6">Upcoming Events</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    {events && events.length > 0 ? (
                      events.map((event) => (
                        <Link key={event.id} href={`/gvteway/events/${event.id}`}>
                          <Card variant="gvteway" className="bg-gray-900/50 hover:scale-105 transition-transform cursor-pointer">
                            <CardContent className="p-6">
                              <h3 className="text-xl font-bebas text-white mb-2">{event.name}</h3>
                              <div className="flex items-center text-gray-400 text-sm mb-3">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(event.startDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bebas text-gvteway-red-500">View Event</span>
                                <Button variant="gvteway" size="sm">Get Tickets</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <p className="text-gray-400 col-span-2">No upcoming events</p>
                    )}
                  </div>
                </div>

                <div>
                  <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm sticky top-24">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bebas text-white mb-4">Venue Information</h3>
                      <div className="space-y-4 text-sm">
                        <div>
                          <p className="text-gray-400">Capacity</p>
                          <p className="text-white font-medium">{venue.capacity.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Type</p>
                          <p className="text-white font-medium">Arena</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Parking</p>
                          <p className="text-white font-medium">Available</p>
                        </div>
                      </div>
                      <Button variant="gvteway" className="w-full mt-6">View on Map</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
