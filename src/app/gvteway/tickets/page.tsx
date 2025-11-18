'use client';

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AlertCircle, Calendar, Download, Filter, Loader2, MapPin, QrCode, Share2, Ticket } from 'lucide-react';
import { GvtewayLayout } from '@/components/gvteway/shared/GvtewayLayout';
import { Button } from '@/components/atoms/Button';
import { Card, CardContent } from '@/components/atoms/Card';
import { Badge } from '@/components/atoms/Badge';
import { useTickets } from '@/lib/hooks/gvteway/useTickets';

type TicketWithEvent = {
  id: string | number;
  eventName: string;
  date: string;
  time: string;
  venue: string;
  location: string;
  ticketType: string;
  quantity: number;
  status: 'active' | 'used' | 'transferred' | 'refunded';
  qrCode: string;
};

export default function TicketsPage() {
  const [filter, setFilter] = useState<'all' | 'active' | 'used'>('all');
  
  // Use React Query hook
  const { data: ticketsData, isLoading, error, refetch } = useTickets();
  
  // Transform API tickets to match display format
  const allTickets = useMemo(() => {
    if (!ticketsData?.tickets) return [];
    
    return ticketsData.tickets.map((ticket): TicketWithEvent => ({
      id: ticket.id,
      eventName: (ticket as any).event?.title || 'Event',
      date: (ticket as any).event?.startDate ? new Date((ticket as any).event.startDate).toLocaleDateString() : '',
      time: (ticket as any).event?.startDate ? new Date((ticket as any).event.startDate).toLocaleTimeString() : '',
      venue: (ticket as any).event?.venue?.name || '',
      location: (ticket as any).event?.venue?.city || '',
      ticketType: (ticket as any).ticketType?.name || 'General',
      quantity: 1,
      status: ticket.status === 'USED' ? 'used' : 'active',
      qrCode: ticket.qrCode,
    }));
  }, [ticketsData]);

  const filteredTickets = useMemo(() => {
    return allTickets.filter(ticket => 
      filter === 'all' || ticket.status === filter
    );
  }, [allTickets, filter]);
  
  const activeCount = allTickets.filter(t => t.status === 'active').length;
  const usedCount = allTickets.filter(t => t.status === 'used').length;
  
  // Loading state
  if (isLoading) {
    return (
      <GvtewayLayout>
        <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-gvteway-red-500" />
            <p className="text-gray-400">Loading tickets...</p>
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
            <h2 className="text-xl font-bebas mb-2">Failed to Load Tickets</h2>
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
              <header className="mb-12">
                <h1 className="text-5xl sm:text-6xl font-bebas mb-4 gvteway-text-gradient">
                  MY TICKETS
                </h1>
                <p className="text-xl text-gray-400 font-oswald">
                  Manage your event tickets and passes
                </p>
              </header>

              {/* Stats Cards */}
              <div className="grid md:grid-cols-3 gap-6 mb-8" role="region" aria-label="Ticket statistics">
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Active Tickets</p>
                        <p className="text-3xl font-bebas text-white" aria-label={`${activeCount} active tickets`}>
                          {activeCount}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gvteway-red-500/20 rounded-full flex items-center justify-center">
                        <Ticket className="w-6 h-6 text-gvteway-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Upcoming Events</p>
                        <p className="text-3xl font-bebas text-white">2</p>
                      </div>
                      <div className="w-12 h-12 bg-gvteway-blue-500/20 rounded-full flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-gvteway-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Total Attended</p>
                        <p className="text-3xl font-bebas text-white" aria-label={`${usedCount} events attended`}>
                          {usedCount}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                        <QrCode className="w-6 h-6 text-atlvs-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between mb-6" role="toolbar" aria-label="Ticket filters">
                <div className="flex gap-2" role="group" aria-label="Filter by ticket status">
                  <Button
                    onClick={() => setFilter('all')}
                    variant={filter === 'all' ? 'gvteway' : 'outline'}
                    size="sm"
                    aria-pressed={filter === 'all'}
                    aria-label="Show all tickets"
                  >
                    All Tickets
                  </Button>
                  <Button
                    onClick={() => setFilter('active')}
                    variant={filter === 'active' ? 'gvteway' : 'outline'}
                    size="sm"
                    aria-pressed={filter === 'active'}
                    aria-label="Show active tickets only"
                  >
                    Active
                  </Button>
                  <Button
                    onClick={() => setFilter('used')}
                    variant={filter === 'used' ? 'gvteway' : 'outline'}
                    size="sm"
                    aria-pressed={filter === 'used'}
                    aria-label="Show past event tickets"
                  >
                    Past Events
                  </Button>
                </div>
                <Button variant="outline" size="sm" aria-label="Open additional filters">
                  <Filter className="w-4 h-4 mr-2" aria-hidden="true" />
                  More Filters
                </Button>
              </div>

              {/* Tickets List */}
              <div className="space-y-4" role="list" aria-label="Your tickets">
                {filteredTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    role="listitem"
                  >
                    <Link href={`/gvteway/tickets/${ticket.id}`} aria-label={`View details for ${ticket.eventName}`}>
                      <Card variant="gvteway" className="overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer bg-gray-900/50 backdrop-blur-sm">
                        <CardContent className="p-6">
                          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                            {/* QR Code Placeholder */}
                            <div className="w-24 h-24 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0" aria-label="QR code for ticket">
                              <QrCode className="w-12 h-12 text-gray-600" aria-hidden="true" />
                            </div>

                            {/* Ticket Info */}
                            <div className="flex-1 space-y-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h3 className="text-2xl font-bebas text-white mb-1">
                                    {ticket.eventName}
                                  </h3>
                                  <Badge variant={ticket.status === 'active' ? 'gvteway' : 'default'}>
                                    {ticket.ticketType}
                                  </Badge>
                                </div>
                                <Badge variant={ticket.status === 'active' ? 'gvteway-outline' : 'default'}>
                                  {ticket.status === 'active' ? 'Active' : 'Used'}
                                </Badge>
                              </div>

                              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-400">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {ticket.date} • {ticket.time}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {ticket.venue}, {ticket.location}
                                </div>
                              </div>

                              <div className="text-sm text-gray-400">
                                Quantity: <span className="text-white font-medium">{ticket.quantity}</span>
                              </div>
                            </div>

                            {/* Actions */}
                            {ticket.status === 'active' && (
                              <div className="flex lg:flex-col gap-2" role="group" aria-label="Ticket actions">
                                <Button variant="gvteway" size="sm" className="flex-1 lg:flex-none" aria-label="View QR code">
                                  <QrCode className="w-4 h-4 mr-2" aria-hidden="true" />
                                  View QR
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 lg:flex-none" aria-label="Download ticket">
                                  <Download className="w-4 h-4 mr-2" aria-hidden="true" />
                                  Download
                                </Button>
                                <Button variant="outline" size="sm" className="flex-1 lg:flex-none">
                                  <Share2 className="w-4 h-4 mr-2" />
                                  Transfer
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredTickets.length === 0 && (
                <Card variant="gvteway" className="bg-gray-900/50 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bebas text-white mb-2">No Tickets Found</h3>
                    <p className="text-gray-400 mb-6">
                      You don&apos;t have any {filter !== 'all' && filter} tickets yet
                    </p>
                    <Link href="/gvteway/events">
                      <Button variant="gvteway" size="lg" rounded="full">
                        Discover Events
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </GvtewayLayout>
  );
}
