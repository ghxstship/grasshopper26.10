'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useBookings } from '@/lib/hooks/gvteway';

export default function BookingsPage() {
  const { data: bookingsData, isLoading, error } = useBookings();
  const bookings = bookingsData || [];

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gvteway-red-500" />
        </div>
      </GvtewayLayout>
    );
  }

  if (error || !bookings) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 pb-16 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-error mx-auto mb-4" />
            <p className="text-white mb-4">Failed to load bookings</p>
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
              <h1 className="text-5xl font-bebas mb-8 gvteway-text-gradient">MY BOOKINGS</h1>

              <div className="space-y-4">
                {bookings.map((booking) => (
                  <Card key={booking.id} variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bebas text-white">{booking.adventureTitle}</h3>
                            <Badge variant={booking.status === 'CONFIRMED' ? 'gvteway' : 'default'}>
                              {booking.status}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {new Date(booking.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {booking.venue}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bebas text-gvteway-red-500">${booking.price.toFixed(2)}</p>
                          <p className="text-sm text-gray-400">{booking.eventName}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
