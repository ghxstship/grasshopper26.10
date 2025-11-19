'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Star, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { useVenue, useEvents } from '@/lib/hooks/gvteway';
import { BodyText, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/events/venue/[id]

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
            <BodyText className="text-white mb-4">Failed to load venue</BodyText>
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
                  <h1 className="text-white mb-4">{venue.name}</h1>
                  
                  <div className="space-y-3 mb-8 text-grey-300">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3" />
                      {venue.address}, {venue.city}, {venue.state} {venue.postalCode}
                    </div>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 mr-3 text-warning" />
                      Capacity: {venue.capacity.toLocaleString()}
                    </div>
                  </div>

                  <SectionHeader className="text-white mb-6">Upcoming Events</SectionHeader>
                  <div className="grid md:grid-cols-2 gap-6">
                    {events && events.length > 0 ? (
                      events.map((event) => (
                        <Link key={event.id} href={`/gvteway/events/${event.id}`}>
                          <Card variant="gvteway" className="bg-grey-900/50 hover:scale-105 transition-transform cursor-pointer">
                            <CardContent className="p-6">
                              <h3 className="text-white mb-2">{event.name}</h3>
                              <div className="flex items-center text-grey-400 text-body-sm mb-3">
                                <Calendar className="w-4 h-4 mr-2" />
                                {new Date(event.startDate).toLocaleDateString()}
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-gvteway-red-500">View Event</span>
                                <Button variant="gvteway" size="sm">Get Tickets</Button>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))
                    ) : (
                      <BodyText className="text-grey-400 col-span-2">No upcoming events</BodyText>
                    )}
                  </div>
                </div>

                <div>
                  <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm sticky top-24">
                    <CardContent className="p-6">
                      <SubsectionHeader className="text-white mb-4">Venue Information</SubsectionHeader>
                      <div className="space-y-4 text-body-sm">
                        <div>
                          <BodyText className="text-grey-400">Capacity</BodyText>
                          <p className="text-white">{venue.capacity.toLocaleString()}</p>
                        </div>
                        <div>
                          <BodyText className="text-grey-400">Type</BodyText>
                          <BodyText className="text-white">Arena</BodyText>
                        </div>
                        <div>
                          <BodyText className="text-grey-400">Parking</BodyText>
                          <BodyText className="text-white">Available</BodyText>
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
