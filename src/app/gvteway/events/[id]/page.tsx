'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Clock, Users, Heart, Share2, Star, Ticket, ChevronRight, Info, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useEvent } from '@/lib/hooks/gvteway/useEvents';
import { BodyText, SectionHeader, SubsectionHeader } from "@/components/atoms/Typography";

// This component calls: /Users/julianclarkson/Documents/Grasshopper26.10/api/gvteway/events/[id]

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const [isSaved, setIsSaved] = useState(false);
  const { data: event, isLoading, error } = useEvent(params.id);

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <BodyText className="text-grey-400">Loading event...</BodyText>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  if (error || !event) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-error" />
            <SectionHeader className="mb-2">Event Not Found</SectionHeader>
            <p className="text-grey-400 mb-4">{error?.message || 'This event could not be loaded'}</p>
            <Link href="/gvteway/events">
              <Button variant="gvteway">Browse Events</Button>
            </Link>
          </div>
        </div>
      </GvtewayLayout>
    );
  }

  return (
    <GvtewayLayout>
      <div className="min-h-screen bg-black pt-16">
        {/* Hero Image */}
        <div className="relative h-96 bg-grey-900">
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-6 lg:px-8 pb-8">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Badge variant="gvteway">{event.categoryId || 'Event'}</Badge>
                  <div className="flex items-center text-warning">
                    <Star className="w-4 h-4 fill-current mr-1" />
                    <span className="text-body-sm">{(event.metadata as any)?.rating || '4.5'}</span>
                    <span className="text-grey-400 text-body-sm ml-1">({(event.metadata as any)?.reviews || '0'} reviews)</span>
                  </div>
                </div>
                <h1 className="text-white mb-4">
                  {event.name}
                </h1>
                <div className="flex flex-wrap gap-4 text-grey-300">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {event.location || 'Location TBA'}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    {(event.metadata as any)?.attending || '0'} attending
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-8">
                {/* About */}
                <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">About This Event</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-grey-300">{event.description}</p>
                    <div className="mt-6 grid sm:grid-cols-2 gap-4">
                      <div className="flex items-start">
                        <Clock className="w-5 h-5 text-gvteway-red-500 mr-3 mt-1" />
                        <div>
                          <BodyText className="text-white">Duration</BodyText>
                          <BodyText className="text-grey-400 text-body-sm">3 Days</BodyText>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Users className="w-5 h-5 text-gvteway-red-500 mr-3 mt-1" />
                        <div>
                          <BodyText className="text-white">Capacity</BodyText>
                          <p className="text-grey-400 text-body-sm">{event.capacity.toLocaleString()} people</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Venue Info */}
                <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Venue Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <SubsectionHeader className="text-white mb-1">Venue</SubsectionHeader>
                        <p className="text-grey-400">{event.location || 'Location TBA'}</p>
                      </div>
                      <div className="h-48 bg-grey-800 rounded-lg flex items-center justify-center">
                        <MapPin className="w-8 h-8 text-grey-600" />
                        <span className="text-grey-500 ml-2">Map View</span>
                      </div>
                      <Button variant="gvteway-outline" className="w-full">
                        <MapPin className="w-4 h-4 mr-2" />
                        View on Map
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Organizer */}
                <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Organized By</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gvteway-red-500/20 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-gvteway-red-500" />
                        </div>
                        <div>
                          <BodyText className="text-white">Event Organizer</BodyText>
                          <BodyText className="text-grey-400 text-body-sm">Event Organizer</BodyText>
                        </div>
                      </div>
                      <Button variant="gvteway-outline" size="sm">
                        Follow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Ticket Card */}
                <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm sticky top-24">
                  <CardContent className="p-6">
                    <div className="text-center mb-6">
                      <BodyText className="text-grey-400 text-body-sm mb-2">Starting from</BodyText>
                      <BodyText className="text-gvteway-red-500">
                        $0
                      </BodyText>
                      <BodyText className="text-grey-400 text-body-sm">per person</BodyText>
                    </div>

                    <div className="space-y-3">
                      <Link href={`/gvteway/tickets/checkout?event=${event.id}`}>
                        <Button variant="gvteway" size="lg" className="w-full" rounded="full">
                          <Ticket className="w-5 h-5 mr-2" />
                          Get Tickets
                        </Button>
                      </Link>
                      <Button
                        variant="gvteway-outline"
                        size="lg"
                        className="w-full"
                        rounded="full"
                        onClick={() => setIsSaved(!isSaved)}
                      >
                        <Heart className={`w-5 h-5 mr-2 ${isSaved ? 'fill-current' : ''}`} />
                        {isSaved ? 'Saved' : 'Save Event'}
                      </Button>
                      <Button variant="outline" size="lg" className="w-full" rounded="full">
                        <Share2 className="w-5 h-5 mr-2" />
                        Share
                      </Button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-grey-800">
                      <div className="flex items-start text-body-sm text-grey-400">
                        <Info className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                        <BodyText >Tickets are non-refundable. See our cancellation policy for details.</BodyText>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Similar Events */}
                <Card variant="gvteway" className="bg-grey-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Similar Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Link key={i} href={`/gvteway/events/${i}`}>
                          <div className="flex gap-3 p-3 rounded-lg hover:bg-grey-800/50 transition-colors cursor-pointer">
                            <div className="w-20 h-20 bg-grey-800 rounded-lg flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-body-sm truncate">Event Title {i}</p>
                              <BodyText className="text-grey-400 text-caption mt-1">Jul 20, 2025</BodyText>
                              <BodyText className="text-gvteway-red-500 text-body-sm mt-1">$49.99</BodyText>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <Button variant="gvteway-outline" className="w-full mt-4">
                      View All
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
