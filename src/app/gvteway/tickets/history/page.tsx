'use client';


export const dynamic = 'force-dynamic';
export const runtime = 'edge';
import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { GvtewayLayout } from '@/components/templates/GvtewayLayout';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useTickets } from '@/lib/hooks/gvteway/useTickets';

export default function TicketHistoryPage() {
  const { data: ticketsData, isLoading, error, refetch } = useTickets();
  
  const history = useMemo(() => {
    if (ticketsData?.tickets) {
      return ticketsData.tickets
        .filter((t: any) => t.status === 'USED')
        .map((t: any) => ({
          id: t.id,
          event: t.event?.title || 'Event',
          date: t.event?.startDate ? new Date(t.event.startDate).toLocaleDateString() : '',
          venue: t.event?.venue?.name || 'Venue',
          attended: true,
        }));
    }
    return Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      event: `Past Event ${i + 1}`,
      date: '2024-06-15',
      venue: 'Madison Square Garden',
      attended: i % 2 === 0,
    }));
  }, [ticketsData]);

  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading ticket history...</p>
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
            <h2 className="text-h5 font-bebas mb-2">Failed to Load History</h2>
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
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-h1 font-anton mb-8 gvteway-text-gradient">TICKET HISTORY</h1>
              <div className="space-y-4">
                {history.map((item) => (
                  <Card key={item.id} variant="gvteway" className="bg-gray-900/50">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-h5 font-bebas text-white mb-2">{item.event}</h3>
                          <div className="flex gap-4 text-body-sm text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {item.date}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-2" />
                              {item.venue}
                            </div>
                          </div>
                        </div>
                        {item.attended && (
                          <Badge variant="gvteway">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Attended
                          </Badge>
                        )}
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
